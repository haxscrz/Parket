# Dijkstra's Algorithm - Road-Only Navigation Fix

## Issues Fixed

### 1. ❌ Problem: Path Ignored Roads
**Before:** The algorithm allowed the car to navigate directly to the parking slot, cutting through other parking spaces.

**Why it happened:** The `isNavigable()` function included the target parking slot as a navigable cell, so Dijkstra found the shortest direct path to it.

```javascript
// BEFORE (Wrong):
if (cell.type === 'parking' && r === targetRow && c === targetCol) return true;
// This made the parking slot navigable, allowing direct access
```

**After:** Now parking slots are NEVER navigable. The car must:
1. Navigate to the road cell adjacent to the parking slot
2. Then enter the slot from that adjacent road

```javascript
// AFTER (Correct):
const isNavigable = (r: number, c: number): boolean => {
  // Only allow roads and entrance - parking slots are NOT navigable
  return (cell.type === 'road' || cell.type === 'entrance');
};
```

### 2. ❌ Problem: Weird Parking Angle on Lower Slots
**Before:** The car entered parking slots with the wrong orientation (sideways or backwards).

**Why it happened:** The angle calculation always defaulted to 90° (down) for the final point, regardless of which direction the car actually entered from.

```javascript
// BEFORE (Wrong):
if (targetSlotData?.type === 'parking') {
  angle = 90; // Always face down - WRONG!
}
```

**After:** The angle is calculated based on the direction the car is moving when entering:

```javascript
// AFTER (Correct):
// Determine entry angle based on where we came from
const prev = gridPath[i - 1];
const dx = cell.col - prev.col;
const dy = cell.row - prev.row;

if (dx > 0) angle = 0;        // entered from left, facing right
else if (dx < 0) angle = 180; // entered from right, facing left
else if (dy > 0) angle = 90;  // entered from above, facing down
else if (dy < 0) angle = 270; // entered from below, facing up
```

## How It Works Now

### Step 1: Find Adjacent Road Cell
Before running Dijkstra, we find which road cell is adjacent to the target parking slot:

```
Parking Slot (P-R4)
     [Road]         ← Adjacent road (approach cell)
     [P-R4]         ← Target parking slot
```

### Step 2: Navigate to Adjacent Road
Dijkstra finds the shortest path through roads to reach the adjacent road cell:

```
Entrance → Roads → Cross Aisles → Target Aisle → Adjacent Road Cell
```

**Key: The parking slot itself is NOT part of the path search!**

### Step 3: Enter the Slot
After reaching the adjacent road, we add one final step: entering the parking slot.

```
Path: [Road Cells...] → [Adjacent Road] → [Parking Slot]
                                        ↑
                                  Added manually
                                  after Dijkstra
```

### Step 4: Calculate Correct Angle
The car's orientation when entering is based on the direction of movement:

- Entering from above → Face down (90°)
- Entering from below → Face up (270°)
- Entering from left → Face right (0°)
- Entering from right → Face left (180°)

## Visual Example

### Before (Wrong):
```
[Road] → [P-R4]  ❌ Direct line cutting through parking
                    (Dijkstra included P-R4 as navigable)
```

### After (Correct):
```
[Road] → [Road] → [Road] ✅ Follows roads
           ↓
        [Road] (Adjacent)
           ↓
        [P-R4] (Enter from adjacent road)
```

## Benefits

✅ **Always uses roads** - Never cuts through parking spaces
✅ **Shortest road-based path** - Dijkstra still finds optimal route through road network
✅ **Correct parking orientation** - Car faces the right direction when entering
✅ **Works for any slot** - Upper, lower, left, right - all handled correctly
✅ **Natural movement** - Car behaves like real parking navigation

## Technical Details

### Adjacent Road Finding
```javascript
const findAdjacentRoadCell = (): { row: number; col: number } | null => {
  const adjacentCells = [
    { row: targetRow - 1, col: targetCol }, // above
    { row: targetRow + 1, col: targetCol }, // below
    { row: targetRow, col: targetCol - 1 }, // left
    { row: targetRow, col: targetCol + 1 }, // right
  ];
  
  for (const cell of adjacentCells) {
    if (isNavigable(cell.row, cell.col)) {
      return cell; // First road cell found adjacent to parking slot
    }
  }
  return null;
};
```

### Modified Dijkstra Target
```javascript
// OLD: Target was the parking slot itself
if (current.row === targetRow && current.col === targetCol) break;

// NEW: Target is the adjacent road cell
if (currentKey === targetApproachKey) break;
```

### Path Construction
```javascript
// 1. Dijkstra finds path to adjacent road
const gridPath = [...]; // Path to adjacent road cell

// 2. Manually add parking slot entry
gridPath.push({ row: targetRow, col: targetCol });

// 3. Calculate angles based on actual movement direction
// (not hardcoded to 90° anymore)
```

## Result

🎯 **Perfect road-based pathfinding**
🚗 **Natural parking entry**
📐 **Correct orientation every time**
✨ **No more shortcuts through parking spaces**
⚡ **Still uses shortest valid path**

The car now behaves exactly like a real vehicle - following roads, respecting parking spaces, and entering slots with proper orientation!
