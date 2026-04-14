# ⚙️ Setup & Installation Guide

## Yêu cầu hệ thống

- **Browser**: Chrome, Edge, Firefox (bản mới nhất)
- **OS**: Windows, macOS, Linux
- **Internet**: Để tải MediaPipe từ CDN (lần đầu)
- **Video**: MP4 format (H.264 codec)

## Cài đặt (không cần setup!)

VSL Keypoint Editor là **client-side only** — không cần cài đặt hay build tool.

### Cách 1: Mở trực tiếp từ file

```bash
1. Tìm file "index.html" trong thư mục dự án
2. Nhấp đúp chuột
   → Trình duyệt sẽ mở tự động
3. Chờ trang load (~3 giây)
   → Sẵn sàng dùng!
```

### Cách 2: Kéo thả vào trình duyệt

```bash
1. Mở Chrome / Edge / Firefox
2. Kéo file "index.html" vào cửa sổ trình duyệt
3. Thả ra
   → Trang sẽ load
```

### Cách 3: Qua command line

```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html

# Hoặc dùng Python local server
python -m http.server 8000
# Rồi mở http://localhost:8000 trên trình duyệt
```

## Cấu trúc file cần có

```
project-folder/
├── index.html                  ✓ REQUIRED
├── app.js                      ✓ REQUIRED
├── mediapipe-extractor.js      ✓ REQUIRED
├── style.css                   ✓ REQUIRED
├── sample-keypoints.json       (optional, dùng để test)
├── README.md                   (documentation)
└── QUICKSTART.md               (quick start guide)
```

**Quan trọng**: Tất cả 4 file bắt buộc phải ở cùng thư mục!

## Kiểm tra setup

1. Mở `index.html` trong trình duyệt
2. Mở Developer Tools (F12 hoặc Ctrl+Shift+I)
3. Xem tab **Console**
4. Nếu thấy message:
   ```
   MediaPipe Extractor module loaded. window.mediaPipeExtractFrames ready.
   ```
   → Setup thành công! ✓

## Troubleshooting

### ❌ "Cannot find mediapipe-extractor.js"

**Giải pháp**: Kiểm tra tất cả 4 file (index.html, app.js, mediapipe-extractor.js, style.css) có ở cùng thư mục không.

### ❌ "MediaPipe not loaded"

**Giải pháp**: 
- Chờ trang load xong (~3 giây)
- Kiểm tra kết nối internet (CDN cần fetch scripts)
- Mở tab **Network** (F12) → xem có lỗi download không

### ❌ "CORS error" khi tải video local

**Giải pháp**: Dùng Local HTTP Server thay vì mở file trực tiếp:
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (nếu có)
npx http-server

# Rồi mở http://localhost:8000 trên trình duyệt
```

### ❌ Video không load

**Giải pháp**:
- Kiểm tra format: MP4 H.264 codec
- Thử video test khác
- Kiểm tra path (có dấu cách, ký tự đặc biệt không?)

### ❌ Extraction chạy rất chậm / tự dừng

**Giải pháp**:
- **Bình thường!** MediaPipe cần ~1-2 sec/frame
- Thử video ngắn hơn (2-5 giây)
- Giảm FPS (ví dụ 15 thay 25)
- Đóng tab khác để giải phóng bộ nhớ

### ❌ Browser crash/freeze khi extraction

**Giải pháp**:
- Giảm video size (độ phân giải)
- Thử browser khác
- Restart browser + computer
- Dùng video ngắn để test

## Tối ưu hoá

### Extraction nhanh hơn

1. **Giảm độ phân giải video**: 640x480 thay 1280x720
2. **Giảm FPS**: 15-20 thay 25
3. **Video ngắn hơn**: Test 5 giây trước
4. **Browser mới nhất**: Chrome 90+, Firefox 88+, Edge 90+

### Memory tốt hơn

- Đóng tab không dùng
- Không mở console (F12) trong quá trình extraction
- Xóa autosave cũ (localStorage):
  ```javascript
  localStorage.removeItem('vsl_editor_autosave')
  ```

## Update / Upgrade

### Từ version cũ sang mới

1. Backup file JSON cũ:
   ```bash
   cp keypoints.json keypoints.backup.json
   ```

2. Tải file mới (3 file bắt buộc: app.js, mediapipe-extractor.js, style.css)

3. Đặt vào cùng thư mục

4. Mở index.html → test với sample-keypoints.json

5. Nếu OK → dùng file JSON cũ của bạn (format tương thích)

## Các biến thể cài đặt

### Docker (nếu muốn)

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY . .
RUN npm install -g http-server
EXPOSE 8080
CMD ["http-server", "-p", "8080"]
```

```bash
docker build -t vsl-editor .
docker run -p 8080:8080 vsl-editor
# Mở http://localhost:8080
```

### Heroku / Cloud hosting

Dùng bất kỳ static site hosting nào:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

(Chỉ upload 4 file HTML/JS/CSS)

## Offline mode (không kết nối internet)

MediaPipe cần load từ CDN lần đầu. Sau đó:

1. **Lần đầu**: Mở app với internet → MediaPipe được cache
2. **Lần sau**: Offline mode vẫn hoạt động (nếu tất cả script đã cache)

Hoặc download MediaPipe offline:
- Download từ npm: `@mediapipe/hands`
- Host local
- Update URL trong `index.html` + `mediapipe-extractor.js`

## Support

Nếu gặp vấn đề:

1. **Mở Console (F12)**
2. **Xem error message**
3. **Kiểm tra checklist troubleshooting ở trên**
4. **Thử sample-keypoints.json** (để xác nhận UI hoạt động)

---

**✓ Sẵn sàng?** Mở `QUICKSTART.md` để bắt đầu!
