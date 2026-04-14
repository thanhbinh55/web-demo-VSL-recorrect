/**
 * MediaPipe Hands Keypoint Extractor
 * Provides window.mediaPipeExtractFrames(video) to extract hand keypoints from video
 * Returns array of frames, each frame has 21 keypoints [x,y,z] normalized to [0,1]
 */

window.mediaPipeExtractFrames = async (videoElement) => {
    console.log('Starting MediaPipe hand extraction...');

    // Wait for MediaPipe Hands module to load
    if (!window.Hands) {
        throw new Error('MediaPipe Hands not loaded. Check CDN script tags in HTML.');
    }

    const hands = new Hands({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }
    });

    hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    const frames = [];
    let frameCount = 0;
    let isProcessing = false;
    let errorOccurred = false;

    // Create a temporary canvas to draw video frames
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    // Helper: get video frame count (approximate via duration and frame rate)
    const getApproxFrameCount = () => {
        if (!videoElement.duration) return 0;
        const fps = 25; // default fps; could be made configurable
        return Math.ceil(videoElement.duration * fps);
    };

    // Callback when hands are detected
    const onResults = (results) => {
        let keypoints = [];
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            // Extract landmarks from first detected hand
            const landmarks = results.multiHandLandmarks[0];
            keypoints = landmarks.map(lm => ({
                x: lm.x,
                y: lm.y,
                z: lm.z || 0
            }));
        } else {
            // No hand detected in this frame; use zero keypoints
            keypoints = Array(21).fill(null).map(() => ({ x: 0, y: 0, z: 0 }));
        }
        frames.push(keypoints);
        frameCount++;
    };

    hands.onResults(onResults);

    // Process video frame-by-frame
    return new Promise((resolve, reject) => {
        const processFrames = async () => {
            const fps = 25;
            const frameDuration = 1 / fps;
            let currentTime = 0;

            // Estimate total frames from video duration
            const totalFrames = getApproxFrameCount();
            console.log(`Estimated frames to process: ${totalFrames}`);

            // Setup canvas to match video size
            tempCanvas.width = videoElement.videoWidth || 640;
            tempCanvas.height = videoElement.videoHeight || 480;

            try {
                // Seek and process each frame
                while (currentTime < videoElement.duration) {
                    // Seek to this time
                    videoElement.currentTime = currentTime;

                    // Wait for frame to load
                    await new Promise(resolveFrame => {
                        const checkFrame = () => {
                            // Draw current video frame to canvas
                            tempCtx.drawImage(videoElement, 0, 0, tempCanvas.width, tempCanvas.height);

                            // Send to MediaPipe
                            hands.send({ image: tempCanvas });

                            // Wait a bit for async processing
                            setTimeout(() => resolveFrame(), 50);
                        };

                        if (videoElement.readyState >= 2) {
                            checkFrame();
                        } else {
                            videoElement.addEventListener('canplay', checkFrame, { once: true });
                        }
                    });

                    currentTime += frameDuration;

                    // Progress indication (every 10%)
                    if (frameCount % Math.max(1, Math.floor(totalFrames / 10)) === 0) {
                        console.log(`Processing: ${frameCount} / ${totalFrames} frames`);
                    }
                }

                // Close hands instance
                await hands.close();

                console.log(`Extraction complete: ${frameCount} frames`);
                resolve(frames);

            } catch (error) {
                console.error('MediaPipe extraction error:', error);
                errorOccurred = true;
                reject(error);
            }
        };

        // Start async processing
        processFrames().catch(reject);
    });
};

// Additional utility: batch extract with progress callback (optional)
window.mediaPipeExtractFramesWithProgress = async (videoElement, onProgress) => {
    // Same as above but calls onProgress(current, total) callback
    // For now, just wrap the base function
    return window.mediaPipeExtractFrames(videoElement);
};

console.log('MediaPipe Extractor module loaded. window.mediaPipeExtractFrames ready.');
