/**
 * ══════════════════════════════════════════════════════════════════════
 *  مصروفاتي | Masrofaty — 3D Interactive Landing Page Logic
 * ══════════════════════════════════════════════════════════════════════
 */

// ── 1. إعدادات الروابط (MEDIAFIRE & DIRECT APK) ────────────────────────
// يمكنك تعديل هذا الرابط ووضع رابط ميديا فاير الحقيقي متى أردت:
const APP_CONFIG = {
  // رابط ميديا فاير (قم بتغييره هنا وسيتحدث في كافة أزرار الموقع تلقائياً)
  MEDIAFIRE_URL: 'https://www.mediafire.com/file/7vhyvhda97sx1mu/Masrofaty.apk/',

  // رابط التحميل المباشر المحلي
  DIRECT_APK_URL: './masrofaty.apk',

  // رابط التحميل السحابي من Expo EAS
  EXPO_APK_URL: 'https://expo.dev/artifacts/eas/qoFIMIHwkNveQ2T0fRGPPztavpLqoZ2AdMjurWF7JeQ.apk'
};

// تطبيق الروابط على الأزرار فور التحميل
document.addEventListener('DOMContentLoaded', () => {
  const mfHeroBtn = document.getElementById('mediafire-hero-btn');
  const mfMainBtn = document.getElementById('mediafire-main-btn');
  if (mfHeroBtn) mfHeroBtn.href = APP_CONFIG.MEDIAFIRE_URL;
  if (mfMainBtn) mfMainBtn.href = APP_CONFIG.MEDIAFIRE_URL;

  // إذا تم فتح الموقع من سيرفر ويب (مثل GitHub Pages) يوجه التحميل المباشر للرابط السحابي
  if (window.location.protocol.startsWith('http')) {
    const directBtn = document.getElementById('direct-download-btn');
    if (directBtn) directBtn.href = APP_CONFIG.EXPO_APK_URL;
  }
});

// ── 2. Three.js 3D Background Canvas ─────────────────────────────────
(function initThreeJS() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 25;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0x14b8a6, 2.5, 60);
  pointLight1.position.set(10, 15, 10);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0x10b981, 2, 60);
  pointLight2.position.set(-15, -10, 10);
  scene.add(pointLight2);

  // Group of Floating 3D Objects
  const objectsGroup = new THREE.Group();
  scene.add(objectsGroup);

  // Materials
  const coinMaterial = new THREE.MeshStandardMaterial({
    color: 0x14b8a6,
    metalness: 0.85,
    roughness: 0.25,
    wireframe: false
  });

  const goldCoinMaterial = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.9,
    roughness: 0.2,
  });

  const emeraldSphereMaterial = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    metalness: 0.6,
    roughness: 0.3,
    transparent: true,
    opacity: 0.7
  });

  // 1. Floating 3D Coins (Cylinders)
  const coins = [];
  const coinGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.28, 32);

  for (let i = 0; i < 9; i++) {
    const isGold = i % 2 === 0;
    const mesh = new THREE.Mesh(coinGeo, isGold ? goldCoinMaterial : coinMaterial);
    
    mesh.position.x = (Math.random() - 0.5) * 36;
    mesh.position.y = (Math.random() - 0.5) * 26;
    mesh.position.z = (Math.random() - 0.5) * 16;

    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;

    mesh.userData = {
      rotSpeedX: (Math.random() - 0.5) * 0.015,
      rotSpeedY: (Math.random() - 0.5) * 0.02,
      floatSpeed: 0.001 + Math.random() * 0.002,
      offset: Math.random() * Math.PI * 2,
      originalY: mesh.position.y
    };

    objectsGroup.add(mesh);
    coins.push(mesh);
  }

  // 2. Floating 3D Torus Rings (Financial rings)
  const torusGeo = new THREE.TorusGeometry(1.8, 0.2, 16, 50);
  for (let i = 0; i < 4; i++) {
    const torus = new THREE.Mesh(torusGeo, coinMaterial);
    torus.position.x = (Math.random() - 0.5) * 40;
    torus.position.y = (Math.random() - 0.5) * 30;
    torus.position.z = (Math.random() - 0.5) * 15;
    torus.userData = {
      rotSpeedX: 0.008,
      rotSpeedY: 0.012,
      floatSpeed: 0.0015,
      offset: Math.random() * Math.PI * 2,
      originalY: torus.position.y
    };
    objectsGroup.add(torus);
    coins.push(torus);
  }

  // 3. Floating Spheres (Floating bubbles)
  const sphereGeo = new THREE.SphereGeometry(0.7, 24, 24);
  for (let i = 0; i < 8; i++) {
    const sphere = new THREE.Mesh(sphereGeo, emeraldSphereMaterial);
    sphere.position.x = (Math.random() - 0.5) * 38;
    sphere.position.y = (Math.random() - 0.5) * 28;
    sphere.position.z = (Math.random() - 0.5) * 18;
    sphere.userData = {
      floatSpeed: 0.002,
      offset: Math.random() * Math.PI * 2,
      originalY: sphere.position.y
    };
    objectsGroup.add(sphere);
    coins.push(sphere);
  }

  // 4. Subtle Particle Constellation Network
  const particleCount = 70;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 45;
    positions[i + 1] = (Math.random() - 0.5) * 35;
    positions[i + 2] = (Math.random() - 0.5) * 20;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0x5eead4,
    size: 0.25,
    transparent: true,
    opacity: 0.6
  });
  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // Mouse Interactivity
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Smooth camera drift
    targetX += (mouseX - targetX) * 0.04;
    targetY += (mouseY - targetY) * 0.04;
    camera.position.x = targetX * 3;
    camera.position.y = -targetY * 3;
    camera.lookAt(0, 0, 0);

    // Rotate & float objects
    coins.forEach((obj) => {
      if (obj.userData.rotSpeedX) obj.rotation.x += obj.userData.rotSpeedX;
      if (obj.userData.rotSpeedY) obj.rotation.y += obj.userData.rotSpeedY;
      obj.position.y = obj.userData.originalY + Math.sin(elapsedTime * 1.5 + obj.userData.offset) * 0.8;
    });

    // Rotate particles
    particleSystem.rotation.y = elapsedTime * 0.02;
    particleSystem.rotation.x = elapsedTime * 0.01;

    renderer.render(scene, camera);
  }
  animate();

  // Resize Handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
})();

