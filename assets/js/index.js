// ============================================================
//  3D SCENE — Scroll-based camera flight through space
// ============================================================

const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x0a0a0a, 1);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a0a0a, 0.018);

const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 0, 0);

// Lights
const ambient = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambient);
const dirLight = new THREE.DirectionalLight(0xc8f542, 1.2);
dirLight.position.set(5, 10, 5);
scene.add(dirLight);
const pointLight1 = new THREE.PointLight(0xc8f542, 2, 30);
scene.add(pointLight1);
const pointLight2 = new THREE.PointLight(0x4488ff, 1, 25);
scene.add(pointLight2);

// ── STARFIELD ──
(function buildStars() {
    const count = 2800;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 280;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 160;
        pos[i * 3 + 2] = Math.random() * -200;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.12, transparent: true, opacity: 0.7 });
    scene.add(new THREE.Points(geo, mat));
})();

// ── LIME ACCENT PARTICLES ──
(function buildParticles() {
    const count = 320;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 60;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
        pos[i * 3 + 2] = -Math.random() * 180;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color: 0xc8f542, size: 0.22, transparent: true, opacity: 0.5 });
    scene.add(new THREE.Points(geo, mat));
})();

// ── FLOATING 3D OBJECTS ──
const limeColor = new THREE.Color(0xc8f542);
const blueColor = new THREE.Color(0x4488ff);
const whiteColor = new THREE.Color(0xffffff);

const materials = {
    lime: new THREE.MeshStandardMaterial({ color: limeColor, metalness: 0.3, roughness: 0.4, emissive: limeColor, emissiveIntensity: 0.15 }),
    wireframeLime: new THREE.MeshBasicMaterial({ color: limeColor, wireframe: true, transparent: true, opacity: 0.25 }),
    glass: new THREE.MeshStandardMaterial({ color: 0x0a0a0a, metalness: 0.9, roughness: 0.1, transparent: true, opacity: 0.6 }),
    blue: new THREE.MeshStandardMaterial({ color: blueColor, metalness: 0.5, roughness: 0.3, emissive: blueColor, emissiveIntensity: 0.1 }),
    white: new THREE.MeshStandardMaterial({ color: whiteColor, metalness: 0.2, roughness: 0.6, transparent: true, opacity: 0.15 }),
};

const objects3D = [];

function addObj(mesh, zPos, xOff, yOff, rotSpeed) {
    mesh.position.set(xOff, yOff, zPos);
    scene.add(mesh);
    objects3D.push({ mesh, rotSpeed: rotSpeed || { x: 0.003, y: 0.005, z: 0.002 } });
    return mesh;
}

// HERO ZONE (z = 0 to -10): Large icosahedron
const heroGeo = new THREE.IcosahedronGeometry(3.5, 1);
const heroMesh = addObj(new THREE.Mesh(heroGeo, materials.wireframeLime), -8, 6, 0, { x: 0.001, y: 0.004, z: 0.001 });

// ABOUT ZONE (z = -18 to -28): Torus knot
const torusKnot = addObj(new THREE.Mesh(new THREE.TorusKnotGeometry(2, 0.5, 80, 12), materials.lime), -25, -7, 1, { x: 0.005, y: 0.007, z: 0.002 });

// SKILLS ZONE (z = -35 to -50): Floating cubes cluster
const skillZPos = -42;
const skillOffsets = [
    [-5, 3, 0], [0, 4, -2], [5, 2, 0], [-4, -2, -1],
    [3, -3, 1], [0, -4, 2], [-2, 1, -3], [6, -1, -2]
];
skillOffsets.forEach((off, i) => {
    const size = 0.4 + Math.random() * 0.5;
    const geo = i % 3 === 0 ? new THREE.OctahedronGeometry(size) : i % 3 === 1 ? new THREE.BoxGeometry(size, size, size) : new THREE.TetrahedronGeometry(size);
    const mat = i % 2 === 0 ? materials.lime : materials.wireframeLime;
    addObj(new THREE.Mesh(geo, mat), skillZPos + off[2], off[0], off[1], { x: Math.random() * 0.01, y: Math.random() * 0.012, z: Math.random() * 0.008 });
});

