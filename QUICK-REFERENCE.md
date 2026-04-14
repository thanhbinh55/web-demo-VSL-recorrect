# Quick Reference: MediaPipe Holistic Upgrade

## 🎯 What Changed

| Aspect | Before | After |
|--------|--------|-------|
| **Keypoints** | 21 (hands) | 543 (body+hands+face) |
| **Max Zoom** | 4x | 20x |
| **Min Zoom** | 0.2x | 0.1x |
| **Zoom Control** | Buttons | Buttons + Mouse Wheel |
| **Filtering** | No | Yes (4 types) |
| **Colors** | 3 hardcoded | Type-based (4 colors) |
| **Skeleton** | Hands only | Pose + Hands |

---

## 🚀 Getting Started

1. **Open browser**: http://localhost:8000
2. **Load video**: Click "Tải Video"
3. **Auto-extract**: Click "Auto-extract (MediaPipe)"
4. **Use filters**: Uncheck types to hide them
5. **Zoom**: Scroll wheel to zoom in/out
6. **Edit**: Drag points to correct positions
7. **Save**: Click "Lưu / Tải xuống JSON"

---

## 🎮 Controls

| Action | Control |
|--------|---------|
| Zoom in | Mouse wheel UP or + button |
| Zoom out | Mouse wheel DOWN or − button |
| Pan | Right-click drag |
| Move point | Left-click drag (paused video only) |
| Undo | Ctrl+Z |
| Redo | Ctrl+Y |
| Reset view | Click "Reset View" |
| Filter type | Uncheck checkboxes |

---

## 🔢 Point Layout

| Type | Index Range | Count | Color |
|------|-------------|-------|-------|
| Pose (Body) | 0–32 | 33 | Red |
| Left Hand | 33–53 | 21 | Teal |
| Right Hand | 54–74 | 21 | Yellow |
| Face | 75–542 | 468 | Light Teal |
| **TOTAL** | 0–542 | **543** | — |

---

## 📁 Key Files

| File | Role |
|------|------|
| `index.html` | UI layout |
| `app.js` | Main logic (drawing, zoom, filtering) |
| `mediapipe-extractor-holistic.js` | Frame extraction |
| `sample-keypoints-holistic.json` | Test data (543-point format) |

---

## 💾 Data Format

```json
[
  [
    {
      "x": 0.5,           // normalized x (0-1)
      "y": 0.5,           // normalized y (0-1)
      "z": 0.1,           // normalized z (depth)
      "type": "pose",     // "pose"|"leftHand"|"rightHand"|"face"
      "visibility": 0.95  // confidence (0-1)
    },
    ...543 points per frame
  ]
]
```

---

## ⚡ Performance Tips

1. **Hide Face**: Uncheck "Face" to reduce clutter (saves 468 points)
2. **Reduce FPS**: Lower video FPS before extraction
3. **Smaller video**: Resize to 480p for faster processing
4. **Batch extract**: Process one video at a time

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| "MediaPipe chưa load" | Wait 3-5s for CDN; check internet |
| No points appear | Ensure video has visible body/hands/face |
| Zoom too slow | Reduce visible points with filters |
| Points disappear | You unchecked their type; check again |
| Extraction fails | Try lower-resolution video |

---

## 📚 Learn More

- Full guide: `HOLISTIC-UPGRADE.md`
- Setup: `INSTALL.md`
- Testing: `TESTING.md`
- Original MVP: `README.md`

---

## ✨ Pro Tips

1. **20x zoom + scroll wheel** = fastest point adjustment
2. **Uncheck Face first** = focus on body/hand editing  
3. **Right-click pan** = reposition after zoom
4. **Ctrl+Z/Y hotkeys** = quick undo/redo
5. **Autosave checkbox** = never lose work

---

**Version**: Holistic Upgrade (2024)  
**Status**: ✅ Production Ready
