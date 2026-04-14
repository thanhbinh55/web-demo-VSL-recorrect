# 📚 VSL Keypoint Editor — Complete Project Index

## 🎯 Quick Links

| Mục | File | Dùng cho |
|-----|------|----------|
| **Start here** | `index.html` | Mở trong trình duyệt để chạy app |
| **Quick start** | `QUICKSTART.md` | Hướng dẫn nhanh 2 phút (cho CTV) |
| **Setup** | `INSTALL.md` | Hướng dẫn cài đặt & troubleshooting |
| **Full docs** | `README.md` | Tài liệu chi tiết & FAQ |
| **Testing** | `TESTING.md` | Hướng dẫn test & demo |
| **Structure** | `PROJECT_STRUCTURE.txt` | Cấu trúc dự án & kiến trúc |

## 📁 File thực thi

| File | Kích thước | Mục đích |
|------|-----------|---------|
| `index.html` | ~2 KB | Giao diện chính, tải MediaPipe từ CDN |
| `app.js` | ~15 KB | Logic chính (UI, drag, undo, autosave) |
| `mediapipe-extractor.js` | ~6 KB | MediaPipe Hands integration |
| `style.css` | ~4 KB | CSS styling |

## 📊 File dữ liệu

| File | Mục đích | Ghi chú |
|------|---------|--------|
| `sample-keypoints.json` | Test data | 2 frames × 21 points, dùng để demo UI |

## 📖 Tài liệu

| File | Độ dài | Dành cho |
|------|--------|----------|
| `README.md` | ~300 dòng | Toàn bộ tính năng, FAQ, technical notes |
| `QUICKSTART.md` | ~100 dòng | CTV: mở app → upload → chỉnh sửa → save |
| `INSTALL.md` | ~250 dòng | Dev: setup, troubleshooting, offline mode |
| `TESTING.md` | ~200 dòng | QA: test cases, performance benchmark |
| `PROJECT_STRUCTURE.txt` | ~150 dòng | Kiến trúc, luồng dữ liệu, configs |
| `INDEX.md` | File này | Lộ trình đọc tài liệu |

## 🚀 Hành trình sử dụng

### Cho CTV (người sửa keypoints)

```
1. Mở QUICKSTART.md (2 phút đọc)
   ↓
2. Mở index.html (ngay trong trình duyệt)
   ↓
3. Tải video (.mp4)
   ↓
4. [Auto-extract] HOẶC [Tải JSON có sẵn]
   ↓
5. Chỉnh sửa drag & drop
   ↓
6. Nhấn "Lưu" → tải JSON về
```

### Cho Developer (mở rộng/troubleshoot)

```
1. Mở PROJECT_STRUCTURE.txt → hiểu kiến trúc
   ↓
2. Mở README.md → xem tính năng chi tiết
   ↓
3. Mở INSTALL.md → nếu có setup issues
   ↓
4. Mở TESTING.md → kiểm tra/test
   ↓
5. Sửa code trong app.js / mediapipe-extractor.js
```

### Cho người muốn offline/local

```
1. Mở INSTALL.md → phần "Offline mode"
   ↓
2. Download MediaPipe files
   ↓
3. Update CDN URLs trong index.html + mediapipe-extractor.js
   ↓
4. Host locally (Python / Node / Docker)
```

## 🔥 Tính năng chính

✅ **Upload video + JSON**
✅ **Auto-extract keypoints** (MediaPipe Hands, 21 points)
✅ **Render & visualize** (points + skeleton)
✅ **Drag & drop edit** (kéo điểm sửa lỗi)
✅ **Undo/Redo** per-frame (Ctrl+Z/Y)
✅ **Zoom/Pan canvas** (+/-, right-drag)
✅ **Frame navigation** (Prev/Next)
✅ **Hover tooltip** + highlight
✅ **Autosave** (localStorage)
✅ **Auto-extract on load** (checkbox)
✅ **Export JSON** (tải xuống)

## 🎓 Tài liệu theo topic

### Giao diện & UX
- `QUICKSTART.md` — UI walkthrough
- `README.md` → "UI/UX Requirements"

### Tính năng extraction
- `README.md` → "MediaPipe scaffold"
- `mediapipe-extractor.js` → source code
- `INSTALL.md` → "Offline mode"

### Undo/Redo & state
- `README.md` → "Ghi chú kỹ thuật"
- `app.js` → functions: `pushHistory()`, `undo()`, `redo()`

### Zoom/Pan
- `app.js` → view transform
- `style.css` → cursor styles

### Autosave
- `app.js` → functions: `trySaveToLocal()`, `loadFromLocalIfAny()`
- `README.md` → "Autosave"

