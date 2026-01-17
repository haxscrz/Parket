# Car Position and Navigation State Fixes

## Issues Fixed

### Issue 1: Car Not Starting at Entrance on Initial Load
**Problem:** When the app first loaded, the car was not positioned at the entrance.

**Root Cause:** The `isParked` state was initialized to `true` (from `lockedOrientationRef.current = true`), which made the system think the car was already parked somewhere.

**Solution:** Changed initialization:
```typescript
// BEFORE:
const lockedOrientationRef = useRef(true);  // locked on mount
const [isParked, setIsParked] = useState<boolean>(lockedOrientationRef.current); // true!

// AFTER:
const lockedOrientationRef = useRef(false);  // unlocked, ready to navigate
const [isParked, setIsParked] = useState<boolean>(false); // not parked initially
```

### Issue 2: Car Teleports When Selecting New Slot While Parked
**Problem:** When already parked or positioned somewhere, selecting a new parking slot caused the car to teleport to the start of the new path.

**Root Cause:** The `handleSelectSlot()` function was resetting `navProgress` to 0 immediately, which caused `carDisplay` to jump to the first point of the new path.

**Solution:** Removed the immediate `navProgress` reset:
```typescript
// BEFORE:
const handleSelectSlot = (row, col, slot) => {
  // ... validation ...
  setTargetSlot(override);
  setNavProgress(0);  // ❌ This caused the teleport!
  setParkingLayoutState(generateParkingLayout(override));
  setTimeout(() => setDashOffset(prev => (prev + 1) % 1000), 10);
};

// AFTER:
const handleSelectSlot = (row, col, slot) => {
  // ... validation ...
  setTargetSlot(override);
  // DON'T reset navProgress - keep car at current position until Start Navigation
  setParkingLayoutState(generateParkingLayout(override));
};
```

### Issue 3: Car Position Not Reset When Starting New Navigation
**Problem:** When clicking "Start Navigation" after selecting a new slot, the car didn't return to the entrance - it started from wherever it was.

**Root Cause:** The start navigation handler wasn't resetting the car's position and display state to the entrance.

**Solution:** Added complete reset when starting navigation:
```typescript
// BEFORE:
onClick={() => {
  if (!isNavigating) {
    lockedOrientationRef.current = false;
    setIsParked(false);
    setIsNavigating(true);
    if (navProgress >= 0.999) setNavProgress(0);
  }
}}

// AFTER:
onClick={() => {
  if (!isNavigating) {
    // Reset car to entrance position
    setCarPosition({ row: 0, col: Math.floor(GRID_COLS / 2) });
    setDisplayX(defaultStartX);
    setDisplayY(defaultStartY);
    setDisplayAngle(90); // facing down/south into parking lot
    
    // Start fresh navigation
    lockedOrientationRef.current = false;
    setIsParked(false);
    setIsNavigating(true);
    setNavProgress(0);
  }
}}
```

## How It Works Now

### Initial State
- Car is positioned at the entrance (row 0, center column)
- Car is NOT parked (`isParked = false`)
- Orientation is unlocked and ready to navigate

### Selecting a New Slot
- User can click any available parking slot
- The target updates immediately (visual highlight appears)
- **Car stays where it is** - no teleporting!
- Path is recalculated but car doesn't move until "Start Navigation"

### Starting Navigation
- Clicking "Start Navigation" button:
  1. Resets car to entrance position
  2. Resets display position and angle
  3. Starts navigation from beginning (`navProgress = 0`)
  4. Car smoothly animates along the path to the target slot

### During Navigation
- Car follows the path using Dijkstra's shortest route
- Respects roads only (no shortcuts through parking)
- Rotates to match movement direction

### Arrival
- When `navProgress >= 0.98`, navigation stops
- Car orientation locks at final angle
- `isParked = true` triggers parked animations
- Car stays in the parking slot

### Selecting Another Slot While Parked
- User can select a different slot
- Target updates (new highlight appears)
- **Car remains in current parking spot**
- New path is calculated but not followed
- Clicking "Start Navigation" will:
  - Move car back to entrance
  - Start fresh journey to new target

## Benefits

✅ **Predictable behavior** - Car always starts at entrance when navigating
✅ **No teleporting** - Car stays put when changing targets
✅ **Clear workflow** - Select slot → see path → press Start Navigation → car moves
✅ **Proper state management** - isParked/isNavigating reflect actual state
✅ **Smooth animations** - All position changes are smooth except deliberate resets
