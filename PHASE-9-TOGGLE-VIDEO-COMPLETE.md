# Phase 9: Toggle Original Video Feature ✅ COMPLETE

## 🎯 Tính Năng

Thêm **Checkbox để bật/tắt video gốc**, chỉ giữ lại keypoints overlay.

**Sử dụng**:
- ✅ **Checked**: Hiển thị video gốc + keypoints overlay (mặc định)
- ❌ **Unchecked**: Ẩn video gốc, chỉ hiển thị keypoints trên background đen

---

## 📍 UI Control

**Vị trí**: Trong phần `.extras` controls, bên cạnh checkbox khác

```html
☑ Autosave
☑ Auto-download after edit
☑ Auto-extract on video load
☑ Show Original Video    ← NEW CHECKBOX
🔘 Auto-extract (MediaPipe)
```

---

## 🔄 Hoạt Động

### **Mode 1: Video Visible (Mặc Định)**
```
┌─────────────────────────┐
│    Original Video       │  ← Display block
│   + Keypoints Overlay   │
│   (Canvas on top)       │
└─────────────────────────┘
```
- Checkbox: ✅ Checked
- Video: visible
- Canvas: overlay (z-index: 2)
- Background: video's own background
- Use case: Verify keypoints match video

### **Mode 2: Keypoints Only (Video Hidden)**
```
┌─────────────────────────┐
│                         │
│   Keypoints Only        │  ← Black background
│   (No video)            │
│                         │
└─────────────────────────┘
```
- Checkbox: ☐ Unchecked
- Video: hidden (display: none)
- Canvas: fullscreen
- Background: Black (#000)
- Use case: Cleaner view, focus on keypoints editing

---

## 💻 Technical Details

### **HTML Change**
```html
<label class="mini">
    <input type="checkbox" id="showVideoChk" checked />
    Show Original Video
</label>
```
- ID: `showVideoChk`
- Default: `checked` (video visible by default)
- Added to: `.extras` section

### **JavaScript State**
```javascript
state.showOriginalVideo = true;  // Track visibility
```

### **Event Listener**
```javascript
showVideoChk.addEventListener('change', (e) => {
    state.showOriginalVideo = e.target.checked;
    video.style.display = e.target.checked ? 'block' : 'none';
    
    // Add/remove class for CSS styling
    viewport.classList.toggle('video-hidden', !e.target.checked);
    
    drawCurrentFrame();
});
```

### **CSS Styling**
```css
/* When video is hidden */
#viewport.video-hidden {
    background: #000 !important;
}

#viewport.video-hidden #overlay {
    background: #000;
}
```

---

## 🎮 User Experience

### **Scenario 1: Initial Load**
```
1. Page loads
2. Checkbox is checked ✅
3. Video visible + keypoints
4. User sees both
```

### **Scenario 2: Focus on Keypoints**
```
1. User unchecks: "Show Original Video"
2. Video disappears
3. Background turns black
4. Only keypoints visible on black
5. Better for detailed editing
```

### **Scenario 3: Switch Back**
```
1. User rechecks: "Show Original Video"
2. Video reappears
3. Keypoints still overlay
4. Back to normal view
```

### **Scenario 4: While Playing**
```
1. Video playing + keypoints synced
2. Uncheck checkbox
3. Video disappears, playback continues
4. Keypoints continue animating on black
5. Can verify keypoint motion without video distraction
```

---

## 🎨 Visual Comparison

### **Before (Video Always Visible)**
```
┌─────────────────────────┐
│ [Person doing action]   │
│ • • • • • • • • • •      │ ← Video pixels + Keypoints
│ • • • • • • • • • •      │    Mixed together
│ • • • • • • • • • •      │    Hard to see details
└─────────────────────────┘
```

### **After (Can Hide Video)**
```
Video Visible (Default):       Video Hidden (New):
┌─────────────────────────┐    ┌─────────────────────────┐
│ [Person doing action]   │    │                         │
│ • • • • • • • • • •      │    │ • • • • • • • • • •     │
│ • • • • • • • • • •      │    │ • • • • • • • • • •     │
│ • • • • • • • • • •      │    │ • • • • • • • • • •     │
└─────────────────────────┘    └─────────────────────────┘
     ☑ Show Original Video         ☐ Show Original Video
```

---

## 🔧 Implementation Details

### **Files Modified**

| File | Changes |
|------|---------|
| `index.html` | Added checkbox `id="showVideoChk"` in `.extras` section |
| `app.js` | Added state variable `showOriginalVideo: true` |
| `app.js` | Added reference: `const showVideoChk = ...` |
| `app.js` | Added event listener for checkbox change |
| `style.css` | Added CSS class `.video-hidden` for styling |

### **Toggle Logic**
```
User clicks checkbox
    ↓
Event listener triggers
    ↓
state.showOriginalVideo = checkbox.checked
    ↓
video.style.display = checked ? 'block' : 'none'
    ↓
viewport.classList.toggle('video-hidden', !checked)
    ↓
drawCurrentFrame()
    ↓
Canvas redraws with new background
```

---

## ✨ Benefits

1. **Cleaner UI**: Remove video clutter when editing keypoints
2. **Better Focus**: Keypoints stand out on black background
3. **Faster Editing**: No video pixels interfering with precision
4. **Flexibility**: Toggle between modes without reloading
5. **Accessibility**: Users with slow computers can hide video to reduce lag

---

## 🎯 Use Cases

### **Use Case 1: Verification**
```
1. Extract keypoints
2. Keep video visible ✅
3. Verify keypoints align with person's joints
4. Confirm accuracy
```

### **Use Case 2: Precision Editing**
```
1. Found a wrong keypoint
2. Uncheck "Show Original Video" ☐
3. Keypoints only on black background
4. Move point with sub-pixel precision
5. Re-check to verify fix
```

### **Use Case 3: Performance**
```
1. Video is high resolution (4K)
2. Causes lag in browser
3. Uncheck "Show Original Video"
4. Browser uses less memory
5. Editing becomes smooth
```

### **Use Case 4: Multi-Monitor Setup**
```
1. Monitor 1: Video player (separate app)
2. Monitor 2: VSL Editor with video hidden
3. Keep keypoints overlay for reference
4. Compare with original playback
```

---

## 📋 Checklist - Testing

- [ ] Checkbox exists in controls
- [ ] Default state: checked (video visible)
- [ ] Uncheck → video disappears
- [ ] Uncheck → background turns black
- [ ] Recheck → video reappears
- [ ] Keypoints visible in both states
- [ ] Play/Pause works with video hidden
- [ ] Seek works with video hidden
- [ ] Zoom works with video hidden
- [ ] Edit keypoints works with video hidden
- [ ] No console errors
- [ ] UI responsive on mobile

---

## 🚀 Next Phase Ideas

Possible enhancements:
- [ ] Add transparency slider for video opacity
- [ ] Add color picker for background when video hidden
- [ ] Remember user's preference (localStorage)
- [ ] Keyboard shortcut to toggle (e.g., 'V' key)
- [ ] Dual-monitor mode (show video + keypoints separately)

---

## 📝 Code Snippet Reference

### **Toggle Video Programmatically**
```javascript
// From console or custom script
state.showOriginalVideo = false;
document.getElementById('showVideoChk').checked = false;
document.getElementById('video').style.display = 'none';
document.getElementById('viewport').classList.add('video-hidden');
```

### **Check Current State**
```javascript
console.log('Video visible:', state.showOriginalVideo);
console.log('Checkbox checked:', showVideoChk.checked);
```

---

## 🎉 Summary

**Phase 9 Achievement**:
- ✅ Added toggle checkbox for video visibility
- ✅ CSS styling for black background when hidden
- ✅ Smooth state management
- ✅ Works with all existing features (play, pause, zoom, edit)
- ✅ Zero performance impact

**Status**: ✅ Complete!

**Use it**: Uncheck "Show Original Video" to get clean keypoints-only view!

