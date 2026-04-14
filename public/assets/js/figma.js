// ============================================================
//  🚀 AWARENEST — Deep Space Background Engine
//  Scroll-parallax space environment for the Figma project page
// ============================================================

(function () {

    const canvas = document.getElementById('bg-canvas');
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 600);
    camera.position.z = 30;

    // ── AMBIENT LIGHT ──
    scene.add(new THREE.AmbientLight(0x0a1a2a, 1));
    const rimLight = new THREE.DirectionalLight(0xc8f542, 0.8);
    rimLight.position.set(-10, 15, 10);
    scene.add(rimLight);
    const blueLight = new THREE.PointLight(0x4488ff, 2, 80);
    blueLight.position.set(15, 0, 10);
    scene.add(blueLight);

    // ── NEBULA DOME (scrollable) ──
    const nebulaGeo = new THREE.SphereGeometry(400, 24, 24);
    const nebulaColors = [];
    const nPos = nebulaGeo.attributes.position;
    for (let i = 0; i < nPos.count; i++) {
        const y = nPos.getY(i);
        const t = (y + 400) / 800;
        nebulaColors.push(
            t > 0.6 ? 0.06 : 0.01,
            t > 0.6 ? 0.01 : 0.02,
            t > 0.6 ? 0.15 : 0.06
        );
    }
    nebulaGeo.setAttribute('color', new THREE.Float32BufferAttribute(nebulaColors, 3));
    const nebulaMesh = new THREE.Mesh(nebulaGeo, new THREE.MeshBasicMaterial({
        side: THREE.BackSide, vertexColors: true, transparent: true, opacity: 0.5
    }));
    scene.add(nebulaMesh);

    // ── STARFIELD — 3 layers ──
    function makeStars(count, spread, size, opacity, color) {
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3]     = (Math.random() - 0.5) * spread;
            pos[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.6;
            pos[i * 3 + 2] = (Math.random() - 0.5) * spread * 0.4 - 20;
        }
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        const pts = new THREE.Points(geo, new THREE.PointsMaterial({
            color, size, transparent: true, opacity, sizeAttenuation: true
        }));
        scene.add(pts);
        return pts;
    }

    const starsDeep = makeStars(5000, 500, 0.25, 0.9, 0xffffff);
    const starsMid  = makeStars(1500, 250, 0.4,  0.6, 0xc8e0ff);
    const starsNear = makeStars(400,  100, 0.7,  0.45, 0xc8f542);

    // ── WARP LINES (hidden by default, shown on-demand) ──
    const warpGroup = new THREE.Group();
    scene.add(warpGroup);
    const warpLines = [];
    for (let i = 0; i < 200; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi   = Math.acos(2 * Math.random() - 1);
        const r     = 4 + Math.random() * 18;
        const dir   = new THREE.Vector3(
            Math.sin(phi) * Math.cos(theta),
            Math.sin(phi) * Math.sin(theta),
            Math.cos(phi)
        ).normalize();
        const len = 1 + Math.random() * 6;
        const geo = new THREE.BufferGeometry().setFromPoints([
            dir.clone().multiplyScalar(r),
            dir.clone().multiplyScalar(r + len)
        ]);
        const color = Math.random() > 0.6 ? 0xc8f542 : 0xaaddff;
        const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0 });
        const line = new THREE.Line(geo, mat);
        warpGroup.add(line);
        warpLines.push({ line, mat, dir, r, len });
    }

    // ── GIANT PLANET (behind the hero section) ──
    const planetGroup = new THREE.Group();
    planetGroup.position.set(18, -6, -60);
    scene.add(planetGroup);

    // Planet core
    const planet = new THREE.Mesh(
        new THREE.SphereGeometry(14, 48, 48),
        new THREE.MeshStandardMaterial({
            color: 0x0d1a2a,
            metalness: 0.2,
            roughness: 0.7,
            emissive: 0x040e18,
            emissiveIntensity: 0.5
        })
    );
    planetGroup.add(planet);

    // Planet rings
    for (let i = 0; i < 4; i++) {
        const inner = 16 + i * 3;
        const outer = inner + 1.8;
        const ringGeo = new THREE.RingGeometry(inner, outer, 128);
        const opacity = 0.25 - i * 0.04;
        const color = i === 0 ? 0xc8f542 : i === 1 ? 0x88aaff : 0xffffff;
        const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({
            color, side: THREE.DoubleSide, transparent: true, opacity
        }));
        ring.rotation.x = Math.PI / 2.4 + i * 0.05;
        planetGroup.add(ring);
    }

    // Planet atmosphere glow (large transparent sphere)
    const atmMesh = new THREE.Mesh(
        new THREE.SphereGeometry(15.5, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0x1144aa, transparent: true, opacity: 0.06, side: THREE.FrontSide })
    );
    planetGroup.add(atmMesh);

    // ── FLOATING DESIGN ELEMENT: Wireframe icosahedron (left side) ──
    const icoLeft = new THREE.Mesh(
        new THREE.IcosahedronGeometry(5, 1),
        new THREE.MeshBasicMaterial({ color: 0xc8f542, wireframe: true, transparent: true, opacity: 0.07 })
    );
    icoLeft.position.set(-24, 8, -40);
    scene.add(icoLeft);

    // ── FLOATING DESIGN ELEMENT: Torus knot ──
    const torus = new THREE.Mesh(
        new THREE.TorusKnotGeometry(3, 0.7, 80, 12),
        new THREE.MeshStandardMaterial({
            color: 0xc8f542, metalness: 0.4, roughness: 0.3,
            emissive: 0xc8f542, emissiveIntensity: 0.18,
            transparent: true, opacity: 0.5
        })
    );
    torus.position.set(-22, -10, -35);
    scene.add(torus);

    // ── FLOATING DESIGN ELEMENT: Octahedra cluster ──
    const octas = [];
    const octaPositions = [
        [28, 14, -50], [-30, 18, -55], [20, -18, -45],
        [-16, -20, -48], [32, -5, -52]
    ];
    octaPositions.forEach((pos, i) => {
        const size = 0.6 + Math.random() * 0.8;
        const mesh = new THREE.Mesh(
            new THREE.OctahedronGeometry(size, 0),
            new THREE.MeshStandardMaterial({
                color: i % 2 === 0 ? 0xc8f542 : 0x4488ff,
                emissive: i % 2 === 0 ? 0xc8f542 : 0x4488ff,
                emissiveIntensity: 0.4, metalness: 0.6, roughness: 0.2
            })
        );
        mesh.position.set(...pos);
        scene.add(mesh);
        octas.push({ mesh, phase: Math.random() * Math.PI * 2, baseY: pos[1] });
    });

    // ── COMET SYSTEM ──
    const comets = [];
    let cometTimer = 0;

    function spawnComet() {
        const x = (Math.random() - 0.5) * 120;
        const y = 30 + Math.random() * 20;
        const z = -20 - Math.random() * 30;
        const vel = new THREE.Vector3(
            (Math.random() - 0.5) * 0.6,
            -0.8 - Math.random() * 1.2,
            0.1
        );
        const headMesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.18, 6, 6),
            new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 })
        );
        headMesh.position.set(x, y, z);
        scene.add(headMesh);

        const tailGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(x, y, z),
            new THREE.Vector3(x - vel.x * 10, y - vel.y * 10, z)
        ]);
        const tailLine = new THREE.Line(tailGeo, new THREE.LineBasicMaterial({
            color: 0xaaddff, transparent: true, opacity: 0.5
        }));
        scene.add(tailLine);
        comets.push({ pos: new THREE.Vector3(x, y, z), vel, head: headMesh, tail: tailLine, life: 0, maxLife: 70 + Math.random() * 50 });
    }

    // ── WARP TRIGGER on NAV click ──
    let warpProgress = 0;
    let warpActive = false;
    let warpTimer = null;

    function triggerWarp() {
        clearTimeout(warpTimer);
        warpActive = true;
        warpTimer = setTimeout(() => { warpActive = false; }, 700);
    }

    // Hook into nav links to trigger warp
    document.querySelectorAll('.nav-links a, #back-top').forEach(el => {
        el.addEventListener('click', triggerWarp);
    });

    // ── SCROLL PARALLAX ──
    let scrollY = 0;
    let targetScrollY = 0;
    window.addEventListener('scroll', () => {
        targetScrollY = window.scrollY;
    });

    // ── MOUSE ──
    let mx = 0, my = 0;
    document.addEventListener('mousemove', e => {
        mx = (e.clientX / window.innerWidth - 0.5) * 2;
        my = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // ── CURSOR ──
    const cursor = document.getElementById('cursor');
    const ring   = document.getElementById('cursorRing');
    if (cursor && ring) {
        document.addEventListener('mousemove', e => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top  = e.clientY + 'px';
            ring.style.left   = e.clientX + 'px';
            ring.style.top    = e.clientY + 'px';
        });
        document.querySelectorAll('a, button').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.style.transform = 'translate(-50%,-50%) scale(2.5)');
            el.addEventListener('mouseleave', () => cursor.style.transform = 'translate(-50%,-50%) scale(1)');
        });
    }

    // ── SCROLL PROGRESS BAR ──
    window.addEventListener('scroll', () => {
        const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        const pb = document.getElementById('progress-bar');
        if (pb) pb.style.width = pct + '%';
        const bt = document.getElementById('back-top');
        if (bt) bt.classList.toggle('show', window.scrollY > 400);

        // Active nav
        let current = '';
        document.querySelectorAll('section[id]').forEach(s => {
            if (window.scrollY >= s.offsetTop - 200) current = s.id;
        });
        document.querySelectorAll('.nav-links a').forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + current);
        });
    });

    // ── NAV HIDE ON SCROLL DOWN ──
    const nav = document.getElementById('mainNav');
    let prevScroll = 0;
    window.addEventListener('scroll', () => {
        const cur = window.scrollY;
        if (window.innerWidth > 768) {
            nav.style.transform = (cur > prevScroll && cur > 100) ? 'translateY(-100%)' : 'translateY(0)';
        } else {
            nav.style.transform = 'none';
        }
        prevScroll = cur;
    });

    // ── INTERSECTION OBSERVER ──
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.fade-up, .info-card, .proto-card').forEach(el => io.observe(el));

    // ── MOBILE NAV ──
    window.toggleNav = function () {
        document.getElementById('navLinks').classList.toggle('open');
        document.getElementById('hamburger').classList.toggle('open');
    };
    document.querySelectorAll('.nav-links a').forEach(a => {
        a.addEventListener('click', () => {
            document.getElementById('navLinks').classList.remove('open');
            document.getElementById('hamburger').classList.remove('open');
        });
    });

    // ── FLOAT CONTACT ──
    const floatToggle = document.getElementById('floatToggle');
    if (floatToggle) {
        floatToggle.addEventListener('click', () => {
            document.getElementById('floatOptions').classList.toggle('open');
        });
    }

    // ── BACK TO TOP ──
    const backTop = document.getElementById('back-top');
    if (backTop) {
        backTop.addEventListener('click', e => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ── RENDER LOOP ──
    const clock = new THREE.Clock();
    let frame = 0;

    function render() {
        requestAnimationFrame(render);
        const t = clock.getElapsedTime();
        frame++;

        // Smooth scroll
        scrollY += (targetScrollY - scrollY) * 0.08;
        const scrollNorm = scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1);

        // ── Camera parallax with scroll ──
        const baseCamZ = 30 - scrollNorm * 18;
        const baseCamY = -scrollNorm * 10;
        camera.position.z += (baseCamZ + mx * 0.5 - camera.position.z) * 0.04;
        camera.position.y += (baseCamY - my * 0.8 - camera.position.y) * 0.04;
        camera.position.x += (mx * 1.5 - camera.position.x) * 0.04;
        camera.lookAt(camera.position.x * 0.2, camera.position.y * 0.2, 0);

        // ── Warp ──
        if (warpActive) {
            warpProgress = Math.min(1, warpProgress + 0.1);
        } else {
            warpProgress = Math.max(0, warpProgress - 0.05);
        }
        warpLines.forEach(({ mat, dir, r, len, line }) => {
            mat.opacity = warpProgress * (0.35 + Math.random() * 0.15);
            const stretch = 1 + warpProgress * 10;
            const positions = line.geometry.attributes.position;
            const p0 = dir.clone().multiplyScalar(r);
            const p1 = dir.clone().multiplyScalar(r + len * stretch);
            positions.setXYZ(0, p0.x, p0.y, p0.z);
            positions.setXYZ(1, p1.x, p1.y, p1.z);
            positions.needsUpdate = true;
        });
        const targetFOV = 70 + warpProgress * 30;
        camera.fov += (targetFOV - camera.fov) * 0.1;
        camera.updateProjectionMatrix();

        // ── Stars drift with parallax ──
        starsDeep.rotation.y = scrollNorm * 0.15 + t * 0.003;
        starsMid.rotation.y  = scrollNorm * 0.25 + t * 0.005;
        starsNear.rotation.y = scrollNorm * 0.4  + t * 0.008;
        starsDeep.material.opacity = 0.9 - warpProgress * 0.5;
        starsMid.material.opacity  = 0.6 - warpProgress * 0.3;

        // ── Planet slow rotation + scroll drift ──
        planet.rotation.y = t * 0.04;
        planetGroup.rotation.z = Math.sin(t * 0.1) * 0.02;
        planetGroup.position.y = -6 - scrollNorm * 20;
        planetGroup.position.x = 18 + scrollNorm * 5;
        // Rings rotate at different speeds
        planetGroup.children.forEach((child, i) => {
            if (i > 0 && i < 5) {
                child.rotation.z = t * (0.06 + i * 0.015) * (i % 2 === 0 ? 1 : -1);
            }
        });

        // ── Wireframe icosahedron ──
        icoLeft.rotation.x = t * 0.05;
        icoLeft.rotation.y = t * 0.08;
        icoLeft.position.y = 8 + Math.sin(t * 0.4) * 2 - scrollNorm * 15;
        icoLeft.position.x = -24 + scrollNorm * 8;

        // ── Torus knot ──
        torus.rotation.x = t * 0.12;
        torus.rotation.y = t * 0.08;
        torus.position.y = -10 + Math.cos(t * 0.35) * 1.5 - scrollNorm * 18;
        torus.material.opacity = Math.max(0.1, 0.5 - scrollNorm * 0.8);

        // ── Octahedra ──
        octas.forEach((o, i) => {
            o.mesh.rotation.x += 0.01;
            o.mesh.rotation.y += 0.015;
            o.mesh.position.y = o.baseY + Math.sin(t * 0.5 + o.phase) * 1.5 - scrollNorm * (12 + i * 3);
        });

        // ── Dynamic lights ──
        blueLight.position.set(
            15 + Math.sin(t * 0.3) * 10,
            Math.cos(t * 0.2) * 8,
            10 + scrollNorm * -20
        );

        // ── Comets ──
        cometTimer++;
        if (cometTimer % 140 === 0 && comets.length < 5) spawnComet();
        for (let i = comets.length - 1; i >= 0; i--) {
            const c = comets[i];
            c.life++;
            c.pos.add(c.vel);
            c.head.position.copy(c.pos);
            const fade = 1 - c.life / c.maxLife;
            c.head.material.opacity = fade;
            c.tail.material.opacity = fade * 0.5;
            const tailEnd = c.pos.clone().sub(c.vel.clone().multiplyScalar(10));
            c.tail.geometry.setFromPoints([c.pos.clone(), tailEnd]);
            if (c.life > c.maxLife) {
                scene.remove(c.head);
                scene.remove(c.tail);
                comets.splice(i, 1);
            }
        }

        renderer.render(scene, camera);
    }

    render();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

})();