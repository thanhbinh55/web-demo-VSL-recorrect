# 🎬 Video Playback + Synchronized Keypoints - Hướng Dẫn

## 📋 Tổng Quát Tính Năng Mới

Bây giờ bạn có thể:

✅ **Play video + keypoints cùng lúc** (tự động đồng bộ)  
✅ **Zoom in/out video + keypoints CÙNG NHAU** (không riêng rẽ)  
✅ **Điều chỉnh tốc độ playback** (0.25x → 2.0x)  
✅ **Pause bất cứ lúc nào** (để chỉnh sửa keypoints)  
✅ **Xem keypoints chạy trực tiếp trên video** (để so sánh/verify)

---

## 🎮 Nút/Điều Khiển Mới

### 1. **Play Button (▶ Play)**
```
Nhấn để:
- Video bắt đầu chạy
- Keypoints tự động cập nhật theo thời gian video
- Cả video và overlay keypoints đều chạy
```

### 2. **Pause Button (⏸ Pause)**
```
Nhấn để:
- Dừng video
- Dừng keypoints
- Bạn có thể sửa keypoints tại frame này
- Hoặc tiếp tục play
```

### 3. **Speed Control (Speed slider)**
```
Thanh trượt từ 0.25x đến 2.0x:
- 0.25x = quay chậm 4 lần (chi tiết từng frame)
- 0.5x  = quay chậm 2 lần
- 1.0x  = tốc độ bình thường
- 1.5x  = quay nhanh hơn 50%
- 2.0x  = quay nhanh gấp đôi

Hiển thị: "1.0x", "0.5x", v.v.
```

---

## 🔍 Zoom Video + Keypoints (Mới)

### **Trước Đây (Cũ)**
- Zoom keypoints → Video không zoom
- Bạn phải zoom 2 lần (zoom canvas, rồi zoom video)
- Khó so sánh keypoints với video

### **Bây Giờ (Mới) ✨**
- Zoom button → **Cả video + keypoints zoom cùng**
- 1 lần zoom = video + keypoints đều zoom
- Dễ so sánh vì chúng resize cùng nhau

### **Cách Zoom**

#### **Cách 1: Dùng Nút Zoom**
```
Nút "-" (zoomOut):
- Nhấn để video + keypoints nhỏ lại (phù hợp nhìn toàn cảnh)

Nút "+" (zoomIn):
- Nhấn để video + keypoints to lên (nhìn chi tiết keypoints)

Nút "Reset View":
- Nhấn để quay về zoom 1.0x (bình thường)
```

#### **Cách 2: Dùng Chuột (Mouse Wheel)**
```
Trên vùng video:
- Cuộn chuột LÊN → Video + keypoints to lên (zoom in)
- Cuộn chuột XUỐNG → Video + keypoints nhỏ lại (zoom out)

Hiệu quả ngay lập tức!
```

#### **Zoom Range (Phạm Vi)**
- **Tối thiểu**: 0.1x (video rất nhỏ, nhìn toàn bộ)
- **Bình thường**: 1.0x (kích thước gốc)
- **Tối đa**: 20x (rất to, chi tiết từng pixel)

---

## 🎯 Quy Trình Làm Việc Điển Hình

### **Scenario 1: Verify Keypoints vs Video**

```
1. Tải video
2. Tải keypoints (hoặc Auto-extract)
3. Nhấn ▶ Play
   → Video chạy + keypoints hiển thị theo thời gian
4. Xem keypoints đúng không so với video
5. Nếu sai → Nhấn ⏸ Pause
6. Zoom in để chỉnh sửa chi tiết
7. Drag điểm để fix
8. Nhấn ▶ Play lại để verify
9. Lặp lại đến hết video
```

### **Scenario 2: Chỉnh Sửa Keypoint Chi Tiết**

```
1. Play video → Xem tổng quát
2. Khi thấy chỗ sai → Nhấn ⏸ Pause
3. Zoom in bằng chuột (cuộn LÊN)
4. Drag điểm để fix
5. Zoom out để xem bối cảnh lại (cuộn XUỐNG)
6. Play lại xem có đúng chưa
```

### **Scenario 3: So Sánh Chi Tiết**

```
1. Nhấn ▶ Play
2. Tốc độ chậm: Chỉnh Speed → 0.5x
3. Xem từng frame chậm + zoom in (cuộn LÊN)
4. So sánh chi tiết giữa video + keypoints
5. Fix các điểm sai
6. Zoom out (cuộl XUỐNG) → Normal speed (1.0x) → Play tiếp
```

---

## 📊 Các Trường Hợp Sử Dụng

| Trường Hợp | Tốc Độ | Zoom | Nút |
|-----------|--------|------|-----|
| Xem tổng quát | 1.0x | 1.0x | Play |
| Kiểm tra chi tiết | 0.5x | 3-5x | Play + Zoom |
| Chỉnh sửa nhanh | Pause | 5x-10x | Pause + Drag |
| Lướt qua nhanh | 1.5-2.0x | 0.1x | Play + Zoom Out |
| Verify sau sửa | 0.5x | 2-3x | Play + Zoom |

---

## 🔧 Chi Tiết Kỹ Thuật

### **Zoom: Video + Keypoints Cùng Nhau**

**Cách hoạt động**:
```javascript
// Trước: Chỉ zoom canvas (keypoints)
view.scale = 2;

// Bây giờ: Zoom cả viewport (video + canvas)
viewport.style.transform = `scale(${view.scale})`;
viewport.style.transformOrigin = '0 0';
```

