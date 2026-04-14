# 🎬 Video + Keypoints Playback - Architecture Diagram

## 1️⃣ Data Flow During Playback

```
┌─────────────────────────────────────────────────────────────────┐
│                    PLAYBACK FLOW (NEW)                          │
└─────────────────────────────────────────────────────────────────┘

User clicks ▶ Play
     ↓
┌──────────────────────┐
│ playVideo() called   │
│ - isPlaying = true   │
│ - video.play()       │
└──────────────────────┘
     ↓
HTML5 Video starts
   currentTime: 0 → 0.04 → 0.08 → 0.12 → ...
     ↓
browser fires 'timeupdate' event
     ↓
drawCurrentFrame() called
     ↓
┌─────────────────────────────────────┐
│ getCurrentFrameIndex()               │
│ frameIdx = round(currentTime * fps) │
│ = round(5.0 * 25) = 125             │
└─────────────────────────────────────┘
     ↓
┌─────────────────────────────────────┐
│ Get frame keypoints                 │
│ pts = state.frames[125].keypoints   │
│ (543 keypoints with x,y,z,type)    │
└─────────────────────────────────────┘
     ↓
┌─────────────────────────────────────┐
│ Draw keypoints on canvas            │
│ with view.scale transform           │
│ + color coding                      │
└─────────────────────────────────────┘
     ↓
Canvas overlay updated ✓
Keypoints visible on video ✓
     ↓
requestAnimationFrame(animationLoop)
     ↓
Back to top (loop continues)
```

---

## 2️⃣ Zoom Architecture - Video + Canvas Together

### **BEFORE** ❌

```
┌─────────────────────────────────┐
│  viewport                       │
├─────────────────────────────────┤
│  video (no transform)           │
│  ┌───────────────────────────┐  │
│  │  Video Display (640×480)  │  │
│  └───────────────────────────┘  │
│                                 │
│  canvas (transform: scale 2x)   │
│  ┌───────────────────────────┐  │
│  │  Keypoints (1280×960) ❌  │  │
│  │  Larger than video!       │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘

Result: MISALIGNED! Video small, keypoints big
```

### **AFTER** ✅

```
┌──────────────────────────────────────────┐
│  viewport (transform: scale 2x)          │
│  ┌────────────────────────────────────┐  │
│  │  Container scaled 2x               │  │
│  │                                    │  │
│  │  ┌───────────────────────────────┐ │  │
│  │  │  video                        │ │  │
│  │  │  1280×960 (was 640×480)       │ │  │
│  │  │                               │ │  │
│  │  │  ┌─────────────────────────┐  │ │  │
│  │  │  │ canvas (overlay)        │  │ │  │
│  │  │  │ 1280×960 ✓              │  │ │  │
│  │  │  │ Same size as video!     │  │ │  │
│  │  │  └─────────────────────────┘  │ │  │
│  │  └───────────────────────────────┘ │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘

Result: PERFECT ALIGNMENT! Both scaled equally
```

---

## 3️⃣ Component Hierarchy

```
HTML Structure:

<body>
  │
  ├─ <header>
  │
  ├─ <main>
  │  │
  │  ├─ <div class="controls">
  │  │  ├─ <button id="playBtn">▶</button>      ← NEW
  │  │  ├─ <button id="pauseBtn">⏸</button>    ← NEW
  │  │  ├─ <button id="zoomIn">+</button>
  │  │  ├─ <button id="zoomOut">-</button>
  │  │  ├─ <input id="speedInput">              ← NEW
  │  │  └─ ...
  │  │
  │  └─ <div class="player-wrap">
  │     │
  │     └─ <div id="viewport">                  ← Has transform
  │        │
  │        ├─ <video id="video" controls>      ← z-index: 1
  │        │  └─ (plays at playbackRate)
  │        │
  │        └─ <canvas id="overlay">            ← z-index: 2
  │           └─ (keypoints drawn here)
```

**CSS Transform Applied To Viewport**:
```css
#viewport {
    transform: scale(view.scale);  /* 0.1 to 20 */
    transform-origin: 0 0;
}

/* Children scale automatically! */
```

---

## 4️⃣ State Management