// ── 3. 3D Interactive Phone Tilt on Hover ──────────────────────────────
(function initPhoneTilt() {
  const container = document.getElementById('phone-container');
  const frame = document.getElementById('phone-frame');
  if (!container || !frame) return;

  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouch) return; // Leave standard position on touch devices

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotY = (x / (rect.width / 2)) * 14; // max 14 deg
    const rotX = -(y / (rect.height / 2)) * 14;

    frame.style.transform = `perspective(1200px) rotateY(${rotY}deg) rotateX(${rotX}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  container.addEventListener('mouseleave', () => {
    frame.style.transform = 'perspective(1200px) rotateY(-8deg) rotateX(4deg) scale3d(1, 1, 1)';
  });
})();

// ── 4. Interactive Live Safe Calculator ────────────────────────────────
(function initCalculator() {
  const budgetRange = document.getElementById('budget-range');
  const daysRange = document.getElementById('days-range');
  const budgetVal = document.getElementById('budget-val');
  const daysVal = document.getElementById('days-val');
  const resultDisplay = document.getElementById('daily-limit-result');
  const statusBadge = document.getElementById('calc-status-badge');
  const tipText = document.getElementById('calc-tip');

  if (!budgetRange || !daysRange) return;

  function update() {
    const budget = parseFloat(budgetRange.value);
    const days = parseInt(daysRange.value, 10);

    budgetVal.textContent = budget.toLocaleString('ar-EG') + ' ج.م';
    daysVal.textContent = days + ' يوم';

    const safeDaily = Math.round(budget / days);
    resultDisplay.textContent = safeDaily.toLocaleString('ar-EG');

    // Visual feedback based on safe daily limit
    if (safeDaily >= 250) {
      statusBadge.textContent = 'حالة الميزانية: ممتازة وفائقة الأمان 🟢';
      statusBadge.style.background = 'rgba(16, 185, 129, 0.15)';
      statusBadge.style.color = '#34d399';
      statusBadge.style.borderColor = 'rgba(16, 185, 129, 0.3)';
      tipText.textContent = '💡 رائع! هذا المبلغ يمنحك راحة تامة في الإنفاق اليومي وستتمكن من تخصيص جزء معتبر للادخار والاستثمار.';
    } else if (safeDaily >= 120) {
      statusBadge.textContent = 'حالة الميزانية: جيدة ومتزنة 🟡';
      statusBadge.style.background = 'rgba(245, 158, 11, 0.15)';
      statusBadge.style.color = '#fbbf24';
      statusBadge.style.borderColor = 'rgba(245, 158, 11, 0.3)';
      tipText.textContent = '💡 وضع متوازن! إذا التزمت بحدك اليومي بدون مصاريف ترفيهية زائدة ستنهي دورتك المالية بدون عجز.';
    } else {
      statusBadge.textContent = 'حالة الميزانية: تتطلب حذراً وترشيداً ⚠️';
      statusBadge.style.background = 'rgba(239, 68, 68, 0.15)';
      statusBadge.style.color = '#f87171';
      statusBadge.style.borderColor = 'rgba(239, 68, 68, 0.3)';
      tipText.textContent = '💡 انتبه! الميزانية محدودة بالنسبة للأيام المتبقية، التطبيق سينبهك فورا عند أي تجاوز للحد اليومي ليحميك!';
    }
  }

  budgetRange.addEventListener('input', update);
  daysRange.addEventListener('input', update);
  update();
})();

// ── 5. App Preview Screen Tabs ─────────────────────────────────────────
(function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      tabBtns.forEach((b) => b.classList.remove('active'));
      tabPanes.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
    });
  });
})();

// ── 6. FAQ Accordion ──────────────────────────────────────────────────
(function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close other items
      faqItems.forEach((other) => other.classList.remove('active'));

      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });
})();

// ── 7. QR Code Modal ──────────────────────────────────────────────────
(function initQRModal() {
  const openBtn = document.getElementById('open-qr-modal');
  const closeBtn = document.getElementById('close-qr-modal');
  const overlay = document.getElementById('qr-modal-overlay');
  const modal = document.getElementById('qr-modal');

  if (!modal) return;

  function open() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (openBtn) openBtn.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (overlay) overlay.addEventListener('click', close);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) close();
  });
})();

// ── 8. Navbar Scroll Effect ────────────────────────────────────────────
(function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
})();
