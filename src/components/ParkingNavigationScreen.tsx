import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ArrowLeft, ZoomIn, ZoomOut, Crosshair, MapPin, Clock, Fuel, Gauge, 
  Navigation2, Share2, Bookmark, Car, Target, Info, ArrowUpDown, Menu
} from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { motion, AnimatePresence } from 'motion/react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import { SmartSlotRecommendation } from './SmartSlotRecommendation';
import carImage from '../assets/user_car.svg';

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

interface Point {
  x: number;
  y: number;
}

interface ParkingSlot {
  id: string;
  type: 'available' | 'occupied' | 'pwd' | 'reserved' | 'ev';
  label: string;
  column: string;
  x: number;
  y: number;
  width: number;
  height: number;
  entryX: number;
  entryY: number;
  centerX: number;
  centerY: number;
  // Visual orientation - we'll render slots rotated by 90 degrees for a horizontal parking look
  rotation?: number;
}

interface Column {
  letter: string;
  x: number;
  y: number;
}

interface NavigationStats {
  speed: number;
  distance: number;
  eta: number;
  gasSaved: number;
}

// Parking configuration
const SLOT_WIDTH = 72; // Narrower to prevent overlap and keep width-of-2 rows compact
const SLOT_HEIGHT = 120;
const SLOT_SPACING = 12;
const ROAD_WIDTH = 280;
const SECTION_GAP = 60; // Horizontal gap between sections to avoid any overlap
const SECTION_WIDTH = ROAD_WIDTH + 2 * SLOT_WIDTH + SECTION_GAP;
const COLUMN_RADIUS = 35;
const SLOTS_PER_SECTION = 10;

const ENTRANCE_X = 900;
const ENTRANCE_Y = 100;
const EXIT_X = 1100;
const EXIT_Y = 100;
const MALL_ENTRANCE_X = 900;
const MALL_ENTRANCE_Y = 1700;
const NAV_DURATION_MS = 9000; // Faster navigation

// ============================================================================
// PARKING LAYOUT GENERATOR
// ============================================================================

const createParkingLayout = (): { slots: ParkingSlot[], columns: Column[] } => {
  const slots: ParkingSlot[] = [];
  const columns: Column[] = [];

  // Keep only two sections across (width of 2) to avoid overcrowding and overlaps
  const columnLetters = ['A', 'B'];
  
  let startY = 250;
  
  // Create parking sections
  columnLetters.forEach((letter, colIndex) => {
    // Space each section by full section width (two slot widths + road width + gap)
    const baseX = 180 + colIndex * SECTION_WIDTH;
    const columnY = startY + (SLOTS_PER_SECTION * (SLOT_HEIGHT + SLOT_SPACING)) / 2;
    
    // Column marker (circle)
    columns.push({
      letter,
      x: baseX + SLOT_WIDTH + ROAD_WIDTH / 2,
      y: columnY
    });

    // Create slots on both sides
    for (let slotNum = 0; slotNum < SLOTS_PER_SECTION; slotNum++) {
      const yPos = startY + slotNum * (SLOT_HEIGHT + SLOT_SPACING);
      
      // Left side slots
      const leftSlot: ParkingSlot = {
        id: `${letter}-L${slotNum + 1}`,
        type: getRandomSlotType(),
        label: `${letter}-${(slotNum * 2 + 1)}`,
        column: letter,
        x: baseX,
        y: yPos,
        width: SLOT_WIDTH,
        height: SLOT_HEIGHT,
        // Entry from the road side (to the right of the slot)
        entryX: baseX + SLOT_WIDTH + 10,
        entryY: yPos + SLOT_HEIGHT / 2,
        centerX: baseX + SLOT_WIDTH / 2,
        centerY: yPos + SLOT_HEIGHT / 2,
        rotation: 90,
      };
      slots.push(leftSlot);

      // Right side slots
      const rightSlot: ParkingSlot = {
        id: `${letter}-R${slotNum + 1}`,
        type: getRandomSlotType(),
        label: `${letter}-${(slotNum * 2 + 2)}`,
        column: letter,
        x: baseX + SLOT_WIDTH + ROAD_WIDTH,
        y: yPos,
        width: SLOT_WIDTH,
        height: SLOT_HEIGHT,
        // Entry from the road side (to the left of the slot)
        entryX: baseX + SLOT_WIDTH + ROAD_WIDTH - 10,
        entryY: yPos + SLOT_HEIGHT / 2,
        centerX: baseX + SLOT_WIDTH + ROAD_WIDTH + SLOT_WIDTH / 2,
        centerY: yPos + SLOT_HEIGHT / 2,
        rotation: 90,
      };
      slots.push(rightSlot);
    }
  });

  // Deterministic zoning:
  // - EV zone: top rows of Section A (grouped, not spread)
  // - PWD zone: bottom rows near mall entrance (across both sections)
  const EV_ZONE_Y_MAX = startY + 4 * (SLOT_HEIGHT + SLOT_SPACING); // top 4 rows
  const PWD_ZONE_Y_MIN = startY + (SLOTS_PER_SECTION - 2) * (SLOT_HEIGHT + SLOT_SPACING); // bottom 2 rows

  for (let i = 0; i < slots.length; i++) {
    const s = slots[i];
    // Group EV in Section A (both sides), top rows
    if (s.column === 'A' && s.y < EV_ZONE_Y_MAX) {
      s.type = 'ev';
    }
    // Place PWD near mall entrance (bottom rows), across sections
    if (s.y >= PWD_ZONE_Y_MIN) {
      s.type = 'pwd';
    }
  }

  return { slots, columns };
};

const getRandomSlotType = (): 'available' | 'occupied' | 'pwd' | 'reserved' => {
  const rand = Math.random();
  if (rand > 0.94) return 'pwd';
  if (rand > 0.90) return 'reserved';
  if (rand > 0.55) return 'occupied';
  return 'available';
};