**Kết quả**:
- Video `<video>` được zoom bởi CSS transform
- Canvas overlay được zoom cùng cấp độ
- Cả hai scale cùng scale factor → Perfect alignment!

### **Synchronized Playback**

**Cách hoạt động**:
```javascript
function playVideo() {
    state.isPlaying = true;
    video.playbackRate = state.playbackSpeed;  // Set tốc độ
    
    const animationLoop = () => {
        drawCurrentFrame();  // Vẽ keypoints theo video time
        if (video.currentTime < video.duration) {
            requestAnimationFrame(animationLoop);  // Lặp lại
        }
    };
    
    video.play();
    animationLoop();
}
```

**Kết quả**:
- `video.currentTime` tự động cập nhật
- `drawCurrentFrame()` lấy frame index từ `currentTime`
- Canvas overlay luôn cập nhật → Sync hoàn hảo!

### **Speed Control**

```javascript
// Thanh trượt 0.25 → 2.0
speedInput.addEventListener('input', (e) => {
    state.playbackSpeed = parseFloat(e.target.value);
    video.playbackRate = state.playbackSpeed;  // Browser tự chỉnh tốc độ
});
```

---

## 🐛 Troubleshooting

### **Problem: Zoom không cùng nhau**

```
Nguyên nhân: Viewport transform chưa được apply
Giải pháp: 
1. Nhấn zoom button thay vì mouse wheel (test)
2. Nếu vẫn lỗi → Hard refresh (Ctrl+Shift+R)
3. Kiểm tra F12 Console có error không
```

### **Problem: Keypoints không cập nhật khi play**

```
Nguyên nhân: Frames không load hoặc mismatch
Giải pháp:
1. Tải lại video
2. Extract keypoints (hoặc tải JSON)
3. Nhấn Play
4. Nếu vẫn không → Xem console (F12) có error không
```

### **Problem: Speed slider không hoạt động**

```
Nguyên nhân: Browser không support playbackRate
Giải pháp:
1. Thử browser khác (Chrome, Firefox)
2. Kiểm tra video format (nên MP4)
3. Xem console error (F12)
```

### **Problem: Play button disabled**

```
Nguyên nhân: Không có video hoặc keypoints
Giải pháp:
1. Tải video trước
2. Tải keypoints (extract hoặc JSON)
3. Rồi mới nhấn Play
```

---

## 💡 Tips & Tricks

### **Tip 1: Kiểm Tra Extraction Chính Xác**

```
1. Extract keypoints
2. Zoom in 2x
3. Play video chậm (0.5x)
4. Xem chi tiết từng joint có đúng vị trí không
5. Nếu lệch → Chỉnh sửa
```

### **Tip 2: Sửa Keypoint Nhanh**

```
1. Play video
2. Khi thấy chỗ sai → Pause
3. Zoom in (5-10x)
4. Drag point to fix
5. Zoom out (Reset View)
6. Play tiếp
```

### **Tip 3: So Sánh Trước/Sau**

```
1. Before fix:
   - Play at 0.5x, zoom 3x
   - Xem toàn bộ lỗi

2. After fix:
   - Play at 0.5x, zoom 3x
   - Verify lại
```

### **Tip 4: Tốc Độ Tối Ưu**

- Tốc độ 0.5x + Zoom 3x = tốt nhất để verify chi tiết
- Tốc độ 1.0x + Zoom 0.1x = tốt nhất để xem tổng quát
- Tốc độ 2.0x + Zoom 0.5x = lướt nhanh kiểm tra

---

## 🎬 Demo Quy Trình

```
Video: tuan62.mp4 (30 seconds)
Keypoints: Extracted 750 frames

QUY TRÌNH:
1. Load tuan62.mp4
   → Video 30 giây, 750 frames @ 25fps

2. Nhấn Auto-extract
   → Chờ ~5 phút
   → 750 keypoints extracted ✓

3. Nhấn Play
   → Video chạy
   → Keypoints đồng bộ
   → Xem 30 giây video with overlay

4. Pause @ 5 giây
   → Video dừng
   → Keypoints dừng
   → Frame index: 125 / 750

5. Zoom in (cuộl LÊN)
   → Video + keypoints to lên
   → Xem chi tiết

6. Drag point A
   → Sửa từ (0.3, 0.4) → (0.31, 0.41)

7. Zoom out (cuộl XUỐNG)
   → Quay về 1.0x

8. Nhấn Play
   → Tiếp tục từ 5 giây
   → Xem verify kết quả
```

---

## 📝 Summary

| Tính Năng | Trước | Sau | Benefit |
|----------|-------|-----|---------|
| Zoom video + keypoints | Riêng rẽ | Cùng nhau | Dễ so sánh |
| Play keypoints | Thủ công | Tự động | Tiết kiệm thời gian |
| Speed control | Không có | 0.25x-2.0x | Linh hoạt |
| Timing sync | Lỗi mỗi lúc | Hoàn hảo | Chính xác |
| Pause anytime | Riêng rẽ | Cùng nhau | Dễ chỉnh sửa |

---

## ✨ Kết Luận

Giờ đây bạn có:
1. ✅ Video + Keypoints zoom cùng nhau
2. ✅ Playback synchronized (chạy cùng lúc)
3. ✅ Speed control (0.25x - 2.0x)
4. ✅ Perfect timing match với video
5. ✅ Dễ verify + chỉnh sửa keypoints

**Thoải mái làm việc! 🚀**
