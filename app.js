// app.js - logic để đồng bộ video frame và canvas overlay
(() => {
    const video = document.getElementById('video');
    const canvas = document.getElementById('overlay');
    const ctx = canvas.getContext('2d');
    const tooltipEl = document.getElementById('tooltip');

    const videoUpload = document.getElementById('videoUpload');
    const jsonUpload = document.getElementById('jsonUpload');
    const prevBtn = document.getElementById('prevFrame');
    const nextBtn = document.getElementById('nextFrame');
    const frameInfo = document.getElementById('frameInfo');
    const fpsInput = document.getElementById('fpsInput');
    const saveBtn = document.getElementById('saveBtn');

    // Auto-sync UI elements
    const fpsStatus = document.getElementById('fpsStatus');
    const fpsStatusValue = document.getElementById('fpsStatusValue');
    const extractionProgress = document.getElementById('extractionProgress');
    const extractionStatus = document.getElementById('extractionStatus');
    const extractionBar = document.getElementById('extractionBar');
    const showVideoChk = document.getElementById('showVideoChk');

    let state = {
        fps: parseInt(fpsInput.value, 10) || 25,
        frames: null, // array of frames, each frame -> array of keypoints [{x,y,z,type,visibility},...]
        sourceWasObject: false,
        frameCount: 0,
        dragging: null, // {frameIndex, pointIndex}
        pointRadius: 5,  // smaller radius for 543 points
        videoSize: { w: 640, h: 480 },
        visibleTypes: { pose: true, leftHand: true, rightHand: true, face: true },
        isPlaying: false,
        playbackSpeed: 1.0,
        showOriginalVideo: true  // Toggle to show/hide original video
    };

    // view transform for zoom/pan - now for BOTH video and canvas
    const view = {
        scale: 1,
        offsetX: 0,
        offsetY: 0,
        isPanning: false,
        panStart: null,
        hoverIndex: null
    };

    // per-frame undo/redo stacks
    const history = {}; // frameIdx -> {undo: [], redo: []}

    // MediaPipe Holistic structure:
    // Pose: 0-32 (33 points)
    // Left hand: 33-53 (21 points, starting at index 33)
    // Right hand: 54-74 (21 points, starting at index 54)
    // Face: 75-542 (468 points, starting at index 75)

    // Hand bone connections (21 points each for left/right)
    const HAND_BONES = [
        [0, 1], [1, 2], [2, 3], [3, 4],       // thumb
        [0, 5], [5, 6], [6, 7], [7, 8],       // index
        [0, 9], [9, 10], [10, 11], [11, 12],  // middle
        [0, 13], [13, 14], [14, 15], [15, 16],// ring
        [0, 17], [17, 18], [18, 19], [19, 20] // pinky
    ];

    // Pose body skeleton (33 points)
    const POSE_BONES = [
        // torso
        [12, 11], [12, 23], [12, 24], [12, 13], [13, 14], [14, 16],
        [11, 15], [15, 17], [16, 18], [22, 23], [23, 24], [24, 26],
        [26, 28], [25, 27], [27, 29],
        // legs
        [23, 25], [24, 26], [25, 27], [26, 28], [27, 29], [28, 30], [29, 31], [30, 32], [31, 32]
    ];

    // color mapping for 543 points: pose (0-32) + leftHand (33-53) + rightHand (54-74) + face (75-542)
    function pointColor(i, point) {
        // prefer point.type if available (from Holistic)
        if (point && point.type) {
            if (point.type === 'pose') {
                return '#ff6b6b'; // red for body
            } else if (point.type === 'leftHand') {
                return '#4ecdc4'; // teal for left hand
            } else if (point.type === 'rightHand') {
                return '#ffe66d'; // yellow for right hand
            } else if (point.type === 'face') {
                return '#95e1d3'; // light teal for face
            }
        }

        // fallback: guess by index range
        if (i < 33) return '#ff6b6b';     // pose
        if (i < 54) return '#4ecdc4';     // left hand
        if (i < 75) return '#ffe66d';     // right hand
        return '#95e1d3';                 // face
    }

    // Helper: Extract keypoints from frame data (handles both old and new format)
    function getFrameKeypoints(frame) {
        if (!frame) return null;
        // New format: {index, time, keypoints: [...]}
        if (frame.keypoints) return frame.keypoints;
        // Old format: just array of keypoints
        if (Array.isArray(frame)) return frame;
        return null;
    }

    // Helper: Clone frame data (preserves metadata)
    function cloneFrame(frame) {
        if (!frame) return null;
        if (frame.keypoints) {
            return {
                index: frame.index,
                time: frame.time,
                keypoints: JSON.parse(JSON.stringify(frame.keypoints))
            };
        }
        return JSON.parse(JSON.stringify(frame));
    }

    // Auto-detect FPS from frame metadata (fixes keypoint lag)
    // This ensures frameIndex calculation matches actual video FPS
    function autoDetectFPS() {
        if (!state.frames || state.frames.length < 2) {
            console.log('Not enough frames to auto-detect FPS');
            return state.fps;
        }

        // Try method 1: Use frame.time metadata (most reliable)
        if (state.frames[0].time !== undefined && state.frames[1].time !== undefined) {
            const frame0 = state.frames[0];
            const frame1 = state.frames[1];
            const timeDiff = frame1.time - frame0.time;

            if (timeDiff > 0 && timeDiff < 1) {
                const detectedFPS = Math.round(1 / timeDiff);
                if (detectedFPS > 0 && detectedFPS <= 120) {
                    state.fps = detectedFPS;
                    fpsInput.value = detectedFPS;
                    console.log(`✅ Auto-detected FPS: ${detectedFPS} from frame metadata`);
                    showFPSStatus(detectedFPS);
                    return detectedFPS;
                }
            }
        }

        // Try method 2: Calculate from total frames and video duration
        if (video && video.duration && state.frameCount > 0) {
            const calculatedFPS = Math.round(state.frameCount / video.duration);
            if (calculatedFPS > 0 && calculatedFPS <= 120) {
                state.fps = calculatedFPS;
                fpsInput.value = calculatedFPS;
                console.log(`✅ Auto-detected FPS: ${calculatedFPS} from video duration`);
                showFPSStatus(calculatedFPS);
                return calculatedFPS;
            }
        }

        console.log(`⚠️ Could not auto-detect FPS, using default: ${state.fps}`);
        return state.fps;
    }    // Helper: Show FPS status display when FPS detected
    function showFPSStatus(fps) {
        if (fps && fps > 0) {
            fpsStatusValue.textContent = fps;
            fpsStatus.style.display = 'inline-block';
            // Auto-hide after 5 seconds
            setTimeout(() => {
                fpsStatus.style.display = 'none';
            }, 5000);
        }
    }

    // Helper: Show extraction progress bar
    function showExtractionProgress(current, total, percent) {
        if (!extractionProgress) return;
        extractionBar.value = percent;
        extractionStatus.textContent = `Extraction: ${percent}% (${current} / ${total} frames)`;
    }

    function readFileAsURL(file, cb) {
        const reader = new FileReader();
        reader.onload = e => cb(e.target.result);
        reader.readAsDataURL(file);
    }

    videoUpload.addEventListener('change', e => {
        const f = e.target.files && e.target.files[0];
        if (!f) return;
        readFileAsURL(f, url => {
            video.src = url;
            video.load();
        });
    });

    jsonUpload.addEventListener('change', e => {
        const f = e.target.files && e.target.files[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = ev => {
            try {
                const data = JSON.parse(ev.target.result);
                // normalize shapes: support either array-of-frames or {frames:[...]} schema
                if (Array.isArray(data)) {
                    state.frames = data;
                    state.sourceWasObject = false;
                } else if (data && Array.isArray(data.frames)) {
                    state.frames = data.frames;
                    state.sourceWasObject = true;
                } else {
                    alert('JSON format không được nhận diện. Cần là Array frames hoặc {frames: [...]}');
                    return;
                }
                state.frameCount = state.frames.length;
                autoDetectFPS();  // Auto-detect FPS from frame metadata
                updateFrameInfo();
                drawCurrentFrame();
            } catch (err) {
                alert('Không đọc được JSON: ' + err.message);
            }
        };
        reader.readAsText(f);
    });

    // Helper: Detect FPS from video element (using MediaCapabilities or fallback)
    function detectVideoFPS() {
        // Try to detect FPS from video properties
        // Note: HTML5 Video API doesn't expose FPS directly, so we use heuristics

        // Most common video FPS values
        const commonFPS = [24, 25, 30, 60, 23.976, 29.97];

        // For now, we'll wait for keypoints to be loaded and detect from frame metadata
        // But if user extracts, it will auto-detect from frames
        // Default to 25 if no keypoints loaded
        console.log('Video metadata loaded. FPS will be auto-detected after keypoint extraction.');
        return state.fps;
    }

    // when video metadata available, size canvas to video
    video.addEventListener('loadedmetadata', () => {
        state.videoSize.w = video.videoWidth || 640;
        state.videoSize.h = video.videoHeight || 480;
        canvas.width = state.videoSize.w;
        canvas.height = state.videoSize.h;
        canvas.style.width = video.clientWidth + 'px';
        canvas.style.height = video.clientHeight + 'px';
        drawCurrentFrame();

        // Try to detect FPS from video metadata
        detectVideoFPS();

        // Auto-extract keypoints if checkbox enabled
        setTimeout(() => {
            if (autoExtractChk && autoExtractChk.checked && window.mediaPipeExtractFrames) {
                console.log('Auto-extracting keypoints...');
                mpExtractBtn && mpExtractBtn.click();
            }
        }, 500);
    });

    // update fps from input
    fpsInput.addEventListener('change', () => {
        const v = parseInt(fpsInput.value, 10);
        if (v > 0) state.fps = v;
        drawCurrentFrame();
    });

    // compute current frame index from video.currentTime and fps
    function getCurrentFrameIndex() {
        if (!video || isNaN(video.currentTime)) return 0;
        return Math.max(0, Math.round(video.currentTime * state.fps));
    }

    function updateFrameInfo() {
        const idx = getCurrentFrameIndex();
        frameInfo.textContent = `Frame: ${idx} / ${state.frameCount || '-'} (fps ${state.fps})`;
    }

    video.addEventListener('timeupdate', () => {
        updateFrameInfo();
        // always redraw when playing to keep overlay in sync
        if (!state.dragging) drawCurrentFrame();
    });

    // IMPORTANT: Also redraw when video is paused and user seeks
    // This fixes: keypoints don't update when paused and dragging video progress bar
    video.addEventListener('seeked', () => {
        updateFrameInfo();
        if (!state.dragging) drawCurrentFrame();
    });

    // Redraw when video is paused (in case user paused at different time)
    video.addEventListener('pause', () => {
        updateFrameInfo();
        if (!state.dragging) drawCurrentFrame();
    });

    // manual step
    prevBtn.addEventListener('click', () => {
        stepFrame(-1);
    });
    nextBtn.addEventListener('click', () => {
        stepFrame(1);
    });

    function stepFrame(dir) {
        video.pause();
        const cur = getCurrentFrameIndex();
        const next = Math.max(0, cur + dir);
        video.currentTime = next / state.fps;
        // draw will happen in timeupdate handler
        setTimeout(drawCurrentFrame, 50);
    }

    // Drawing routine: draw keypoints for current frame
    function drawCurrentFrame() {
        const w = state.videoSize.w;
        const h = state.videoSize.h;
        canvas.width = w; // clears canvas
        canvas.height = h;

        // Calculate canvas CSS size based on visibility
        let displayWidth = video.clientWidth;
        let displayHeight = video.clientHeight;

        // If video is hidden, use state.videoSize as display size
        if (!state.showOriginalVideo || displayWidth === 0 || displayHeight === 0) {
            // Get viewport container size
            const viewport = document.getElementById('viewport');
            if (viewport) {
                const rect = viewport.getBoundingClientRect();
                displayWidth = rect.width > 0 ? rect.width : w;
                displayHeight = rect.height > 0 ? rect.height : h;
            } else {
                displayWidth = w;
                displayHeight = h;
            }
        }

        canvas.style.width = displayWidth + 'px';
        canvas.style.height = displayHeight + 'px';

        const frameIdx = getCurrentFrameIndex();
        if (!state.frames || !state.frames[frameIdx]) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            return;
        }
        const points = getFrameKeypoints(state.frames[frameIdx]);
        if (!Array.isArray(points)) return;

        // If video is hidden, draw black background on canvas
        if (!state.showOriginalVideo) {
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // apply view transform
        ctx.save();
        ctx.setTransform(view.scale, 0, 0, view.scale, view.offsetX, view.offsetY);

        // draw bones (pose + hands)
        ctx.lineWidth = 3 / Math.max(1, view.scale);
        ctx.lineCap = 'round';

        // draw pose skeleton if visible (indices 0-32)
        if (state.visibleTypes.pose) {
            for (const [a, b] of POSE_BONES) {
                const pa = points[a];
                const pb = points[b];
                if (!pa || !pb) continue;
                const ax = toX(pa.x, w);
                const ay = toY(pa.y, h);
                const bx = toX(pb.x, w);
                const by = toY(pb.y, h);
                ctx.beginPath();
                ctx.moveTo(ax, ay);
                ctx.lineTo(bx, by);
                ctx.strokeStyle = '#ff6b6b';
                ctx.stroke();
            }
        }

        // draw hand skeletons if visible (leftHand 33-53, rightHand 54-74)
        if (state.visibleTypes.leftHand || state.visibleTypes.rightHand) {
            for (const [a, b] of HAND_BONES) {
                // left hand: points 33-53
                if (state.visibleTypes.leftHand && a >= 33 && a < 54 && b >= 33 && b < 54) {
                    const pa = points[a];
                    const pb = points[b];
                    if (!pa || !pb) continue;
                    const ax = toX(pa.x, w);
                    const ay = toY(pa.y, h);
                    const bx = toX(pb.x, w);
                    const by = toY(pb.y, h);
                    ctx.beginPath();
                    ctx.moveTo(ax, ay);
                    ctx.lineTo(bx, by);
                    ctx.strokeStyle = '#4ecdc4';
                    ctx.stroke();
                }
                // right hand: points 54-74
                if (state.visibleTypes.rightHand && a >= 54 && a < 75 && b >= 54 && b < 75) {
                    const pa = points[a];
                    const pb = points[b];
                    if (!pa || !pb) continue;
                    const ax = toX(pa.x, w);
                    const ay = toY(pa.y, h);
                    const bx = toX(pb.x, w);
                    const by = toY(pb.y, h);
                    ctx.beginPath();
                    ctx.moveTo(ax, ay);
                    ctx.lineTo(bx, by);
                    ctx.strokeStyle = '#ffe66d';
                    ctx.stroke();
                }
            }
        }

        // draw points (filter by visible types)
        let visiblePointCount = 0;
        for (let i = 0; i < points.length; i++) {
            const p = points[i];
            if (!p) continue;

            // skip if type is hidden
            if (p.type && !state.visibleTypes[p.type]) continue;
            visiblePointCount++;

            const x = toX(p.x, w);
            const y = toY(p.y, h);
            const baseR = state.pointRadius;
            const r = baseR / Math.max(1, view.scale);
            ctx.beginPath();
            ctx.fillStyle = (view.hoverIndex === i) ? '#ffa726' : pointColor(i, p);
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2 / Math.max(1, view.scale);
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }

        // update point counter in UI
        const pointCountEl = document.getElementById('pointCount');
        if (pointCountEl) {
            pointCountEl.textContent = `Points: ${visiblePointCount}`;
        }

        ctx.restore();
    }

    // helpers: convert stored coordinate to pixel
    // Supports normalized coords (0..1) or absolute pixels (>1)
    function toX(x, w) {
        if (x === undefined || x === null) return 0;
        return (x <= 1 ? x * w : x);
    }
    function toY(y, h) {
        if (y === undefined || y === null) return 0;
        return (y <= 1 ? y * h : y);
    }

    // inverse: convert mouse pixel to stored coord (use normalized)
    function toNormX(px, w) { return px / w; }
    function toNormY(py, h) { return py / h; }

    // hit test nearest point within radius (logical canvas coords)
    function pickPointAt(mx, my) {
        const idx = getCurrentFrameIndex();
        const frame = state.frames && state.frames[idx];
        const pts = getFrameKeypoints(frame);
        if (!pts) return null;
        const w = state.videoSize.w;
        const h = state.videoSize.h;
        let best = { dist: Infinity, i: -1 };
        for (let i = 0; i < pts.length; i++) {
            const p = pts[i];
            if (!p) continue;
            const x = toX(p.x, w);
            const y = toY(p.y, h);
            const dx = x - mx, dy = y - my;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < best.dist) { best = { dist: d, i: i }; }
        }
        if (best.dist <= state.pointRadius * 1.4) return best.i;
        return null;
    }

    // mouse interactions (drag, pan & hover)
    let rect = null;
    let pushedHistoryOnDrag = false;
    canvas.addEventListener('mousedown', (ev) => {
        if (!state.frames) return;
        rect = canvas.getBoundingClientRect();
        const mx_css = (ev.clientX - rect.left);
        const my_css = (ev.clientY - rect.top);
        const mx = mx_css * (canvas.width / rect.width);
        const my = my_css * (canvas.height / rect.height);
        // logical coords (consider view transform)
        const logicalX = (mx - view.offsetX) / view.scale;
        const logicalY = (my - view.offsetY) / view.scale;

        // right-click starts pan
        if (ev.button === 2) {
            view.isPanning = true;
            view.panStart = { x: ev.clientX, y: ev.clientY, ox: view.offsetX, oy: view.offsetY };
            return;
        }

        if (!video.paused) return;
        const picked = pickPointAt(logicalX, logicalY);
        if (picked !== null) {
            state.dragging = { frameIndex: getCurrentFrameIndex(), pointIndex: picked };
            canvas.classList.add('dragging');
            // push history for undo
            pushHistory(state.dragging.frameIndex);
            pushedHistoryOnDrag = true;
        }
    });

    window.addEventListener('mousemove', (ev) => {
        rect = canvas.getBoundingClientRect();
        const mx_css = (ev.clientX - rect.left);
        const my_css = (ev.clientY - rect.top);
        const mx = mx_css * (canvas.width / rect.width);
        const my = my_css * (canvas.height / rect.height);
        const logicalX = (mx - view.offsetX) / view.scale;
        const logicalY = (my - view.offsetY) / view.scale;

        // handle panning
        if (view.isPanning && view.panStart) {
            const dx = ev.clientX - view.panStart.x;
            const dy = ev.clientY - view.panStart.y;
            view.offsetX = view.panStart.ox + dx;
            view.offsetY = view.panStart.oy + dy;
            drawCurrentFrame();
            return;
        }

        // dragging point
        if (state.dragging) {
            const fi = state.dragging.frameIndex;
            const pi = state.dragging.pointIndex;
            if (!state.frames[fi]) return;
            const points = getFrameKeypoints(state.frames[fi]);
            if (!points || !points[pi]) return;
            points[pi].x = logicalX / canvas.width;
            points[pi].y = logicalY / canvas.height;
            drawCurrentFrame();
            return;
        }

        // hover
        if (state.frames) {
            const idx = getCurrentFrameIndex();
            const pts = state.frames && state.frames[idx];
            if (pts) {
                const hit = pickPointAt(logicalX, logicalY);
                if (hit !== null) {
                    view.hoverIndex = hit;
                    showTooltip(ev.clientX, ev.clientY, `Point ${hit}`);
                } else {
                    view.hoverIndex = null;
                    hideTooltip();
                }
                drawCurrentFrame();
            }
        }
    });

    window.addEventListener('mouseup', (ev) => {
        // end pan
        if (view.isPanning) {
            view.isPanning = false;
            view.panStart = null;
            return;
        }
        if (state.dragging) {
            state.dragging = null;
            canvas.classList.remove('dragging');
            pushedHistoryOnDrag = false;
            updateFrameInfo();
            // autosave to localStorage
            if (document.getElementById('autosaveChk') && document.getElementById('autosaveChk').checked) {
                trySaveToLocal();
            }
        }
    });

    // Save / Download updated JSON
    saveBtn.addEventListener('click', () => {
        if (!state.frames) { alert('Chưa có dữ liệu keypoints.'); return; }
        const out = state.sourceWasObject ? { frames: state.frames } : state.frames;
        const blob = new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'keypoints_corrected.json';
        a.click();
        URL.revokeObjectURL(url);
    });

    // ---------------- helper functions ----------------
    function clonePoints(frame) {
        // Handle both old format (array) and new format (with metadata)
        if (frame && frame.keypoints) {
            return {
                index: frame.index,
                time: frame.time,
                keypoints: JSON.parse(JSON.stringify(frame.keypoints))
            };
        }
        return JSON.parse(JSON.stringify(frame || []));
    }

    function pushHistory(frameIdx) {
        if (!state.frames || !state.frames[frameIdx]) return;
        if (!history[frameIdx]) history[frameIdx] = { undo: [], redo: [] };
        const snap = clonePoints(state.frames[frameIdx]);
        history[frameIdx].undo.push(snap);
        // cap history length
        if (history[frameIdx].undo.length > 50) history[frameIdx].undo.shift();
        // clear redo
        history[frameIdx].redo = [];
    }

    function undo(frameIdx) {
        if (!history[frameIdx] || history[frameIdx].undo.length === 0) return;
        const cur = clonePoints(state.frames[frameIdx]);
        const prev = history[frameIdx].undo.pop();
        history[frameIdx].redo.push(cur);
        state.frames[frameIdx] = prev;
        drawCurrentFrame();
    }

    function redo(frameIdx) {
        if (!history[frameIdx] || history[frameIdx].redo.length === 0) return;
        const cur = clonePoints(state.frames[frameIdx]);
        const next = history[frameIdx].redo.pop();
        history[frameIdx].undo.push(cur);
        state.frames[frameIdx] = next;
        drawCurrentFrame();
    }

    function showTooltip(clientX, clientY, text) {
        if (!tooltipEl) return;
        tooltipEl.style.display = 'block';
        tooltipEl.textContent = text;
        tooltipEl.style.left = (clientX + 12) + 'px';
        tooltipEl.style.top = (clientY + 12) + 'px';
    }
    function hideTooltip() {
        if (!tooltipEl) return;
        tooltipEl.style.display = 'none';
    }

    function trySaveToLocal() {
        try {
            const key = 'vsl_editor_autosave';
            const out = state.sourceWasObject ? { frames: state.frames } : state.frames;
            localStorage.setItem(key, JSON.stringify(out));
        } catch (e) {
            console.warn('Autosave failed', e);
        }
    }

    function loadFromLocalIfAny() {
        try {
            const key = 'vsl_editor_autosave';
            const raw = localStorage.getItem(key);
            if (!raw) return false;
            const data = JSON.parse(raw);
            if (Array.isArray(data)) { state.frames = data; state.sourceWasObject = false; }
            else if (data && Array.isArray(data.frames)) { state.frames = data.frames; state.sourceWasObject = true; }
            else return false;
            state.frameCount = state.frames.length;
            autoDetectFPS();  // Auto-detect FPS from frame metadata
            drawCurrentFrame();
            return true;
        } catch (e) { return false; }
    }

    function triggerDownload() {
        if (!state.frames) return;
        const out = state.sourceWasObject ? { frames: state.frames } : state.frames;
        const blob = new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'keypoints_autosave.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    // Playback control functions (Play + Keypoints synchronized)
    function playVideo() {
        if (!video.src || !state.frames) {
            alert('Vui lòng tải video và keypoints trước.');
            return;
        }
        state.isPlaying = true;
        updatePlaybackUI();

        // Create animation frame loop for synchronized playback
        const animationLoop = () => {
            if (!state.isPlaying) return;

            // Advance video by playback speed
            video.playbackRate = state.playbackSpeed;

            // Draw keypoints at current video time
            drawCurrentFrame();

            // Continue loop if video hasn't ended
            if (video.currentTime < video.duration) {
                requestAnimationFrame(animationLoop);
            } else {
                state.isPlaying = false;
                updatePlaybackUI();
            }
        };

        video.play().catch(e => console.error('Video play failed:', e));
        animationLoop();
    }

    function pauseVideo() {
        state.isPlaying = false;
        video.pause();
        updatePlaybackUI();
        drawCurrentFrame();
    }

    function updatePlaybackUI() {
        const playBtn = document.getElementById('playBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        if (playBtn) playBtn.disabled = state.isPlaying;
        if (pauseBtn) pauseBtn.disabled = !state.isPlaying;
    }

    // Apply zoom/pan transform to both video AND canvas container
    function applyViewTransform() {
        const viewport = document.getElementById('viewport');
        if (!viewport) return;

        // Use CSS transform to zoom video and canvas together
        viewport.style.transform = `scale(${view.scale})`;
        viewport.style.transformOrigin = '0 0';

        // Adjust container size to accommodate zoom
        const scaledWidth = state.videoSize.w * view.scale;
        const scaledHeight = state.videoSize.h * view.scale;
        viewport.style.width = scaledWidth + 'px';
        viewport.style.height = scaledHeight + 'px';
    }

    // UI wiring for undo/redo/zoom/pan/autosave
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');
    const zoomIn = document.getElementById('zoomIn');
    const zoomOut = document.getElementById('zoomOut');
    const resetView = document.getElementById('resetView');
    const autosaveChk = document.getElementById('autosaveChk');
    const autoDownloadChk = document.getElementById('autoDownloadChk');
    const autoExtractChk = document.getElementById('autoExtractChk');
    const mpExtractBtn = document.getElementById('mpExtract');
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const speedInput = document.getElementById('speedInput');
    const speedDisplay = document.getElementById('speedDisplay');

    if (undoBtn) undoBtn.addEventListener('click', () => undo(getCurrentFrameIndex()));
    if (redoBtn) redoBtn.addEventListener('click', () => redo(getCurrentFrameIndex()));

    // zoom range: 0.1x to 20x for detailed keypoint editing
    // NOW: zooms both video AND canvas together
    if (zoomIn) zoomIn.addEventListener('click', () => {
        view.scale = Math.min(20, view.scale * 1.2);
        applyViewTransform();
        drawCurrentFrame();
    });
    if (zoomOut) zoomOut.addEventListener('click', () => {
        view.scale = Math.max(0.1, view.scale / 1.2);
        applyViewTransform();
        drawCurrentFrame();
    });

    // mouse wheel zoom for faster zoom control (video + keypoints together)
    canvas.addEventListener('wheel', (ev) => {
        ev.preventDefault();
        const zoomFactor = ev.deltaY < 0 ? 1.1 : 0.91; // scroll up = zoom in, down = zoom out
        view.scale = Math.max(0.1, Math.min(20, view.scale * zoomFactor));
        applyViewTransform();
        drawCurrentFrame();
    });

    // Play/Pause buttons - synchronized playback with keypoints
    if (playBtn) playBtn.addEventListener('click', playVideo);
    if (pauseBtn) pauseBtn.addEventListener('click', pauseVideo);

    // Speed control slider
    if (speedInput) {
        speedInput.addEventListener('input', (e) => {
            state.playbackSpeed = parseFloat(e.target.value);
            if (speedDisplay) {
                speedDisplay.textContent = state.playbackSpeed.toFixed(2) + 'x';
            }
            video.playbackRate = state.playbackSpeed;
        });
    }

    // wire filter checkboxes for showing/hiding keypoint types
    const showPoseChk = document.getElementById('showPose');
    const showLeftHandChk = document.getElementById('showLeftHand');
    const showRightHandChk = document.getElementById('showRightHand');
    const showFaceChk = document.getElementById('showFace');

    if (showPoseChk) showPoseChk.addEventListener('change', (e) => {
        state.visibleTypes.pose = e.target.checked;
        drawCurrentFrame();
    });
    if (showLeftHandChk) showLeftHandChk.addEventListener('change', (e) => {
        state.visibleTypes.leftHand = e.target.checked;
        drawCurrentFrame();
    });
    if (showRightHandChk) showRightHandChk.addEventListener('change', (e) => {
        state.visibleTypes.rightHand = e.target.checked;
        drawCurrentFrame();
    });
    if (showFaceChk) showFaceChk.addEventListener('change', (e) => {
        state.visibleTypes.face = e.target.checked;
        drawCurrentFrame();
    });

    if (showVideoChk) showVideoChk.addEventListener('change', (e) => {
        state.showOriginalVideo = e.target.checked;
        // Toggle video visibility
        if (video) {
            video.style.display = e.target.checked ? 'block' : 'none';
        }
        // Add/remove class to apply CSS styling
        const viewport = document.getElementById('viewport');
        if (viewport) {
            if (e.target.checked) {
                viewport.classList.remove('video-hidden');
            } else {
                viewport.classList.add('video-hidden');
            }
        }
        drawCurrentFrame();
    });

    if (resetView) resetView.addEventListener('click', () => {
        view.scale = 1;
        view.offsetX = 0;
        view.offsetY = 0;
        applyViewTransform();
        drawCurrentFrame();
    });

    // keyboard shortcuts: Ctrl+Z / Ctrl+Y for undo/redo
    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo(getCurrentFrameIndex()); }
        if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) { e.preventDefault(); redo(getCurrentFrameIndex()); }
    });

    // Try load autosave on start
    loadFromLocalIfAny();

    // MediaPipe extraction button handler
    if (mpExtractBtn) mpExtractBtn.addEventListener('click', async () => {
        if (!video.src) { alert('Vui lòng tải video trước.'); return; }
        if (!window.mediaPipeExtractFrames) { alert('MediaPipe chưa load. Chờ trang tải xong hoặc kiểm tra CDN.'); return; }

        mpExtractBtn.disabled = true;
        mpExtractBtn.textContent = 'Đang trích xuất...';

        // Show progress bar
        if (extractionProgress) {
            extractionProgress.style.display = 'block';
            extractionBar.value = 0;
            extractionStatus.textContent = 'Extraction: 0%';
        }

        try {
            // Progress callback to update UI during extraction
            const progressCallback = (data) => {
                showExtractionProgress(data.current, data.total, data.percent);
            };

            const res = await window.mediaPipeExtractFrames(video, progressCallback);
            if (Array.isArray(res)) {
                state.frames = res;
                state.frameCount = res.length;
                autoDetectFPS();  // Auto-detect FPS from frame metadata
                updateFrameInfo();
                drawCurrentFrame();
                alert(`Trích xuất thành công ${res.length} frame!`);
            } else {
                alert('MediaPipe extraction did not return expected array of frames.');
            }
        } catch (e) {
            alert('Trích xuất lỗi: ' + e.message);
        } finally {
            mpExtractBtn.disabled = false;
            mpExtractBtn.textContent = 'Auto-extract (MediaPipe)';

            // Hide progress bar after 2 seconds
            setTimeout(() => {
                if (extractionProgress) {
                    extractionProgress.style.display = 'none';
                }
            }, 2000);
        }
    });

    // initial small render loop to keep canvas sized while no video loaded
    function tick() {
        if (video && video.videoWidth && (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight)) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
        }
        requestAnimationFrame(tick);
    }
    tick();
})();