// ============================================================================
// PATHFINDING
// ============================================================================

const findPathToSlot = (
  startX: number,
  startY: number,
  targetSlot: ParkingSlot
): Point[] => {
  const path: Point[] = [];
  
  // Start position
  path.push({ x: startX, y: startY });
  
  // Determine road center near the slot
  const isLeftSide = /-L\d+$/i.test(targetSlot.id);
  const roadCenterX = isLeftSide
    ? targetSlot.x + SLOT_WIDTH + ROAD_WIDTH / 2
    : targetSlot.x - ROAD_WIDTH / 2;

  // Always route horizontal movement along the top road centerline to avoid crossing slots
  const topRoadY = 50 + ROAD_WIDTH / 2;
  if (startY !== topRoadY) {
    // Move vertically to the top road centerline first
    path.push({ x: startX, y: topRoadY });
  }

  // Move horizontally along the top road to the target column's road center
  path.push({ x: roadCenterX, y: topRoadY });

  // Move down along the vertical road center to the slot's entry Y
  path.push({ x: roadCenterX, y: targetSlot.entryY });

  // Move from road center to the entry point at the correct side
  path.push({ x: targetSlot.entryX, y: targetSlot.entryY });

  // Enter the slot center (short perpendicular move)
  path.push({ x: targetSlot.centerX, y: targetSlot.centerY });
  
  return path;
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const calculatePathLength = (points: Point[]): number => {
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const dx = points[i + 1].x - points[i].x;
    const dy = points[i + 1].y - points[i].y;
    total += Math.hypot(dx, dy);
  }
  return total;
};

const interpolateAlongPath = (
  points: Point[],
  progress: number
): { x: number; y: number; angle: number; passedIndex: number } => {
  if (points.length === 0) return { x: 0, y: 0, angle: 0, passedIndex: 0 };
  if (points.length === 1) return { x: points[0].x, y: points[0].y, angle: 0, passedIndex: 0 };

  const segmentLengths: number[] = [];
  let totalLength = 0;

  for (let i = 0; i < points.length - 1; i++) {
    const dx = points[i + 1].x - points[i].x;
    const dy = points[i + 1].y - points[i].y;
    const len = Math.hypot(dx, dy);
    segmentLengths.push(len);
    totalLength += len;
  }

  if (totalLength === 0) return { x: points[0].x, y: points[0].y, angle: 0, passedIndex: 0 };

  const targetDistance = progress * totalLength;
  let accumulatedDistance = 0;

  for (let i = 0; i < segmentLengths.length; i++) {
    const segLen = segmentLengths[i];
    if (targetDistance <= accumulatedDistance + segLen || i === segmentLengths.length - 1) {
      const t = segLen > 0 ? (targetDistance - accumulatedDistance) / segLen : 0;
      const x = points[i].x + (points[i + 1].x - points[i].x) * t;
      const y = points[i].y + (points[i + 1].y - points[i].y) * t;
      
      // Calculate angle based on direction of movement
      const dx = points[i + 1].x - points[i].x;
      const dy = points[i + 1].y - points[i].y;
      let angle = Math.atan2(dy, dx) * (180 / Math.PI);
      
      // Adjust angle so car faces forward (0° = right, 90° = down, -90° = up)
      angle = angle + 90; // Rotate by 90 degrees so car image faces in travel direction
      
      return { x, y, angle, passedIndex: i };
    }
    accumulatedDistance += segLen;
  }

  const last = points[points.length - 1];
  return { x: last.x, y: last.y, angle: 0, passedIndex: points.length - 1 };
};

const findNearestAvailableSlot = (
  slots: ParkingSlot[],
  origin: { x: number; y: number },
  filterType: 'all' | 'pwd' | 'ev'
): ParkingSlot | null => {
  let nearestSlot: ParkingSlot | null = null;
  let minDistance = Infinity;

  for (const slot of slots) {
    const isValidType = filterType === 'pwd'
      ? slot.type === 'pwd'
      : filterType === 'ev'
        ? slot.type === 'ev'
        : (slot.type === 'available' || slot.type === 'pwd' || slot.type === 'ev');
    
    if (isValidType) {
      const distance = Math.hypot(slot.centerX - origin.x, slot.centerY - origin.y);
      if (distance < minDistance) {
        minDistance = distance;
        nearestSlot = slot;
      }
    }
  }

  return nearestSlot;
};

