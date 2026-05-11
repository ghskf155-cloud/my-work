// Three.js is loaded globally via CDN

// 1. Initialize Lenis for Smooth Scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Integrate Lenis with GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
});
gsap.ticker.lagSmoothing(0);

// 2. Section 1: Horizontal Timeline (Drag to scroll)
const slider = document.getElementById('timeline-wrapper');
let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.style.cursor = 'grabbing';
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
});

slider.addEventListener('mouseleave', () => {
    isDown = false;
    slider.style.cursor = 'grab';
});

slider.addEventListener('mouseup', () => {
    isDown = false;
    slider.style.cursor = 'grab';
});

slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed multiplier
    slider.scrollLeft = scrollLeft - walk;
});

// 3. Section 2: AI Brain (Three.js WebGL Particle System)
const initBrain = () => {
    const container = document.getElementById('brain-canvas-container');
    if(!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Performance optimization
    container.appendChild(renderer.domElement);

    camera.position.z = 8;
    // Shift scene to the left a bit to balance with the UI on the right
    camera.position.x = window.innerWidth > 768 ? -2 : 0; 

    // Create Particles
    const particleCount = 20000;
    const geometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    const targetArray = new Float32Array(particleCount * 3);
    const colorsArray = new Float32Array(particleCount * 3);

    for(let i = 0; i < particleCount * 3; i+=3) {
        // Chaos position (large sphere)
        const rChaos = 15;
        posArray[i] = (Math.random() - 0.5) * rChaos;
        posArray[i+1] = (Math.random() - 0.5) * rChaos;
        posArray[i+2] = (Math.random() - 0.5) * rChaos;

        // Structured position (Head/Brain shape approx)
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const r = 3 + Math.random() * 0.8; // Brain radius

        targetArray[i] = r * Math.sin(phi) * Math.cos(theta);
        targetArray[i+1] = r * Math.sin(phi) * Math.sin(theta);
        targetArray[i+2] = r * Math.cos(phi);

        // Color (Matrix green theme)
        colorsArray[i] = 0.2;     // R
        colorsArray[i+1] = 0.8 + Math.random()*0.2; // G
        colorsArray[i+2] = 0.4;   // B
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    geometry.setAttribute('aTarget', new THREE.BufferAttribute(targetArray, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

    const material = new THREE.PointsMaterial({
        size: 0.03,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    let brainScrollProgress = 0;
    let targetRotation = 0;

    // Mouse drag to morph
    const brainSection = document.getElementById('section-brain');
    let isDraggingBrain = false;
    let startXBrain = 0;
    let lastProgressBrain = 0;

    brainSection.addEventListener('mousedown', (e) => {
        isDraggingBrain = true;
        startXBrain = e.clientX;
        lastProgressBrain = brainScrollProgress;
        brainSection.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
        if(!isDraggingBrain) return;
        const dx = e.clientX - startXBrain;
        // Drag 60% of screen width to go from 0 to 1
        const progressDelta = dx / (window.innerWidth * 0.6); 
        let rawProgress = lastProgressBrain + progressDelta;
        
        // Smoothly ease progress target
        gsap.to(window, {
            duration: 0.5,
            onUpdate: function() {
                brainScrollProgress = Math.max(0, Math.min(1, rawProgress));
            }
        });
    });

    window.addEventListener('mouseup', () => {
        isDraggingBrain = false;
        brainSection.style.cursor = 'ew-resize';
    });

    const posAttr = geometry.attributes.position;
    const targetAttr = geometry.attributes.aTarget;
    const initialPos = new Float32Array(posArray); // Store original chaos
    
    const animate = () => {
        // Slow continuous rotation
        particles.rotation.y += 0.001;
        particles.rotation.x += 0.0005;

        // Morphing logic based on scroll (0 to 1)
        for(let i = 0; i < particleCount * 3; i++) {
            const chaos = initialPos[i];
            const structured = targetAttr.array[i];
            // Interpolate
            posAttr.array[i] = chaos + (structured - chaos) * brainScrollProgress;
        }
        posAttr.needsUpdate = true;

        renderer.render(scene, camera);
    };
    
    // Intersection Observer for performance
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                renderer.setAnimationLoop(animate);
            } else {
                renderer.setAnimationLoop(null);
            }
        });
    });
    observer.observe(document.getElementById('section-brain'));

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.position.x = window.innerWidth > 768 ? -2 : 0; 
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

initBrain();

// 4. Data Stream Simulation
const initDataStream = () => {
    const streamContainer = document.getElementById('data-stream');
    if(!streamContainer) return;

    const logs = [
        "신경망 코어 초기화 ... 성공",
        "모델 가중치 로딩 ... 99%",
        "센서 캘리브레이션 ... 완료",
        "비전 시스템: 객체 인식됨",
        "모션 플래너: 궤적 재계산 중",
        "지연 시간: 4ms [최적 상태]",
        "옵티컬 플로우: 동기화됨",
        "보상 함수: 0.992",
        "액추에이터 온도: 42°C",
        "메모리 할당: 12.4GB",
        "상태 추정: 수렴 완료"
    ];

    setInterval(() => {
        // Only run if visible
        const rect = streamContainer.getBoundingClientRect();
        if(rect.top > window.innerHeight || rect.bottom < 0) return;

        if(streamContainer.children.length > 12) {
            streamContainer.removeChild(streamContainer.firstChild);
        }
        const el = document.createElement('div');
        el.className = 'log-line';
        
        // Random hex hash
        const hash = Math.random().toString(16).substring(2, 8).toUpperCase();
        el.innerText = `[0x${hash}] > ${logs[Math.floor(Math.random() * logs.length)]}`;
        
        streamContainer.appendChild(el);
    }, 400 + Math.random() * 600); // Random interval
};

initDataStream();


// 5. Section 3: Anatomy (Exploded View Fallback using Primitives)
const initAnatomy = () => {
    const container = document.getElementById('anatomy-canvas-container');
    if(!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    camera.position.z = 15;
    camera.position.y = 0;
    if(window.innerWidth > 768) {
        camera.position.x = 4; // Shift right
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    
    const spotLight = new THREE.SpotLight(0xffffff, 100);
    spotLight.position.set(10, 20, 10);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.5;
    scene.add(spotLight);

    const backLight = new THREE.DirectionalLight(0x4a7cde, 2);
    backLight.position.set(-10, 10, -10);
    scene.add(backLight);

    // Create a conceptual "Robot" made of stylized parts
    const robotGroup = new THREE.Group();
    
    // Materials
    const darkMetal = new THREE.MeshStandardMaterial({ 
        color: 0x111111, roughness: 0.2, metalness: 0.9 
    });
    const glowingRed = new THREE.MeshStandardMaterial({ 
        color: 0xff0000, roughness: 0.1, metalness: 0.8, emissive: 0x550000 
    });
    const whitePlastic = new THREE.MeshStandardMaterial({ 
        color: 0xdddddd, roughness: 0.1, metalness: 0.1 
    });

    // Parts
    // 1. Head
    const headGeo = new THREE.BoxGeometry(1.4, 1.6, 1.4);
    const head = new THREE.Mesh(headGeo, whitePlastic);
    head.position.set(0, 4.5, 0);
    robotGroup.add(head);

    // 2. Neck
    const neckGeo = new THREE.CylinderGeometry(0.3, 0.4, 0.8, 16);
    const neck = new THREE.Mesh(neckGeo, darkMetal);
    neck.position.set(0, 3.5, 0);
    robotGroup.add(neck);

    // 3. Chest (Upper Torso)
    const chestGeo = new THREE.BoxGeometry(2.6, 2, 1.4);
    const chest = new THREE.Mesh(chestGeo, whitePlastic);
    chest.position.set(0, 2, 0);
    robotGroup.add(chest);

    // 4. Core Actuator (Glowing red, target for interaction)
    const actuatorGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.2, 32);
    const actuator = new THREE.Mesh(actuatorGeo, glowingRed);
    actuator.rotation.z = Math.PI / 2;
    actuator.position.set(0, 0.5, 0);
    actuator.name = "actuator";
    robotGroup.add(actuator);

    // 5. Pelvis (Lower Torso)
    const pelvisGeo = new THREE.BoxGeometry(2.4, 1.2, 1.4);
    const pelvis = new THREE.Mesh(pelvisGeo, darkMetal);
    pelvis.position.set(0, -1, 0);
    robotGroup.add(pelvis);

    // 6. Left Arm
    const lShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 16), darkMetal);
    lShoulder.position.set(1.6, 2.5, 0);
    robotGroup.add(lShoulder);
    
    const lUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.25, 1.8, 16), whitePlastic);
    lUpperArm.position.set(2.2, 1.5, 0);
    lUpperArm.rotation.z = -Math.PI / 8;
    robotGroup.add(lUpperArm);

    // 7. Right Arm
    const rShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 16), darkMetal);
    rShoulder.position.set(-1.6, 2.5, 0);
    robotGroup.add(rShoulder);

    const rUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.25, 1.8, 16), whitePlastic);
    rUpperArm.position.set(-2.2, 1.5, 0);
    rUpperArm.rotation.z = Math.PI / 8;
    robotGroup.add(rUpperArm);

    // 8. Legs
    const lThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.35, 2.2, 16), whitePlastic);
    lThigh.position.set(0.7, -2.5, 0);
    robotGroup.add(lThigh);

    const rThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.35, 2.2, 16), whitePlastic);
    rThigh.position.set(-0.7, -2.5, 0);
    robotGroup.add(rThigh);

    // 9. Battery Pack (Back)
    const batteryGeo = new THREE.BoxGeometry(2, 3, 0.5);
    const battery = new THREE.Mesh(batteryGeo, darkMetal);
    battery.position.set(0, 1, -1);
    robotGroup.add(battery);

    scene.add(robotGroup);

    // Exploded View Animation Setup
    const anatomyTl = gsap.timeline({ paused: true });

    // Mouse drag to explode
    const anatomySection = document.getElementById('section-anatomy');
    let isDraggingAnatomy = false;
    let startXAnatomy = 0;
    let lastProgressAnatomy = 0;

    anatomySection.addEventListener('mousedown', (e) => {
        isDraggingAnatomy = true;
        startXAnatomy = e.clientX;
        lastProgressAnatomy = anatomyTl.progress();
        anatomySection.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
        if(!isDraggingAnatomy) return;
        const dx = e.clientX - startXAnatomy;
        const progressDelta = dx / (window.innerWidth * 0.6);
        let rawProgress = lastProgressAnatomy + progressDelta;
        let finalProgress = Math.max(0, Math.min(1, rawProgress));
        anatomyTl.progress(finalProgress);
    });

    window.addEventListener('mouseup', () => {
        isDraggingAnatomy = false;
        anatomySection.style.cursor = 'ew-resize';
    });

    // Explode parts
    anatomyTl.to(head.position, { y: 6 }, 0)
             .to(neck.position, { y: 4.5 }, 0)
             .to(chest.position, { z: 2 }, 0)
             .to(actuator.position, { z: 4, scale: 1.5 }, 0)
             .to(pelvis.position, { y: -2.5 }, 0)
             .to(lShoulder.position, { x: 3, y: 3 }, 0)
             .to(rShoulder.position, { x: -3, y: 3 }, 0)
             .to(lUpperArm.position, { x: 4, y: 1 }, 0)
             .to(rUpperArm.position, { x: -4, y: 1 }, 0)
             .to(lThigh.position, { x: 2, y: -4 }, 0)
             .to(rThigh.position, { x: -2, y: -4 }, 0)
             .to(battery.position, { z: -3 }, 0)
             .to(robotGroup.rotation, { y: Math.PI * 2 }, 0); // Rotate to show separation

    // Interaction (Popover)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const popover = document.getElementById('popover-actuator');
    let isHovering = false;

    window.addEventListener('mousemove', (event) => {
        // Only run raycaster if in the section
        const sectionRect = document.getElementById('section-anatomy').getBoundingClientRect();
        if(sectionRect.top > window.innerHeight || sectionRect.bottom < 0) return;

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(actuator);

        if (intersects.length > 0) {
            if(!isHovering) {
                isHovering = true;
                gsap.to(popover, { autoAlpha: 1, duration: 0.3, y: 0 });
                document.body.style.cursor = 'pointer';
                // Highlight actuator
                actuator.material.emissive.setHex(0xff0000);
            }
            // Move popover to mouse position
            gsap.to(popover, { 
                left: event.clientX + 20, 
                top: event.clientY, 
                duration: 0.1, 
                ease: "power1.out" 
            });
        } else {
            if(isHovering) {
                isHovering = false;
                gsap.to(popover, { autoAlpha: 0, duration: 0.3, y: -20 });
                document.body.style.cursor = 'default';
                actuator.material.emissive.setHex(0x550000);
            }
        }
    });

    const animate = () => {
        // Gentle float animation when not exploded
        const time = Date.now() * 0.001;
        robotGroup.position.y = Math.sin(time) * 0.2;
        
        renderer.render(scene, camera);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                renderer.setAnimationLoop(animate);
            } else {
                renderer.setAnimationLoop(null);
            }
        });
    });
    observer.observe(document.getElementById('section-anatomy'));
    
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        if(window.innerWidth > 768) {
            camera.position.x = 4;
        } else {
            camera.position.x = 0;
        }
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

