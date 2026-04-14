// ============================================================
//  🚀 DEEP SPACE PORTFOLIO — Hyperspace Travel Engine
//  Complete 3D rewrite with warp speed section transitions
// ============================================================

const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x00000a, 1);
renderer.shadowMap.enabled = true;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x00000a, 0.004);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 0, 50);
camera.lookAt(0, 0, 0);

// ─── NEBULA / SKY GRADIENT ───
(function buildNebula() {
    // Large sphere around scene as background nebula
    const geo = new THREE.SphereGeometry(900, 32, 32);
    const mat = new THREE.MeshBasicMaterial({
        side: THREE.BackSide,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
    });
    const colors = [];
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        const norm = (y + 900) / 1800;
        // Deep purple-blue → dark teal → near-black
        if (norm > 0.7) {
            colors.push(0.04, 0.01, 0.12);      // deep violet top
        } else if (norm > 0.4) {
            colors.push(0.01, 0.04, 0.10);       // midnight blue
        } else {
            colors.push(0.0, 0.02, 0.05);        // near-black bottom
        }
    }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    scene.add(new THREE.Mesh(geo, mat));
})();

// ─── DENSE STARFIELD (3 layers) ───
const starSystems = [];
function buildStarLayer(count, spread, size, opacity, color) {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = spread * (0.3 + Math.random() * 0.7);
        pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
        pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        pos[i * 3 + 2] = r * Math.cos(phi);
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color, size, transparent: true, opacity, sizeAttenuation: true });
    const pts = new THREE.Points(geo, mat);
    scene.add(pts);
    starSystems.push({ pts, mat, baseOpacity: opacity });
    return pts;
}

const starsDistant = buildStarLayer(6000, 700, 0.3, 0.9, 0xffffff);
const starsMid     = buildStarLayer(2000, 400, 0.5, 0.7, 0xc8e0ff);
const starsNear    = buildStarLayer(600,  200, 0.8, 0.5, 0xc8f542);

// ─── WARP STREAKS (hyperspace lines) ───
const warpGroup = new THREE.Group();
scene.add(warpGroup);
const warpLines = [];
const WARP_COUNT = 280;

function buildWarpLines() {
    warpGroup.clear();
    warpLines.length = 0;
    for (let i = 0; i < WARP_COUNT; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi   = Math.acos(2 * Math.random() - 1);
        const r     = 5 + Math.random() * 25;
        const dir   = new THREE.Vector3(
            Math.sin(phi) * Math.cos(theta),
            Math.sin(phi) * Math.sin(theta),
            Math.cos(phi)
        ).normalize();
        const len = 1.5 + Math.random() * 8;
        const pts  = [dir.clone().multiplyScalar(r), dir.clone().multiplyScalar(r + len)];
        const geo  = new THREE.BufferGeometry().setFromPoints(pts);
        const hue  = Math.random() > 0.7 ? 0xc8f542 : 0xaaddff;
        const mat  = new THREE.LineBasicMaterial({ color: hue, transparent: true, opacity: 0 });
        const line = new THREE.Line(geo, mat);
        warpGroup.add(line);
        warpLines.push({ line, mat, r, dir, len, theta, phi, speed: 1.5 + Math.random() * 3 });
    }
}
buildWarpLines();

// ─── WARP STATE ───
let warpProgress = 0;    // 0 = normal, 1 = full warp
let warpTarget   = 0;
let isWarping    = false;
let warpTimeout  = null;

function triggerWarp() {
    clearTimeout(warpTimeout);
    warpTarget = 1;
    isWarping = true;
    warpTimeout = setTimeout(() => {
        warpTarget = 0;
        isWarping = false;
    }, 800);
}

// ─── SECTION ZONE OBJECTS ───
// Each zone has a collection of 3D objects that are visible near that camera Z

const ZONE_Z = [0, -180, -360, -540, -720, -900];
const objects3D = [];

function addMesh(mesh, z, xOff, yOff, rotSpeed) {
    mesh.position.set(xOff, yOff, z);
    scene.add(mesh);
    objects3D.push({ mesh, rotSpeed: rotSpeed || { x: 0.002, y: 0.004, z: 0.001 }, baseZ: z });
}

