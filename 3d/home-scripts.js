// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    // Header and footer functionality now in external file
    // Mobile menu initialization
    // Promo banner initialization
    initScrollReveal();
    init3DCard();
    initProductModel();
    initGalleryCarousel();
    initContactForm();
});

// Scroll reveal animations - Cách tiếp cận mới, chỉ kích hoạt animation một lần duy nhất
function initScrollReveal() {
    // Lưu trữ các phần tử đã được animate
    const animatedElements = new Set();

    // Thiết lập observer để thêm hiệu ứng khi cuộn
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Chỉ animate khi phần tử đang đi vào viewport và chưa từng được animate
            if (entry.isIntersecting && !animatedElements.has(entry.target)) {
                // Thêm hiệu ứng nhẹ nhàng chỉ một lần
                entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';

                // Thêm phần tử vào danh sách đã animate
                animatedElements.add(entry.target);

                // Ngắt theo dõi phần tử này sau khi đã animate
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    // Gắn observer cho các phần tử cần hiệu ứng
    document.querySelectorAll('.feature-card').forEach((card, index) => {
        // Thiết lập độ trễ khác nhau cho mỗi card
        card.style.animationDelay = `${index * 100}ms`;
        observer.observe(card);
    });

    document.querySelectorAll('.testimonial-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 100}ms`;
        observer.observe(card);
    });

    ['#video .video-container', '#cta h2', '#cta a', '#contact form'].forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            observer.observe(element);
        }
    });
}

// 3D Hero Card Animation
function init3DCard() {
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.warn('Three.js not loaded');
        return;
    }

    const container = document.getElementById('card-container');
    if (!container) return;

    let scene, camera, renderer, card, controls;
    let width = container.clientWidth;
    let height = container.clientHeight;

    // Initialize the scene
    function init() {
        // Create scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xFFFBF2);

        // Create camera
        camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.z = 5;

        // Create renderer
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        // Create card geometry
        const cardGeometry = new THREE.BoxGeometry(3, 4, 0.1);

        // Create card materials
        const frontTexture = new THREE.TextureLoader().load('https://placehold.co/500x700');

        const materials = [
            new THREE.MeshStandardMaterial({ color: 0xF5F5F5 }), // Right side
            new THREE.MeshStandardMaterial({ color: 0xF5F5F5 }), // Left side
            new THREE.MeshStandardMaterial({ color: 0xF5F5F5 }), // Top side
            new THREE.MeshStandardMaterial({ color: 0xF5F5F5 }), // Bottom side
            new THREE.MeshStandardMaterial({ map: frontTexture }), // Front side
            new THREE.MeshStandardMaterial({ color: 0xFFFAFA })  // Back side
        ];

        // Create card mesh
        card = new THREE.Mesh(cardGeometry, materials);
        scene.add(card);

        // Set up orbital controls
        if (typeof THREE.OrbitControls !== 'undefined') {
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.rotateSpeed = 0.5;
            controls.enableZoom = false;
            controls.maxPolarAngle = Math.PI / 2;
            controls.minPolarAngle = Math.PI / 3;
        } else {
            console.warn('OrbitControls not loaded, using manual rotation');
            // Add mouse move event for manual rotation
            container.addEventListener('mousemove', onMouseMove);
        }

        // Add window resize event
        window.addEventListener('resize', onWindowResize);

        // Start animation loop
        animate();
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        if (controls) {
            controls.update();
        } else {
            // Fallback subtle rotation
            card.rotation.y += 0.005;
        }

        renderer.render(scene, camera);
    }

    // Mouse move event handler
    function onMouseMove(event) {
        const rect = container.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / width) * 2 - 1;
        const y = -((event.clientY - rect.top) / height) * 2 + 1;

        card.rotation.y = x * 0.5;
        card.rotation.x = y * 0.3;
    }

    // Window resize event handler
    function onWindowResize() {
        width = container.clientWidth;
        height = container.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    // Initialize the 3D card
    init();
}

