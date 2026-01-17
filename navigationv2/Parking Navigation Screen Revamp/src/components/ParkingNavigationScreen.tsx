import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ArrowLeft, ZoomIn, ZoomOut, Crosshair, MapPin, Clock, Fuel, Gauge, 
  Navigation2, Share2, Bookmark, Car, Target
} from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { motion, AnimatePresence } from 'motion/react';
import carImage from 'figma:asset/1c837f1ddbdd5ae4d1d30d1315abedb7288f3478.png';

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

interface Point {
  x: number;
  y: number;
}

interface ParkingSlot {
  id: string;
  type: 'available' | 'occupied' | 'pwd' | 'reserved';
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
const SLOT_WIDTH = 80;
const SLOT_HEIGHT = 120;
const SLOT_SPACING = 12;
const ROAD_WIDTH = 280;
const COLUMN_RADIUS = 35;
const SLOTS_PER_SECTION = 11;

const ENTRANCE_X = 900;
const ENTRANCE_Y = 100;

// ============================================================================
// PARKING LAYOUT GENERATOR
// ============================================================================

const createParkingLayout = (): { slots: ParkingSlot[], columns: Column[] } => {
  const slots: ParkingSlot[] = [];
  const columns: Column[] = [];

  const columnLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
  
  let startY = 250;
  
  // Create parking sections
  columnLetters.forEach((letter, colIndex) => {
    const baseX = 180 + colIndex * 280;
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
        entryX: baseX + SLOT_WIDTH / 2,
        entryY: yPos + SLOT_HEIGHT + 10,
        centerX: baseX + SLOT_WIDTH / 2,
        centerY: yPos + SLOT_HEIGHT / 2
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
        entryX: baseX + SLOT_WIDTH + ROAD_WIDTH + SLOT_WIDTH / 2,
        entryY: yPos + SLOT_HEIGHT + 10,
        centerX: baseX + SLOT_WIDTH + ROAD_WIDTH + SLOT_WIDTH / 2,
        centerY: yPos + SLOT_HEIGHT / 2
      };
      slots.push(rightSlot);
    }
  });

  return { slots, columns };
};