// ── ZONE 0: HERO — Massive spinning nebula ring + orbital spheres ──
const heroRingGeo = new THREE.TorusGeometry(22, 0.3, 8, 200);
const heroRingMat = new THREE.MeshBasicMaterial({ color: 0xc8f542, transparent: true, opacity: 0.15 });
const heroRing = new THREE.Mesh(heroRingGeo, heroRingMat);
heroRing.rotation.x = Math.PI / 2.5;
heroRing.position.set(0, 0, ZONE_Z[0] - 50);
scene.add(heroRing);

const heroRing2 = new THREE.Mesh(
    new THREE.TorusGeometry(35, 0.12, 6, 200),
    new THREE.MeshBasicMaterial({ color: 0x4488ff, transparent: true, opacity: 0.08 })
);
heroRing2.rotation.x = -Math.PI / 3;
heroRing2.position.set(0, 0, ZONE_Z[0] - 50);
scene.add(heroRing2);

// Central hero orb
const heroOrb = new THREE.Mesh(
    new THREE.IcosahedronGeometry(8, 4),
    new THREE.MeshStandardMaterial({ color: 0x0a1a0a, metalness: 0.9, roughness: 0.05, transparent: true, opacity: 0.7, envMapIntensity: 1 })
);
heroOrb.position.set(18, 2, ZONE_Z[0] - 45);
scene.add(heroOrb);

const heroWireframe = new THREE.Mesh(
    new THREE.IcosahedronGeometry(8.2, 2),
    new THREE.MeshBasicMaterial({ color: 0xc8f542, wireframe: true, transparent: true, opacity: 0.12 })
);
heroWireframe.position.copy(heroOrb.position);
scene.add(heroWireframe);

// Orbital dots around hero orb
const orbitalPts = [];
for (let i = 0; i < 3; i++) {
    const orb = new THREE.Mesh(
        new THREE.SphereGeometry(0.6, 12, 12),
        new THREE.MeshBasicMaterial({ color: i === 0 ? 0xc8f542 : i === 1 ? 0x4488ff : 0xffffff, transparent: true, opacity: 0.8 })
    );
    scene.add(orb);
    orbitalPts.push({ mesh: orb, radius: 12 + i * 4, speed: 0.4 + i * 0.2, angle: (i / 3) * Math.PI * 2, tilt: i * 0.3 });
}

// ── ZONE 1: ABOUT — Floating asteroid belt ──
const asteroids = [];
for (let i = 0; i < 40; i++) {
    const angle = (i / 40) * Math.PI * 2;
    const radius = 20 + Math.random() * 12;
    const size = 0.3 + Math.random() * 1.2;
    const geo = new THREE.DodecahedronGeometry(size, 0);
    const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(0.25 + Math.random() * 0.1, 0.3, 0.2),
        metalness: 0.4, roughness: 0.8
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 8,
        ZONE_Z[1] - 30 + Math.random() * 20
    );
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    scene.add(mesh);
    asteroids.push({ mesh, angle, radius, speed: 0.002 + Math.random() * 0.003, yOff: mesh.position.y });
}

// ── ZONE 2: SKILLS — Floating tech constellation ──
const skillNodes = [];
const skillPositions = [
    [-15, 8], [-8, -5], [0, 10], [8, -8], [15, 5],
    [-12, -10], [5, 2], [12, -3], [-5, 6], [0, -9]
];
skillPositions.forEach((pos, i) => {
    const size = 0.8 + Math.random() * 0.8;
    const geo = i % 3 === 0 ? new THREE.OctahedronGeometry(size) :
                i % 3 === 1 ? new THREE.BoxGeometry(size, size, size) :
                              new THREE.TetrahedronGeometry(size);
    const mat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0xc8f542 : 0x4488ff,
        metalness: 0.5, roughness: 0.3,
        emissive: i % 2 === 0 ? 0xc8f542 : 0x4488ff,
        emissiveIntensity: 0.3
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(pos[0], pos[1], ZONE_Z[2] - 20 + Math.random() * 10);
    scene.add(mesh);
    skillNodes.push({ mesh, baseX: pos[0], baseY: pos[1], phase: Math.random() * Math.PI * 2 });
});

