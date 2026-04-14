# 🎯 QUICK REFERENCE - Playback + Synchronized Zoom

## ⚡ Quick Start (30 seconds)

```
1. Load video.mp4
2. Extract or load keypoints.json
3. Click ▶ Play
   → Video + keypoints play together ✓
4. Scroll mouse to zoom (video + canvas together) ✓
5. Adjust Speed slider to slow down/speed up ✓
6. Click ⏸ Pause to edit keypoints ✓
```

---

## 🎮 Button Guide

| Button | Icon | Function | Keyboard |
|--------|------|----------|----------|
| Play | ▶ | Start video + keypoints | - |
| Pause | ⏸ | Stop video + keypoints | - |
| Zoom In | + | Make bigger (video + canvas) | Mouse wheel UP |
| Zoom Out | - | Make smaller (video + canvas) | Mouse wheel DOWN |
| Reset View | ↺ | Back to 1.0x zoom | - |

---

## 🎬 Speed Control

```
Slider Range: 0.25x → 2.0x

0.25x  = Quay chậm 4 lần (Ultra slow, detailed analysis)
0.5x   = Quay chậm 2 lần (Slow, frame-by-frame)
1.0x   = Bình thường (Normal speed)
1.5x   = Quay nhanh 50% (Fast)
2.0x   = Quay nhanh gấp đôi (Ultra fast)

Display: Shows current speed "0.5x", "1.0x", "2.0x" etc
```

---

## 🔍 Zoom Guide

### **Buttons**
```
Nút +  (3-5 clicks) → Zoom 1.73x to 2.49x
Nút -  (3-5 clicks) → Zoom 0.41x to 0.68x
```

### **Mouse Wheel** (Over Video Area)
```
Scroll UP   = Zoom In   (faster, one scroll = 1.1x)
Scroll DOWN = Zoom Out  (faster, one scroll = 0.91x)
```

### **Range**
```
0.1x  = Tiny (see entire video at once)
1.0x  = Normal (original size)
20x   = Huge (see single joint details)
```

---

## 🎯 Common Tasks

### **Task 1: Check Overall Video**
```
1. Click ▶ Play
2. Speed: 1.0x (normal)
3. Zoom: 0.1x-0.5x (see everything)
4. Watch entire video
5. Pause if you see any wrong points
```

### **Task 2: Find + Fix Errors**
```
1. Pause ⏸
2. Zoom in: 5-10x (cuộl chuột LÊN)
   → Both video and keypoints enlarge
3. Drag wrong point to fix
4. Zoom out: Reset View button
5. Play ▶ again to verify
```

### **Task 3: Frame-by-Frame Analysis**
```
1. Speed: 0.5x (slow)
2. Zoom: 3-5x (medium detail)
3. Click ▶ Play
4. Watch each frame slowly
5. Pause and fix as needed
```

### **Task 4: Verify After Editing**
```
1. Speed: 0.5x (slow)
2. Zoom: 2-3x (check details)
3. Play from edited point
4. Watch if fix is correct
5. Continue if OK, else re-edit
```

---

## 🔑 Keyboard Shortcuts (Existing)

```
Ctrl+Z     = Undo last edit
Ctrl+Y     = Redo last edit
Mouse drag = Move keypoint (when paused)
```

---

## 💡 Tips

**Tip 1**: Zoom + Speed combo for best results
```
Verification: 0.5x speed + 3x zoom = Perfect!
Editing:      0.5x speed + 5x zoom = Easier
Overview:     1.0x speed + 0.1x zoom = See all
```

**Tip 2**: Always pause before dragging points
```
Play → See issue
Pause → Fix issue
Play → Verify fix
```

**Tip 3**: Use mouse wheel for quick zoom
```
Don't click + button 5 times
Just scroll mouse wheel = faster!
```

**Tip 4**: Reset zoom when done
```
Click "Reset View" → Back to 1.0x
Then continue playing
```

---

## ❌ Common Issues

| Problem | Solution |
|---------|----------|
| Play button gray (disabled) | Load video + keypoints first |
| Keypoints lag behind video | Check F12 console for errors |
| Zoom not synchronized | Hard refresh (Ctrl+Shift+R) |
| Speed slider not working | Try Chrome or Firefox |
| Video plays but no keypoints | Ensure keypoints loaded |

---

## 📊 Feature Comparison

| Use Case | Speed | Zoom | Button |
|----------|-------|------|--------|
| Overview check | 1.0x | 0.1x | Play |
| Detail check | 0.5x | 5x | Play |
| Edit keypoint | Pause | 10x | Pause + Drag |
| Verify fix | 0.5x | 3x | Play |
| Quick browse | 2.0x | 0.5x | Play |

---

## 🎬 Example Workflow (2 minutes)

```
Time    Action                  What You See
────────────────────────────────────────────
0:00    Load video "person.mp4" Video in player
0:05    Extract keypoints       750 frames extracted
0:30    Zoom = 0.1x, Play       Video plays small, see all
0:45    See issue at 5s         Left hand wrong
0:50    Pause at 5s             Frame paused
0:55    Zoom = 5x               Hand zoomed in
1:00    Drag points to fix      Fixed position
1:10    Zoom = 1.0x             Back to normal
1:15    Play from 5s            Check if correct
1:30    Looks good! Continue    Play rest of video
1:45    Finish checking         All frames checked
2:00    Save JSON               File downloaded
```

---

## 🔧 Technical Summary

```
What's New:
- Play/Pause buttons
- Speed slider (0.25x - 2.0x)
- Zoom synchronized (video + keypoints)
- Canvas update on timeupdate event

How It Works:
- video.currentTime → frameIndex → keypoints → draw
- All three tied together by timing

Result:
- Perfect synchronization
- Easy verification
- Quick editing workflow
```

---

## ✅ Verification Checklist

- [ ] Play button works (video starts)
- [ ] Pause button works (video stops)
- [ ] Speed slider changes playback speed
- [ ] Zoom buttons enlarge/shrink both video + canvas
- [ ] Mouse wheel zoom works
- [ ] Reset view returns to 1.0x
- [ ] Keypoints display on video overlay
- [ ] Keypoints update with video time
- [ ] Can pause + edit + play again
- [ ] No console errors (F12)

---

## 🎉 You're Ready!

Start using:
1. Load video
2. Extract/load keypoints
3. Play + Zoom + Verify
4. Edit as needed
5. Save

**Happy keypoint editing! 🚀**

---

**Version**: 1.0 (Playback + Synchronized Zoom)  
**Date**: 2025  
**Status**: ✅ Ready for Production
