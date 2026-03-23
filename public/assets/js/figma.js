// ── MINI 3D BG (matching portfolio) ──
(function () {
    const canvas = document.getElementById('bg-canvas');
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 20;

    // Starfield
    const starGeo = new THREE.BufferGeometry();
    const starCount = 1800;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) starPos[i] = (Math.random() - 0.5) * 120;
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, transparent: true, opacity: 0.6 })));

    // Lime particles
    const limeGeo = new THREE.BufferGeometry();
    const limeCount = 200;
    const limePos = new Float32Array(limeCount * 3);
    for (let i = 0; i < limeCount * 3; i++) limePos[i] = (Math.random() - 0.5) * 80;
    limeGeo.setAttribute('position', new THREE.BufferAttribute(limePos, 3));
    scene.add(new THREE.Points(limeGeo, new THREE.PointsMaterial({ color: 0xc8f542, size: 0.18, transparent: true, opacity: 0.45 })));

    // Floating wireframe shapes
    const shapes = [];
    const mat = new THREE.MeshBasicMaterial({ color: 0xc8f542, wireframe: true, transparent: true, opacity: 0.08 });
    [[10, 6, -15], [-12, -4, -10], [0, 10, -18], [8, -8, -12]].forEach(([x, y, z]) => {
        const geo = Math.random() > 0.5 ? new THREE.IcosahedronGeometry(2.5, 1) : new THREE.TorusGeometry(2, 0.5, 8, 24);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, y, z);
        scene.add(mesh);
        shapes.push(mesh);
    });

    let mx = 0, my = 0;
    document.addEventListener('mousemove', e => {
        mx = (e.clientX / window.innerWidth - 0.5) * 0.6;
        my = (e.clientY / window.innerHeight - 0.5) * 0.3;
    });

    const clock = new THREE.Clock();
    (function render() {
        requestAnimationFrame(render);
        const t = clock.getElapsedTime();
        camera.position.x += (mx - camera.position.x) * 0.04;
        camera.position.y += (-my - camera.position.y) * 0.04;
        camera.lookAt(0, 0, 0);
        shapes.forEach((s, i) => {
            s.rotation.x += 0.003 + i * 0.001;
            s.rotation.y += 0.005 + i * 0.001;
        });
        renderer.render(scene, camera);
    })();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();

// ── CURSOR ──
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px';
    ring.style.left = e.clientX + 'px'; ring.style.top = e.clientY + 'px';
});
document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.style.transform = 'translate(-50%,-50%) scale(2.5)');
    el.addEventListener('mouseleave', () => cursor.style.transform = 'translate(-50%,-50%) scale(1)');
});

// ── SCROLL PROGRESS ──
window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    document.getElementById('progress-bar').style.width = pct + '%';
    document.getElementById('back-top').classList.toggle('show', window.scrollY > 400);
});

// ── NAV SCROLL ──
const nav = document.getElementById('mainNav');
let prev = 0;
window.addEventListener('scroll', () => {
    const cur = window.scrollY;
    if (window.innerWidth > 768) {
        nav.style.transform = (cur > prev && cur > 100) ? 'translateY(-100%)' : 'translateY(0)';
    } else { nav.style.transform = 'none'; }
    prev = cur;

    // Active nav
    let current = '';
    document.querySelectorAll('section[id]').forEach(s => {
        if (window.scrollY >= s.offsetTop - 200) current = s.id;
    });
    document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
});

// ── INTERSECTION OBSERVER ──
const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.fade-up, .info-card, .proto-card').forEach(el => io.observe(el));

// ── MOBILE NAV ──
function toggleNav() {
    document.getElementById('navLinks').classList.toggle('open');
    document.getElementById('hamburger').classList.toggle('open');
}
document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
        document.getElementById('navLinks').classList.remove('open');
        document.getElementById('hamburger').classList.remove('open');
    });
});

// ── FLOAT CONTACT ──
document.getElementById('floatToggle').addEventListener('click', () => {
    document.getElementById('floatOptions').classList.toggle('open');
});

// ── BACK TO TOP ──
document.getElementById('back-top').addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});