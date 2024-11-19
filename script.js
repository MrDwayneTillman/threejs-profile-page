// Step 1: Setting Up the Scene, Camera, and Renderer
const scene = new THREE.Scene();

// Load the background texture
const loader = new THREE.TextureLoader();
loader.load('background.jpg', function (texture) {
    scene.background = texture;
});

// PerspectiveCamera(fov, aspect, near, far)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

// WebGLRenderer to draw everything
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Step 2: Creating Four Balls (Profiles), Clumped Together with Different Colors and Materials
const geometry = new THREE.SphereGeometry(1, 32, 32);  // Ball size and detail

// Load the textures for the thumbnails
const thumbnailTexture1 = loader.load('thumbnail.jpg');   // First video thumbnail
const thumbnailTexture2 = loader.load('thumbnail2.gif');  // Second video thumbnail
const thumbnailTexture3 = loader.load('thumbnail3.gif');  // Third video thumbnail
const thumbnailTexture4 = loader.load('thumbnail4.gif');  // Fourth video thumbnail

// Colors for each ball
const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00]; // Red, Green, Blue, Yellow

// Create 4 balls to represent profiles, arranged in a cross-like structure
const balls = [];
const radius = 1.05; // Slightly more than the ball radius to ensure they are touching

const positions = [
    { x: 0, y: radius * 2, z: 0 },  // Top
    { x: -radius * 2, y: 0, z: 0 },  // Left
    { x: radius * 2, y: 0, z: 0 },   // Right
    { x: 0, y: -radius * 2, z: 0 }   // Bottom
];

for (let i = 0; i < 4; i++) {
    // Use the appropriate thumbnail image for the first four balls
    const material = (i === 0) ? new THREE.MeshPhysicalMaterial({
        map: thumbnailTexture1,        // Use the first video thumbnail texture for the first ball
        roughness: 0.2,                // Slightly less shiny to make it more glass-like
        metalness: 0.1,                // Less metallic to give a glassy look
        reflectivity: 0.9,             // Makes it reflective
        clearcoat: 1,                  // Adds a clear reflective layer on top
        clearcoatRoughness: 0.1,       // Smooths out the clear coat
        opacity: 0.6,                  // Make it semi-transparent
        transparent: true              // Enable transparency
    }) : (i === 1) ? new THREE.MeshPhysicalMaterial({
        map: thumbnailTexture2,        // Use the second video thumbnail texture for the second ball
        roughness: 0.2,
        metalness: 0.1,
        reflectivity: 0.9,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        opacity: 0.6,
        transparent: true
    }) : (i === 2) ? new THREE.MeshPhysicalMaterial({
        map: thumbnailTexture3,        // Use the third video thumbnail texture for the third ball
        roughness: 0.2,
        metalness: 0.1,
        reflectivity: 0.9,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        opacity: 0.6,
        transparent: true
    }) : new THREE.MeshPhysicalMaterial({
        map: thumbnailTexture4,        // Use the fourth video thumbnail texture for the fourth ball
        roughness: 0.2,
        metalness: 0.1,
        reflectivity: 0.9,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        opacity: 0.6,
        transparent: true
    });

    const ball = new THREE.Mesh(geometry, material);
    ball.position.set(positions[i].x, positions[i].y, positions[i].z);
    scene.add(ball);
    balls.push(ball);
}

// Step 3: Adding Lighting for the Electrons
const pointLight = new THREE.PointLight(0xffffff, 1, 100); // White light
pointLight.position.set(0, 0, 5);
scene.add(pointLight);

// Adding Ambient Light to make everything look nice and soft
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Step 4: Adding Electrons (Small Spheres) Orbiting the Nucleus
const electronGeometry = new THREE.SphereGeometry(0.2, 16, 16);  // Smaller sphere for electrons

// Colors for each electron
const electronColors = [0xff69b4, 0x00ffff, 0xffa500, 0x8a2be2]; // Pink, Cyan, Orange, BlueViolet

const electrons = [];
for (let i = 0; i < 4; i++) {
    const electronMaterial = new THREE.MeshStandardMaterial({
        color: electronColors[i],      // Assign different color to each electron
        emissive: electronColors[i],   // Make them glow with the same color
        emissiveIntensity: 0.5         // Adjust emissive intensity to make them glow nicely
    });

    const electron = new THREE.Mesh(electronGeometry, electronMaterial);
    scene.add(electron);
    electrons.push(electron);
}

// Step 5: Adding Interaction to Rotate the Scene with Mouse
let isDragging = false;
let previousMousePosition = {
    x: 0,
    y: 0
};

document.addEventListener('mousedown', function (event) {
    isDragging = true;
});