const calculateNavigationStats = (
  pathLength: number,
  progress: number,
  isNavigating: boolean,
  durationMs: number
): NavigationStats => {
  const distanceKm = (pathLength / 1000);
  const remainingKm = distanceKm * (1 - progress);
  // Calculate actual movement speed: pathLength pixels over durationMs, scaled to parking lot speed
  // Assuming 1 pixel ≈ 0.3 meters for parking lot scale, and clamping to 5-15 km/h
  const pixelsPerSecond = pathLength / (durationMs / 1000);
  const metersPerSecond = pixelsPerSecond * 0.3;
  const kmPerHour = metersPerSecond * 3.6;
  const speed = isNavigating ? Math.min(Math.max(parseFloat(kmPerHour.toFixed(1)), 5), 15) : 0;
  const etaMinutes = speed > 0 ? Math.ceil((remainingKm / speed) * 60) : 0;
  const gasSavedLiters = distanceKm * 0.06;

  return {
    speed,
    distance: parseFloat((remainingKm).toFixed(2)),
    eta: etaMinutes,
    gasSaved: parseFloat(gasSavedLiters.toFixed(2))
  };
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ParkingNavigationScreen({ onBack, darkMode }: { onBack: () => void; darkMode?: boolean }) {
  const [isDarkMode, setIsDarkMode] = useState(darkMode ?? false);
  const [parkingData, setParkingData] = useState<{ slots: ParkingSlot[], columns: Column[] }>({ slots: [], columns: [] });
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [autoStrategy, setAutoStrategy] = useState<'nearest-car' | 'nearest-mall'>('nearest-car');
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationProgress, setNavigationProgress] = useState(0);
  const [carPosition, setCarPosition] = useState({ x: ENTRANCE_X, y: ENTRANCE_Y, angle: 0 });
  const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 });
  const [isParked, setIsParked] = useState(false);
  const [parkingTimeRemaining, setParkingTimeRemaining] = useState(4 * 60 * 60);
  const [zoom, setZoom] = useState(0.85);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [passedWaypoints, setPassedWaypoints] = useState(0);
  const [filterType, setFilterType] = useState<'all' | 'pwd' | 'ev'>('all');
  const [pathPointsState, setPathPointsState] = useState<Point[]>([]);
  const [showLegend, setShowLegend] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const hasAutoSelectedRef = useRef(false);

  // Theme detection
  useEffect(() => {
    if (darkMode !== undefined) {
      setIsDarkMode(darkMode);
      return;
    }
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [darkMode]);

  // Initialize parking layout
  useEffect(() => {
    setParkingData(createParkingLayout());
  }, []);

  // Auto-close the info popover after 3 seconds when opened
  useEffect(() => {
    if (!showLegend) return;
    const t = setTimeout(() => setShowLegend(false), 3000);
    return () => clearTimeout(t);
  }, [showLegend]);

  // Periodically refresh slot statuses every 5 seconds (demo simulation)
  useEffect(() => {
    const interval = setInterval(() => {
      setParkingData(prev => {
        const updatedSlots: ParkingSlot[] = prev.slots.map((slot): ParkingSlot => {
          // Keep special designations stable; flip availability for regular slots sometimes
          if (slot.type === 'reserved' || slot.type === 'pwd') return slot;
          const rand = Math.random();
          if (slot.type === 'available' && rand > 0.75) return { ...slot, type: 'occupied' } as ParkingSlot;
          if (slot.type === 'occupied' && rand > 0.75) return { ...slot, type: 'available' } as ParkingSlot;
          return slot;
        });
        return { ...prev, slots: updatedSlots };
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-select slot by strategy and filter
  useEffect(() => {
    if (isAutoMode && parkingData.slots.length > 0 && !hasAutoSelectedRef.current) {
      const origin = autoStrategy === 'nearest-mall' ? { x: MALL_ENTRANCE_X, y: MALL_ENTRANCE_Y } : { x: ENTRANCE_X, y: ENTRANCE_Y };
      const nearest = findNearestAvailableSlot(parkingData.slots, origin, 'all'); // Auto mode always finds any available slot
      
      if (nearest) {
        setSelectedSlot(nearest);
        const newPath = findPathToSlot(origin.x, origin.y, nearest);
        setPathPointsState(newPath);
        setCarPosition({ x: origin.x, y: origin.y, angle: 0 });
        setIsNavigating(true);
        setNavigationProgress(0);
        setPassedWaypoints(0);
        hasAutoSelectedRef.current = true;
      }
    }
  }, [isAutoMode, parkingData.slots.length, autoStrategy]);

  // Preview path when not navigating
  const previewPath = useMemo(() => {
    if (!selectedSlot || isNavigating) return [];
    return findPathToSlot(carPosition.x, carPosition.y, selectedSlot);
  }, [selectedSlot, carPosition.x, carPosition.y, isNavigating]);

  const pathLength = useMemo(() => calculatePathLength(pathPointsState.length ? pathPointsState : previewPath), [pathPointsState, previewPath]);
  
  const navigationStats = useMemo(
    () => calculateNavigationStats(pathLength, navigationProgress, isNavigating, NAV_DURATION_MS),
    [pathLength, navigationProgress, isNavigating]
  );

  const availableCount = useMemo(() => {
    // Treat EV and PWD as available types for count (reserved and occupied are not available)
    return parkingData.slots.filter(s => s.type === 'available' || s.type === 'ev' || s.type === 'pwd').length;
  }, [parkingData]);

  const pwdCount = useMemo(() => {
    return parkingData.slots.filter(s => s.type === 'pwd').length;
  }, [parkingData]);

  // Navigation animation
  useEffect(() => {
    if (!isNavigating || pathPointsState.length === 0) return;

    const duration = NAV_DURATION_MS;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setNavigationProgress(progress);

  const position = interpolateAlongPath(pathPointsState, progress);
      setCarPosition({ x: position.x, y: position.y, angle: position.angle });
      setPassedWaypoints(position.passedIndex);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Navigation complete - car is now parked!
        setIsNavigating(false);
        setNavigationProgress(0);
        setIsParked(true);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isNavigating, pathPointsState]);

  // Camera follows car during navigation
  useEffect(() => {
    if (isNavigating && containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      
      const targetX = -carPosition.x * zoom + containerWidth / 2;
      const targetY = -carPosition.y * zoom + containerHeight / 2;
      
      setCameraOffset(prev => ({
        x: prev.x + (targetX - prev.x) * 0.08,
        y: prev.y + (targetY - prev.y) * 0.08
      }));
    }
  }, [carPosition, isNavigating, zoom]);

  // Zoom in on car when parked
  useEffect(() => {
    if (isParked && containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      
      // Zoom in closer
      const targetZoom = 2.5;
      setZoom(targetZoom);
      
      // Center on car
      const targetX = -carPosition.x * targetZoom + containerWidth / 2;
      const targetY = -carPosition.y * targetZoom + containerHeight / 2;
      
      setCameraOffset({ x: targetX, y: targetY });
    }
  }, [isParked, carPosition.x, carPosition.y]);

  // Parking timer countdown
  useEffect(() => {
    if (!isParked) return;

    const interval = setInterval(() => {
      setParkingTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isParked]);

  // Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isAutoMode && !isNavigating) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - cameraOffset.x, y: e.clientY - cameraOffset.y });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isAutoMode && !isNavigating && e.touches.length === 1) {
      setIsPanning(true);
      setPanStart({ x: e.touches[0].clientX - cameraOffset.x, y: e.touches[0].clientY - cameraOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setCameraOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isPanning && e.touches.length === 1) {
      setCameraOffset({
        x: e.touches[0].clientX - panStart.x,
        y: e.touches[0].clientY - panStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleSlotClick = (slot: ParkingSlot) => {
    // Only allow clicking in manual mode, when not navigating
    if (isAutoMode || isNavigating) return;
    
    // Check if slot is available
    if (slot.type !== 'available' && slot.type !== 'pwd' && slot.type !== 'ev') return;
    
    // In manual mode, respect the filter
    const matchesFilter = (
      filterType === 'all'
        ? true
        : filterType === 'pwd'
          ? slot.type === 'pwd'
          : slot.type === 'ev'
    );
    
    if (matchesFilter) {
      setSelectedSlot(slot);
    }
  };

  const handleStartNavigation = () => {
    if (selectedSlot && !isNavigating && !isAutoMode) {
      const origin = { x: carPosition.x, y: carPosition.y };
      const newPath = findPathToSlot(origin.x, origin.y, selectedSlot);
      setPathPointsState(newPath);
      setNavigationProgress(0);
      setPassedWaypoints(0);
      setIsNavigating(true);
    }
  };

  const handleRecenter = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      setCameraOffset({
        x: -carPosition.x * zoom + containerWidth / 2,
        y: -carPosition.y * zoom + containerHeight / 2
      });
    }
  };

  const handleChangeSlot = () => {
    // Reset everything back to navigation mode
    setIsParked(false);
    setIsNavigating(false);
    setSelectedSlot(null);
    setNavigationProgress(0);
    setPassedWaypoints(0);
    setCarPosition({ x: ENTRANCE_X, y: ENTRANCE_Y, angle: 0 });
    setPathPointsState([]);
    setParkingTimeRemaining(4 * 60 * 60);
    setZoom(1);
    setCameraOffset({ x: 0, y: 0 });
    hasAutoSelectedRef.current = false;
    
    // Switch to manual mode to let user choose
    setIsAutoMode(false);
  };

  // Format time remaining as HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.15, 1.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.15, 0.5));

  const toggleMode = () => {
    setIsAutoMode(!isAutoMode);
    setIsNavigating(false);
    setNavigationProgress(0);
    setPassedWaypoints(0);
    setCarPosition({ x: ENTRANCE_X, y: ENTRANCE_Y, angle: 0 });
    setSelectedSlot(null);
    setPathPointsState([]);
    hasAutoSelectedRef.current = false;
  };

  return (
    <div className={`h-screen w-screen ${isDarkMode ? 'bg-zinc-950' : 'bg-gray-50'} flex flex-col overflow-hidden`}>
      {/* Header - Fixed at top - Hide when parked */}
      {!isParked && (
        <div className={`sticky top-0 z-50 ${isDarkMode ? 'bg-zinc-900/95 border-zinc-800' : 'bg-white/95 border-gray-200'} border-b backdrop-blur-xl`}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onBack}
              className="hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" />
                <h1 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>SM Dasmariñas</h1>
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Level 1 • {availableCount} slots available</p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {isAutoMode && (
                <>
                  <div className="px-2 py-2">
                    <p className="text-xs text-muted-foreground mb-2">Auto Navigation Strategy</p>
                  </div>
                  <DropdownMenuRadioGroup value={autoStrategy} onValueChange={(v: string) => setAutoStrategy(v as 'nearest-car' | 'nearest-mall')}>
                    <DropdownMenuRadioItem value="nearest-car">
                      Closest to Vehicle
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="nearest-mall">
                      Nearest to Mall
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                  <DropdownMenuSeparator />
                </>
              )}
              
              <DropdownMenuItem 
                onClick={(e) => {
                  e.preventDefault();
                  setShowLegend(!showLegend);
                }}
              >
                <Info className="w-4 h-4 mr-2" />
                {showLegend ? 'Hide' : 'Show'} Legend
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mode Switch Bar */}
        <div className={`flex items-center justify-between px-4 py-2 border-t ${isDarkMode ? 'border-zinc-800 bg-zinc-900/50' : 'border-gray-200 bg-gray-50/50'}`}>
          <div className="flex items-center gap-2">
            <Label htmlFor="mode-switch" className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {isAutoMode ? '🤖 Auto Mode' : '👆 Manual Mode'}
            </Label>
            <Switch
              id="mode-switch"
              checked={isAutoMode}
              onCheckedChange={toggleMode}
            />
          </div>
          {isAutoMode && (
            <Badge variant="secondary" className="text-xs">
              {autoStrategy === 'nearest-car' ? 'Closest to Car' : 'Nearest to Mall'}
            </Badge>
          )}
        </div>

        {/* ML Smart Slot Recommendation - Show when not navigating and not parked */}
        {!isNavigating && !isParked && !isAutoMode && (
          <div className={`px-4 py-3 border-t ${isDarkMode ? 'border-zinc-800' : 'border-gray-200'}`}>
            <SmartSlotRecommendation 
              location="SM Dasmarinas"
              onAcceptRecommendation={(slotId) => {
                // Find the recommended slot
                const recommendedSlot = parkingLayout.slots.find(s => 
                  s.label === slotId || s.id.includes(slotId)
                );
                if (recommendedSlot && (recommendedSlot.type === 'available' || recommendedSlot.type === 'pwd' || recommendedSlot.type === 'ev')) {
                  setSelectedSlot(recommendedSlot);
                  // Auto-start navigation
                  setTimeout(() => {
                    const origin = { x: carPosition.x, y: carPosition.y };
                    const newPath = findPathToSlot(origin.x, origin.y, recommendedSlot);
                    setPathPointsState(newPath);
                    setNavigationProgress(0);
                    setPassedWaypoints(0);
                    setIsNavigating(true);
                  }, 500);
                }
              }}
              darkMode={isDarkMode}
            />
          </div>
        )}

        {/* Filter Buttons - Only in manual mode */}
        {!isAutoMode && !isNavigating && (
          <div className={`border-t ${isDarkMode ? 'border-zinc-800' : 'border-gray-200'}`}>
            <div className="flex gap-2 px-4 py-3 overflow-x-auto">
              <Button
                variant={filterType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setFilterType('all');
                  setSelectedSlot(null);
                }}
                className="flex-shrink-0"
              >
                <Car className="w-3 h-3 mr-1" />
                All Slots
              </Button>
              <Button
                variant={filterType === 'pwd' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setFilterType('pwd');
                  setSelectedSlot(null);
                }}
                className="flex-shrink-0"
              >
                ♿ PWD
              </Button>
              <Button
                variant={filterType === 'ev' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setFilterType('ev');
                  setSelectedSlot(null);
                }}
                className="flex-shrink-0"
              >
                ⚡ EV
              </Button>
            </div>
          </div>
        )}

        {/* Legend */}
        {showLegend && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`px-4 pb-3 border-t ${isDarkMode ? 'border-zinc-800' : 'border-gray-200'}`}
          >
            <div className="flex flex-wrap gap-3 pt-3 text-xs">
              <div className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-sm bg-green-400" />
                Available
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-sm bg-red-500" />
                Occupied
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-sm bg-blue-500" />
                PWD
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-sm bg-purple-500" />
                EV
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-sm bg-yellow-500" />
                Reserved
              </div>
            </div>
          </motion.div>
        )}
        </div>
      )}

      {/* Map Container */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden touch-none">
        <svg
          ref={svgRef}
          className={`w-full h-full ${!isAutoMode && !isNavigating ? 'cursor-grab' : 'cursor-default'} ${isPanning ? 'cursor-grabbing' : ''}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          <defs>
            <filter id="carShadow">
              <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
              <feOffset dx="0" dy="4" result="offsetblur"/>
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.25"/>
              </feComponentTransfer>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <radialGradient id="ripple1">
              <stop offset="0%" stopColor="rgba(30, 58, 138, 0.20)" />
              <stop offset="100%" stopColor="rgba(30, 58, 138, 0)" />
            </radialGradient>

            <radialGradient id="ripple2">
              <stop offset="0%" stopColor="rgba(30, 58, 138, 0.12)" />
              <stop offset="100%" stopColor="rgba(30, 58, 138, 0)" />
            </radialGradient>

            {/* Arrow marker for lane direction */}
            <marker id="arrowHead" orient="auto" markerWidth="6" markerHeight="6" refX="5" refY="3">
              <path d="M0,0 L6,3 L0,6 Z" fill={isDarkMode ? '#71717a' : '#6b7280'} />
            </marker>
          </defs>
          
          <g transform={`translate(${cameraOffset.x}, ${cameraOffset.y}) scale(${zoom})`}>
            {/* Background */}
            <rect x={0} y={0} width={2000} height={1900} fill={isDarkMode ? '#0a0a0a' : '#f5f5f5'} />

            {/* Main horizontal road at top */}
            <rect
              x={0}
              y={50}
              width={2000}
              height={ROAD_WIDTH}
              fill={isDarkMode ? '#1a1a1a' : '#d4d4d8'}
              rx={10}
            />
            <line
              x1={0}
              y1={50 + ROAD_WIDTH / 2}
              x2={2000}
              y2={50 + ROAD_WIDTH / 2}
              stroke={isDarkMode ? '#3f3f46' : '#a1a1aa'}
              strokeWidth={3}
              strokeDasharray="30 20"
            />

            {/* Vertical roads for each section */}
            {parkingData.columns.map((column, idx) => {
              const roadX = column.x - ROAD_WIDTH / 2;
              return (
                <g key={`road-${idx}`}>
                  <rect
                    x={roadX}
                    y={200}
                    width={ROAD_WIDTH}
                    height={1500}
                    fill={isDarkMode ? '#1a1a1a' : '#d4d4d8'}
                    rx={10}
                  />
                  <line
                    x1={column.x}
                    y1={200}
                    x2={column.x}
                    y2={1700}
                    stroke={isDarkMode ? '#3f3f46' : '#a1a1aa'}
                    strokeWidth={3}
                    strokeDasharray="30 20"
                  />
                  {/* Lane direction arrows (downwards) */}
                  {Array.from({ length: 6 }).map((_, i) => {
                    const ay = 260 + i * 240;
                    return (
                      <line
                        key={`arrow-${idx}-${i}`}
                        x1={column.x}
                        y1={ay}
                        x2={column.x}
                        y2={ay + 1}
                        stroke={isDarkMode ? '#71717a' : '#6b7280'}
                        strokeWidth={2}
                        markerEnd="url(#arrowHead)"
                      />
                    );
                  })}
                </g>
              );
            })}

            {/* Parking Slots */}
            {parkingData.slots.map((slot) => {
              let fill = isDarkMode ? '#27272a' : '#e4e4e7';
              let stroke = isDarkMode ? '#3f3f46' : '#a1a1aa';

              if (slot.type === 'available') {
                fill = isDarkMode ? '#065f46' : '#d1fae5';
                stroke = isDarkMode ? '#059669' : '#10b981';
              } else if (slot.type === 'pwd') {
                fill = isDarkMode ? '#1e40af' : '#dbeafe';
                stroke = isDarkMode ? '#3b82f6' : '#2563eb';
              } else if (slot.type === 'reserved') {
                fill = isDarkMode ? '#713f12' : '#fef3c7';
                stroke = isDarkMode ? '#ca8a04' : '#eab308';
              } else if (slot.type === 'occupied') {
                fill = isDarkMode ? '#450a0a' : '#fee2e2';
                stroke = isDarkMode ? '#7f1d1d' : '#dc2626';
              } else if (slot.type === 'ev') {
                // Purple EV zone
                fill = isDarkMode ? '#4c1d95' : '#f3e8ff';
                stroke = isDarkMode ? '#a78bfa' : '#8b5cf6';
              }

              const isSelected = selectedSlot?.id === slot.id;
              const isLeftSide = /-L\d+$/i.test(slot.id);
              const entryLine = isLeftSide
                ? { x1: slot.x + slot.width - 3, y1: slot.centerY - 12, x2: slot.x + slot.width - 3, y2: slot.centerY + 12 }
                : { x1: slot.x + 3, y1: slot.centerY - 12, x2: slot.x + 3, y2: slot.centerY + 12 };

              const matchesFilter = (
                filterType === 'all'
                  ? (slot.type === 'available' || slot.type === 'ev' || slot.type === 'pwd')
                  : (filterType === 'pwd' ? slot.type === 'pwd' : slot.type === 'ev')
              );

              const isClickable = !isAutoMode && !isNavigating && matchesFilter && (slot.type === 'available' || slot.type === 'pwd' || slot.type === 'ev');

              return (
                <g key={slot.id}>
                  <rect
                    x={slot.x}
                    y={slot.y}
                    width={slot.width}
                    height={slot.height}
                    fill={fill}
                    stroke={isSelected ? '#f59e0b' : stroke}
                    strokeWidth={isSelected ? 4 : 2}
                    rx={4}
                    onClick={() => handleSlotClick(slot)}
                    className={`${isClickable ? 'cursor-pointer hover:opacity-80' : ''} transition-all`}
                    style={{
                      filter: isSelected ? 'drop-shadow(0 0 12px rgba(245, 158, 11, 0.6))' : 'none',
                      opacity: (!isAutoMode && filterType !== 'all' && !matchesFilter) ? 0.25 : 1
                    }}
                    transform={`rotate(${slot.rotation ?? 0}, ${slot.centerX}, ${slot.centerY})`}
                  />
                  {/* Slot label - centered within rotated rectangle */}
                  <text
                    x={slot.centerX}
                    y={slot.centerY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="12"
                    fontWeight="600"
                    fill={isDarkMode ? '#e5e7eb' : '#374151'}
                    pointerEvents="none"
                  >
                    {slot.label}
                  </text>
                  {/* PWD symbol */}
                  {slot.type === 'pwd' && (
                    <text
                      x={slot.centerX}
                      y={slot.centerY + 18}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="20"
                      fill="#3b82f6"
                      pointerEvents="none"
                    >
                      ♿
                    </text>
                  )}
                  {/* Entry side indicator */}
                  <line
                    x1={entryLine.x1}
                    y1={entryLine.y1}
                    x2={entryLine.x2}
                    y2={entryLine.y2}
                    stroke={isDarkMode ? '#52525b' : '#9ca3af'}
                    strokeWidth={4}
                    strokeLinecap="round"
                    opacity={0.6}
                  />
                </g>
              );
            })}

            {/* Column markers (circles) */}
            {parkingData.columns.map((column) => (
              <g key={column.letter}>
                {/* Circle with letter */}
                <circle
                  cx={column.x}
                  cy={column.y}
                  r={COLUMN_RADIUS}
                  fill={isDarkMode ? '#27272a' : '#e4e4e7'}
                  stroke={isDarkMode ? '#52525b' : '#a1a1aa'}
                  strokeWidth={3}
                />
                <circle
                  cx={column.x}
                  cy={column.y}
                  r={COLUMN_RADIUS - 8}
                  fill="none"
                  stroke={isDarkMode ? '#3f3f46' : '#d4d4d8'}
                  strokeWidth={2}
                />
                {/* Column letter */}
                <text
                  x={column.x}
                  y={column.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="32"
                  fontWeight="bold"
                  fill={isDarkMode ? '#71717a' : '#52525b'}
                >
                  {column.letter}
                </text>
              </g>
            ))}

            {/* Path */}
            {(isNavigating ? pathPointsState : previewPath).length > 0 && selectedSlot && (
              <g>
                <path
                  d={(isNavigating ? pathPointsState : previewPath).slice(passedWaypoints).map((p: Point, i: number) => 
                    i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
                  ).join(' ')}
                  stroke="rgba(59, 130, 246, 0.3)"
                  strokeWidth="16"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ filter: 'blur(8px)' }}
                />
                <path
                  d={(isNavigating ? pathPointsState : previewPath).slice(passedWaypoints).map((p: Point, i: number) => 
                    i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
                  ).join(' ')}
                  stroke="#3b82f6"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="15 10"
                />
              </g>
            )}

            {/* Car with image */}
            <g transform={`translate(${carPosition.x}, ${carPosition.y}) rotate(${carPosition.angle})`}>
              <circle r="38" fill="url(#ripple1)">
                <animate attributeName="r" values="38;50;38" dur="3.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values={isNavigating ? '0.3;0.05;0.3' : '0.18;0.04;0.18'} dur="3.2s" repeatCount="indefinite" />
              </circle>
              <circle r="45" fill="url(#ripple2)">
                <animate attributeName="r" values="45;60;45" dur="3.2s" begin="0.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values={isNavigating ? '0.25;0;0.25' : '0.12;0;0.12'} dur="3.2s" begin="0.5s" repeatCount="indefinite" />
              </circle>
              
              <ellipse
                cx={0}
                cy={32}
                rx={18}
                ry={7}
                fill="rgba(0,0,0,0.12)"
                style={{ filter: 'blur(3px)' }}
              />
              
              <image
                href={carImage}
                x={-20}
                y={-40}
                width={40}
                height={80}
                filter="url(#carShadow)"
              />
            </g>

            {/* Entrance marker */}
            <g transform={`translate(${ENTRANCE_X}, ${ENTRANCE_Y})`}>
              <circle r="28" fill="#10b981" opacity="0.12">
                <animate attributeName="r" values="28;36;28" dur="2.5s" repeatCount="indefinite" />
              </circle>
              <circle r="22" fill="#10b981" opacity="0.25" />
              <circle r="16" fill="#10b981" />
              <text
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="10"
                fontWeight="bold"
                fill="white"
              >
                ENTRY
              </text>
            </g>

            {/* Top road lane arrows (to the right) */}
            {Array.from({ length: 8 }).map((_, i) => {
              const ax = 150 + i * 220;
              return (
                <line
                  key={`top-arrow-${i}`}
                  x1={ax}
                  y1={50 + ROAD_WIDTH / 2}
                  x2={ax + 1}
                  y2={50 + ROAD_WIDTH / 2}
                  stroke={isDarkMode ? '#71717a' : '#6b7280'}
                  strokeWidth={2}
                  markerEnd="url(#arrowHead)"
                />
              );
            })}

            {/* Exit marker */}
            <g transform={`translate(${EXIT_X}, ${EXIT_Y})`}>
              <circle r="22" fill="#ef4444" opacity="0.2" />
              <circle r="16" fill="#ef4444" />
              <text
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="10"
                fontWeight="bold"
                fill="white"
              >
                EXIT
              </text>
            </g>

            {/* Mall entrance marker */}
            <g transform={`translate(${MALL_ENTRANCE_X}, ${MALL_ENTRANCE_Y})`}>
              <circle r="24" fill="#3b82f6" opacity="0.18" />
              <circle r="18" fill="#3b82f6" />
              <text
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="10"
                fontWeight="bold"
                fill="white"
              >
                MALL
              </text>
            </g>
          </g>
        </svg>

        {/* Floating Map Controls */}
        <div className="absolute top-24 right-4 flex flex-col gap-2 z-40">
          <Button 
            variant="secondary" 
            size="icon" 
            onClick={handleZoomIn}
            className={`rounded-full shadow-lg ${isDarkMode ? 'bg-zinc-900 hover:bg-zinc-800' : 'bg-white hover:bg-gray-100'}`}
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button 
            variant="secondary" 
            size="icon" 
            onClick={handleZoomOut}
            className={`rounded-full shadow-lg ${isDarkMode ? 'bg-zinc-900 hover:bg-zinc-800' : 'bg-white hover:bg-gray-100'}`}
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button 
            variant="secondary" 
            size="icon" 
            onClick={handleRecenter}
            className={`rounded-full shadow-lg ${isDarkMode ? 'bg-zinc-900 hover:bg-zinc-800' : 'bg-white hover:bg-gray-100'}`}
            title="Recenter"
          >
            <Crosshair className="w-4 h-4" />
          </Button>
        </div>

        {/* Manual Mode Helper - Show when in manual mode and no slot selected */}
        {!isAutoMode && !selectedSlot && !isNavigating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none"
          >
            <div className={`${isDarkMode ? 'bg-blue-900/90 border-blue-700' : 'bg-blue-50/90 border-blue-200'} border-2 rounded-xl p-3 backdrop-blur-sm text-center`}>
              <p className={`text-sm ${isDarkMode ? 'text-blue-100' : 'text-blue-900'}`}>
                👆 Tap on a {filterType === 'pwd' ? 'PWD' : filterType === 'ev' ? 'EV' : 'green'} parking slot to select it
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Stats Card - Hide when parked */}
      {!isParked && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'} border-t`}
          style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 16px)' }}
        >
        {/* Stats Grid - Horizontal layout */}
        <div className="px-2 py-2">
          <div className="flex justify-around items-end gap-1">
            <div className="flex flex-col items-center flex-1">
              <div className={`p-1 rounded-lg ${isDarkMode ? 'bg-red-500/20' : 'bg-red-50'} mb-0.5`}>
                <Gauge className="w-3 h-3 text-red-500" />
              </div>
              <span className={`text-xs font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{navigationStats.speed}</span>
              <span className={`text-[8px] leading-tight ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>km/h</span>
            </div>
            
            <div className="flex flex-col items-center flex-1">
              <div className={`p-1 rounded-lg ${isDarkMode ? 'bg-cyan-500/20' : 'bg-cyan-50'} mb-0.5`}>
                <Navigation2 className="w-3 h-3 text-cyan-500" />
              </div>
              <span className={`text-xs font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{navigationStats.distance}</span>
              <span className={`text-[8px] leading-tight ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>km</span>
            </div>
            
            <div className="flex flex-col items-center flex-1">
              <div className={`p-1 rounded-lg ${isDarkMode ? 'bg-purple-500/20' : 'bg-purple-50'} mb-0.5`}>
                <Clock className="w-3 h-3 text-purple-500" />
              </div>
              <span className={`text-xs font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{navigationStats.eta}</span>
              <span className={`text-[8px] leading-tight ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>min</span>
            </div>
            
            <div className="flex flex-col items-center flex-1">
              <div className={`p-1 rounded-lg ${isDarkMode ? 'bg-green-500/20' : 'bg-green-50'} mb-0.5`}>
                <Fuel className="w-3 h-3 text-green-500" />
              </div>
              <span className={`text-xs font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{navigationStats.gasSaved}</span>
              <span className={`text-[8px] leading-tight ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>L</span>
            </div>
          </div>
        </div>

        {/* Selected Slot Info */}
        <AnimatePresence>
          {selectedSlot && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`border-t ${isDarkMode ? 'border-zinc-800' : 'border-gray-200'} px-4 py-3`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-500" />
                  <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedSlot.label}</span>
                  {selectedSlot.type === 'pwd' && (
                    <Badge className="bg-blue-500 text-white text-xs">PWD</Badge>
                  )}
                  {selectedSlot.type === 'ev' && (
                    <Badge className="bg-purple-500 text-white text-xs">EV</Badge>
                  )}
                  <Badge variant="secondary" className="text-xs">Column {selectedSlot.column}</Badge>
                </div>
              </div>
              
              {isNavigating && (
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Navigation Progress</span>
                    <span className="font-mono text-blue-500">{Math.round(navigationProgress * 100)}%</span>
                  </div>
                  <Progress value={navigationProgress * 100} className="h-2" />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className={`border-t ${isDarkMode ? 'border-zinc-800' : 'border-gray-200'} px-4 py-3`}>
          {/* Manual Mode - Show Start Navigation Button */}
          {!isAutoMode && selectedSlot && !isNavigating && (
            <div className="flex gap-2">
              <Button
                onClick={handleStartNavigation}
                className={`flex-1 shadow-lg border transition-colors !bg-[var(--primary)] !text-[var(--primary-foreground)] !border-[var(--primary)] hover:!bg-[color-mix(in_oklab,var(--primary),white_12%)]`}
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                  borderColor: 'var(--primary)',
                }}
              >
                <Navigation2 className="w-4 h-4 mr-2" />
                Start Navigation
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                className={isDarkMode ? 'border-zinc-700' : 'border-gray-300'}
              >
                <Share2 className="w-4 h-4" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                className={isDarkMode ? 'border-zinc-700' : 'border-gray-300'}
              >
                <Bookmark className="w-4 h-4" />
              </Button>
            </div>
          )}
          
          {/* Auto Mode - Show status */}
          {isAutoMode && (
            <div className={`text-center py-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
              {isNavigating ? '🚗 Auto-navigating to your spot...' : '🎯 Finding best parking spot...'}
            </div>
          )}
          
          {/* Manual Mode - No slot selected */}
          {!isAutoMode && !selectedSlot && !isNavigating && (
            <div className={`text-center py-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
              👆 Tap on an available parking slot to select it
            </div>
          )}
          
          {/* Navigating - Show cancel option */}
          {isNavigating && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsNavigating(false);
                  setNavigationProgress(0);
                  setPathPointsState([]);
                  if (isAutoMode) {
                    hasAutoSelectedRef.current = false;
                  }
                }}
                className="flex-1"
              >
                Cancel Navigation
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                className={isDarkMode ? 'border-zinc-700' : 'border-gray-300'}
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
        </motion.div>
      )}

      {/* Parked Success Overlay */}
      <AnimatePresence>
        {isParked && (
          <>
            {/* Celebration Particles */}
            <motion.div className="fixed inset-0 z-40 pointer-events-none">
              {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    opacity: 0,
                    scale: 0,
                    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
                    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
                  }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0.5],
                    x: typeof window !== 'undefined' ? window.innerWidth / 2 + (Math.random() - 0.5) * 600 : 0,
                    y: typeof window !== 'undefined' ? window.innerHeight / 2 + (Math.random() - 0.5) * 600 : 0,
                    rotate: Math.random() * 360,
                  }}
                  transition={{ 
                    duration: 1.5,
                    delay: i * 0.02,
                    ease: "easeOut"
                  }}
                  className={`absolute w-3 h-3 rounded-full ${
                    ['bg-green-400', 'bg-blue-400', 'bg-purple-400', 'bg-yellow-400', 'bg-pink-400'][i % 5]
                  }`}
                />
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
            >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ 
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: 0.2
              }}
              className={`${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'} border-2 rounded-3xl shadow-2xl mx-4 max-w-md w-full overflow-hidden`}
            >
              {/* Success Animation Header */}
              <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-8 text-center">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.4
                  }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-2xl font-bold text-white mb-2"
                >
                  Successfully Parked! 🎉
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-white/90 text-sm"
                >
                  Your ticket timer has started
                </motion.p>
              </div>

              {/* Timer Display */}
              <div className="p-8">
                <div className={`${isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-50 border-gray-200'} border-2 rounded-2xl p-6 mb-6`}>
                  <div className="text-center mb-4">
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Time Remaining</p>
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                        delay: 0.7
                      }}
                      className="font-mono text-5xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent"
                    >
                      {formatTime(parkingTimeRemaining)}
                    </motion.div>
                  </div>

                  {/* Parking Details */}
                  <div className={`pt-4 border-t ${isDarkMode ? 'border-zinc-700' : 'border-gray-200'} space-y-2`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Parking Slot</span>
                      <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedSlot?.label}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Location</span>
                      <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>SM Dasmariñas - Level 1</span>
                    </div>
                    {selectedSlot?.type === 'pwd' && (
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Type</span>
                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-500 border-blue-500/30">
                          PWD Slot
                        </Badge>
                      </div>
                    )}
                    {selectedSlot?.type === 'ev' && (
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Type</span>
                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-500 border-purple-500/30">
                          EV Charging
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Button
                    onClick={handleChangeSlot}
                    variant="outline"
                    className={`w-full h-12 ${isDarkMode ? 'border-zinc-700 hover:bg-zinc-800' : 'border-gray-300 hover:bg-gray-100'}`}
                  >
                    <Car className="w-4 h-4 mr-2" />
                    Change Slot
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
