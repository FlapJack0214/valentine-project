document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const loadingScreen = document.getElementById('loading-screen');
    const giftContainer = document.getElementById('gift-container');
    const gameContainer = document.getElementById('game-container');
    const successContainer = document.getElementById('success-container');

    // Interactive Elements
    const giftBox = document.getElementById('gift-box');
    const noBtn = document.getElementById('no-btn');
    const yesBtn = document.getElementById('yes-btn');
    const bgMusic = document.getElementById('bg-music');

    // Asset Preloading (Background)
    const assetsToLoad = [
        'assets/couple-photo.jpg',
        'assets/success-image.jpg'
    ];

    assetsToLoad.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    // 5-Second Loading Timer with Progress Bar
    const progressBar = document.getElementById('progress-bar');
    let progress = 0;
    const duration = 3000; // 3 seconds
    const intervalTime = 50; // Update every 50ms
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    const loadingInterval = setInterval(() => {
        progress += increment;

        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);

            // Transition to Gift
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                giftContainer.classList.remove('hidden');
            }, 500); // Small pause at 100%
        }

        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }, intervalTime);

    // Gift Box Interaction
    giftBox.addEventListener('click', () => {
        // Start Music
        bgMusic.play().catch(e => console.log("Audio play failed:", e));

        // Switch to Game
        giftContainer.classList.add('hidden');
        gameContainer.classList.remove('hidden');
    });

    // --- Legacy Logic (No Changed) ---

    // Function to move the 'No' button
    const moveNoBtn = () => {
        // Percentage-Based Positioning (Device Agnostic)
        // We use a safe range of 10% to 90% for the CENTER of the button
        // This generally ensures the button stays on screen regardless of exact pixel size
        const min = 15; // 15%
        const max = 85; // 85%

        const randomX = Math.floor(Math.random() * (max - min)) + min;
        const randomY = Math.floor(Math.random() * (max - min)) + min;

        // Random rotation
        const randomRotate = (Math.random() * 40) - 20; // -20 to +20 deg

        // Apply new position
        noBtn.style.position = 'fixed';
        noBtn.style.width = 'auto';
        // Use percentages for position
        noBtn.style.left = `${randomX}%`;
        noBtn.style.top = `${randomY}%`;
        // Translate -50%, -50% ensures the anchor point is the CENTER of the button
        // This matches our safe zone logic (keeping the center away from edges)
        noBtn.style.transform = `translate(-50%, -50%) rotate(${randomRotate}deg)`;

        // Bonus: Grow 'Yes' button
        // "I would like the Yes button to grow until it reaches all the screen size"
        const currentScale = parseFloat(yesBtn.getAttribute('data-scale')) || 1;

        // Remove capping (< 3) to allow infinite growth
        // Increase growth rate slightly (1.15 -> 1.2) for faster effect
        const newScale = currentScale * 1.2;

        yesBtn.setAttribute('data-scale', newScale);
        yesBtn.style.transform = `scale(${newScale})`;

        // Make sure it stays on top as it grows
        yesBtn.style.zIndex = '1000';

        // "The no button should be above the yes button"
        // Ensure No button is always on top of the growing Yes button
        noBtn.style.zIndex = '2000';

        // Unlock Logic: If giant, unlock
        if (newScale > 10) { // Approx huge size
            yesBtn.classList.remove('locked');
            const lockIcon = document.getElementById('lock-icon');
            if (lockIcon) lockIcon.style.display = 'none';
            yesBtn.innerHTML = 'YES!!'; // Update content and clear icon
        }
    };

    // Desktop Interaction: Hover close
    noBtn.addEventListener('mouseover', moveNoBtn);

    // Mobile Interaction: Touch start
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevent click
        moveNoBtn();
    });

    // Modal Elements
    const modalOverlay = document.getElementById('modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalButtons = document.getElementById('modal-buttons');

    // Helper to show custom modal
    function showCustomModal(title, message, buttons) {
        modalTitle.innerText = title;
        modalMessage.innerText = message;
        modalButtons.innerHTML = ''; // Clear old buttons

        buttons.forEach(btnConfig => {
            const btn = document.createElement('button');
            btn.innerText = btnConfig.text;
            btn.className = `btn modal-btn ${btnConfig.class || 'yes-btn'}`;
            btn.onclick = () => {
                modalOverlay.classList.add('hidden');
                if (btnConfig.onClick) btnConfig.onClick();
            };
            modalButtons.appendChild(btn);
        });

        modalOverlay.classList.remove('hidden');
    }

    // Handle 'Yes' Click
    yesBtn.addEventListener('click', () => {
        // Check if locked
        if (yesBtn.classList.contains('locked')) {
            return;
        }

        const suspenseContainer = document.getElementById('suspense-container');
        const questionContainer = document.getElementById('question-container');

        // Step 1: Hide game, show suspense (3s)
        gameContainer.classList.add('hidden');
        if (suspenseContainer) {
            suspenseContainer.classList.remove('hidden');

            setTimeout(() => {
                // Step 2: Hide suspense, show comedic question
                suspenseContainer.classList.add('hidden');
                if (questionContainer) {
                    questionContainer.classList.remove('hidden');

                    // Interaction: "Are you sure?" screen buttons
                    const qYes = document.getElementById('question-yes-btn');
                    const qNo = document.getElementById('question-no-btn');

                    qNo.onclick = () => {
                        showCustomModal("Error ⚠️", "Error: I love you ❤️. Please be my Valentine 🥺", [
                            {
                                text: "Okay 🥺",
                                onClick: () => {
                                    // Unlock Question Yes Button
                                    qYes.classList.remove('locked');
                                    const qLock = qYes.querySelector('.lock-icon-small');
                                    if (qLock) qLock.style.display = 'none';

                                    // Change Frame Color
                                    const photoFrame = questionContainer.querySelector('.photo-frame');
                                    if (photoFrame) photoFrame.classList.add('frame-pink');
                                }
                            }
                        ]);
                    };

                    qYes.onclick = () => {
                        if (qYes.classList.contains('locked')) return;
                        showCustomModal("Warning! 📃", "Are you aware that by accepting you sign a compromise term with me that last for 90 years?", [
                            {
                                text: "Yes, I agree",
                                onClick: () => {
                                    questionContainer.classList.add('hidden');
                                    // Move to Video Screen instead of Success
                                    const videoContainer = document.getElementById('video-container');
                                    const coupleVideo = document.getElementById('couple-video');
                                    if (videoContainer) {
                                        videoContainer.classList.remove('hidden');
                                        if (coupleVideo) coupleVideo.play();

                                        // Setup Video Screen Interactions
                                        const vYes = document.getElementById('video-yes-btn');
                                        const vNo = document.getElementById('video-no-btn');
                                        const videoFrame = videoContainer.querySelector('.video-frame');

                                        vNo.onclick = () => {
                                            showCustomModal("Warning!", "Sorry, it's part of the package 😅", [
                                                {
                                                    text: "Ok then 😮‍💨",
                                                    onClick: () => {
                                                        // Unlock Yes Button
                                                        vYes.classList.remove('locked');
                                                        const vLock = document.getElementById('video-lock-icon');
                                                        if (vLock) vLock.style.display = 'none';

                                                        // Change Video Frame Color
                                                        if (videoFrame) videoFrame.classList.add('frame-pink');
                                                    }
                                                }
                                            ]);
                                        };

                                        vYes.onclick = () => {
                                            if (vYes.classList.contains('locked')) return;
                                            videoContainer.classList.add('hidden');
                                            successContainer.classList.remove('hidden');
                                            startConfetti();
                                        };
                                    } else {
                                        successContainer.classList.remove('hidden');
                                        startConfetti();
                                    }
                                }
                            },
                            {
                                text: "No, wait",
                                onClick: () => {
                                    showCustomModal("Wait... 🥺", "Don't you love me? 🥺", [
                                        {
                                            text: "I do! ❤️",
                                            onClick: () => {
                                                questionContainer.classList.add('hidden');
                                                // Move to Video Screen instead of Success
                                                const videoContainer = document.getElementById('video-container');
                                                const coupleVideo = document.getElementById('couple-video');
                                                if (videoContainer) {
                                                    videoContainer.classList.remove('hidden');
                                                    if (coupleVideo) coupleVideo.play();

                                                    // Setup Video Screen Interactions
                                                    // (Same logic as above, ideally would be a shared function but keeping simple for now)
                                                    const vYes = document.getElementById('video-yes-btn');
                                                    const vNo = document.getElementById('video-no-btn');
                                                    const videoFrame = videoContainer.querySelector('.video-frame');

                                                    vNo.onclick = () => {
                                                        showCustomModal("Warning!", "Sorry, it's part of the package 😅", [
                                                            {
                                                                text: "Ok then 😮‍💨",
                                                                onClick: () => {
                                                                    vYes.classList.remove('locked');
                                                                    const vLock = document.getElementById('video-lock-icon');
                                                                    if (vLock) vLock.style.display = 'none';

                                                                    // Change Video Frame Color
                                                                    if (videoFrame) videoFrame.classList.add('frame-pink');
                                                                }
                                                            }
                                                        ]);
                                                    };

                                                    vYes.onclick = () => {
                                                        if (vYes.classList.contains('locked')) return;
                                                        videoContainer.classList.add('hidden');
                                                        successContainer.classList.remove('hidden');
                                                        startConfetti();
                                                    };
                                                } else {
                                                    successContainer.classList.remove('hidden');
                                                    startConfetti();
                                                }
                                            }
                                        }
                                    ]);
                                }
                            }
                        ]);
                    };
                } else {
                    successContainer.classList.remove('hidden');
                    startConfetti();
                }
            }, 3000);
        } else {
            successContainer.classList.remove('hidden');
            startConfetti();
        }
    });
});

// Simple Confetti Implementation
function startConfetti() {
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#ff4d6d', '#ffccd5', '#ffffff', '#ffb3c1'];

    for (let i = 0; i < 200; i++) {
        pieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height, // Start above screen
            w: Math.random() * 10 + 5,
            h: Math.random() * 10 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: Math.random() * 3 + 2,
            angle: Math.random() * Math.PI * 2,
            spin: Math.random() * 0.2 - 0.1
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        pieces.forEach(p => {
            p.y += p.speed;
            p.angle += p.spin;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();

            // Reset if falls off screen
            if (p.y > canvas.height) {
                p.y = -20;
                p.x = Math.random() * canvas.width;
            }
        });

        requestAnimationFrame(animate);
    }

    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}
