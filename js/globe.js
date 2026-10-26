/**
 * Globe — Footer 3D globe with Three.js + OrbitControls
 * Lazy-initialized when scrolled into view to keep initial page load ultra-fast
 */
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('webgl-globe-container');
  if (!container) return;

  let isInitialized = false;
  let isVisible = false;
  let rafId = null;

  function initGlobeScene() {
    if (isInitialized || typeof THREE === 'undefined') return;
    isInitialized = true;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 3.6;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Earth texturing
    const textureLoader = new THREE.TextureLoader();
    const earthNightMap = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png');

    const earthGeometry = new THREE.SphereGeometry(1, 48, 48);
    const earthMaterial = new THREE.MeshBasicMaterial({
      map: earthNightMap,
      color: 0xffffff
    });
    
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    globeGroup.add(earth);

    // Background stars
    const starsGeo = new THREE.BufferGeometry();
    const starsVertices = [];
    for (let i = 0; i < 250; i++) {
      const r = 10 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      starsVertices.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
    }
    starsGeo.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const starsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, transparent: true, opacity: 0.5 });
    const stars = new THREE.Points(starsGeo, starsMat);
    scene.add(stars);

    // Network Nodes & Arcs
    function latLongToVector3(lat, lon, radius) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = (radius * Math.sin(phi) * Math.sin(theta));
      const y = (radius * Math.cos(phi));
      return new THREE.Vector3(x, y, z);
    }

    const hubs = [
      { name: "NYC-01", lat: 40.7, lon: -74.0 }, { name: "LAX-02", lat: 34.0, lon: -118.2 }, { name: "CHI-03", lat: 41.8, lon: -87.6 },
      { name: "LON-01", lat: 51.5, lon: -0.1 }, { name: "PAR-01", lat: 48.8, lon: 2.3 }, { name: "FRA-01", lat: 52.5, lon: 13.4 },
      { name: "TOK-01", lat: 35.6, lon: 139.6 }, { name: "SHA-01", lat: 31.2, lon: 121.4 }, { name: "HKG-01", lat: 22.3, lon: 114.1 },
      { name: "SYD-01", lat: -33.8, lon: 151.2 }, { name: "BOM-01", lat: 19.0, lon: 72.8 }, { name: "DEL-02", lat: 28.6, lon: 77.2 },
      { name: "SGP-01", lat: 1.3, lon: 103.8 }
    ];

    const hubMaterial = new THREE.MeshBasicMaterial({ color: 0xa020ff });
    const hubGeometry = new THREE.SphereGeometry(0.012, 12, 12);
    const arcMaterial = new THREE.LineBasicMaterial({ 
      color: 0xba68c8, 
      transparent: true, 
      opacity: 0.5, 
      blending: THREE.AdditiveBlending 
    });

    const hubCoords = [];
    hubs.forEach(h => {
      const pos = latLongToVector3(h.lat, h.lon, 1.01);
      hubCoords.push(pos);
      const hubMesh = new THREE.Mesh(hubGeometry, hubMaterial);
      hubMesh.position.copy(pos);
      globeGroup.add(hubMesh);
    });

    for (let i = 0; i < hubCoords.length; i++) {
      for (let j = i + 1; j < hubCoords.length; j++) {
        if (Math.random() < 0.28) {
          const v1 = hubCoords[i];
          const v2 = hubCoords[j];
          const dist = v1.distanceTo(v2);
          if (dist < 1.8) {
            const mid = v1.clone().add(v2).multiplyScalar(0.5);
            const altitude = 1.0 + (dist * 0.18);
            mid.normalize().multiplyScalar(altitude);
            const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
            const points = curve.getPoints(20);
            const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
            const arc = new THREE.Line(arcGeo, arcMaterial);
            globeGroup.add(arc);
          }
        }
      }
    }

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.4;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    function animate() {
      if (!isVisible) { rafId = null; return; }
      controls.update();
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }, { passive: true });

    if (isVisible) {
      rafId = requestAnimationFrame(animate);
    }
  }

  // Observe container intersection before initializing Three.js
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        if (!isInitialized) {
          initGlobeScene();
        } else if (!rafId) {
          rafId = requestAnimationFrame(() => {
            const controls = container._controls;
            if (controls) controls.update();
          });
        }
      }
    });
  }, { threshold: 0.05, rootMargin: '100px' });

  observer.observe(container.closest('section') || container);
});
