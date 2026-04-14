# 📖 Hướng Dẫn Sửa Lỗi Trích Xuất Keypoint

## 🎯 Vấn Đề: "khong trich xuat duoc keypoint"

Bạn gặp lỗi khi nhấn **"Auto-extract (MediaPipe)"** button.

---

## 📚 Chọn Hướng Dẫn Phù Hợp Với Bạn

### **1️⃣ Nếu Bạn Muốn Sửa NHANH** ⚡
→ Đọc: **`QUICK-FIX.md`** (5 phút)
- Các lỗi phổ biến nhất
- Giải pháp nhanh nhất
- Checklist đơn giản

### **2️⃣ Nếu Bạn Muốn Sửa TOÀN DIỆN** 🔧
→ Đọc: **`KHONG-TRICH-XUAT-DUOC.md`** (15 phút)
- Chi tiết từng bước
- Mọi nguyên nhân có thể
- Cách kiểm tra video
- Timeout troubleshooting

### **3️⃣ Nếu Bạn Muốn HIỂU KỸ THUẬT** 👨‍💻
→ Đọc: **`FIX-EXTRACTION-ISSUES.md`** (20 phút)
- Cải tiến code chi tiết
- Trước/Sau so sánh
- Console log chính xác
- Async/await logic

### **4️⃣ Nếu Bạn Muốn DEBUGGING** 🐛
→ Đọc: **`DEBUGGING-EXTRACTION.md`** (10 phút)
- Console log tips
- Frame processing details
- Error patterns
- Developer tools usage

### **5️⃣ Nếu Bạn KHÔNG BIẾT BẮT ĐẦU Từ ĐÂU** 🤔
→ Đọc: **`EXTRACTION-COMPLETE.md`** (này)
- Tóm tắt toàn bộ fix
- Quick error reference
- Timeline dự kiến
- Validation checklist

---

## 🚦 Quick Triage (Nhanh)

### Triệu Chứng 1: "Nothing Happens"
```
Bạn nhấn "Auto-extract" nhưng không có phản hồi
→ Đọc: KHONG-TRICH-XUAT-DUOC.md → Bước 5
```

### Triệu Chứng 2: "Console Error Đỏ"
```
Bạn thấy lỗi trong F12 Console
→ Đọc: FIX-EXTRACTION-ISSUES.md → Lỗi phù hợp
```

### Triệu Chứng 3: "Chạy Quá Lâu"
```
Bạn thấy "Processing: 0% ..." nhưng chưa xong sau 5 phút
→ Đọc: EXTRACTION-COMPLETE.md → Expected Timeline
```

### Triệu Chứng 4: "Không Biết Lỗi Là Gì"
```
Bạn không biết vấn đề
→ Đọc: QUICK-FIX.md trước, rồi mở F12 Console
```

---

## 📋 Mở F12 Console (Rất Quan Trọng!)

### **Windows/Linux**:
1. Nhấn **F12**
2. Click tab **Console**

### **Mac**:
1. Nhấn **Cmd+Option+J**

Lỗi sẽ hiển thị bằng **chữ đỏ**

---

## ⏱️ Expected Times

| Video | Extract Time |
|-------|---------|
| 10 giây | 1-2 phút |
| 30 giây | 2-4 phút |
| 1 phút | 4-8 phút |
| 5 phút | 20-40 phút |

**→ MediaPipe Holistic chậm vì xử lý 543 points**

---

## ✅ Checklist Trước Khi Sửa

- [ ] Có mạng internet (WiFi/4G)
- [ ] Server chạy: `python -m http.server 8000`
- [ ] Mở `http://localhost:8000` (KHÔNG `file://`)
- [ ] Chờ 10 giây sau khi mở trang
- [ ] F12 không có lỗi đỏ khác
- [ ] Tải video MP4 thành công
- [ ] Video có người/body rõ ràng

---

## 🎯 Các Bước Sửa Nhanh

### Bước 1: Hard Refresh
```
Ctrl+Shift+R (Windows) hoặc Cmd+Shift+R (Mac)
Chờ 10 giây
```

### Bước 2: Kiểm Tra Video
```
Tải video MP4
Kiểm tra video chơi được không
```

### Bước 3: Test Với Sample JSON
```
Nhấn "Tải Keypoints" → chọn sample-keypoints-holistic.json
Nếu load được → lỗi do extraction/MediaPipe
Nếu không load → lỗi do app.js
```

### Bước 4: Xem Console Log
```
F12 → Console
Nhấn "Auto-extract"
Xem có log không (phải thấy "Processing: 0%...")
```

### Bước 5: Nếu Vẫn Lỗi
```
Đọc KHONG-TRICH-XUAT-DUOC.md chi tiết
```

---

## 📞 Nếu Gặp Vấn Đề

### Chuẩn Bị Info Này:
1. **Console Error** (screenshot)
2. **Video Info** (độ dài, kích thước)
3. **Browser** (Chrome? Firefox?)
4. **Server** (http:// hay file://?

)

### Kiểm Tra Này:
```javascript
// Copy vào Console (F12) và gõ Enter:
console.log(window.mediaPipeExtractFrames ? "✅" : "❌")
console.log(window.Holistic ? "✅" : "❌")
console.log(navigator.userAgent)  // Browser info
```

---

## 🎓 Nếu Bạn Muốn Học Thêm

| Topic | File |
|-------|------|
| Holistic là gì | `HOLISTIC-UPGRADE.md` |
| Zoom control | `QUICK-REFERENCE.md` |
| Project structure | `PROJECT_STRUCTURE.txt` |
| Toàn bộ setup | `QUICKSTART.md` |

---

## 🚀 Khi Thành Công

```
✅ Thấy alert: "Trích xuất thành công XXX frame!"
✅ Canvas hiện keypoints (các chấm)
✅ Có thể drag để sửa
✅ Có thể uncheck "Face" để ẩn điểm
✅ Có thể zoom (scroll wheel)
```

---

## 🔗 Bản Đồ Tài Liệu

```
START HERE (Bạn đang đọc) ← index debugging
    ↓
    ├─ QUICK FIX (5 min) ← Lỗi phổ biến
    ├─ KHONG TRICH XUAT (15 min) ← Chi tiết
    ├─ DEBUGGING (10 min) ← Console tips
    ├─ FIX ISSUES (20 min) ← Code changes
    └─ COMPLETE (tóm tắt) ← Tổng hợp

    HOLISTIC GUIDES (trước đó)
    ├─ HOLISTIC-UPGRADE.md
    ├─ QUICK-REFERENCE.md
    └─ STATUS.md
```

---

## ⏱️ Thời Gian

| Tác Vụ | Thời Gian |
|--------|----------|
| Hard refresh + chờ | 30 giây |
| Tải & test video | 2 phút |
| Xem console log | 1 phút |
| Đọc quick fix | 5 phút |
| Đọc chi tiết fix | 15 phút |
| Test extract (10s video) | 2 phút |

**→ Tổng cộng: 5-30 phút tùy độ phức tạp**

---

**Bắt đầu nào? Đọc `KHONG-TRICH-XUAT-DUOC.md` hoặc `QUICK-FIX.md`** 👇

Chúc bạn thành công! 🎉
