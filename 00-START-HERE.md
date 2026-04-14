# 👋 START HERE — VSL Keypoint Editor

Welcome! Đây là hướng dẫn đầu tiên. Chọn lộ trình của bạn:

## 🎯 Bạn là ai?

### 👥 CTV (người sửa keypoints) — **ĐỌC NGAY**

```
1. Mở file "index.html" với trình duyệt
2. Đọc "QUICKSTART.md" (2 phút)
3. Thực hiện: Upload video → chỉnh sửa → save
Done!
```

**→ File: `QUICKSTART.md`**

---

### 👨‍💻 Developer (muốn tìm hiểu kỹ thuật)

```
1. Đọc "PROJECT_STRUCTURE.txt" (5 phút)
   → Hiểu kiến trúc, luồng dữ liệu, config
   
2. Đọc "README.md" (10 phút)
   → Xem chi tiết tính năng, FAQ
   
3. Đọc "app.js" source code (20 phút)
   → Hiểu logic drag/drop, undo/redo, state
   
4. Nếu cần setup offline: Xem "INSTALL.md"
   → MediaPipe local, troubleshooting

5. Nếu muốn test: Xem "TESTING.md"
   → Test cases, performance benchmark
```

**→ File: `PROJECT_STRUCTURE.txt` → `README.md` → code**

---

### 🚀 Quản lý (muốn deploy/scale)

```
1. Kiểm tra "INSTALL.md" phần "Docker" hoặc "Cloud hosting"
2. Deploy 4 file (.html, .js x2, .css) lên server
3. Hoàn thành!

Hoặc:
- Netlify (kéo thả 4 file)
- GitHub Pages (push git repo)
- AWS S3 (upload static files)
```

**→ File: `INSTALL.md`**

---

### 🧪 QA (muốn test)

```
1. Đọc "TESTING.md" (10 phút)
2. Chạy test cases:
   - Mở app + kiểm tra UI
   - Tải sample data
   - Test drag/drop, undo/redo
   - Test extraction (với video test)
3. Report issues nếu có
```

**→ File: `TESTING.md`**

---

## 📚 Toàn bộ tài liệu

| Tài liệu | Mục đích | Đọc mất |
|---------|---------|--------|
| **INDEX.md** | Lộ trình đọc chi tiết | 10 phút |
| **QUICKSTART.md** | Bắt đầu nhanh (CTV) | 2 phút |
| **README.md** | Tài liệu đầy đủ | 15 phút |
| **INSTALL.md** | Setup & troubleshooting | 15 phút |
| **TESTING.md** | Hướng dẫn test | 15 phút |
| **PROJECT_STRUCTURE.txt** | Kiến trúc hệ thống | 10 phút |

---

## 🎬 Demo 60 giây

```
1. Mở index.html → (trang load ~3 giây)
2. Tải Keypoints: sample-keypoints.json
3. Xem canvas hiện 21 điểm + skeleton
4. Click + kéo một điểm
5. Nhấn "Undo" → điểm quay lại
6. Nhấn "+" → zoom in
7. Nhấn "Lưu / Tải xuống JSON"
   → File JSON mới tải về
Done! ✓
```

---

## ✅ Chuẩn bị

### Cần có gì?

- ✓ Trình duyệt (Chrome/Edge/Firefox)
- ✓ 4 file: index.html, app.js, mediapipe-extractor.js, style.css
- ✓ (Optional) Video MP4 hoặc file JSON keypoints

### Không cần:

- ✗ Cài đặt server
- ✗ Python / Node.js / Docker (tùy chọn)
- ✗ Build tool (webpack, vite, etc)

**→ Mở index.html là xong!**

---

## 🐛 Nếu có vấn đề

### App không mở

```
1. Kiểm tra: file index.html có ở đúng thư mục không?
2. Kéo index.html vào Chrome / Edge
3. Nếu lỗi: Mở F12 (Developer Tools) → Console → xem error
```

### Extraction chậm / bị treo

```
1. BÌNH THƯỜNG! MediaPipe xử lý từng frame, quá trình lâu
2. Test với video 2-5 giây (chứ không 1 phút)
3. Xem console (F12) → có progress log không
```

### Drag không hoạt động

```
1. Kiểm tra: Video đã pause chưa? (nhấn nút pause)
2. Kiểm tra: Canvas có focus không? (click vào canvas)
3. Nếu dùng JSON: Kiểm tra JSON đã tải xong không?
```

→ **Xem chi tiết**: `INSTALL.md` → Troubleshooting

---

## 🚀 Bắt đầu ngay

### Bước 1: Mở ứng dụng

```bash
# Cách dễ nhất:
1. Tìm file index.html
2. Nhấp đúp → mở trình duyệt
3. Done!

# Hoặc:
- Kéo index.html vào cửa sổ Chrome / Edge
- Hoặc: Right-click → Open with → Browser
```

### Bước 2: Thực hiện theo QUICKSTART.md

```
[Mở file này]
→ Bạn sẽ thấy hướng dẫn từng bước
→ Chỉ cần 2 phút!
```

### Bước 3: Tải video + chỉnh sửa

```
→ Upload video (.mp4)
→ [Auto-extract] hoặc [Upload JSON]
→ Drag & drop chỉnh sửa
→ Save
```

---

## 🎓 Tài liệu liên quan

Nếu bạn muốn:

| Nhu cầu | Đọc file | Thời gian |
|--------|---------|----------|
| Bắt đầu nhanh | QUICKSTART.md | 2 phút |
| Hiểu chi tiết | README.md | 15 phút |
| Setup offline | INSTALL.md | 15 phút |
| Test kỹ lưỡng | TESTING.md | 20 phút |
| Tìm một tính năng | INDEX.md | 10 phút |
| Dùng code | PROJECT_STRUCTURE.txt | 10 phút |

---

## 💡 Gợi ý

1. **Lần đầu**: Mở `QUICKSTART.md` trước
2. **Có lỗi**: Xem `INSTALL.md` → Troubleshooting
3. **Muốn mở rộng**: Đọc `PROJECT_STRUCTURE.txt` + source code
4. **Muốn test đầy đủ**: Xem `TESTING.md`

---

## 🎯 Mục tiêu

Mục tiêu của app:

```
CTV upload video
    ↓
Auto-extract keypoints (MediaPipe)
    ↓
Chỉnh sửa bằng drag & drop
    ↓
Export JSON chính xác
    ↓
Sử dụng cho dataset VSL
```

**Hoàn tất từ A→Z trên 1 app, không cần server phức tạp!**

---

## 📞 Liên hệ

Nếu cần giúp:

1. Mở Browser Console (F12)
2. Copy lỗi
3. Kiểm tra INSTALL.md Troubleshooting
4. Nếu vẫn không được → Contact developer

---

## 🎬 Sẵn sàng?

```
👉 [CTV] Mở QUICKSTART.md
👉 [Dev] Mở PROJECT_STRUCTURE.txt
👉 [QA]  Mở TESTING.md
👉 [All] Mở index.html để thử
```

**Let's go! 🚀**

---

**Last updated**: 2026-04-14 | **Status**: ✅ Ready