// Product Model 3D Animation
function initProductModel() {
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.warn('Three.js not loaded');
        return;
    }

    const container = document.getElementById('product-model-container');
    if (!container) return;

    let scene, camera, renderer, cardGroup, controls;
    let width = container.clientWidth;
    let height = container.clientHeight;
    let isCardOpen = false;

    // Initialize the scene
    function init() {
        // Create scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xFFFDF9);

        // Create camera
        camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.z = 5;

        // Create renderer
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        // Create card group
        cardGroup = new THREE.Group();
        scene.add(cardGroup);

        // Create front cover
        const frontGeometry = new THREE.BoxGeometry(3, 4, 0.05);
        const frontTexture = new THREE.TextureLoader().load('h?text=Front+Cover');
        const frontMaterial = new THREE.MeshStandardMaterial({ map: frontTexture });
        const frontCard = new THREE.Mesh(frontGeometry, frontMaterial);
        frontCard.position.set(0, 0, 0.025);
        cardGroup.add(frontCard);

        // Create inside page
        const insideGeometry = new THREE.BoxGeometry(3, 4, 0.05);
        const insideTexture = new THREE.TextureLoader().load('https://placehold.co/500x700');
        const insideMaterial = new THREE.MeshStandardMaterial({ map: insideTexture });
        const insideCard = new THREE.Mesh(insideGeometry, insideMaterial);
        insideCard.position.set(-1.5, 0, 0);
        insideCard.rotation.y = Math.PI / 2;
        cardGroup.add(insideCard);

        // Create NFC chip
        const chipGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 32);
        const chipMaterial = new THREE.MeshStandardMaterial({
            color: 0x000000,
            emissive: 0x2222ff,
            emissiveIntensity: 0.2
        });
        const nfcChip = new THREE.Mesh(chipGeometry, chipMaterial);
        nfcChip.rotation.x = Math.PI / 2;
        nfcChip.position.set(-0.5, 0, 0.025);
        nfcChip.visible = false;
        cardGroup.add(nfcChip);

        // Set up orbital controls
        if (typeof THREE.OrbitControls !== 'undefined') {
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.rotateSpeed = 0.5;
            controls.enableZoom = false;
            controls.maxPolarAngle = Math.PI / 1.5;
            controls.minPolarAngle = Math.PI / 3;
        } else {
            console.warn('OrbitControls not loaded, using manual rotation');
        }

        // Add event listeners
        container.addEventListener('mousemove', onMouseMove);
        container.addEventListener('click', toggleCardOpen);
        window.addEventListener('resize', onWindowResize);

        // Start animation loop
        animate();
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Update controls if available
        if (controls) {
            controls.update();
        }

        renderer.render(scene, camera);
    }

    // Toggle card open/closed
    function toggleCardOpen() {
        isCardOpen = !isCardOpen;

        // Get the NFC chip
        const nfcChip = cardGroup.children[2];

        // Animate the card opening/closing
        const targetRotation = isCardOpen ? -Math.PI / 2 : 0;
        const targetPosition = isCardOpen ? -1.5 : 0;

        animateCard(targetRotation, targetPosition);

        // Show/hide NFC chip
        nfcChip.visible = isCardOpen;
    }

    // Animate card opening/closing
    function animateCard(targetRotation, targetPosition) {
        const duration = 1000; // Animation duration in ms
        const startTime = Date.now();
        const startRotation = cardGroup.rotation.y;
        const startPosition = cardGroup.position.x;

        function updateAnimation() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Use easing function for smoother animation
            const easedProgress = progress * (2 - progress);

            // Interpolate rotation and position
            cardGroup.rotation.y = startRotation + (targetRotation - startRotation) * easedProgress;
            cardGroup.position.x = startPosition + (targetPosition - startPosition) * easedProgress;

            if (progress < 1) {
                requestAnimationFrame(updateAnimation);
            }
        }

        updateAnimation();
    }

    // Mouse move event handler
    function onMouseMove(event) {
        if (!controls) {
            const rect = container.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / width) * 2 - 1;
            const y = -((event.clientY - rect.top) / height) * 2 + 1;

            cardGroup.rotation.y = x * 0.3 + (isCardOpen ? -Math.PI / 2 : 0);
            cardGroup.rotation.x = y * 0.2;
        }
    }

    // Window resize event handler
    function onWindowResize() {
        width = container.clientWidth;
        height = container.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    // Initialize the 3D model
    init();
}

