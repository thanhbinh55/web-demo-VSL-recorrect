/**
 * MediaPipe Holistic Keypoint Extractor
 * Extracts full-body keypoints: pose (33) + leftHand (21) + rightHand (21) + face (468) = 543 total
 * Provides window.mediaPipeExtractFrames(video) to extract all keypoints from video
 * Returns array of frames, each frame has 543 keypoints [x,y,z,type] normalized to [0,1]
 */

window.mediaPipeExtractFrames = async (videoElement, progressCallback) => {
    console.log('Starting MediaPipe Holistic extraction (body + hands + face = 543 points)...');
    console.log('Video element:', videoElement);
    console.log('Video readyState:', videoElement.readyState);
    console.log('Video src:', videoElement.src);

    // Wait for MediaPipe Holistic module to load
    if (!window.Holistic) {
        console.error('MediaPipe Holistic not loaded. Waiting...');
        // Give CDN time to load
        await new Promise(r => setTimeout(r, 3000));
        if (!window.Holistic) {
            throw new Error('MediaPipe Holistic not loaded after waiting. Check CDN script tags in HTML.');
        }
    }

    console.log('MediaPipe Holistic found:', typeof window.Holistic);

    const holistic = new Holistic({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
        }
    });

    holistic.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    const frames = [];
    let frameCount = 0;
    const fps = 25;  // Standard FPS for extraction

    // Create a temporary canvas to draw video frames
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    // Helper: get video frame count
    const getApproxFrameCount = () => {
        if (!videoElement.duration) return 0;
        return Math.ceil(videoElement.duration * fps);
    };

    // Combine all landmarks: pose (33) + leftHand (21) + rightHand (21) + face (468)
    // Also track frame metadata (time, index) for synchronization
    let currentFrameTime = 0;  // Track current frame time

    const onResults = (results) => {
        let keypoints = [];

        // Pose body (33 points: 0-32)
        if (results.poseLandmarks && results.poseLandmarks.length > 0) {
            keypoints.push(...results.poseLandmarks.map(lm => ({
                x: lm.x,
                y: lm.y,
                z: lm.z || 0,
                type: 'pose',
                visibility: lm.visibility || 1
            })));
        } else {
            keypoints.push(...Array(33).fill(null).map(() => ({
                x: 0, y: 0, z: 0, type: 'pose', visibility: 0
            })));
        }

        // Left hand (21 points: 33-53)
        if (results.leftHandLandmarks && results.leftHandLandmarks.length > 0) {
            keypoints.push(...results.leftHandLandmarks.map(lm => ({
                x: lm.x,
                y: lm.y,
                z: lm.z || 0,
                type: 'leftHand',
                visibility: lm.visibility || 1
            })));
        } else {
            keypoints.push(...Array(21).fill(null).map(() => ({
                x: 0, y: 0, z: 0, type: 'leftHand', visibility: 0
            })));
        }

        // Right hand (21 points: 54-74)
        if (results.rightHandLandmarks && results.rightHandLandmarks.length > 0) {
            keypoints.push(...results.rightHandLandmarks.map(lm => ({
                x: lm.x,
                y: lm.y,
                z: lm.z || 0,
                type: 'rightHand',
                visibility: lm.visibility || 1
            })));
        } else {
            keypoints.push(...Array(21).fill(null).map(() => ({
                x: 0, y: 0, z: 0, type: 'rightHand', visibility: 0
            })));
        }

        // Face (468 points: 75-542)
        if (results.faceLandmarks && results.faceLandmarks.length > 0) {
            keypoints.push(...results.faceLandmarks.map(lm => ({
                x: lm.x,
                y: lm.y,
                z: lm.z || 0,
                type: 'face',
                visibility: lm.visibility || 1
            })));
        } else {
            keypoints.push(...Array(468).fill(null).map(() => ({
                x: 0, y: 0, z: 0, type: 'face', visibility: 0
            })));
        }

        // Store frame with metadata for synchronization
        frames.push({
            index: frameCount,
            time: currentFrameTime,  // Timestamp in seconds
            keypoints: keypoints
        });
        frameCount++;
    };

    holistic.onResults(onResults);

    // Process video frame-by-frame
    return new Promise((resolve, reject) => {
        const processFrames = async () => {
            const fps = 25;
            const frameDuration = 1 / fps;
            let currentTime = 0;

            // Estimate total frames from video duration
            const totalFrames = getApproxFrameCount();
            console.log(`Video duration: ${videoElement.duration}s`);
            console.log(`Estimated frames to process: ${totalFrames}`);

            // Setup canvas to match video size
            tempCanvas.width = videoElement.videoWidth || 640;
            tempCanvas.height = videoElement.videoHeight || 480;
            console.log(`Canvas size: ${tempCanvas.width}x${tempCanvas.height}`);

            try {
                // Seek and process each frame
                while (currentTime < videoElement.duration) {
                    // Update frame time tracker BEFORE seeking
                    currentFrameTime = currentTime;

                    // Seek to this time
                    videoElement.currentTime = currentTime;

                    // Wait for frame to load
                    await new Promise(resolveFrame => {
                        const checkFrame = () => {
                            try {
                                // Draw current video frame to canvas
                                tempCtx.drawImage(videoElement, 0, 0, tempCanvas.width, tempCanvas.height);

                                // Send to MediaPipe Holistic
                                holistic.send({ image: tempCanvas });

                                // Wait for async processing
                                setTimeout(() => resolveFrame(), 100);
                            } catch (e) {
                                console.error('Error drawing/processing frame:', e);
                                resolveFrame();
                            }
                        };

                        // Try to get frame
                        if (videoElement.readyState >= 2) {
                            checkFrame();
                        } else {
                            // Wait for video to be ready
                            const onCanPlay = () => {
                                videoElement.removeEventListener('canplay', onCanPlay);
                                checkFrame();
                            };
                            videoElement.addEventListener('canplay', onCanPlay, { once: true });

                            // Set a timeout in case canplay never fires
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
                    });

                    currentTime += frameDuration;

                    // Progress indication
                    if (frameCount % Math.max(1, Math.floor(totalFrames / 10)) === 0) {
                        const percent = Math.round(frameCount * 100 / totalFrames);
                        console.log(`Processing: ${frameCount} / ${totalFrames} frames (${percent}%)`);
                        // Call progress callback if provided
                        if (progressCallback && typeof progressCallback === 'function') {
                            progressCallback({ current: frameCount, total: totalFrames, percent });
                        }
                    }
                }

                // Close holistic instance
                await holistic.close();

                console.log(`Extraction complete: ${frameCount} frames with 543 keypoints per frame (expected)`);
                resolve(frames);

            } catch (error) {
                console.error('MediaPipe Holistic extraction error:', error);
                reject(error);
            }
        };

        // Start async processing
        processFrames().catch(reject);
    });
};

console.log('MediaPipe Holistic Extractor module loaded (body + hands + face). window.mediaPipeExtractFrames ready.');
