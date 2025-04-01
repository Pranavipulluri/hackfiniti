
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { getFresnelMat } from '@/utils/getFresnelMat';
import getStarfield from '@/utils/getStarfield';

const WorldGlobe = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedTextureCount, setLoadedTextureCount] = useState(0);
  const [highlightedRegion, setHighlightedRegion] = useState<string | null>(null);
  const totalTextures = 1; // We'll reduce this to just track essential textures
  
  // Create fallback textures
  const createFallbackTexture = (color: string = '#1E88E5') => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    if (context) {
      context.fillStyle = color;
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // For earth texture, create some visible continents
      if (color === '#1E88E5') { // blue for ocean
        context.fillStyle = '#4CAF50'; // green for land
        // Draw basic continent shapes
        context.beginPath();
        context.arc(canvas.width * 0.7, canvas.height * 0.4, 80, 0, Math.PI * 2);
        context.fill();
        context.beginPath();
        context.arc(canvas.width * 0.3, canvas.height * 0.5, 120, 0, Math.PI * 2);
        context.fill();
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  };

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

    // Add starfield
    const starfield = getStarfield({ numStars: 2000 });
    scene.add(starfield);

    // Create globe with fallback textures
    const globeRadius = 5;
    const geometry = new THREE.SphereGeometry(globeRadius, 64, 64);
    
    // Create fallback textures
    const earthTexture = createFallbackTexture('#1E88E5');
    const bumpMap = createFallbackTexture('#555555');
    const specularMap = createFallbackTexture('#FFFFFF');
    
    // Earth material with fallback textures
    const material = new THREE.MeshPhongMaterial({
      map: earthTexture,
      bumpMap: bumpMap,
      bumpScale: 0.1,
      specular: new THREE.Color(0x333333),
      shininess: 25,
      emissive: new THREE.Color(0x111111),
      emissiveIntensity: 0.5,
    });
    
    // Create Earth globe
    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);
    
    // Add fresnel effect for atmosphere glow
    const fresenelMat = getFresnelMat({
      rimHex: 0x0099ff,
      facingHex: 0x000000
    });
    const atmosphereGeo = new THREE.SphereGeometry(globeRadius * 1.08, 64, 64);
    const atmosphere = new THREE.Mesh(atmosphereGeo, fresenelMat);
    scene.add(atmosphere);
    
    // Mark the loading complete since we're using fallback textures
    setIsLoading(false);
    
    // Add markers for important cultural regions
    const addMarker = (lat, lng, color, size = 0.1) => {
      const phi = (90 - lat) * Math.PI / 180;
      const theta = (lng + 180) * Math.PI / 180;
      
      const x = -globeRadius * Math.sin(phi) * Math.cos(theta) * 1.01;
      const y = globeRadius * Math.cos(phi) * 1.01;
      const z = globeRadius * Math.sin(phi) * Math.sin(theta) * 1.01;
      
      // Create marker
      const markerGeometry = new THREE.SphereGeometry(size, 16, 16);
      const markerMaterial = new THREE.MeshBasicMaterial({ color });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      
      marker.position.set(x, y, z);
      
      // Add pulsing effect
      const pulse = new THREE.Mesh(
        new THREE.SphereGeometry(size * 1.5, 16, 16),
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
    
    // Add cultural hotspots - focus on India and Kerala
    const markers = [
      addMarker(10.8505, 76.2711, 0xff3333, 0.15), // Kerala, India - larger
      addMarker(28.6139, 77.2090, 0xffcc00), // Delhi, India
      addMarker(19.0760, 72.8777, 0x33ff33), // Mumbai, India
      addMarker(22.5726, 88.3639, 0x3333ff), // Kolkata, India
      addMarker(13.0827, 80.2707, 0xff33ff), // Chennai, India
      addMarker(17.3850, 78.4867, 0x33ffff), // Hyderabad, India
      addMarker(26.9124, 75.7873, 0xffff33), // Jaipur, India
      addMarker(30.7333, 76.7794, 0xff9900), // Chandigarh, India
    ];

    // Focus on India region
    const indiaPosition = {
      lat: 20.5937, 
      lng: 78.9629
    };

    // Position camera for India view
    const focusOnIndia = () => {
      const targetPhi = (90 - indiaPosition.lat) * Math.PI / 180;
      const targetTheta = (indiaPosition.lng + 180) * Math.PI / 180;
      
      const targetX = -15 * Math.sin(targetPhi) * Math.cos(targetTheta);
      const targetY = 15 * Math.cos(targetPhi) * 0.5; // Offset to show more of the region
      const targetZ = 15 * Math.sin(targetPhi) * Math.sin(targetTheta);
      
      camera.position.set(targetX, targetY, targetZ);
      camera.lookAt(0, 0, 0);
      controls.update();
    };

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
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

    // Focus on India after a short delay
    setTimeout(() => {
      focusOnIndia();
      controls.autoRotate = false; // Stop auto-rotation when focused
    }, 500);

    // Animation
    let rotation = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Auto-rotation when not interacting
      rotation += 0.001;
      
      // Update starfield rotation
      starfield.rotation.y = rotation * 0.2;
      
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
            <p className="mt-4 text-teal-500 font-semibold">
              Loading 3D India Globe...
            </p>
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background pointer-events-none" />
    </div>
  );
};

export default WorldGlobe;
