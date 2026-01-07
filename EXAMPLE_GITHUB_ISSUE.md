# BEISPIEL: Verbessertes GitHub Issue Format

## Wie unsere GitHub Issues AB JETZT aussehen sollen:

---

### Issue #1: Timer Core - Start Button Begins Countdown

**Category:** functional
**Priority:** high
**Status:** todo

#### Context
Users need to start the Pomodoro timer with a single click. The start button is the primary
interaction and must be prominent and responsive.

#### Implementation Details
- React state for `isRunning` (boolean)
- `setInterval` hook for countdown (1000ms)
- Circular progress ring using SVG with `stroke-dasharray` animation
- Timer display format: MM:SS with leading zero

#### UI/UX Requirements

**UI Elements Required:**
- **Start Button:**
  - Location: Center of timer controls (below timer display)
  - Size: Large, minimum 80x80px (prominent, primary action)
  - Icon: Play icon (lucide-react Play icon)
  - Style: Rounded-full, accent color background (#EF4444 for Work mode)
  - Text: No text, icon-only (or icon + "Start" on desktop)
- **Timer Display:**
  - Location: Center of screen, large
  - Format: MM:SS (e.g., "25:00")
  - Font: Monospace, ~80px (desktop), ~60px (tablet), ~48px (mobile)

**User Flow:**
1. User sees timer at "25:00" in Work mode
2. User clicks Start button (center, large, prominent)
3. Button transforms to Pause icon (toggle)
4. Timer decrements: 25:00 → 24:59 → 24:58...
5. Circular progress ring animates clockwise

**Visual States:**
- **Initial State:** Button shows Play icon, timer at "25:00"
- **Running State:** Button shows Pause icon, timer counting down
- **Hover:** Button scales to 1.05, background shifts slightly darker
- **Active:** Button has subtle glow or ring when timer is running

#### Test Steps

1. **Verify Start button exists and is clickable**
   - Navigate to: `localhost:3000`
   - **UI Element to find:** Large circular button below timer display (center position, ~80px, red background with Play icon)
   - Action: Look for button in center of screen, below timer digits
   - Expected: Button is visible, centered, has red background, shows Play icon

2. **Click Start button and verify timer begins countdown**
   - Navigate to: `localhost:3000`
   - **UI Element to find:** Same Start button (center, below timer)
   - Action: Click the Start button once
   - Expected: Timer changes from "25:00" to "24:59" within 1 second, button icon changes to Pause

3. **Verify button toggles to Pause icon**
   - Navigate to: `localhost:3000`
   - **UI Element to find:** Center button (now should show Pause icon)
   - Action: After starting timer, observe button
   - Expected: Button now shows Pause icon (two vertical bars), not Play icon

4. **Verify progress ring starts animating**
   - Navigate to: `localhost:3000`
   - **UI Element to find:** Circular progress ring around timer display
   - Action: Start timer and observe the ring
   - Expected: Ring is full (100%) at start, then slowly decreases clockwise as timer counts down

5. **Verify countdown continues smoothly each second**
   - Navigate to: `localhost:3000`
   - **UI Element to find:** Timer display (large MM:SS digits)
   - Action: Start timer and observe for 10 seconds
   - Expected: Each second decrements exactly once (24:59 → 24:58 → 24:57...), no skips, no double-counts

#### Verification
- [ ] **Backend implemented** (React state, useEffect with setInterval, timer logic)
- [ ] **UI elements visible** (Start button exists in center, below timer, large and prominent)
- [ ] **UI elements clickable** (onClick handler connected, click triggers timer start)
- [ ] **Feature works end-to-end** (click Start → timer counts down → button shows Pause)
- [ ] **Progress ring animates** (SVG stroke-dasharray animates clockwise)
- [ ] **No console errors** (open DevTools, verify no errors)
- [ ] **Smooth animations** (60fps, no stuttering)

#### Acceptance Criteria
- [ ] Start button is centered below timer display
- [ ] Start button is large (minimum 80x80px) and prominent
- [ ] Start button shows Play icon from lucide-react
- [ ] Clicking Start button begins countdown from 25:00
- [ ] Timer decrements each second (MM:SS format)
- [ ] Button toggles to Pause icon when running
- [ ] Circular progress ring animates clockwise
- [ ] Animations are smooth (60fps)

#### Screenshots Required
- `step_1_initial_state.png` - Timer at 25:00, Start button visible
- `step_2_after_click.png` - Timer at 24:59, button shows Pause icon
- `step_3_progress_ring.png` - Progress ring partially filled
- `step_4_working.gif` - Animation showing countdown (optional)

---

## WAS HAT SICH VERÄNDERT?

### ALT (unser aktuelles Format):
```markdown
## Feature: Image Upload

- Upload images to notes
- Display in editor
```

### NEU (mit UI/UX Requirements):
```markdown
## Feature: Image Upload

#### UI/UX Requirements
- **Upload Button:**
  - Location: Header (right side, before Delete button)
  - Icon: Image icon (lucide-react Image)
  - Text: "Image" (hidden on mobile, visible on desktop)
  - Style: px-3 py-2, min-h-[40px], rounded-lg
  - Action: Click opens file picker

**User Flow:**
1. User clicks "Image" button
2. File picker opens with accept="image/*"
3. User selects PNG/JPG
4. Upload progress bar shows
5. Image inserts into editor
6. Success toast appears

#### Test Steps
1. **Verify upload button exists**
   - Navigate to: /notes/1
   - **UI Element to find:** "Image" button in header (right side)
   - Action: Look for button with image icon + text
   - Expected: Button visible, clickable

#### Verification
- [ ] **Backend implemented** (UploadThing, API routes)
- [ ] **UI elements visible** (Image button in header)
- [ ] **UI elements clickable** (onClick → file picker opens)
- [ ] **Feature works end-to-end** (upload → display in editor)
```

---

## KEY DIFFERENCES:

1. **UI/UX Requirements Section** (NEU!)
   - Wo genau? (Location)
   - Wie groß? (Size)
   - Welches Icon? (Icon library)
   - Welcher Style? (Tailwind classes)
   - Was passiert bei Hover/Active?

2. **User Flow** (NEU!)
   - Schritt-für-Schritt was der User sieht
   - Click → X → Y → Z

3. **Test Steps mit "UI Element to find"** (NEU!)
   - JEDER Test sagt wo das Element ist
   - Wie es aussieht
   - Was man tun muss

4. **Verification Checklist** (VERBESSERT!)
   - Backend implemented ✓
   - **UI elements visible** ✓ (NEU!)
   - **UI elements clickable** ✓ (NEU!)
   - End-to-end works ✓

---

## DAS VERHINDERT "Code ≠ Feature" PROBLEME!

**Alt:** Agent implementiert Upload API → Kein Button → Feature unusable

**Neu:** Agent MUSS in Verification checklisten:
- UI elements visible → Wenn NEIN → Test fail → Button hinzufügen!
- UI elements clickable → Wenn NEIN → Test fail → onClick handler hinzufügen!

---

## regression Testing (NUMMER 3!)

### NEUER STEP IN PHASE 2 (Implementation):

```markdown
### STEP 2.5: REGRESSION TEST (MANDATORY!)

**BEFORE implementing new feature, verify existing features still work:**

1. Pick 2 tests marked as "passes": true that are CORE to the app
2. Run them manually or with browser automation
3. If ANY fail → mark as "passes": false → fix BEFORE new work

Example:
- Test #1 (Timer start): Run it, verify timer still starts
- Test #15 (Task add): Run it, verify tasks can still be added

If both pass → Continue to new feature
If any fail → Fix first! This prevents breaking existing functionality
```

---

## Zusammenfassung:

| Änderung | Was es bringt |
|----------|---------------|
| **UI/UX Requirements** | Agent weiß GENAU wo UI Elemente sein müssen |
| **User Flow** | Agent sieht kompletten User Journey |
| **UI Element to find** | Tester weiß wo zu klicken ist |
| **Verification: UI visible/clickable** | Verhindert "Backend ohne UI" |
| **Regression Test** | Verhindert "Neues bricht Altes" |

---

**Das ist es!** Damit haben wir:

1. ✅ **Bessere app_spec.xml** - RIESIG detailiert (alles drin: UI, DB, API, Design)
2. ✅ **feature_list.json** - 200+ granulare Tests
3. ✅ **Regression Testing** - Vor neuem Feature altes testen
4. ✅ **GitHub Issues detailliert** - UI-spezifisch mit "UI Element to find"

Sollen wir das jetzt im **fac system** einbauen?
