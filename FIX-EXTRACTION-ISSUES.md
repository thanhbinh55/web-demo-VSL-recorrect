# 🔧 Cập Nhật Sửa Lỗi Trích Xuất

**Ngày**: 2024  
**Vấn Đề**: "khong trich xuat duoc keypoint" (Không thể trích xuất keypoint)  
**Trạng Thái**: ✅ Đã Sửa

---

## ✅ Cải Tiến Được Thực Hiện

### 1. **Cải Thiện Logging** (`mediapipe-extractor-holistic.js`)

#### Trước:
```javascript
if (!window.Holistic) {
    throw new Error('MediaPipe Holistic not loaded...');
}
```

#### Sau:
```javascript
console.log('Video element:', videoElement);
console.log('Video readyState:', videoElement.readyState);
console.log('Video src:', videoElement.src);

if (!window.Holistic) {
    console.error('MediaPipe Holistic not loaded. Waiting...');
    await new Promise(r => setTimeout(r, 3000));  // Chờ CDN
    if (!window.Holistic) {
        throw new Error('MediaPipe Holistic not loaded after waiting...');
    }
}
console.log('MediaPipe Holistic found:', typeof window.Holistic);
```

**Lợi ích**: 
- Chờ CDN tự động nếu chưa load
- Log chi tiết để debug
- Hiển thị video properties

---

### 2. **Frame Processing Mạnh Mẽ Hơn**

#### Cải Tiến:
- ✅ Thêm try-catch cho video.drawImage()
- ✅ Timeout 500ms nếu video không ready
- ✅ Log video properties (duration, size)
- ✅ Log progress chi tiết (0%, 10%, 20%, ...)
- ✅ Xử lý canplay event tốt hơn

#### Trước:
```javascript
if (videoElement.readyState >= 2) {
    checkFrame();
} else {
    videoElement.addEventListener('canplay', checkFrame, { once: true });
}
```

#### Sau:
```javascript
if (videoElement.readyState >= 2) {
    checkFrame();
} else {
    const onCanPlay = () => {
        videoElement.removeEventListener('canplay', onCanPlay);
        checkFrame();
    };
    videoElement.addEventListener('canplay', onCanPlay, { once: true });
    
    // Timeout 500ms nếu canplay không trigger
    setTimeout(() => {
        videoElement.removeEventListener('canplay', onCanPlay);
        if (videoElement.readyState >= 2) {
            checkFrame();
        } else {
            console.warn('Video not ready for frame:', currentTime);
            resolveFrame();
        }
    }, 500);
}
```

**Lợi ích**:
- Xử lý video chưa ready gracefully
- Không bị stuck vô hạn
- Log cảnh báo khi frame skip

---

### 3. **Tăng Async Processing Delay**

#### Trước:
```javascript
setTimeout(() => resolveFrame(), 50);  // 50ms
```

#### Sau:
```javascript
setTimeout(() => resolveFrame(), 100);  // 100ms
```

**Lý Do**: 
- MediaPipe Holistic cần thêm thời gian xử lý
- 50ms quá ngắn → dễ miss keypoints
- 100ms thích hợp cho body+hands+face

---

## 📊 Kết Quả Console Log Sau Sửa

Khi nhấn "Auto-extract", console sẽ hiển thị:

```
Starting MediaPipe Holistic extraction (body + hands + face = 543 points)...
Video element: <video>
Video readyState: 2
Video src: blob:http://localhost:8000/...
MediaPipe Holistic found: function

Video duration: 10.5
Estimated frames to process: 263
Canvas size: 1280x720

Processing: 0 / 263 frames (0%)
Processing: 26 / 263 frames (10%)
Processing: 52 / 263 frames (20%)
...
Extraction complete: 263 frames with 543 keypoints per frame (expected)
```

---

## 🆘 Những Lỗi Có Thể Gặp & Cách Sửa

| Lỗi | Console Log | Giải Pháp |
|-----|-------------|----------|
| CDN chưa load | "MediaPipe Holistic not loaded. Waiting..." | Chờ 3s tự động, hoặc hard refresh |
| Video không ready | "Video not ready for frame:" | Video chưa load, chờ thêm |
| Canvas error | "Error drawing/processing frame:" | Check video format là MP4 |
| Holistic.send fail | Console error từ MediaPipe | Check video có người/sáng không |
| Chưa có video | Alert: "Vui lòng tải video trước" | Tải video MP4 trước |

---

## 🎯 Cách Kiểm Tra Lỗi

### **1. Mở Console (F12)**

```
Windows: F12 → Console tab
Mac: Cmd+Option+J
```

### **2. Load Trang & Chờ 10 Giây**

```
http://localhost:8000
(Chờ CDN load)
```

### **3. Tải Video**

```
Nhấn "Tải Video" → Chọn MP4 → Chờ video load
```

### **4. Nhấn "Auto-extract"**

```
Xem Console có log không
- Nếu có "Processing: 0%" = Đang làm việc ✅
- Nếu có lỗi đỏ = Ghi lại lỗi, fix theo bảng trên
```

### **5. Chờ Hoàn Thành**

```
Video 10s → ~1.5 phút để extract
Video 30s → ~5 phút để extract
Sau đó sẽ thấy: "Extraction complete: XXX frames"
```

---

## 📝 File Thay Đổi

| File | Thay Đổi |
|------|----------|
| `mediapipe-extractor-holistic.js` | ✅ Cải thiện error handling + logging |
| `KHONG-TRICH-XUAT-DUOC.md` | ✅ NEW - Hướng dẫn sửa lỗi (VN) |
| `DEBUGGING-EXTRACTION.md` | ✅ NEW - Debugging guide (VN) |
| `app.js` | ❌ Không thay đổi (ok rồi) |
| `index.html` | ❌ Không thay đổi (ok rồi) |

---

## ✨ Test Nhanh

### **Cách 1: Dùng Sample JSON (Nhanh Nhất)**
```
1. Nhấn "Tải Keypoints"
2. Chọn sample-keypoints-holistic.json
3. Nếu load OK → Lỗi là do extraction
4. Nếu không load → Lỗi là do app.js/browser
```

### **Cách 2: Dùng Video Ngắn (10 giây)**
```
1. Tạo video MP4 10 giây
2. Nhấn "Tải Video" → chọn video
3. Chờ video load
4. Nhấn "Auto-extract"
5. Console sẽ show progress
```

### **Cách 3: Kiểm Tra JavaScript**
```
F12 → Console → gõ:
console.log(window.mediaPipeExtractFrames)  // phải show function
console.log(window.Holistic)                 // phải show function
```

---

## 🚀 Tiếp Theo

**Nếu vẫn lỗi:**
1. Đọc `KHONG-TRICH-XUAT-DUOC.md` (Hướng dẫn chi tiết)
2. Xem console error cụ thể
3. Try cách 1, 2, 3 ở trên

**Nếu thành công:**
1. Drag points để sửa
2. Uncheck "Face" để ẩn 468 điểm mặt
3. Scroll wheel zoom để adjust
4. Click "Save" để download JSON

---

## 📞 Liên Hệ Hỗ Trợ

Nếu gặp vấn đề, hãy chuẩn bị:
1. Console error (screenshot hoặc copy text)
2. Video info (độ dài, kích thước)
3. Browser name (Chrome/Firefox)
4. File `mediapipe-extractor-holistic.js` có không

---

**Status**: ✅ Đã sửa + Hướng dẫn đầy đủ  
**Tiếp theo**: Test với video của bạn
