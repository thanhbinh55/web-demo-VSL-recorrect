# 🧪 Testing & Demo Guide

## Test nhanh (5 phút) — Không cần video thật

### Step 1: Mở app + kiểm tra giao diện

```
1. Mở index.html
2. Xem giao diện có thành phố không:
   ✓ Nút "Tải Video"
   ✓ Nút "Tải Keypoints"
   ✓ Nút "Prev Frame" / "Next Frame"
   ✓ Checkbox "Autosave", "Auto-extract on video load"
   ✓ Nút "Undo" / "Redo"
   ✓ Nút "+", "-", "Reset View"
   ✓ Canvas trống (chưa có video)
```

### Step 2: Tải sample keypoints + test drag

```
1. Nhấn "Tải Keypoints (.json)"
2. Chọn file "sample-keypoints.json"
3. Xem canvas có hiện 21 điểm + skeleton không ✓
4. Nhấn "Next Frame" → hiện frame 2 ✓
5. Hover lên một điểm → xem tooltip "Point N" ✓
```

### Step 3: Test drag & drop

```
1. Frame phải là trạng thái "paused" (không có video, nên mặc định paused)
2. Click vào điểm = kéo nó đi
3. Xem điểm di chuyển + tọa độ thay đổi ✓
4. Thả chuột → điểm dừng lại ✓
```

### Step 4: Test undo/redo

```
1. Drag một điểm đi
2. Nhấn "Undo" → điểm quay lại vị trí cũ ✓
3. Nhấn "Redo" → điểm quay lại vị trí sai ✓
4. Test Ctrl+Z / Ctrl+Y → cũng hoạt động ✓
```

### Step 5: Test zoom/pan

```
1. Nhấn "+" → canvas phóng to ✓
2. Nhấn "-" → canvas thu nhỏ ✓
3. Nhấn chuột phải + kéo → view di chuyển ✓
4. Nhấn "Reset View" → quay về ban đầu ✓
```

### Step 6: Test autosave

```
1. Bật checkbox "Autosave"
2. Drag một điểm
3. Thả chuột
4. Mở Developer Tools (F12) → Application → LocalStorage → vsl_editor_autosave
5. Xem có JSON data không ✓
```

### Step 7: Test download

```
1. Nhấn "Lưu / Tải xuống JSON"
2. File "keypoints_corrected.json" sẽ tải về
3. Mở file → xem có dữ liệu không ✓
```

## Test với video thật (15 phút)

### Setup: Chuẩn bị video test

```bash
# Video test requirements:
- Format: MP4 (H.264)
- Size: 640x480 hoặc 1280x720
- Duration: 2-5 giây (để test nhanh)
- Codec: H.264 (hầu hết MP4 đều đúng)

# Download sample video từ:
# - Pexels.com / Pixabay.com (free video)
# - Hoặc dùng video có sẵn trên máy
```

### Test 1: Auto-extract từ video

```
1. Bật checkbox "Auto-extract on video load"
2. Nhấn "Tải Video"
3. Chọn video 5 giây
4. Chờ extraction (console sẽ show progress)
   Expected: 5 sec × 25 fps = 125 frames → ~3-5 phút
5. Xem canvas có hiện điểm không ✓
6. Nhấn "Next Frame" → frame tiếp theo có điểm ✓
```

### Test 2: Upload JSON + drag

```
1. Tải video (.mp4)
2. Tải JSON keypoints (hoặc dùng sample-keypoints.json)
3. Xem keypoints hiện trên video ✓
4. Pause video
5. Drag điểm = di chuyển ✓
```

### Test 3: FPS adjustment

```
1. Tải video
2. Thay FPS = 15 (thay 25)
3. Nhấn "Prev Frame" / "Next Frame"
4. Xem frame index thay đổi khác ✓
5. (Frame index = round(time * fps))
```

### Test 4: Keyboard shortcuts

```
1. Drag một điểm
2. Nhấn Ctrl+Z → undo ✓
3. Nhấn Ctrl+Y → redo ✓
4. Nhấn Ctrl+Z nhiều lần → undo stack hoạt động ✓
5. (Tối đa 50 undo per frame)
```

## Performance test

### Extraction speed benchmark

```javascript
// Mở console (F12) → thêm code này
const start = Date.now();
const frames = await window.mediaPipeExtractFrames(video);
const elapsed = (Date.now() - start) / 1000;
console.log(`Extracted ${frames.length} frames in ${elapsed} seconds`);
console.log(`Average: ${(elapsed / frames.length).toFixed(2)} sec/frame`);
```

