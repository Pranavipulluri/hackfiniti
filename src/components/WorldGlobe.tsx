
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const WorldGlobe = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Create globe with high-resolution textures
    const globeRadius = 5;
    const geometry = new THREE.SphereGeometry(globeRadius, 64, 64);
    
    // Load high-quality textures
    const textureLoader = new THREE.TextureLoader();
    
    // Earth textures
    const earthTexture = textureLoader.load('/earth-texture.jpg', () => setIsLoading(false));
    const bumpMap = textureLoader.load('/earth-bump.jpg');
    const specularMap = textureLoader.load('/earth-specular.jpg');
    const cloudsTexture = textureLoader.load('/earth-clouds.png');
    
    // High-quality material
    const material = new THREE.MeshPhongMaterial({
      map: earthTexture,
      bumpMap: bumpMap,
      bumpScale: 0.1,
      specularMap: specularMap,
      shininess: 15,
      emissive: new THREE.Color(0x112244),
      emissiveIntensity: 0.1
    });
    
    // Create Earth globe
    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);
    
    // Add clouds layer
    const cloudGeometry = new THREE.SphereGeometry(globeRadius + 0.15, 64, 64);
    const cloudMaterial = new THREE.MeshPhongMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.4,
      depthWrite: false
    });
    
    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    scene.add(clouds);
    
    // Add atmosphere glow
    const atmosphereGeometry = new THREE.SphereGeometry(globeRadius + 0.3, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true
    });
    
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    // Add stars background
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      transparent: true
    });
    
    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starVertices.push(x, y, z);
    }
    
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Add markers for important cultural regions
    const addMarker = (lat, lng, color) => {
      const phi = (90 - lat) * Math.PI / 180;
      const theta = (lng + 180) * Math.PI / 180;
      
      const x = -globeRadius * Math.sin(phi) * Math.cos(theta);
      const y = globeRadius * Math.cos(phi);
      const z = globeRadius * Math.sin(phi) * Math.sin(theta);
      
      // Create marker
      const markerGeometry = new THREE.SphereGeometry(0.1, 16, 16);
      const markerMaterial = new THREE.MeshBasicMaterial({ color });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      
      marker.position.set(x, y, z);
      
      // Add pulsing effect
      const pulse = new THREE.Mesh(
        new THREE.SphereGeometry(0.15, 16, 16),
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.4
        })
      );
      pulse.position.set(x, y, z);
      
      globe.add(marker);
      globe.add(pulse);
      
      return { marker, pulse };
    };
    
    // Add cultural hotspots
    const markers = [
      addMarker(10.8505, 76.2711, 0xff3333), // Kerala, India
      addMarker(35.8617, 104.1954, 0xffcc00), // China
      addMarker(37.0902, -95.7129, 0x33ff33), // USA
      addMarker(-14.2350, -51.9253, 0x3333ff), // Brazil
      addMarker(55.3781, -3.4360, 0xff33ff), // UK
      addMarker(26.8206, 30.8025, 0x33ffff), // Egypt
      addMarker(-25.2744, 133.7751, 0xffff33), // Australia
      addMarker(61.5240, 105.3188, 0xff9900), // Russia
    ];

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x333333, 1);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.5);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    
    // Sunlight effect
    const sunLight = new THREE.DirectionalLight(0xffffff, 1);
    sunLight.position.set(-15, 10, 15);
    scene.add(sunLight);

    // Camera position
    camera.position.z = 15;
    
    // Add orbit controls for interactivity
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.enableZoom = true;
    controls.minDistance = 6.5;
    controls.maxDistance = 20;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // Animation
    let rotation = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Auto-rotation when not interacting
      rotation += 0.001;
      
      // Rotate clouds slightly faster than the globe
      clouds.rotation.y = rotation * 1.1;
      
      // Pulse the markers
      markers.forEach(({ pulse }) => {
        pulse.scale.setScalar(1 + 0.1 * Math.sin(Date.now() * 0.003));
      });
      
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      scene.clear();
      controls.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-t-teal-500 border-teal-200 rounded-full animate-spin"></div>
            <p className="mt-4 text-teal-500 font-semibold">Loading 3D Earth...</p>
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background pointer-events-none" />
    </div>
  );
};

export default WorldGlobe;