// ACHIEVEMENTS ZONE (z = -55 to -65): Floating planes
const achZPos = -60;
[-4, 0, 4].forEach((x, i) => {
    const geo = new THREE.PlaneGeometry(2.5, 3.5);
    const mat = new THREE.MeshStandardMaterial({ color: 0x0d1a0a, transparent: true, opacity: 0.6, side: THREE.DoubleSide, metalness: 0.5, roughness: 0.2 });
    const mesh = addObj(new THREE.Mesh(geo, mat), achZPos - i * 2, x, 0, { x: 0, y: 0.003, z: 0 });
    // Edge glow via wireframe overlay
    const edge = new THREE.Mesh(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: 0xc8f542, transparent: true, opacity: 0.4 }));
    mesh.add(edge);
});

// PROJECTS ZONE (z = -75 to -90): Holographic rings
const projZPos = -82;
[0, Math.PI / 3, 2 * Math.PI / 3, Math.PI, 4 * Math.PI / 3, 5 * Math.PI / 3].forEach((angle, i) => {
    const r = 5.5;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    const geo = new THREE.TorusGeometry(0.8, 0.04, 8, 40);
    addObj(new THREE.Mesh(geo, materials.wireframeLime), projZPos, x, y, { x: 0.004 + i * 0.001, y: 0.006 + i * 0.001, z: 0.002 });
});
const centralSphere = addObj(new THREE.Mesh(new THREE.SphereGeometry(1.8, 24, 24), materials.glass), projZPos, 0, 0, { x: 0.002, y: 0.003, z: 0.001 });

// CONTACT ZONE (z = -100 to -110): Grid / portal
const contactZPos = -106;
for (let i = -3; i <= 3; i++) {
    const hLine = new THREE.Line(
        (() => { const g = new THREE.BufferGeometry(); g.setFromPoints([new THREE.Vector3(-8, i * 1.2, 0), new THREE.Vector3(8, i * 1.2, 0)]); return g; })(),
        new THREE.LineBasicMaterial({ color: 0xc8f542, transparent: true, opacity: 0.12 })
    );
    hLine.position.z = contactZPos;
    scene.add(hLine);
    const vLine = new THREE.Line(
        (() => { const g = new THREE.BufferGeometry(); g.setFromPoints([new THREE.Vector3(i * 2.2, -5, 0), new THREE.Vector3(i * 2.2, 5, 0)]); return g; })(),
        new THREE.LineBasicMaterial({ color: 0xc8f542, transparent: true, opacity: 0.12 })
    );
    vLine.position.z = contactZPos;
    scene.add(vLine);
}
const portalRing = addObj(new THREE.Mesh(new THREE.TorusGeometry(4, 0.08, 12, 80), materials.lime), contactZPos, 0, 0, { x: 0, y: 0.006, z: 0 });
const portalRing2 = addObj(new THREE.Mesh(new THREE.TorusGeometry(5.5, 0.04, 8, 80), materials.wireframeLime), contactZPos, 0, 0, { x: 0, y: -0.004, z: 0 });

// ── SCROLL & SECTION SYSTEM ──
const SECTIONS = [
    { id: 'hero-panel', label: 'Hero', num: '00', targetZ: 0, camZ: 0 },
    { id: 'about-panel', label: 'About', num: '01', targetZ: -20, camZ: -18 },
    { id: 'skills-panel', label: 'Skills', num: '02', targetZ: -38, camZ: -36 },
    { id: 'achievements-panel', label: 'Achievements', num: '03', targetZ: -55, camZ: -53 },
    { id: 'projects-panel', label: 'Projects', num: '04', targetZ: -75, camZ: -73 },
    { id: 'contact-panel', label: 'Contact', num: '06', targetZ: -98, camZ: -96 },
];
const TOTAL_Z = 100;