**Kỳ vọng**:
- Trên GPU (NVIDIA/AMD): 1-2 sec/frame
- Trên CPU (Intel/AMD): 3-5 sec/frame
- Trên MacBook M1: 0.5-1 sec/frame

### Memory usage

```javascript
// Mở console → check memory
console.log('Total frames:', state.frameCount);
console.log('Approx memory:', 
  (JSON.stringify(state.frames).length / 1024 / 1024).toFixed(2) + ' MB'
);
```

## Browser compatibility test

Thử trên các browser:
- ✓ Chrome 90+
- ✓ Firefox 88+
- ✓ Edge 90+
- ✓ Safari 14+ (có thể chậm hơn)
- ✗ IE 11 (không hỗ trợ)

## Edge case tests

### Test 1: Video không có timeline

```
- Dùng video không có seekbar
- Xem app vẫn hoạt động tốt (next/prev frame)
```

### Test 2: Keypoints không đầy đủ

```
- JSON chỉ có 10 điểm thay 21
- Xem app vẫn vẽ được + không crash ✓
```

### Test 3: Tọa độ ngoài [0..1]

```
- JSON có tọa độ > 1 hoặc < 0
- Xem app xử lý (scale để hiển thị)
```

### Test 4: Frame rỗng

```
- JSON frame nào không có keypoints
- Xem canvas vẽ rỗng (không crash) ✓
```

### Test 5: Video dài

```
- Upload video 1 phút
- Bật extraction
- App có crash không?
- Performance OK không?
```

## Demo scenario (5 phút)

### Scenario: "CTV chỉnh sửa video VSL"

```
1. [Bước 1] Mở app → bật "Auto-extract on video load"
2. [Bước 2] Tải video tay (5 giây)
3. [Bước 3] Chờ extraction (sẽ show console progress)
4. [Bước 4] Frame đầu tiên hiện 21 điểm + skeleton
5. [Bước 5] Nhấn "Next Frame" → frame 2 hiện
6. [Bước 6] Hover lên "Point 8" (index finger tip) → tooltip hiện
7. [Bước 7] Drag điểm sai → di chuyển đến vị trí đúng
8. [Bước 8] Lặp lại cho 2-3 điểm khác
9. [Bước 9] Nhấn "Undo" → quay lại thử
10. [Bước 10] Zoom in (+) → xem rõ hơn
11. [Bước 11] Nhấn "Lưu / Tải xuống JSON"
    → File JSON mới được tải về
12. [Xong!] Demo thành công ✓
```

## Regression tests

Sau mỗi thay đổi code, chạy:

```
□ Mở index.html → giao diện OK?
□ Upload sample-keypoints.json → xem điểm?
□ Drag điểm → tọa độ update?
□ Undo/Redo → hoạt động?
□ Zoom/Pan → hoạt động?
□ Download JSON → file OK?
□ Auto-extract (test video 2 giây) → OK?
□ Autosave → localStorage có data?
□ FPS adjust → frame index tính đúng?
```

## Automated test (Optional - nâng cao)

```javascript
// File: tests.js (nếu muốn viết test tự động)

async function testBasics() {
  console.log('Test 1: UI Elements');
  const btn = document.getElementById('saveBtn');
  console.assert(btn !== null, 'Save button exists');
  
  console.log('Test 2: Sample data');
  // Load sample JSON
  const res = await fetch('sample-keypoints.json');
  const data = await res.json();
  console.assert(Array.isArray(data), 'Sample JSON is array');
  console.assert(data[0].length === 21, '21 points per frame');
  
  console.log('✓ All basic tests passed');
}

testBasics();
```

## Troubleshooting test failures

| Lỗi | Giải pháp |
|-----|----------|
| UI không hiện | Kiểm tra console lỗi, reload trang |
| Điểm không vẽ | Kiểm tra JSON đã load, frame index OK |
| Drag không hoạt động | Kiểm tra video paused, canvas có focus |
| Extraction chậm | Bình thường, dùng video ngắn |
| Browser crash | Giảm video size, dùng browser mới |
| Autosave không lưu | Kiểm tra localStorage enabled |
| Download không hoạt động | Kiểm tra browser allow download |

---

**✓ Tất cả test pass?** App sẵn sàng dùng!

**Ghi chú**: Test này dành cho developers. CTV chỉ cần mở index.html + theo QUICKSTART.md.
