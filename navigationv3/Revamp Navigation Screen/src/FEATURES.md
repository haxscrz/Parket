# Parking Navigation App - Features

## Mode Toggle

### 🤖 Auto Mode
- **Location**: Header bar with visible switch
- **Behavior**: Automatically finds and navigates to the nearest available parking slot
- **Strategy Options** (via menu):
  - "Closest to Vehicle" - Finds slot nearest to car's current position
  - "Nearest to Mall" - Finds slot nearest to mall entrance
- **Status**: Shows "Auto-navigating to your spot..." during navigation

### 👆 Manual Mode  
- **Location**: Header bar with visible switch
- **Behavior**: User selects their preferred parking slot manually
- **Steps**:
  1. Use filter buttons to show specific slot types (optional)
  2. Tap on any available (green/blue/purple) parking slot
  3. Review slot details in bottom panel
  4. Press "Start Navigation" button to begin
- **Helper**: Blue hint box appears when no slot is selected

## Filters (Manual Mode Only)

Located below the mode toggle when in manual mode:

1. **All Slots** - Shows all available parking slots (green, PWD, EV)
2. **♿ PWD** - Shows only PWD (disabled) parking slots
3. **⚡ EV** - Shows only electric vehicle charging slots

Filters are:
- Mutually exclusive (only one active at a time)
- Visual dimming of non-matching slots
- Clear selection when switching filters

## Parking Slot Types

- 🟢 **Available** - Regular parking slots (green)
- 🔴 **Occupied** - Not available (red/dark)
- 🔵 **PWD** - Disabled parking with wheelchair icon (blue)
- 🟣 **EV** - Electric vehicle charging (purple)
- 🟡 **Reserved** - Reserved slots (yellow)

## Navigation Features

### Stats Display (Always Visible)
- **Speed** - Current km/h
- **Distance** - Remaining distance to slot
- **ETA** - Estimated time of arrival (minutes)
- **Gas Saved** - Fuel saved by optimal routing

### Map Controls (Right Side)
- **Zoom In** - Increase map zoom
- **Zoom Out** - Decrease map zoom  
- **Recenter** - Focus camera on current car position

### Progress Tracking
- Real-time progress bar during navigation
- Animated path visualization
- Ripple effects around moving vehicle

## Bottom Panel

### When Slot Selected (Manual Mode, Not Navigating)
- Slot number and details
- Column location
- PWD/EV badges if applicable
- "Start Navigation" button (blue, prominent)
- Share and Bookmark buttons

### During Navigation
- Navigation progress percentage
- Progress bar visualization
- "Cancel Navigation" button

### No Selection (Manual Mode)
- Helper text: "Tap on an available parking slot to select it"

## Mobile Optimizations

- Touch gesture support for panning
- Safe area handling for notches/home indicators
- Responsive button sizes (44px minimum)
- Horizontal scroll for filter buttons
- Collapsible legend to save space

## Menu Options

Accessible via hamburger menu (top right):

- **Auto Navigation Strategy** - Choose between closest to car or nearest to mall
- **Show/Hide Legend** - Toggle color legend display

## Legend (When Visible)

Shows color codes for all slot types:
- Available (green)
- Occupied (red)
- PWD (blue)
- EV (purple)
- Reserved (yellow)