// Gallery Carousel 3D
function initGalleryCarousel() {
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.warn('Three.js not loaded');
        return;
    }

    const container = document.getElementById('carousel-container');
    if (!container) return;

    let scene, camera, renderer, carousel, controls;
    let width = container.clientWidth;
    let height = container.clientHeight;
    let targetRotationY = 0;
    let currentRotationY = 0;

    // Gallery card data
    const galleryItems = [
                    { name: 'Classic Elegance', color: '#FFCDD2', img: 'https://placehold.co/500x700' },
            { name: 'Modern Romance', color: '#F8BBD0', img: 'https://placehold.co/500x700' },
            { name: 'Rustic Charm', color: '#E1BEE7', img: 'https://placehold.co/500x700' },
            { name: 'Minimalist', color: '#D1C4E9', img: 'https://placehold.co/500x700' },
            { name: 'Vintage Love', color: '#C5CAE9', img: 'https://placehold.co/500x700' },
            { name: 'Garden Wedding', color: '#BBDEFB', img: 'https://placehold.co/500x700' }
    ];

    // Initialize the carousel
    function init() {
        // Create scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xFFF8F5);

        // Create camera
        camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
        camera.position.z = 15;
        camera.position.y = 0;  // Đặt camera ở vị trí ngang tầm với thiệp

        // Create renderer
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);  // Tăng độ sáng môi trường
        scene.add(ambientLight);

        // Thêm điểm sáng trước mặt để soi sáng mặt thiệp
        const frontLight = new THREE.DirectionalLight(0xffffff, 0.8);
        frontLight.position.set(0, 0, 10);
        scene.add(frontLight);

        // Thêm ánh sáng từ trên xuống
        const spotLight = new THREE.SpotLight(0xffffff, 0.5);
        spotLight.position.set(0, 10, 0);
        spotLight.castShadow = true;
        scene.add(spotLight);

        // Create carousel group
        carousel = new THREE.Group();
        scene.add(carousel);

        // Create cards
        const radius = 7; // Radius of the carousel circle
        const numCards = galleryItems.length;
        const angleStep = (2 * Math.PI) / numCards;

        galleryItems.forEach((item, i) => {
            const cardGeometry = new THREE.BoxGeometry(3, 4, 0.1);

            // Create card texture from image
            const texture = new THREE.TextureLoader().load(item.img);

            const materials = [
                new THREE.MeshStandardMaterial({ color: item.color }), // Right side
                new THREE.MeshStandardMaterial({ color: item.color }), // Left side
                new THREE.MeshStandardMaterial({ color: item.color }), // Top side
                new THREE.MeshStandardMaterial({ color: item.color }), // Bottom side
                new THREE.MeshStandardMaterial({ map: texture }), // Front side
                new THREE.MeshStandardMaterial({ color: item.color })  // Back side
            ];

            const card = new THREE.Mesh(cardGeometry, materials);

            // Position in a circle
            const angle = i * angleStep;
            card.position.x = radius * Math.sin(angle);
            card.position.z = radius * Math.cos(angle);

            // Make cards always face the camera (not the center)
            card.rotation.y = Math.PI - angle;

            carousel.add(card);
        });

        // Set up orbital controls
        if (typeof THREE.OrbitControls !== 'undefined') {
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.enableZoom = false;
            controls.enablePan = false;
            controls.minPolarAngle = Math.PI / 3;
            controls.maxPolarAngle = Math.PI / 2;
        }

        // Set up navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                targetRotationY += 2 * Math.PI / numCards;
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                targetRotationY -= 2 * Math.PI / numCards;
            });
        }

        // Add window resize event
        window.addEventListener('resize', onWindowResize);

        // Start animation loop
        animate();
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Smoothly animate to target rotation
        currentRotationY += (targetRotationY - currentRotationY) * 0.05;
        carousel.rotation.y = currentRotationY;

        // Auto-rotate slightly
        if (Math.abs(targetRotationY - currentRotationY) < 0.001) {
            targetRotationY += 0.0005;
        }

        // Make sure cards always face the camera
        carousel.children.forEach((card, i) => {
            // Lấy vị trí toàn cục của card
            const worldPos = new THREE.Vector3();
            card.getWorldPosition(worldPos);

            // Tính vector chỉ phương từ tâm carousel (0,0,0) đến vị trí card
            const direction = worldPos.clone().normalize();

            // Định hướng card sao cho trục negative Z chỉ về phía ngoài (theo hướng của 'direction')
            card.lookAt(worldPos.clone().add(direction));

            // Xoay thêm 180 độ quanh trục Y để chuyển mặt chứa texture (positive Z) về phía ngoài
            card.rotateY(Math.PI * 2);
        });

        if (controls) {
            controls.update();
        }

        renderer.render(scene, camera);
    }

    // Window resize event handler
    function onWindowResize() {
        width = container.clientWidth;
        height = container.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    // Initialize the carousel
    init();
}

// Handle contact form submission
function initContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            // Normally you would send this data to a server
            console.log('Form submission:', formData);

            // Show success message
            alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.');

            // Reset form
            contactForm.reset();
        });
    }
}

// Ensure that elements are visible on initial load if needed
window.addEventListener('load', function() {
    // Show testimonials immediately if user scrolled to them already
    const testimonials = document.querySelectorAll('.testimonial-card');
    if (testimonials.length > 0) {
        const rect = testimonials[0].getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            testimonials.forEach(card => {
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
            });
        }
    }

    // Manually trigger a scroll event to help initialize IntersectionObserver
    window.dispatchEvent(new Event('scroll'));
});