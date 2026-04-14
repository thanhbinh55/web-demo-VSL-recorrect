# Hướng Dẫn Sửa Lỗi Trích Xuất Keypoint

## ❌ Vấn Đề: "khong trich xuat duoc keypoint" (Không thể trích xuất keypoint)

Nếu bạn gặp lỗi này khi nhấn "Auto-extract (MediaPipe)", hãy làm theo các bước sau:

---

## 🔍 Bước 1: Kiểm Tra Console Browser

1. Mở browser (Chrome, Firefox, Edge)
2. Nhấn **F12** để mở Developer Tools
3. Vào tab **Console**
4. Tìm thông báo lỗi (thường là đỏ)

### Các Lỗi Thường Gặp:

#### ❌ Lỗi 1: "MediaPipe Holistic not loaded"
**Nguyên nhân**: CDN không tải xong
**Giải pháp**: 
- Chờ 5-10 giây trước khi nhấn "Auto-extract"
- Kiểm tra internet connection
- Hard refresh: **Ctrl+Shift+R** (Windows) hoặc **Cmd+Shift+R** (Mac)

#### ❌ Lỗi 2: "Video element not ready"
**Nguyên nhân**: Video chưa load xong
**Giải pháp**:
- Tải video MP4 (nhấn "Tải Video")
- Chờ video hiển thị hoàn toàn trước khi auto-extract
- Kiểm tra video có phát được không

#### ❌ Lỗi 3: "CORS error" hoặc "Access denied"
**Nguyên nhân**: Vấn đề quyền truy cập file
**Giải pháp**:
- Chạy server HTTP: `python -m http.server 8000`
- Truy cập: `http://localhost:8000` (KHÔNG phải `file://`)

#### ❌ Lỗi 4: "Holistic.send error"
**Nguyên nhân**: Canvas hoặc MediaPipe config sai
**Giải pháp**: Xem **Bước 3** dưới đây

---

## 🔧 Bước 2: Kiểm Tra File HTML

Mở `index.html` và tìm các dòng này (xung quanh dòng 83-86):

```html
<script async src="https://cdn.jsdelivr.net/npm/@mediapipe/holistic/holistic.js"></script>
<script src="mediapipe-extractor-holistic.js"></script>
<script src="app.js"></script>
```

✅ **Phải có đầy đủ 3 script này**

Nếu thiếu hoặc sai URL, thêm/sửa lại.

---

## 🎥 Bước 3: Kiểm Tra Video

Video MP4 cần:
- ✅ Có người (để MediaPipe phát hiện được body/hands/face)
- ✅ Độ phân giải >= 480p (tốt hơn là 720p+)
- ✅ Độ sáng đủ (MediaPipe cần nhìn rõ)
- ✅ < 2-3 phút (quá dài sẽ mất rất lâu để trích xuất)

**Test nhanh**: Dùng file `tuan62.mp4` có sẵn

```
1. Nhấn "Tải Video"
2. Chọn tuan62.mp4
3. Video sẽ hiển thị ở canvas
```

---

## ⚡ Bước 4: Kiểm Tra Console Log

Sau khi nhấn "Auto-extract", tìm thông báo ở Console:

### ✅ Thành công sẽ thấy:
```
Starting MediaPipe Holistic extraction (body + hands + face = 543 points)...
Video element: <video>
Video readyState: 2
Video duration: 10.5
Estimated frames to process: 263
Canvas size: 1280x720
Processing: 0 / 263 frames (0%)
Processing: 26 / 263 frames (10%)
...
Extraction complete: 263 frames with 543 keypoints per frame (expected)
```

### ❌ Lỗi sẽ thấy:
```
MediaPipe Holistic extraction error: ...
```

---

## 🆘 Bước 5: Nếu Vẫn Lỗi - Hãy Làm Điều Này

### Cách 1: Test Với Sample JSON
Thay vì auto-extract, hãy:

1. Nhấn "Tải Keypoints (.json)"
2. Chọn `sample-keypoints-holistic.json`
3. Nếu file này load được, vậy app.js OK
4. Lỗi là do MediaPipe hoặc video

### Cách 2: Chạy Lệnh Test

Mở terminal và chạy:

**Windows (PowerShell)**:
```powershell
cd "c:\Users\sv\Desktop\New folder"
python -m http.server 8000
```

**Mac/Linux**:
```bash
cd ~/Desktop/New\ folder
python3 -m http.server 8000
```

Sau đó mở browser: `http://localhost:8000`

### Cách 3: Kiểm Tra Kết Nối CDN

Mở browser tab mới, truy cập:
```
https://cdn.jsdelivr.net/npm/@mediapipe/holistic/holistic.js
```

Nếu thấy code JavaScript = CDN OK
Nếu thấy error = Mất internet hoặc CDN down

---

## 📝 Ghi Nhớ

| Vấn Đề | Giải Pháp |
|--------|----------|
| CDN không load | Hard refresh (Ctrl+Shift+R) |
| Video không sẵn sàng | Chờ video load, check readyState |
| Canvas error | Kiểm tra video size/format |
| Extraction lâu | Video quá dài, hãy cắt ngắn |
| 0 frames extracted | Video không có người hoặc quá tối |

---

## 💡 Tips Nhanh

1. **Tăng tốc độ**: Giảm FPS từ 25 → 10 trước khi extract
2. **Kiểm tra**: Console log sẽ hiển thị tiến độ 0%...100%
3. **Lỗi trình duyệt**: Thử browser khác (Chrome, Firefox)
4. **Tìm giúp**: Chia sẻ console error log

---

**Nếu vẫn gặp vấn đề, hãy:**
1. Copy lỗi từ Console (F12)
2. Kiểm tra file `mediapipe-extractor-holistic.js` có tồn tại không
3. Restart server HTTP
4. Hard refresh browser