### Performance
- `TESTING.md` → "Performance test"
- `README.md` → "Troubleshooting"

### Browser support
- `INSTALL.md` → "Yêu cầu hệ thống"
- `TESTING.md` → "Browser compatibility test"

## 🔧 Customize

Để sửa đổi app:

| Cần thay đổi | Ở file | Ví dụ |
|-------------|--------|-------|
| Màu điểm | `app.js` line ~50 | `pointColor(i)` function |
| Kích thước điểm | `app.js` line ~24 | `pointRadius: 9` |
| FPS mặc định | `index.html` | `<input ... value="25">` |
| Bones/skeleton | `app.js` line ~42 | `HAND_BONES` array |
| CSS colors | `style.css` | `.btn`, `.save`, etc |
| MediaPipe model | `mediapipe-extractor.js` | `modelComplexity`, `minDetectionConfidence` |
| Max undo | `app.js` | `history[frameIdx].undo.length > 50` |

## 📦 Dependencies

**External (từ CDN)**:
- MediaPipe Hands (Google CDN)

**Internal (tất cả đã bao gồm)**:
- Vanilla JavaScript (ES6+)
- HTML5 Canvas
- LocalStorage API

**Không cần cài thêm!**

## 🚨 Giới hạn & Known issues

| Issue | Workaround |
|-------|-----------|
| Extraction chậm | Dùng video ngắn, giảm FPS |
| Multi-hand không support | Sử dụng ở lần lần (1 tay/video) |
| Pose (body) không support | Chỉ hand 21 points MVP |
| 3D keypoints (Z axis) | Render 2D only, nhưng lưu z |
| Offline extraction | Cần internet lần 1 (MediaPipe load) |
| Safari chậm | Upgrade Safari, hoặc dùng Chrome |

## 📞 Support & Contribution

### Report issue
1. Mở console (F12)
2. Copy error message
3. Kiểm tra INSTALL.md troubleshooting section
4. Liên hệ dev

### Request feature
- Xem "Nâng cấp tương lai" trong README.md
- Xem PROJECT_STRUCTURE.txt → "Mở rộng tương lai"

### Extend code
1. Mở app.js
2. Find relevant function
3. Add your logic
4. Test (TESTING.md)
5. Done!

## 📝 Version history

```
v1.0 (2026-04-14) — Initial MVP
- Upload video + JSON
- Canvas visualization
- Drag & drop edit
- Undo/Redo
- Zoom/Pan
- Autosave
- MediaPipe extraction scaffold
```

## 🎯 Next milestones

```
v1.1 — UX improvements
- [ ] Better error messages
- [ ] Progress bar for extraction
- [ ] Batch mode

v2.0 — Feature expansion
- [ ] Multi-hand support
- [ ] Body pose (33 points)
- [ ] CSV export
- [ ] Video render with keypoints

v3.0 — Pro features
- [ ] Calibration tools
- [ ] 3D visualization
- [ ] Live webcam
- [ ] Cloud sync
```

## ✅ Checklist: Sẵn sàng production?

```
□ Tất cả 4 file (.html, .js x2, .css) ở cùng thư mục
□ Kiểm tra giao diện: Prev/Next, Undo/Redo, +/-, Save buttons
□ Test với sample-keypoints.json
□ Test with real video (2-5 sec)
□ Kiểm tra download JSON work
□ Kiểm tra autosave (localStorage)
□ Test undo/redo (Ctrl+Z/Y)
□ Test zoom/pan
□ Browser compatible (Chrome/Edge/Firefox)
□ Internet connectivity (for MediaPipe)
□ CTV training (QUICKSTART.md)
□ Ready to ship!
```

## 📂 File Organization

```
/root
├── index.html ........................ [App entry point]
├── app.js ............................ [Main logic]
├── mediapipe-extractor.js ............ [Extraction engine]
├── style.css ......................... [Styles]
├── sample-keypoints.json ............. [Test data]
│
├── README.md ......................... [Full documentation]
├── QUICKSTART.md ..................... [CTV guide]
├── INSTALL.md ........................ [Setup guide]
├── TESTING.md ........................ [QA guide]
├── PROJECT_STRUCTURE.txt ............. [Architecture]
└── INDEX.md .......................... [This file]
```

---

**🚀 Ready to start?**

- CTV: `QUICKSTART.md` → open `index.html`
- Dev: `PROJECT_STRUCTURE.txt` → read `README.md`
- QA: `TESTING.md` → run test suite

---

**📅 Last updated**: 2026-04-14
**Status**: ✅ Production Ready MVP
