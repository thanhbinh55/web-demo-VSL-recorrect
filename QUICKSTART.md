# 🚀 Hướng dẫn nhanh — VSL Keypoint Editor

## Mở app

1. Tìm file `index.html` trong thư mục dự án
2. Nhấp đúp chuột hoặc kéo vào trình duyệt Chrome/Edge/Firefox
3. Chờ trang tải xong (~3 giây)

## Sử dụng app

### Cách 1: Auto-extract keypoints từ video (TỰ ĐỘNG)

```
✓ Bật checkbox "Auto-extract on video load"
✓ Tải lên video .mp4
  → Chờ process (có thể mất vài phút...)
  → Keypoints sẽ xuất hiện tự động trên video
```

### Cách 2: Tải keypoints có sẵn (UPLOAD JSON)

```
✓ Tải video .mp4
✓ Tải file keypoints (.json)
  → Keypoints hiện ngay
```

## Chỉnh sửa điểm

1. **Pause video** (nhấn nút pause trên video)
2. **Hover** lên điểm → xem tooltip "Point N"
3. **Click + kéo** điểm sai → thả tại vị trí đúng
4. **Lặp lại** cho tất cả điểm sai

### Phím tắt

| Phím | Hành động |
|------|----------|
| `Ctrl+Z` | Undo (quay lại) |
| `Ctrl+Y` | Redo (làm lại) |
| Nút phải + kéo | Pan (di chuyển view) |

## Lưu kết quả

- **Autosave**: Bật checkbox "Autosave" → tự lưu khi edit
- **Tải file**: Nhấn "Lưu / Tải xuống JSON" → file `.json` mới sẽ được tải về

## Zoom / Pan

- Nút **"+"** : Phóng to
- Nút **"-"** : Thu nhỏ
- **Chuột phải + kéo** : Di chuyển view
- Nút **"Reset View"** : Về vị trí ban đầu

## Tips

💡 **Bắt đầu với video ngắn** (2-5 giây) để test
💡 **Kiểm tra chiều rộng, chiều cao** của từng điểm trước khi drag
💡 **Mở console (F12)** để xem progress khi extraction

## Lỗi thường gặp

**Q: Extraction chậm?**
A: Bình thường! 1 phút video = ~30 phút xử lý. Dùng video ngắn để test.

**Q: Drag không hoạt động?**
A: Đảm bảo video đã pause (dừng lại).

**Q: Keypoints không hiện?**
A: Kiểm tra video + JSON đã tải, hoặc extraction đã xong.

---

**Cần giúp?** Mở browser console (F12) → xem error message
