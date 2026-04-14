VSL Keypoint Editor — MVP (Client-side, hoàn chỉnh với Auto-extract MediaPipe)

Mục tiêu:
- SPA nhẹ để visualize keypoints đè lên video và chỉnh sửa từng frame bằng kéo-thả.
- Auto-extract keypoints từ video bằng MediaPipe Hands (client-side).
- Không cần server, chạy trực tiếp bằng cách mở `index.html` trên trình duyệt.

Các file:
- `index.html` — giao diện chính (tải MediaPipe từ CDN)
- `app.js` — logic chính (upload, sync frame → canvas, vẽ, drag/drop, undo/redo, autosave)
- `mediapipe-extractor.js` — hàm trích xuất keypoints bằng MediaPipe Hands
- `style.css` — style tối giản
- `sample-keypoints.json` — dữ liệu keypoints mẫu (2 frames × 21 points)

Cách chạy nhanh:

1. Mở `index.html` trong trình duyệt (kéo thả file vào cửa sổ Chrome/Edge hoặc `Right-click → Open with Browser`).
   - Trang sẽ tải MediaPipe từ CDN (cdn.jsdelivr.net). Chờ đến khi script load xong (~2-3 giây).

2. [**Lựa chọn A: Auto-extract từ video**]
   - Bật checkbox "Auto-extract on video load"
   - Tải lên video (.mp4)
   - Trang sẽ tự động trích xuất keypoints từ video (quá trình có thể mất ~1-5 phút tuỳ độ dài video)
   - Sau khi xong, frame đầu sẽ hiển thị với các điểm keypoints

3. [**Lựa chọn B: Tải JSON keypoints có sẵn**]
   - Tải lên video (.mp4)
   - Tải lên file keypoints (.json) — có thể dùng `sample-keypoints.json` để test
   - Keypoints sẽ hiển thị trên video ngay

4. Chỉnh sửa:
   - Dừng video (pause) tại frame cần sửa
   - Hover lên điểm sai để xem tooltip "Point N"
   - Click + kéo (drag) điểm đó đến vị trí đúng
   - Nhả chuột (drop) — tọa độ cập nhật ngay
   - Nếu sai, nhấn "Undo" (Ctrl+Z) hoặc Redo (Ctrl+Y)

5. Zoom / Pan:
   - Nút "+" / "-" để zoom in/out
   - Nhấn chuột phải + kéo (right-drag) để di chuyển view
   - Nút "Reset View" để về vị trí ban đầu

6. Lưu kết quả:
   - Bật "Autosave" để tự động lưu vào localStorage khi edit
   - Nhấn "Lưu / Tải xuống JSON" để tải file JSON đã chỉnh xuống máy
   - Tên file: `keypoints_corrected.json`

Tính năng chi tiết:

✅ Upload video & JSON
✅ Auto-extract keypoints (MediaPipe Hands)
✅ Vẽ 21 điểm tay + skeleton
✅ Frame-by-frame navigation (Prev / Next)
✅ Drag & drop chỉnh sửa điểm
✅ Undo/Redo per-frame (Ctrl+Z / Ctrl+Y)
✅ Zoom/Pan canvas
✅ Hover tooltip + highlight
✅ Autosave (localStorage)
✅ Auto-extract on video load (checkbox)
✅ Export JSON chỉnh sửa

Ghi chú kỹ thuật:

- **Tọa độ**: Lưu trữ dạng chuẩn hoá [0..1]. Tự động scale tới kích thước video hiển thị.
- **Frame index**: Tính từ `Math.round(time * fps)`. FPS mặc định = 25 (có thể chỉnh).
- **MediaPipe**: Sử dụng Hands model từ cdn.jsdelivr.net. Trích xuất frame-by-frame.
- **History**: Mỗi frame có stack undo/redo riêng (tối đa 50 undo per frame).
- **Autosave**: Lưu vào localStorage key `vsl_editor_autosave`. Tự động load khi mở app.

FAQ & Troubleshooting:

Q: Video không hiện keypoints?
A: Kiểm tra:
   1. Video đã load metadata (`Tải Video` xong)
   2. JSON keypoints đã tải (hoặc auto-extract đã chạy xong)
   3. Mở browser console (F12) xem có lỗi JS không

Q: Auto-extract chậm hoặc bị treo?
A: Bình thường! MediaPipe xử lý frame-by-frame. Video 1 phút (25fps) = 1500 frames = ~10-30 phút tùy máy.
   - Nên test với video 2-5 giây đầu tiên.
   - Kiểm tra console (F12) xem progress log.

Q: Drag điểm không hoạt động?
A: Chỉ hoạt động khi video paused. Đảm bảo nhấn pause trước.

Q: Muốn dùng FPS khác?
A: Thay đổi số trong ô "FPS" trước khi tải video.

Q: Extraction không chạy?
A: MediaPipe chưa load từ CDN. Chờ trang load xong (F12 console → xem "MediaPipe Extractor module loaded" message).
   Nếu lỗi, kiểm tra kết nối internet (CDN cần fetch scripts).

Q: Muốn load MediaPipe từ offline/local?
A: Download MediaPipe files từ npm, host locally, update CDN URL trong `index.html` và `mediapipe-extractor.js`.

Ví dụ JSON format:

```json
[
  [
    {"x": 0.5, "y": 0.5, "z": 0},
    {"x": 0.52, "y": 0.48, "z": 0},
    ...21 points tổng cộng...
  ],
  ...
]
```

Hoặc:
```json
{
  "frames": [
    [...],
    ...
  ]
}
```

Next steps đề xuất (nếu muốn nâng cấp):

1. **Hỗ trợ body pose** (MediaPipe Pose): 33 points thay vì 21 hand points
2. **Multi-hand** (2 bàn tay cùng lúc)
3. **Batch export** keypoints từ nhiều video
4. **Confidence score visualization** (hiện độ tin cậy của từng điểm)
5. **Export video** (video + keypoints rendered)
6. **Công cụ calibration** (điều chỉnh camera intrinsics cho độ chính xác 3D tốt hơn)

=====

Toàn bộ ghi chú: Đây là MVP hoàn chỉnh client-side. Mục đích: CTV tải video, auto-extract hoặc upload JSON có sẵn, chỉnh sửa drag-drop, save.
Không cần server, không cần setup phức tạp — chỉ mở file HTML là dùng được.
