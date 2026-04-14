# Sửa Lỗi: Không Thể Trích Xuất Keypoint

## 🎯 Vấn Đề

Bạn nhấn **"Auto-extract (MediaPipe)"** nhưng:
- ❌ Keypoints không xuất hiện
- ❌ Hoặc có lỗi trong Console
- ❌ Hoặc quá lâu mà không có phản hồi

---

## 🔧 Giải Pháp Từng Bước

### **Bước 1: Kiểm Tra Kết Nối Internet**

MediaPipe cần tải từ CDN (Mạng), nên:
1. Kiểm tra bạn có mạng không (WiFi/4G hoạt động)
2. Mở một trang web bất kỳ để test mạng

**Nếu không có mạng → Kết nối internet trước**

---

### **Bước 2: Chờ CDN Load Xong**

Lần đầu tiên trang load, MediaPipe cần 3-5 giây để tải từ CDN:

1. Mở http://localhost:8000
2. **CHỜ 10 giây** để tất cả scripts load
3. Sau đó mới tải video và nhấn "Auto-extract"

**Dấu hiệu CDN đã load**:
- Nhấn **F12** → Tab **Console**
- Nếu thấy: `MediaPipe Holistic Extractor module loaded` = OK ✅

---

### **Bước 3: Kiểm Tra Video**

Video cần phải:
- ✅ Là file MP4 thực sự (không bị hỏng)
- ✅ Có **người** trong video (MediaPipe phát hiện pose, hands, face)
- ✅ **Sáng đủ** (không quá tối)
- ✅ **Dưới 1 phút** (đầu tiên - để test nhanh)

**Cách test nhanh**:
```
1. Nhấn "Tải Video"
2. Chọn tuan62.mp4 (có sẵn)
3. Xem video chạy bình thường không
4. Nếu OK → Lỗi không phải do video
```

---

### **Bước 4: Mở Developer Console (F12)**

Để xem chính xác lỗi gì:

**Windows/Linux**:
1. Nhấn **F12**
2. Click tab **Console** (thường là đỏ)
3. Nhấn "Auto-extract"
4. Xem thông báo lỗi

**Mac**:
1. Nhấn **Cmd+Option+J**
2. Xem Console log

---

### **Bước 5: Tìm Lỗi Cụ Thể**

#### **Lỗi A: "MediaPipe chưa load"**

```
Nguyên nhân: Holistic.js từ CDN chưa tải xong
Giải pháp:
1. Chờ thêm 5 giây
2. Hard refresh: Ctrl+Shift+R
3. Kiểm tra internet (tự mở trang khác)
```

#### **Lỗi B: "Video element error"**

```
Nguyên nhân: Video không load hoặc sai format
Giải pháp:
1. Video phải là MP4 thực sự
2. Dùng tuan62.mp4 để test
3. Kiểm tra file video có tồn tại không
```

#### **Lỗi C: "Canvas error" hoặc "Holistic.send error"**

```
Nguyên nhân: Canvas không khớp với video size
Giải pháp:
1. Video phải được load hoàn toàn trước
2. Nhấn play, chờ video tải, rồi mới auto-extract
3. Thử video khác (test với tuan62.mp4)
```

#### **Lỗi D: "Không có phản hồi (chờ mãi)"**

```
Nguyên nhân: Extraction đang chạy chậm (bình thường)
Giải pháp:
1. MediaPipe Holistic chậm, mỗi frame ~300-500ms
2. Video 1 phút = ~1500 frames = ~10-15 phút extract
3. Hãy dùng video ngắn hơn (10-30 giây) để test
4. Kiểm tra console log xem tiến độ (0%, 10%, 20%, ...)
```

---

## 📋 Checklist Kiểm Tra

Đánh dấu ✅ vào những cái bạn đã kiểm tra:

- [ ] Có mạng internet (WiFi/4G hoạt động)
- [ ] Chờ trang load 10 giây trước khi test
- [ ] Console hiển thị: "MediaPipe Holistic Extractor module loaded"
- [ ] Video MP4 thực sự (không bị hỏng, không phải AVI/MOV)
- [ ] Video dưới 1 phút (hoặc dưới 30 giây để test)
- [ ] Video có người, đủ sáng
- [ ] Server chạy: `python -m http.server 8000`
- [ ] Truy cập: `http://localhost:8000` (KHÔNG phải file://)
- [ ] F12 Console không có lỗi đỏ khác

---

## 🚀 Nếu Vẫn Không Được - Thử Cách Này

### **Cách 1: Load Sample JSON Thay Vì Extract**

```
1. Nhấn "Tải Keypoints (.json)"
2. Chọn sample-keypoints-holistic.json
3. Nếu load được → Lỗi là do MediaPipe/Video
4. Nếu không load → Lỗi là do app.js
```

### **Cách 2: Dùng Video Ngắn Hơn**

```
Thay vì dùng video 5 phút → dùng video 10 giây
Cách tạo:
- Dùng DaVinci Resolve (miễn phí) hoặc Adobe Premiere
- Hoặc dùng FFmpeg: ffmpeg -i video.mp4 -t 10 output.mp4
```

### **Cách 3: Kiểm Tra Holistic API**

Mở Developer Console gõ:

```javascript
// Xem Holistic đã load chưa
console.log(window.Holistic ? "OK" : "Chưa load")

// Xem function mediaPipeExtractFrames đã có chưa
console.log(window.mediaPipeExtractFrames ? "OK" : "Chưa có")
```

Nếu cả 2 đều `"OK"` → System sẵn sàng, lỗi do video hoặc timing

### **Cách 4: Restart Toàn Bộ**

```
1. Đóng browser hoàn toàn
2. Đóng terminal/server
3. Mở terminal mới
4. Chạy: python -m http.server 8000
5. Mở browser → http://localhost:8000
6. CHỜ 10 giây
7. Tải video
8. Nhấn "Auto-extract"
```

---

## 💡 Điều Cần Biết Về Extraction

**Thời Gian Trích Xuất**:
- Video 10 giây @ 25fps = 250 frames
- Mỗi frame mất ~300-500ms (vì phải xử lý body+hands+face)
- Tổng cộng: 250 × 0.3s = **75 giây = ~1.5 phút**
- → Bình thường! Đừng lo

**Dấu Hiệu Đang Làm Việc**:
```
Console sẽ hiển thị:
Processing: 0 / 250 frames (0%)
Processing: 25 / 250 frames (10%)
Processing: 50 / 250 frames (20%)
...
Extraction complete: 250 frames ...
```

---

## 📞 Nếu Vẫn Lỗi - Hãy Làm Này

1. **Copy toàn bộ console error** (F12 → Console)
2. **Ghi nhớ**:
   - Video file name
   - Browser (Chrome/Firefox/Edge)
   - Video độ dài và size
3. **Check**: Tất cả 3 files có tồn tại không:
   - `mediapipe-extractor-holistic.js`
   - `app.js`
   - `index.html`

---

## ✨ Khi Thành Công Sẽ Thấy

```
✅ Alert hiểu: "Trích xuất thành công 250 frame!"
✅ Canvas xuất hiện keypoints (các chấm tròn)
✅ Console log: "Extraction complete: 250 frames"
✅ Có thể uncheck "Face" để ẩn 468 điểm mặt
✅ Có thể drag các điểm để chỉnh sửa
```

---

**Chúc bạn thành công! 🚀**

Nếu có câu hỏi, hãy đọc `HOLISTIC-UPGRADE.md` để hiểu chi tiết hơn.