let scrollProgress = 0;   // 0..1
let targetScrollProgress = 0;
let currentSection = 0;
let skillsAnimated = false;

// Wheel & touch scroll
let touchStartY = 0;
window.addEventListener('wheel', e => {
    targetScrollProgress = Math.max(0, Math.min(1, targetScrollProgress + e.deltaY / 3000));
}, { passive: true });
window.addEventListener('touchstart', e => { touchStartY = e.touches[0].clientY; }, { passive: true });
window.addEventListener('touchmove', e => {
    const dy = touchStartY - e.touches[0].clientY;
    touchStartY = e.touches[0].clientY;
    targetScrollProgress = Math.max(0, Math.min(1, targetScrollProgress + dy / 2000));
}, { passive: true });

function goToSection(idx) {
    targetScrollProgress = idx / (SECTIONS.length - 1);
}
window.goToSection = goToSection;

// Panel manager
function updatePanels(sectionIdx) {
    SECTIONS.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (i === sectionIdx) el.classList.add('visible');
        else el.classList.remove('visible');
    });
}

// Skill bars fire once when skills section appears
function animateSkillBars() {
    if (skillsAnimated) return;
    skillsAnimated = true;
    document.querySelectorAll('.skill-bar').forEach(bar => {
        bar.style.width = bar.dataset.w + '%';
    });
}

// Float nav highlight
const floatBtns = document.querySelectorAll('.float-nav-btn');
function updateFloatNav(idx) {
    floatBtns.forEach((btn, i) => btn.classList.toggle('active', i === idx));
}

// Section label
const sectionLabelEl = document.getElementById('section-label');
const navLabelEl = document.getElementById('nav-section-label');

// Mouse parallax
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

// ── ANIMATION LOOP ──
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    const dt = clock.getDelta ? 0.016 : 0.016;

    // Smooth scroll
    scrollProgress += (targetScrollProgress - scrollProgress) * 0.07;

    // Camera Z fly-through
    const targetCamZ = -scrollProgress * TOTAL_Z;
    camera.position.z += (targetCamZ - camera.position.z) * 0.08;

    // Mouse parallax
    camera.position.x += (mouseX * 1.2 - camera.position.x) * 0.04;
    camera.position.y += (-mouseY * 0.8 - camera.position.y) * 0.04;
    camera.lookAt(camera.position.x * 0.3, camera.position.y * 0.3, camera.position.z - 5);

    // Dynamic lights
    pointLight1.position.set(Math.sin(t * 0.4) * 8, Math.cos(t * 0.3) * 5, camera.position.z - 5);
    pointLight2.position.set(Math.cos(t * 0.3) * 6, Math.sin(t * 0.5) * 4, camera.position.z - 8);

    // Rotate 3D objects
    objects3D.forEach(({ mesh, rotSpeed }) => {
        mesh.rotation.x += rotSpeed.x;
        mesh.rotation.y += rotSpeed.y;
        mesh.rotation.z += rotSpeed.z;
    });

    // Floating bob on hero icosahedron
    heroMesh.position.y = Math.sin(t * 0.6) * 0.5;
    centralSphere.position.y = Math.sin(t * 0.5) * 0.4;

    // Determine current section
    const prog = scrollProgress;
    const secIdx = Math.min(SECTIONS.length - 1, Math.round(prog * (SECTIONS.length - 1)));
    if (secIdx !== currentSection) {
        currentSection = secIdx;
        updatePanels(secIdx);
        updateFloatNav(secIdx);
        sectionLabelEl.textContent = SECTIONS[secIdx].num + ' / 06';
        navLabelEl.textContent = SECTIONS[secIdx].label;
        if (secIdx === 2) animateSkillBars();
    }

    // Progress bar
    document.getElementById('progress').style.width = (prog * 100) + '%';

    // Hide scroll hint after first scroll
    if (prog > 0.02) document.getElementById('scroll-hint').classList.add('hidden');

    renderer.render(scene, camera);
}

// Initial state
updatePanels(0);
updateFloatNav(0);
animate();

// Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});