initAnatomy();

// 6. Bento Box Glow Effect (Mouse Follow)
const initBentoGlow = () => {
    const bentoItems = document.querySelectorAll('.bento-item');
    
    bentoItems.forEach(item => {
        const glow = item.querySelector('.glow-effect');
        if(!glow) return;
        
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            // Calculate mouse position relative to the element
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Center the glow circle on the mouse (assuming glow is 500x500 or 400x400)
            const glowWidth = glow.offsetWidth;
            const glowHeight = glow.offsetHeight;
            
            glow.style.transform = `translate(${x - glowWidth/2}px, ${y - glowHeight/2}px)`;
        });
    });
};

initBentoGlow();

// 7. Contact Modal Logic
const initContactModal = () => {
    const btnContact = document.getElementById('btn-contact-sales');
    const modal = document.getElementById('contact-modal');
    const overlay = document.getElementById('contact-modal-overlay');
    const btnClose = document.getElementById('btn-close-modal');
    const modalContent = document.getElementById('contact-modal-content');
    const form = document.getElementById('contact-form');

    if(!modal || !btnContact) return;

    const openModal = () => {
        modal.classList.remove('hidden');
        // trigger reflow
        void modal.offsetWidth;
        modal.classList.remove('opacity-0');
        modalContent.classList.remove('scale-95');
        modalContent.classList.add('scale-100');
        // Stop Lenis scroll when modal is open
        lenis.stop();
    };

    const closeModal = () => {
        modal.classList.add('opacity-0');
        modalContent.classList.remove('scale-100');
        modalContent.classList.add('scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
            lenis.start();
        }, 300);
    };

    btnContact.addEventListener('click', openModal);
    overlay.addEventListener('click', closeModal);
    btnClose.addEventListener('click', closeModal);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('문의가 성공적으로 접수되었습니다. 담당 영업팀에서 기재해주신 이메일로 곧 연락드리겠습니다.');
        form.reset();
        closeModal();
    });
};

initContactModal();

// 8. Gallery Carousel Drag Logic
const initGalleryDrag = () => {
    const gallery = document.getElementById('gallery-carousel');
    if(!gallery) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    gallery.addEventListener('mousedown', (e) => {
        isDown = true;
        gallery.style.cursor = 'grabbing';
        startX = e.pageX - gallery.offsetLeft;
        scrollLeft = gallery.scrollLeft;
        // Temporarily disable snap during drag for smooth feeling
        gallery.classList.remove('snap-x', 'snap-mandatory');
    });

    gallery.addEventListener('mouseleave', () => {
        isDown = false;
        gallery.style.cursor = 'grab';
        gallery.classList.add('snap-x', 'snap-mandatory');
    });

    gallery.addEventListener('mouseup', () => {
        isDown = false;
        gallery.style.cursor = 'grab';
        gallery.classList.add('snap-x', 'snap-mandatory');
    });

    gallery.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - gallery.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed multiplier
        gallery.scrollLeft = scrollLeft - walk;
    });
};

initGalleryDrag();