const getRandomSlotType = (): 'available' | 'occupied' | 'pwd' | 'reserved' => {
  const rand = Math.random();
  if (rand > 0.93) return 'pwd';
  if (rand > 0.89) return 'reserved';
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
  
  // Move to align with target column horizontally
  const targetRoadX = targetSlot.x < 900 
    ? targetSlot.x + SLOT_WIDTH / 2 
    : targetSlot.x + SLOT_WIDTH / 2;
  
  path.push({ x: targetRoadX, y: startY });
  
  // Move down to slot level
  path.push({ x: targetRoadX, y: targetSlot.entryY - 30 });
  
  // Move to entry point
  path.push({ x: targetSlot.entryX, y: targetSlot.entryY });
  
  // Enter slot
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

const findNearestAvailableSlot = (slots: ParkingSlot[], filterType?: string): ParkingSlot | null => {
  let nearestSlot: ParkingSlot | null = null;
  let minDistance = Infinity;

  const MALL_ENTRANCE_X = 900;
  const MALL_ENTRANCE_Y = 1700;

  for (const slot of slots) {
    const isValidType = filterType === 'pwd' ? slot.type === 'pwd' : (slot.type === 'available' || slot.type === 'pwd');
    
    if (isValidType) {
      const distance = Math.hypot(slot.centerX - MALL_ENTRANCE_X, slot.centerY - MALL_ENTRANCE_Y);
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
  isNavigating: boolean
): NavigationStats => {
  const distanceKm = (pathLength / 1000);
  const remainingKm = distanceKm * (1 - progress);
  const speed = isNavigating ? 12 : 0;
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
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationProgress, setNavigationProgress] = useState(0);
  const [carPosition, setCarPosition] = useState({ x: ENTRANCE_X, y: ENTRANCE_Y, angle: 0 });
  const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(0.85);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [passedWaypoints, setPassedWaypoints] = useState(0);
  const [filterType, setFilterType] = useState<'all' | 'pwd'>('all');

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

  // Auto-select nearest slot
  useEffect(() => {
    if (isAutoMode && parkingData.slots.length > 0 && !hasAutoSelectedRef.current) {
      const nearest = findNearestAvailableSlot(parkingData.slots, filterType === 'pwd' ? 'pwd' : undefined);
      if (nearest) {
        setSelectedSlot(nearest);
        setIsNavigating(true);
        setNavigationProgress(0);
        setPassedWaypoints(0);
        hasAutoSelectedRef.current = true;
      }
    } else if (!isAutoMode) {
      hasAutoSelectedRef.current = false;
    }
  }, [isAutoMode, parkingData, filterType]);

  // Calculate path
  const pathPoints = useMemo(() => {
    if (!selectedSlot) return [];
    return findPathToSlot(ENTRANCE_X, ENTRANCE_Y, selectedSlot);
  }, [selectedSlot]);

  const pathLength = useMemo(() => calculatePathLength(pathPoints), [pathPoints]);
  
  const navigationStats = useMemo(
    () => calculateNavigationStats(pathLength, navigationProgress, isNavigating),
    [pathLength, navigationProgress, isNavigating]
  );

  const availableCount = useMemo(() => {
    return parkingData.slots.filter(s => s.type === 'available').length;
  }, [parkingData]);

  const pwdCount = useMemo(() => {
    return parkingData.slots.filter(s => s.type === 'pwd').length;
  }, [parkingData]);

  // Navigation animation
  useEffect(() => {
    if (!isNavigating || pathPoints.length === 0) return;

    const duration = 16000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setNavigationProgress(progress);

      const position = interpolateAlongPath(pathPoints, progress);
      setCarPosition({ x: position.x, y: position.y, angle: position.angle });
      setPassedWaypoints(position.passedIndex);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Keep the final rotation
        setIsNavigating(false);
        setNavigationProgress(0);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isNavigating, pathPoints]);

  // Camera follows car
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

  // Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isAutoMode && !isNavigating) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - cameraOffset.x, y: e.clientY - cameraOffset.y });
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

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleSlotClick = (slot: ParkingSlot) => {
    if (!isAutoMode && !isNavigating && (slot.type === 'available' || slot.type === 'pwd')) {
      setSelectedSlot(slot);
    }
  };

  const handleStartNavigation = () => {
    if (selectedSlot && !isNavigating && !isAutoMode) {
      setCarPosition({ x: ENTRANCE_X, y: ENTRANCE_Y, angle: 0 });
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

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.15, 1.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.15, 0.5));

  const toggleMode = () => {
    setIsAutoMode(!isAutoMode);
    setIsNavigating(false);
    setNavigationProgress(0);
    setPassedWaypoints(0);
    setCarPosition({ x: ENTRANCE_X, y: ENTRANCE_Y, angle: 0 });
    setSelectedSlot(null);
  };

  return (
    <div className={`h-screen w-screen ${isDarkMode ? 'bg-zinc-950' : 'bg-gray-50'} flex flex-col overflow-hidden relative`}>
      {/* Floating Header */}
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between gap-3"
      >
        <Card className={`flex items-center gap-3 px-4 py-3 backdrop-blur-xl ${isDarkMode ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white/90 border-gray-200'} shadow-2xl`}>
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
              <h1 className="font-bold">SM Dasmariñas</h1>
            </div>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Level 1 • {availableCount} slots available</p>
          </div>
        </Card>

        <Card className={`flex items-center gap-2 px-4 py-3 backdrop-blur-xl ${isDarkMode ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white/90 border-gray-200'} shadow-2xl`}>
          <Label htmlFor="mode-switch" className="text-sm font-medium">
            {isAutoMode ? 'Auto' : 'Manual'}
          </Label>
          <Switch
            id="mode-switch"
            checked={isAutoMode}
            onCheckedChange={toggleMode}
          />
        </Card>
      </motion.div>

      {/* Map Container */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden">
        <svg
          ref={svgRef}
          className={`w-full h-full ${!isAutoMode && !isNavigating ? 'cursor-grab' : 'cursor-default'} ${isPanning ? 'cursor-grabbing' : ''}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
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
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.25)" />
              <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
            </radialGradient>

            <radialGradient id="ripple2">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.15)" />
              <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
            </radialGradient>
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
              }

              const isSelected = selectedSlot?.id === slot.id;

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
                    className={slot.type !== 'occupied' && !isAutoMode && !isNavigating ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
                    style={{
                      filter: isSelected ? 'drop-shadow(0 0 12px rgba(245, 158, 11, 0.6))' : 'none'
                    }}
                  />
                  {/* Slot label */}
                  <text
                    x={slot.centerX}
                    y={slot.centerY - 15}
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
                  {/* Entry line indicator */}
                  <line
                    x1={slot.x + 8}
                    y1={slot.y + slot.height - 3}
                    x2={slot.x + slot.width - 8}
                    y2={slot.y + slot.height - 3}
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
            {pathPoints.length > 0 && selectedSlot && (
              <g>
                <path
                  d={pathPoints.slice(passedWaypoints).map((p, i) => 
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
                  d={pathPoints.slice(passedWaypoints).map((p, i) => 
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
              {/* Subtle ripple effect */}
              {isNavigating && (
                <>
                  <circle r="38" fill="url(#ripple1)">
                    <animate attributeName="r" values="38;50;38" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.3;0.05;0.3" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <circle r="45" fill="url(#ripple2)">
                    <animate attributeName="r" values="45;60;45" dur="3s" begin="0.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.25;0;0.25" dur="3s" begin="0.5s" repeatCount="indefinite" />
                  </circle>
                </>
              )}
              
              {/* Subtle shadow under car */}
              <ellipse
                cx={0}
                cy={32}
                rx={18}
                ry={7}
                fill="rgba(0,0,0,0.12)"
                style={{ filter: 'blur(3px)' }}
              />
              
              {/* Car image - centered and properly oriented */}
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
          </g>
        </svg>

        {/* Floating Controls */}
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="absolute top-24 right-4 flex flex-col gap-2"
        >
          <Button 
            variant="secondary" 
            size="icon" 
            onClick={handleZoomIn}
            className={`rounded-full shadow-xl ${isDarkMode ? 'bg-zinc-900/90 border-zinc-800 hover:bg-zinc-800' : 'bg-white/90 border-gray-200 hover:bg-gray-100'} backdrop-blur-xl hover:scale-110 transition-all`}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button 
            variant="secondary" 
            size="icon" 
            onClick={handleZoomOut}
            className={`rounded-full shadow-xl ${isDarkMode ? 'bg-zinc-900/90 border-zinc-800 hover:bg-zinc-800' : 'bg-white/90 border-gray-200 hover:bg-gray-100'} backdrop-blur-xl hover:scale-110 transition-all`}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button 
            variant="secondary" 
            size="icon" 
            onClick={handleRecenter}
            className={`rounded-full shadow-xl ${isDarkMode ? 'bg-zinc-900/90 border-zinc-800 hover:bg-zinc-800' : 'bg-white/90 border-gray-200 hover:bg-gray-100'} backdrop-blur-xl hover:scale-110 transition-all`}
          >
            <Crosshair className="w-4 h-4" />
          </Button>
        </motion.div>

        {/* Bottom Stats Card */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`absolute bottom-4 left-4 right-4 mx-auto max-w-2xl ${isDarkMode ? 'bg-zinc-900/95 border-zinc-800' : 'bg-white/95 border-gray-200'} backdrop-blur-xl rounded-3xl shadow-2xl border-2 overflow-hidden`}
        >
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4 p-4">
            <div className="flex flex-col items-center">
              <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-red-500/20' : 'bg-red-50'} mb-2`}>
                <Gauge className="w-5 h-5 text-red-500" />
              </div>
              <span className="text-2xl font-bold">{navigationStats.speed}</span>
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>km/h</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-cyan-500/20' : 'bg-cyan-50'} mb-2`}>
                <Navigation2 className="w-5 h-5 text-cyan-500" />
              </div>
              <span className="text-2xl font-bold">{navigationStats.distance}</span>
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>km left</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-purple-500/20' : 'bg-purple-50'} mb-2`}>
                <Clock className="w-5 h-5 text-purple-500" />
              </div>
              <span className="text-2xl font-bold">{navigationStats.eta}</span>
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>min ETA</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-green-500/20' : 'bg-green-50'} mb-2`}>
                <Fuel className="w-5 h-5 text-green-500" />
              </div>
              <span className="text-2xl font-bold">{navigationStats.gasSaved}</span>
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>L saved</span>
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
                    <span className="font-bold">{selectedSlot.label}</span>
                    {selectedSlot.type === 'pwd' && (
                      <Badge className="bg-blue-500 text-white text-xs">PWD</Badge>
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
          <div className={`border-t ${isDarkMode ? 'border-zinc-800' : 'border-gray-200'} p-3 flex gap-2`}>
            {!isAutoMode && selectedSlot && !isNavigating && (
              <Button
                onClick={handleStartNavigation}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all"
              >
                <Navigation2 className="w-4 h-4 mr-2" />
                Start Navigation
              </Button>
            )}
            
            <Button
              variant="outline"
              size="icon"
              className={isDarkMode ? 'border-zinc-800' : 'border-gray-200'}
            >
              <Share2 className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className={isDarkMode ? 'border-zinc-800' : 'border-gray-200'}
            >
              <Bookmark className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Quick Filters */}
        {!isAutoMode && !isNavigating && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute top-24 left-1/2 transform -translate-x-1/2 flex gap-2"
          >
            <Button
              variant={filterType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('all')}
              className={`rounded-full ${isDarkMode ? 'border-zinc-800' : 'border-gray-200'} backdrop-blur-xl`}
            >
              <Car className="w-3 h-3 mr-1" />
              All Slots
            </Button>
            <Button
              variant={filterType === 'pwd' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('pwd')}
              className={`rounded-full ${isDarkMode ? 'border-zinc-800' : 'border-gray-200'} backdrop-blur-xl`}
            >
              PWD Only
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