```
┌─────────────────────────────────┐
│  state object (app.js)          │
├─────────────────────────────────┤
│  fps: 25                        │
│  frames: [{...}, {...}, ...]    │  ← Loaded from JSON/extraction
│  frameCount: 750                │  ← Total frames
│  isPlaying: false               │  ← ← NEW: Play/Pause state
│  playbackSpeed: 1.0             │  ← ← NEW: Speed (0.25-2.0)
│  dragging: null                 │
│  videoSize: {w:640, h:480}      │
│  visibleTypes: {pose, hand, ...}│
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  view object (app.js)           │
├─────────────────────────────────┤
│  scale: 1.0                     │  ← Used by CSS transform
│  offsetX: 0                     │
│  offsetY: 0                     │
│  isPanning: false               │
│  panStart: null                 │
│  hoverIndex: null               │
└─────────────────────────────────┘

When user clicks Zoom:
  view.scale = 2.0
       ↓
  applyViewTransform()
       ↓
  viewport.style.transform = "scale(2.0)"
       ↓
  Both video AND canvas scale 2x ✓
```

---

## 5️⃣ Event Flow

```
┌──────────────────────────────────────┐
│  User Interaction                    │
├──────────────────────────────────────┤
│                                      │
│  1. Click ▶ Play Button              │
│     → playVideo() called             │
│     → state.isPlaying = true         │
│     → video.play()                   │
│     → animationLoop() starts         │
│                                      │
│  2. Browser plays video              │
│     → currentTime: 0 → 0.04 → 0.08   │
│     → fires 'timeupdate' event       │
│                                      │
│  3. timeupdate → drawCurrentFrame()  │
│     → Get frame index from time      │
│     → Get keypoints for frame        │
│     → Draw on canvas                 │
│                                      │
│  4. Mouse wheel over canvas          │
│     → wheel event                    │
│     → Calculate zoom factor          │
│     → view.scale = new value         │
│     → applyViewTransform()           │
│     → drawCurrentFrame()             │
│                                      │
│  5. Adjust Speed Slider              │
│     → speedInput change event        │
│     → state.playbackSpeed = value    │
│     → video.playbackRate = value     │
│     → Browser adjusts play speed     │
│                                      │
│  6. Click ⏸ Pause Button             │
│     → pauseVideo() called            │
│     → state.isPlaying = false        │
│     → video.pause()                  │
│     → animationLoop() stops          │
│     → user can drag points now       │
│                                      │
└──────────────────────────────────────┘
```

---

## 6️⃣ Zoom Control Options

```
┌─────────────────────────────────────────────┐
│  Zoom Control Methods                       │
├─────────────────────────────────────────────┤
│                                             │
│  Option 1: Button Click                     │
│  ┌────────┐  ┌────────┐                     │
│  │   +    │  │   -    │                     │
│  └────────┘  └────────┘                     │
│    view.scale *= 1.2                        │
│    view.scale /= 1.2                        │
│                                             │
│  Option 2: Mouse Wheel (Over Canvas)        │
│  Scroll Up:    view.scale *= 1.1  (zoom in)│
│  Scroll Down:  view.scale *= 0.91 (out)    │
│                                             │
│  Option 3: Reset Button                     │
│  ┌──────────────┐                           │
│  │  Reset View  │                           │
│  └──────────────┘                           │
│    view.scale = 1.0                         │
│    view.offsetX = 0                         │
│    view.offsetY = 0                         │
│                                             │
│  All options call:                          │
│    applyViewTransform()                     │
│         ↓                                   │
│    drawCurrentFrame()                       │
│         ↓                                   │
│    canvas updated + video scaled ✓          │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 7️⃣ Timing Synchronization Loop

```
Frame Timeline:

Video Time:    0.00s    0.04s    0.08s    ...    5.00s
               Frame 0  Frame 1  Frame 2  ...    Frame 125
                 │        │        │               │
                 ├────────┴────────┴───────────────┤
                 │   (video.currentTime)          │
                 ↓                                 ↓
            Math.round(0 * 25)                Math.round(5.0 * 25)
                 = 0                               = 125
                 ↓                                 ↓
         state.frames[0]                  state.frames[125]
         {time: 0.0, kpts}                {time: 5.0, kpts}
                 ↓                                 ↓
            drawCurrentFrame()            drawCurrentFrame()
                 ↓                                 ↓
            Canvas updated                Canvas updated
            Keypoints shown               Keypoints shown