document.addEventListener('mousemove', function (event) {
    if (isDragging) {
        const deltaMove = {
            x: event.clientX - previousMousePosition.x,
            y: event.clientY - previousMousePosition.y
        };

        const deltaRotationQuaternion = new THREE.Quaternion()
            .setFromEuler(new THREE.Euler(
                toRadians(deltaMove.y * 0.5),
                toRadians(deltaMove.x * 0.5),
                0,
                'XYZ'
            ));

        scene.quaternion.multiplyQuaternions(deltaRotationQuaternion, scene.quaternion);
    }

    previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
});

document.addEventListener('mouseup', function () {
    isDragging = false;
});

function toRadians(angle) {
    return angle * (Math.PI / 180);
}

// Step 6: Click Event to Zoom In and Show Video
document.addEventListener('click', function (event) {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(balls);

    if (intersects.length > 0) {
        const targetBall = intersects[0].object;

        let videoUrl = null;

        // Check which ball was clicked and assign the corresponding video URL
        if (targetBall === balls[0]) {
            videoUrl = 'https://www.youtube.com/embed/3I9MpV3nZco?autoplay=1';
        } else if (targetBall === balls[1]) {
            videoUrl = 'https://www.youtube.com/embed/6KN8nZKI1vE?autoplay=1'; // Second video link
        } else if (targetBall === balls[2]) {
            videoUrl = 'https://www.youtube.com/embed/HsHhoJvsJog?autoplay=1'; // Third video link
        } else if (targetBall === balls[3]) {
            videoUrl = 'https://www.youtube.com/embed/9r7R0iLS_9k?autoplay=1'; // Fourth video link
        }

        if (videoUrl) {
            // Use GSAP to zoom into the clicked ball
            gsap.to(camera.position, {
                duration: 2,
                x: targetBall.position.x,
                y: targetBall.position.y,
                z: targetBall.position.z + 2, // Adjusted value to keep the camera slightly back
                onComplete: function () {
                    // Display the video in an iframe overlay
                    const videoContainer = document.createElement('div');
                    videoContainer.id = 'videoContainer';
                    videoContainer.style.position = 'fixed';
                    videoContainer.style.top = '50%';
                    videoContainer.style.left = '50%';
                    videoContainer.style.transform = 'translate(-50%, -50%)';
                    videoContainer.style.background = 'rgba(0, 0, 0, 0.8)';
                    videoContainer.style.padding = '10px';
                    videoContainer.style.zIndex = '1000';

                    const iframe = document.createElement('iframe');
                    iframe.width = '560';
                    iframe.height = '315';
                    iframe.src = videoUrl;
                    iframe.frameBorder = '0';
                    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                    iframe.allowFullscreen = true;

                    const closeButton = document.createElement('button');
                    closeButton.innerText = 'Close';
                    closeButton.style.display = 'block';
                    closeButton.style.margin = '10px auto';
                    closeButton.onclick = function () {
                        document.body.removeChild(videoContainer);
                        // Reset the camera position smoothly after closing the video
                        gsap.to(camera.position, {
                            duration: 2,
                            x: 0,
                            y: 0,
                            z: 10
                        });
                    };

                    videoContainer.appendChild(iframe);
                    videoContainer.appendChild(closeButton);
                    document.body.appendChild(videoContainer);
                }
            });
        }
    }
});

// Render Loop to continuously draw the scene
function animate() {
    requestAnimationFrame(animate);

    // Optional: make the balls rotate slowly to create a nucleus-like effect
    balls.forEach((ball, index) => {
        ball.rotation.y += 0.01 * (index + 1); // Rotate each ball at a slightly different speed
    });

    // Animate electrons to orbit around the nucleus in different planes and directions
    const time = Date.now() * 0.001;  // Using time to create smooth movement
    electrons.forEach((electron, index) => {
        const angle = time * ((index % 2 === 0) ? 1 : -1) + (index * Math.PI / 2);  // Alternate direction for each electron
        const radius = 4.5;  // Distance from the nucleus

        // Different planes for different electrons
        if (index === 0) {
            // Orbit in XY plane
            electron.position.set(
                Math.cos(angle) * radius, // X position
                Math.sin(angle) * radius, // Y position
                0  // Z position fixed
            );
        } else if (index === 1) {
            // Orbit in XZ plane
            electron.position.set(
                Math.cos(angle) * radius, // X position
                0,                        // Y position fixed
                Math.sin(angle) * radius  // Z position
            );
        } else if (index === 2) {
            // Orbit in YZ plane
            electron.position.set(
                0,                        // X position fixed
                Math.cos(angle) * radius, // Y position
                Math.sin(angle) * radius  // Z position
            );
        } else if (index === 3) {
            // Orbit diagonally in 3D space
            electron.position.set(
                Math.cos(angle) * radius * 0.7,  // X position
                Math.sin(angle) * radius * 0.7,  // Y position
                Math.sin(angle) * radius * 0.7   // Z position
            );
        }
    });

    renderer.render(scene, camera);
}

animate();