// Constellation lines between skill nodes
for (let i = 0; i < skillNodes.length - 1; i++) {
    const geo = new THREE.BufferGeometry().setFromPoints([
        skillNodes[i].mesh.position.clone(),
        skillNodes[(i + 2) % skillNodes.length].mesh.position.clone()
    ]);
    scene.add(new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0xc8f542, transparent: true, opacity: 0.08 })));
}

// ── ZONE 3: ACHIEVEMENTS — Spiral galaxy arm ──
const galaxyGeo = new THREE.BufferGeometry();
const galaxyCount = 8000;
const gPos = new Float32Array(galaxyCount * 3);
const gCol = new Float32Array(galaxyCount * 3);
for (let i = 0; i < galaxyCount; i++) {
    const arm = i % 3;
    const t = (i / galaxyCount);
    const angle = t * Math.PI * 10 + arm * (Math.PI * 2 / 3);
    const r = t * 40;
    const scatter = (1 - t) * 3;
    gPos[i * 3]     = Math.cos(angle) * r + (Math.random() - 0.5) * scatter;
    gPos[i * 3 + 1] = (Math.random() - 0.5) * 3 * (1 - t);
    gPos[i * 3 + 2] = ZONE_Z[3] - 30 + Math.sin(angle) * r + (Math.random() - 0.5) * scatter;
    // Color from center: white → yellow → lime
    const c = t;
    gCol[i * 3]     = 1 - c * 0.3;
    gCol[i * 3 + 1] = 1 - c * 0.05;
    gCol[i * 3 + 2] = c < 0.5 ? 1 - c * 2 : 0;
}
galaxyGeo.setAttribute('position', new THREE.BufferAttribute(gPos, 3));
galaxyGeo.setAttribute('color', new THREE.BufferAttribute(gCol, 3));
const galaxyMat = new THREE.PointsMaterial({ size: 0.15, vertexColors: true, transparent: true, opacity: 0.85 });
const galaxyPts = new THREE.Points(galaxyGeo, galaxyMat);
scene.add(galaxyPts);

// ── ZONE 4: PROJECTS — Holographic hexagonal portal ──
const hexPortalGroup = new THREE.Group();
hexPortalGroup.position.set(0, 0, ZONE_Z[4] - 40);
scene.add(hexPortalGroup);

// Hexagonal rings
for (let r = 1; r <= 4; r++) {
    const geo = new THREE.RingGeometry(r * 5 - 0.1, r * 5 + 0.05, 6);
    const mat = new THREE.MeshBasicMaterial({ color: 0xc8f542, side: THREE.DoubleSide, transparent: true, opacity: 0.08 + r * 0.03 });
    const ring = new THREE.Mesh(geo, mat);
    hexPortalGroup.add(ring);
}

// Orbiting satellites around portal
const satelliteGroup = new THREE.Group();
satelliteGroup.position.copy(hexPortalGroup.position);
scene.add(satelliteGroup);
for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const sat = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.7, 0),
        new THREE.MeshStandardMaterial({ color: 0xc8f542, emissive: 0xc8f542, emissiveIntensity: 0.5, metalness: 0.8, roughness: 0.2 })
    );
    sat.position.set(Math.cos(angle) * 22, Math.sin(angle) * 22, 0);
    satelliteGroup.add(sat);
}

// ── ZONE 5: CONTACT — Black hole / event horizon ──
const blackHoleGroup = new THREE.Group();
blackHoleGroup.position.set(0, 0, ZONE_Z[5] - 50);
scene.add(blackHoleGroup);

// Accretion disk
const diskGeo = new THREE.RingGeometry(8, 28, 128);
const diskColors = [];
const diskPos = diskGeo.attributes.position;
for (let i = 0; i < diskPos.count; i++) {
    const x = diskPos.getX(i), y = diskPos.getY(i);
    const r = Math.sqrt(x * x + y * y);
    const t = (r - 8) / 20;
    diskColors.push(1 - t * 0.5, t > 0.5 ? 1 - (t - 0.5) * 2 : t * 2, 0);
}
diskGeo.setAttribute('color', new THREE.Float32BufferAttribute(diskColors, 3));
const diskMat = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
const disk = new THREE.Mesh(diskGeo, diskMat);
disk.rotation.x = Math.PI / 2.2;
blackHoleGroup.add(disk);