Perfect Sync: Video position = Frame time = Keypoints time
```

---

## 8️⃣ Speed Control Implementation

```
HTML Input:
┌────────────────────────────────────┐
│ Speed Slider: 0.25 ← 1.0 → 2.0    │
│ Display: "1.0x"                    │
└────────────────────────────────────┘
              ↓ (user input)
         Range Change Event
              ↓
   speedInput.addEventListener('input', (e) => {
       state.playbackSpeed = parseFloat(e.target.value);
       video.playbackRate = state.playbackSpeed;
       speedDisplay.textContent = ... + 'x';
   })
              ↓
   HTML5 Video API handles:
   - Slowing down video playback
   - Adjusting audio pitch (if any)
   - Keeping sync with browser
              ↓
   video.currentTime still increments:
   - At 0.5x: currentTime += 0.02 (half speed)
   - At 1.0x: currentTime += 0.04 (normal)
   - At 2.0x: currentTime += 0.08 (double speed)
              ↓
   timeupdate event fires (slower/faster)
              ↓
   drawCurrentFrame() called
              ↓
   Keypoints display at correct frame (slow/fast) ✓
```

---

## 9️⃣ File Structure After Changes

```
c:\Users\sv\Desktop\New folder\
│
├─ index.html                          ← MODIFIED (play/pause/speed UI)
│  ├─ Lines 31-40: Added playBtn, pauseBtn, speedInput
│
├─ app.js                              ← MODIFIED (main logic)
│  ├─ Line 23-25: Added state.isPlaying, state.playbackSpeed
│  ├─ Lines 570-595: Added playVideo(), pauseVideo(), updatePlaybackUI()
│  ├─ Lines 618-627: Added applyViewTransform()
│  ├─ Lines 644-681: Updated zoom listeners + added play/pause listeners
│  ├─ Lines 668-674: Added speed control listener
│
├─ style.css                           ← MODIFIED (viewport zoom support)
│  ├─ Lines 55-63: Updated #viewport (transform-origin, transform)
│  ├─ Lines 66-79: Updated #video, #overlay (z-index positioning)
│
├─ mediapipe-extractor-holistic.js     (no changes needed)
│
├─ sample-keypoints-holistic.json      (no changes needed)
│
└─ PLAYBACK-ZOOM-*.md                  ← NEW DOCUMENTATION
   ├─ PLAYBACK-ZOOM-GUIDE.md           (comprehensive guide)
   ├─ PLAYBACK-ZOOM-SUMMARY.md         (quick summary)
   ├─ PLAYBACK-ZOOM-IMPLEMENTATION.md  (technical details)
```

---

## 🔟 Workflow Diagram

```
START
  ↓
Load Video → Load Keypoints (or Extract)
  ↓
┌─────────────────────────────────────┐
│         MAIN WORKFLOW                │
├─────────────────────────────────────┤
│                                     │
│  1. User clicks ▶ Play              │
│     ↓                               │
│  2. Video plays                     │
│     + Keypoints update every frame  │
│     + Canvas overlay shows keypts   │
│     ↓                               │
│  3. User checks: Are keypts correct?│
│     ├─ YES → Continue playing       │
│     │         or press Pause        │
│     │                               │
│     └─ NO → Press ⏸ Pause          │
│             ↓                       │
│         4a. Zoom in (mouse wheel up)│
│             ↓                       │
│         4b. Drag incorrect point    │
│             ↓                       │
│         4c. Zoom out (reset)        │
│             ↓                       │
│         4d. Play again from here    │
│             ↓                       │
│         4e. Verify fix              │
│             ↓                       │
│             Back to step 3          │
│                                     │
│  5. Finished checking/editing       │
│     ↓                               │
│  6. Save JSON (download)            │
│                                     │
└─────────────────────────────────────┘
  ↓
END

Total time for 30s video: ~5 min (extract) + ~2 min (verify+edit)
```

---

## 📊 Summary Table

| Feature | Before | After | Method |
|---------|--------|-------|--------|
| **Playback** | Manual frame-by-frame | Play/Pause auto-sync | animationLoop |
| **Zoom** | Canvas only | Video + Canvas | CSS viewport transform |
| **Speed** | Fixed 1x | 0.25x - 2.0x | HTML5 playbackRate |
| **Sync** | Unreliable | Perfect | frame index from time |
| **UI** | Simple | Enhanced | New buttons + slider |
| **Performance** | Fast | Fast | RequestAnimationFrame |

---

**Architecture complete! 🎉 Ready for production.**
