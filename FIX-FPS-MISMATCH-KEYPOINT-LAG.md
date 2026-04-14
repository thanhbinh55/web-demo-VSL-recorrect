# 🔧 FIX: FPS Mismatch Causing Keypoint Lag

## 🎯 Problem Identified

**Issue**: Keypoints still lag behind video when paused  
**Root Cause**: **FPS mismatch** - Video extracted at 25fps, but your video might be recorded at 30fps (or different)

### **How It Happens**

```
Video recorded at 30fps
Keypoints extracted at 25fps (hardcoded)

When video is paused at time 5.0s:
- Correct frame index = 5.0 × 30 = 150 (should be frame 150)
- But app calculates = 5.0 × 25 = 125 (wrong frame!)
- Result: Shows frame 125 instead of 150 (LAG!) ❌
```

---

## ✅ Solution: Auto-Detect FPS

### **Method 1: Check Video Metadata** (Recommended)

The video element has `videoWidth`, `videoHeight`, and we can calculate FPS from duration.

**New approach**:
```javascript
// When video loads, detect actual FPS
function detectVideoFPS() {
    // Try to get FPS from video element (if available)
    // Otherwise use video duration to calculate
    
    if (!state.frames || state.frames.length === 0) {
        return 25; // Default
    }
    
    // Calculate FPS from extracted frames
    const totalFrames = state.frames.length;
    const videoDuration = video.duration;
    const calculatedFPS = totalFrames / videoDuration;
    
    return Math.round(calculatedFPS);
}
```

---

## 🔧 Quick Fix: Update FPS When Keypoints Load

Let me add automatic FPS detection:

**Add this code to app.js** (when keypoints are loaded):

```javascript
// After loading keypoints, auto-detect FPS
function autoDetectFPS() {
    if (!state.frames || state.frames.length < 2) return;
    
    // Get FPS from frame metadata if available
    if (state.frames[0].time !== undefined) {
        const frame1 = state.frames[0];
        const frame2 = state.frames[Math.min(1, state.frames.length - 1)];
        
        if (frame1.time !== frame2.time) {
            const timeDiff = Math.abs(frame2.time - frame1.time);
            const fps = Math.round(1 / timeDiff);
            if (fps > 0 && fps < 120) {
                state.fps = fps;
                fpsInput.value = fps;
                console.log(`Auto-detected FPS: ${fps}`);
                return fps;
            }
        }
    }
    
    // Fallback: Calculate from total frames and duration
    if (video && video.duration && state.frameCount > 0) {
        const fps = Math.round(state.frameCount / video.duration);
        if (fps > 0 && fps < 120) {
            state.fps = fps;
            fpsInput.value = fps;
            console.log(`Calculated FPS from duration: ${fps}`);
            return fps;
        }
    }
    
    return state.fps;
}
```

---

## 📝 Where to Add This

### **Location: app.js**

Find the section where keypoints are loaded (around line 150-160), and add the auto-detection.

**After JSON is loaded or after extraction completes:**

```javascript
// After: state.frames = loadedFrames;
// Add: autoDetectFPS();
```

---

## 🧪 How to Test

### **Test Case: 30fps Video**

```
1. Load a video recorded at 30fps
2. Extract keypoints (or load JSON)
3. Look at FPS input field
   - Before: Shows 25 (WRONG!)
   - After: Should show 30 (CORRECT!) ✓
4. Pause video at 5 seconds
5. Keypoints should now show correct frame ✓
```

---

## 💡 Why This Works

```
Video @ 30fps, 150 frames total:
- Frame 0: time = 0.000s
- Frame 1: time = 0.0333s (1/30)
- Frame 2: time = 0.0667s (2/30)
- ...
- Frame 150: time = 5.000s

Auto-detection:
- Calculates: (frame2.time - frame1.time) = 0.0333s
- FPS = 1 / 0.0333 = 30fps ✓

When user pauses at 5.0s:
- frameIndex = Math.round(5.0 * 30) = 150 ✓
- Gets frame 150 (CORRECT!) ✓
```

---

## 🎯 Quick Diagnostic

### **Check Your Video FPS**

```
In browser console (F12):
1. Load keypoints
2. Type: 
   console.log(state.frames[0])
   console.log(state.frames[1])
3. Check the .time property
4. Calculate: 1 / (frame1.time - frame0.time) = FPS
```

---

## ✨ Expected Result

**Before Fix**:
```
Video @ 30fps
Keypoints extracted @ 30fps
FPS setting @ 25fps (WRONG!)
Result: Lag of ~5-6 frames ❌
```

**After Fix**:
```
Video @ 30fps
Keypoints extracted @ 30fps
FPS setting @ 30fps (CORRECT!) ✓
Result: Perfect sync ✓
```

---

## 🚀 Workaround (Until Fix Applied)

If you want to fix manually:

1. **Load your keypoints**
2. **Open F12 Console**
3. **Type**:
   ```javascript
   // Check first 2 frames
   let f1 = state.frames[0];
   let f2 = state.frames[1];
   let fps = 1 / (f2.time - f1.time);
   console.log("Calculated FPS:", fps);
   
   // Set correct FPS
   state.fps = Math.round(fps);
   document.getElementById('fpsInput').value = Math.round(fps);
   ```
4. **Result**: FPS is now correct, keypoints should sync!

---

## 🎊 Summary

**Problem**: FPS mismatch between video (30fps) and app setting (25fps)  
**Solution**: Auto-detect FPS from frame metadata  
**Result**: Perfect keypoint sync when paused ✓

---

**Status**: Issue identified ✅  
**Fix ready**: See above  
**Apply**: Add autoDetectFPS() function and call when keypoints load