// Black hole core (dark sphere)
const bhCore = new THREE.Mesh(
    new THREE.SphereGeometry(7, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x000005 })
);
blackHoleGroup.add(bhCore);

// Gravitational lensing rings
for (let i = 0; i < 3; i++) {
    const lensRing = new THREE.Mesh(
        new THREE.TorusGeometry(7.5 + i * 0.8, 0.08, 8, 80),
        new THREE.MeshBasicMaterial({ color: i === 0 ? 0xffa500 : i === 1 ? 0xff6600 : 0xc8f542, transparent: true, opacity: 0.7 - i * 0.15 })
    );
    lensRing.rotation.x = Math.PI / 2;
    blackHoleGroup.add(lensRing);
}

// ─── LIGHTS ───
scene.add(new THREE.AmbientLight(0x112233, 0.8));
const sunLight = new THREE.DirectionalLight(0xfff4e0, 1.5);
sunLight.position.set(20, 30, 10);
scene.add(sunLight);
const limePoint = new THREE.PointLight(0xc8f542, 3, 80);
scene.add(limePoint);
const bluePoint = new THREE.PointLight(0x4488ff, 2, 60);
scene.add(bluePoint);
const purplePoint = new THREE.PointLight(0x8844ff, 1.5, 50);
purplePoint.position.set(-20, 10, -100);
scene.add(purplePoint);

// ─── COMET SYSTEM ───
const comets = [];
function spawnComet() {
    const comet = {
        pos: new THREE.Vector3(
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 100,
            camera.position.z - 200 - Math.random() * 100
        ),
        vel: new THREE.Vector3(
            (Math.random() - 0.5) * 0.8,
            (Math.random() - 0.5) * 0.4,
            2 + Math.random() * 3
        ),
        life: 1,
        maxLife: 80 + Math.random() * 60,
        mesh: null, tail: null
    };
    const headGeo = new THREE.SphereGeometry(0.2, 6, 6);
    const headMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
    comet.mesh = new THREE.Mesh(headGeo, headMat);
    comet.mesh.position.copy(comet.pos);

    const tailPts = [comet.pos.clone(), comet.pos.clone().sub(comet.vel.clone().multiplyScalar(8))];
    const tailGeo = new THREE.BufferGeometry().setFromPoints(tailPts);
    comet.tail = new THREE.Line(tailGeo, new THREE.LineBasicMaterial({ color: 0xaaddff, transparent: true, opacity: 0.5 }));

    scene.add(comet.mesh);
    scene.add(comet.tail);
    comets.push(comet);
}

// ─── SCROLL / SECTION SYSTEM ───
const SECTIONS = [
    { id: 'hero-panel',         label: 'Hero',         num: '00', camZ: 50    },
    { id: 'about-panel',        label: 'About',        num: '01', camZ: -130  },
    { id: 'skills-panel',       label: 'Skills',       num: '02', camZ: -310  },
    { id: 'achievements-panel', label: 'Achievements', num: '03', camZ: -490  },
    { id: 'projects-panel',     label: 'Projects',     num: '04', camZ: -670  },
    { id: 'contact-panel',      label: 'Contact',      num: '06', camZ: -850  },
];

let scrollProgress  = 0;
let targetScroll    = 0;
let currentSection  = 0;
let skillsAnimated  = false;
let lastSection     = -1;
let mouseX = 0, mouseY = 0;

// Smooth inertia scroll
let velocity = 0;
window.addEventListener('wheel', e => {
    velocity += e.deltaY * 0.00004;
}, { passive: true });

let touchY = 0;
window.addEventListener('touchstart', e => { touchY = e.touches[0].clientY; }, { passive: true });
window.addEventListener('touchmove', e => {
    const dy = touchY - e.touches[0].clientY;
    touchY = e.touches[0].clientY;
    velocity += dy * 0.00003;
}, { passive: true });

window.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

function goToSection(idx) {
    const from = scrollProgress;
    const to = idx / (SECTIONS.length - 1);
    triggerWarp();
    // Animate scroll to target
    let start = null;
    function animJump(ts) {
        if (!start) start = ts;
        const t = Math.min((ts - start) / 900, 1);
        const ease = t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
        targetScroll = from + (to - from) * ease;
        if (t < 1) requestAnimationFrame(animJump);
        else { targetScroll = to; velocity = 0; }
    }
    requestAnimationFrame(animJump);
}
window.goToSection = goToSection;

function updatePanels(idx) {
    SECTIONS.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el) {
            if (i === idx) el.classList.add('visible');
            else el.classList.remove('visible');
        }
    });
}

function animateSkillBars() {
    if (skillsAnimated) return;
    skillsAnimated = true;
    document.querySelectorAll('.skill-bar').forEach(bar => {
        bar.style.width = (bar.dataset.w || 0) + '%';
    });
}

// ─── ANIMATION LOOP ───
const clock = new THREE.Clock();
let frame = 0;

function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    frame++;

    // ── Inertia scroll ──
    velocity *= 0.88;
    targetScroll = Math.max(0, Math.min(1, targetScroll + velocity));
    scrollProgress += (targetScroll - scrollProgress) * 0.05;

    // ── Warp progress ──
    if (isWarping) {
        warpProgress = Math.min(1, warpProgress + 0.08);
    } else {
        warpProgress = Math.max(0, warpProgress - 0.04);
    }

    // ── Camera Z travel ──
    const targetCamZ = SECTIONS[0].camZ + scrollProgress * (SECTIONS[SECTIONS.length - 1].camZ - SECTIONS[0].camZ);
    camera.position.z += (targetCamZ - camera.position.z) * 0.07;

    // ── Mouse parallax ──
    const parallaxStrength = 1 - warpProgress * 0.8;
    camera.position.x += (mouseX * 3 * parallaxStrength - camera.position.x) * 0.03;
    camera.position.y += (-mouseY * 1.5 * parallaxStrength - camera.position.y) * 0.03;

    // Subtle camera tilt during warp
    camera.rotation.z += (warpProgress * 0.02 * mouseX - camera.rotation.z) * 0.1;

    const lookTarget = new THREE.Vector3(
        camera.position.x * 0.15,
        camera.position.y * 0.15,
        camera.position.z - 10
    );
    camera.lookAt(lookTarget);

    // ── Dynamic lights ──
    limePoint.position.set(
        Math.sin(t * 0.3) * 30,
        Math.cos(t * 0.2) * 15,
        camera.position.z - 20
    );
    bluePoint.position.set(
        Math.cos(t * 0.25) * 25,
        Math.sin(t * 0.35) * 12,
        camera.position.z - 35
    );

    // ── Warp lines animation ──
    const warpFOV = 75 + warpProgress * 35;
    camera.fov += (warpFOV - camera.fov) * 0.1;
    camera.updateProjectionMatrix();

    warpLines.forEach(({ line, mat, dir, r, len }) => {
        mat.opacity = warpProgress * (0.4 + Math.random() * 0.2);
        // Stretch lines during warp
        const stretchFactor = 1 + warpProgress * 12;
        const positions = line.geometry.attributes.position;
        const p0 = dir.clone().multiplyScalar(r);
        const p1 = dir.clone().multiplyScalar(r + len * stretchFactor);
        positions.setXYZ(0, p0.x, p0.y, p0.z);
        positions.setXYZ(1, p1.x, p1.y, p1.z);
        positions.needsUpdate = true;
    });

    // ── Star streaking during warp ──
    const baseOpacity0 = 0.9, baseOpacity1 = 0.7, baseOpacity2 = 0.5;
    starsDistant.material.opacity = baseOpacity0 * (1 - warpProgress * 0.6);
    starsMid.material.opacity     = baseOpacity1 * (1 - warpProgress * 0.4);
    starsNear.material.opacity    = baseOpacity2 + warpProgress * 0.3;

    // Slow starfield rotation
    starsDistant.rotation.y = t * 0.005;
    starsMid.rotation.y     = t * 0.008;

    // ── Hero zone ──
    heroRing.rotation.z  = t * 0.08;
    heroRing2.rotation.z = -t * 0.05;
    heroOrb.rotation.y   = t * 0.12;
    heroWireframe.rotation.y = t * 0.15;
    heroWireframe.rotation.x = t * 0.07;
    // Pulse glow on hero orb
    heroRingMat.opacity = 0.1 + Math.sin(t * 1.5) * 0.05;

    orbitalPts.forEach(o => {
        o.angle += o.speed * 0.01;
        o.mesh.position.set(
            heroOrb.position.x + Math.cos(o.angle) * o.radius,
            heroOrb.position.y + Math.sin(o.angle + o.tilt) * o.radius * 0.4,
            heroOrb.position.z + Math.sin(o.angle) * o.radius * 0.6
        );
        o.mesh.rotation.x += 0.04;
        o.mesh.rotation.y += 0.06;
    });

    // ── Asteroid belt ──
    asteroids.forEach(a => {
        a.angle += a.speed;
        a.mesh.position.x = Math.cos(a.angle) * a.radius;
        a.mesh.position.z = ZONE_Z[1] - 30 + Math.sin(a.angle * 0.3) * 5;
        a.mesh.position.y = a.yOff + Math.sin(t * 0.5 + a.angle) * 1.5;
        a.mesh.rotation.x += 0.008;
        a.mesh.rotation.y += 0.012;
    });

    // ── Skill nodes floating ──
    skillNodes.forEach((n, i) => {
        n.mesh.position.y = n.baseY + Math.sin(t * 0.6 + n.phase) * 1.2;
        n.mesh.rotation.x += 0.008;
        n.mesh.rotation.y += 0.012;
    });

    // ── Galaxy rotation ──
    galaxyPts.rotation.y = t * 0.02;

    // ── Portal rotation ──
    hexPortalGroup.rotation.z = t * 0.06;
    satelliteGroup.rotation.z = t * 0.04;

    // ── Black hole accretion ──
    disk.rotation.z = t * 0.15;
    // Pulsing glow
    blackHoleGroup.children.forEach((c, i) => {
        if (c.isLine || (c.geometry && c.geometry.type === 'TorusGeometry')) {
            if (c.material) c.material.opacity = 0.5 + Math.sin(t * 2 + i) * 0.2;
        }
    });

    // ── Comets ──
    if (frame % 90 === 0 && comets.length < 6) spawnComet();
    for (let i = comets.length - 1; i >= 0; i--) {
        const c = comets[i];
        c.life++;
        c.pos.add(c.vel);
        c.mesh.position.copy(c.pos);
        const opacity = 1 - (c.life / c.maxLife);
        c.mesh.material.opacity = opacity;
        c.tail.material.opacity = opacity * 0.5;
        // Update tail positions
        const tailPts = [c.pos.clone(), c.pos.clone().sub(c.vel.clone().multiplyScalar(8))];
        c.tail.geometry.setFromPoints(tailPts);
        if (c.life > c.maxLife) {
            scene.remove(c.mesh);
            scene.remove(c.tail);
            comets.splice(i, 1);
        }
    }

    // ── Section detection ──
    const secIdx = Math.min(SECTIONS.length - 1, Math.round(scrollProgress * (SECTIONS.length - 1)));
    if (secIdx !== lastSection) {
        lastSection = secIdx;
        currentSection = secIdx;
        updatePanels(secIdx);

        const sl = document.getElementById('section-label');
        const nl = document.getElementById('nav-section-label');
        if (sl) sl.textContent = SECTIONS[secIdx].num + ' / 06';
        if (nl) nl.textContent = SECTIONS[secIdx].label;

        // Trigger warp flash on section change
        triggerWarp();

        if (secIdx === 2) animateSkillBars();
    }

    // ── Progress bar ──
    const prog = document.getElementById('progress');
    if (prog) prog.style.width = (scrollProgress * 100) + '%';

    // ── Scroll hint ──
    if (scrollProgress > 0.02) {
        const sh = document.getElementById('scroll-hint');
        if (sh) sh.classList.add('hidden');
    }

    renderer.render(scene, camera);
}

// ── Init ──
updatePanels(0);
animate();

// ── Resize ──
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});