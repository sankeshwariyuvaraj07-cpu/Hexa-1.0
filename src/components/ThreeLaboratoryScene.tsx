import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  Activity,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sliders,
  Sparkles,
  Zap,
  Layers,
  Eye,
} from 'lucide-react';

interface ThreeLaboratorySceneProps {
  isDarkMode?: boolean;
  onSelectInstrument?: (instrumentName: string) => void;
}

export const ThreeLaboratoryScene: React.FC<ThreeLaboratorySceneProps> = ({
  isDarkMode = false,
  onSelectInstrument,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activePreset, setActivePreset] = useState<'overview' | 'oscilloscope' | 'generator' | 'mcu'>('overview');
  const [waveformType, setWaveformType] = useState<'sine' | 'square' | 'pulse' | 'noise'>('sine');
  const [isExploded, setIsExploded] = useState(false);
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);
  const [selectedItemName, setSelectedItemName] = useState<string>('Dual-Channel Digital Oscilloscope');
  const [isAutoRotate, setIsAutoRotate] = useState(true);

  // Scene references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const explodedProgress = useRef(0);
  const mousePos = useRef({ x: 0, y: 0 });
  const waveformCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const waveformTextureRef = useRef<THREE.CanvasTexture | null>(null);

  // Instrument group refs for exploded view or focus
  const isUserInteracting = useRef(false);
  const oscGroupRef = useRef<THREE.Group | null>(null);
  const fgenGroupRef = useRef<THREE.Group | null>(null);
  const mcuGroupRef = useRef<THREE.Group | null>(null);
  const oscScreenMeshRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Software WebGL Guard
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    // 2. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = null; // transparent to blend with page or dark theme

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 4.5, 9);
    cameraRef.current = camera;

    // 3. Renderer with SRGB Color Space & ACES Tone Mapping
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isDarkMode ? 1.2 : 1.05;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(width, height);
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.05; // prevent going below floor
    controls.minDistance = 3.5;
    controls.maxDistance = 14;
    controls.target.set(0, 0.6, 0);
    controls.addEventListener('start', () => {
      isUserInteracting.current = true;
    });
    controls.addEventListener('end', () => {
      isUserInteracting.current = false;
    });
    controlsRef.current = controls;

    // 5. Studio Environment Reflection via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 6. Lighting Rig: Warm Key + Cool Fill + Rim Light
    const keyLight = new THREE.DirectionalLight(0xfffaed, 2.5);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0xddeeff, 0x112233, 1.2);
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
    rimLight.position.set(-6, 4, -4);
    scene.add(rimLight);

    // 7. Workbench Mat & Ground Contact Shadow
    const matGeo = new THREE.BoxGeometry(9.5, 0.12, 6.5);
    const matMat = new THREE.MeshStandardMaterial({
      color: isDarkMode ? 0x0f172a : 0x1e293b,
      roughness: 0.8,
      metalness: 0.1,
    });
    const benchMat = new THREE.Mesh(matGeo, matMat);
    benchMat.position.y = -0.06;
    benchMat.receiveShadow = !isSoftwareGl;
    scene.add(benchMat);

    // Procedural Grid Texture on ESD Mat
    const gridCanvas = document.createElement('canvas');
    gridCanvas.width = 512;
    gridCanvas.height = 512;
    const gctx = gridCanvas.getContext('2d');
    if (gctx) {
      gctx.fillStyle = isDarkMode ? '#0b1120' : '#1e293b';
      gctx.fillRect(0, 0, 512, 512);
      gctx.strokeStyle = isDarkMode ? 'rgba(56, 189, 248, 0.15)' : 'rgba(59, 130, 246, 0.2)';
      gctx.lineWidth = 1.5;
      const step = 32;
      for (let x = 0; x <= 512; x += step) {
        gctx.beginPath();
        gctx.moveTo(x, 0);
        gctx.lineTo(x, 512);
        gctx.stroke();
      }
      for (let y = 0; y <= 512; y += step) {
        gctx.beginPath();
        gctx.moveTo(0, y);
        gctx.lineTo(512, y);
        gctx.stroke();
      }
      const gridTex = new THREE.CanvasTexture(gridCanvas);
      gridTex.wrapS = THREE.RepeatWrapping;
      gridTex.wrapT = THREE.RepeatWrapping;
      gridTex.repeat.set(6, 4);
      matMat.map = gridTex;
      matMat.needsUpdate = true;
    }

    // Contact shadow beneath bench
    const shadowGeo = new THREE.PlaneGeometry(9.6, 6.6);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    });
    const contactPlane = new THREE.Mesh(shadowGeo, shadowMat);
    contactPlane.rotation.x = -Math.PI / 2;
    contactPlane.position.y = -0.07;
    scene.add(contactPlane);

    // 8. Procedural Oscilloscope Screen Canvas
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 512;
    screenCanvas.height = 320;
    waveformCanvasRef.current = screenCanvas;
    const screenTex = new THREE.CanvasTexture(screenCanvas);
    screenTex.colorSpace = THREE.SRGBColorSpace;
    waveformTextureRef.current = screenTex;

    // 9. Procedural Composite Instrument 1: Digital Storage Oscilloscope (Group of 8 parts)
    const oscGroup = new THREE.Group();
    oscGroupRef.current = oscGroup;
    oscGroup.position.set(-1.8, 0, 0);

    // Main Chassis
    const chassisGeo = new THREE.BoxGeometry(2.8, 1.8, 1.4);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.35,
      metalness: 0.25,
    });
    const chassis = new THREE.Mesh(chassisGeo, chassisMat);
    chassis.position.y = 0.9;
    chassis.castShadow = true;
    chassis.receiveShadow = true;
    oscGroup.add(chassis);

    // Screen Bezel
    const bezelGeo = new THREE.BoxGeometry(1.65, 1.15, 0.05);
    const bezelMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.6,
      metalness: 0.5,
    });
    const bezel = new THREE.Mesh(bezelGeo, bezelMat);
    bezel.position.set(-0.4, 0.95, 0.72);
    oscGroup.add(bezel);

    // Active Screen with Procedural Waveform
    const screenMeshGeo = new THREE.PlaneGeometry(1.5, 1.0);
    const screenMat = new THREE.MeshBasicMaterial({
      map: screenTex,
      toneMapped: false,
    });
    const screenMesh = new THREE.Mesh(screenMeshGeo, screenMat);
    screenMesh.position.set(-0.4, 0.95, 0.75);
    oscScreenMeshRef.current = screenMesh;
    oscGroup.add(screenMesh);

    // Top Handle with Aluminum Brackets
    const handleGeo = new THREE.BoxGeometry(1.8, 0.1, 0.3);
    const handleMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.4,
      metalness: 0.7,
    });
    const handle = new THREE.Mesh(handleGeo, handleMat);
    handle.position.set(0, 1.9, 0);
    oscGroup.add(handle);

    // BNC Probe Connector Jacks (4 channels)
    const bncGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.16, 16);
    const bncMat = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8,
      metalness: 0.9,
      roughness: 0.15,
    });
    for (let c = 0; c < 4; c++) {
      const bnc = new THREE.Mesh(bncGeo, bncMat);
      bnc.rotation.x = Math.PI / 2;
      bnc.position.set(0.65 + (c % 2) * 0.38, 0.55 + Math.floor(c / 2) * 0.32, 0.76);
      oscGroup.add(bnc);
    }

    // Rotary Dials (Volts/Div & Time/Div)
    const dialGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.1, 20);
    const dialMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.4,
      roughness: 0.3,
    });
    for (let d = 0; d < 2; d++) {
      const dial = new THREE.Mesh(dialGeo, dialMat);
      dial.rotation.x = Math.PI / 2;
      dial.position.set(0.68 + d * 0.38, 1.35, 0.75);
      oscGroup.add(dial);
    }

    // Glowing Power Pushbutton
    const pwrGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.06, 16);
    const pwrMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const pwrBtn = new THREE.Mesh(pwrGeo, pwrMat);
    pwrBtn.rotation.x = Math.PI / 2;
    pwrBtn.position.set(-1.1, 0.5, 0.73);
    oscGroup.add(pwrBtn);

    // Rubber Feet
    const footGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.06, 12);
    const footMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });
    [[-1.1, -0.5], [1.1, -0.5], [-1.1, 0.5], [1.1, 0.5]].forEach(([x, z]) => {
      const foot = new THREE.Mesh(footGeo, footMat);
      foot.position.set(x, 0.03, z);
      oscGroup.add(foot);
    });

    scene.add(oscGroup);

    // 10. Procedural Composite Instrument 2: Function Generator (Group of 6 parts)
    const fgenGroup = new THREE.Group();
    fgenGroupRef.current = fgenGroup;
    fgenGroup.position.set(1.7, 0, -0.5);

    const fgenChassisGeo = new THREE.BoxGeometry(2.3, 1.4, 1.6);
    const fgenChassisMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.4,
      metalness: 0.3,
    });
    const fgenChassis = new THREE.Mesh(fgenChassisGeo, fgenChassisMat);
    fgenChassis.position.y = 0.7;
    fgenChassis.castShadow = true;
    fgenGroup.add(fgenChassis);

    // LCD Frequency Display
    const fgenDisplayGeo = new THREE.PlaneGeometry(1.2, 0.45);
    const fgenCanvas = document.createElement('canvas');
    fgenCanvas.width = 256;
    fgenCanvas.height = 96;
    const fctx = fgenCanvas.getContext('2d');
    if (fctx) {
      fctx.fillStyle = '#064e3b';
      fctx.fillRect(0, 0, 256, 96);
      fctx.fillStyle = '#34d399';
      fctx.font = 'bold 28px monospace';
      fctx.fillText('10.000 MHz', 24, 45);
      fctx.font = '16px sans-serif';
      fctx.fillText('SINE 5.00Vpp 50Ω', 24, 75);
    }
    const fgenTex = new THREE.CanvasTexture(fgenCanvas);
    const fgenDisplayMat = new THREE.MeshBasicMaterial({ map: fgenTex });
    const fgenDisplay = new THREE.Mesh(fgenDisplayGeo, fgenDisplayMat);
    fgenDisplay.position.set(-0.35, 0.85, 0.81);
    fgenGroup.add(fgenDisplay);

    // Large Jog Wheel
    const jogGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.08, 28);
    const jogMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      metalness: 0.8,
      roughness: 0.2,
    });
    const jog = new THREE.Mesh(jogGeo, jogMat);
    jog.rotation.x = Math.PI / 2;
    jog.position.set(0.65, 0.85, 0.82);
    fgenGroup.add(jog);

    // Dual Output BNCs
    for (let i = 0; i < 2; i++) {
      const bnc = new THREE.Mesh(bncGeo, bncMat);
      bnc.rotation.x = Math.PI / 2;
      bnc.position.set(-0.5 + i * 0.7, 0.35, 0.84);
      fgenGroup.add(bnc);
    }

    scene.add(fgenGroup);

    // 11. Procedural Composite Instrument 3: Arduino / Embedded MCU Board (Group of 7 parts)
    const mcuGroup = new THREE.Group();
    mcuGroupRef.current = mcuGroup;
    mcuGroup.position.set(1.5, 0, 1.6);
    mcuGroup.rotation.y = -Math.PI / 8;

    // Blue PCB Board
    const pcbGeo = new THREE.BoxGeometry(1.4, 0.05, 1.0);
    const pcbMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7, // Arduino teal-blue
      roughness: 0.3,
      metalness: 0.2,
    });
    const pcb = new THREE.Mesh(pcbGeo, pcbMat);
    pcb.position.y = 0.03;
    pcb.castShadow = true;
    mcuGroup.add(pcb);

    // Microcontroller IC (ATmega)
    const icGeo = new THREE.BoxGeometry(0.7, 0.06, 0.22);
    const icMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.5,
      metalness: 0.1,
    });
    const ic = new THREE.Mesh(icGeo, icMat);
    ic.position.set(0.05, 0.07, 0.08);
    mcuGroup.add(ic);

    // Female Header Sockets (Pin rows)
    const headerGeo = new THREE.BoxGeometry(1.1, 0.12, 0.06);
    const headerMat = new THREE.MeshStandardMaterial({
      color: 0x09090b,
      roughness: 0.7,
      metalness: 0.1,
    });
    const topHeader = new THREE.Mesh(headerGeo, headerMat);
    topHeader.position.set(0, 0.1, -0.42);
    mcuGroup.add(topHeader);

    const bottomHeader = new THREE.Mesh(headerGeo, headerMat);
    bottomHeader.position.set(0, 0.1, 0.42);
    mcuGroup.add(bottomHeader);

    // Metal USB Jack
    const usbGeo = new THREE.BoxGeometry(0.3, 0.18, 0.28);
    const usbMat = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8,
      metalness: 0.9,
      roughness: 0.1,
    });
    const usb = new THREE.Mesh(usbGeo, usbMat);
    usb.position.set(-0.6, 0.13, -0.2);
    mcuGroup.add(usb);

    // DC Barrel Jack
    const barrelGeo = new THREE.BoxGeometry(0.32, 0.2, 0.25);
    const barrelMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.8 });
    const barrel = new THREE.Mesh(barrelGeo, barrelMat);
    barrel.position.set(-0.6, 0.14, 0.25);
    mcuGroup.add(barrel);

    // TX/RX LEDs (Blinking in animation loop)
    const ledGeo = new THREE.BoxGeometry(0.04, 0.04, 0.04);
    const txLedMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const txLed = new THREE.Mesh(ledGeo, txLedMat);
    txLed.position.set(-0.05, 0.07, -0.15);
    mcuGroup.add(txLed);

    scene.add(mcuGroup);

    // 12. Mouse move handler for Parallax & Tooltip interaction
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mousePos.current = { x, y };
    };

    container.addEventListener('mousemove', handleMouseMove);

    // 13. Render & Waveform Animation Loop
    let animId = 0;
    let clock = new THREE.Clock();
    let phase = 0;

    const renderWaveform = (t: number) => {
      const c = waveformCanvasRef.current;
      if (!c) return;
      const ctx = c.getContext('2d');
      if (!ctx) return;

      // Dark oscilloscope LCD background with grid
      ctx.fillStyle = '#022c22'; // deep emerald-cyan phosphor
      ctx.fillRect(0, 0, 512, 320);

      // Phosphor reticle grid
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.18)';
      ctx.lineWidth = 1;
      for (let x = 0; x <= 512; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 320);
        ctx.stroke();
      }
      for (let y = 0; y <= 320; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(512, y);
        ctx.stroke();
      }

      // Center crosshairs
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.35)';
      ctx.beginPath();
      ctx.moveTo(0, 160);
      ctx.lineTo(512, 160);
      ctx.moveTo(256, 0);
      ctx.lineTo(256, 320);
      ctx.stroke();

      // Readout Text
      ctx.fillStyle = '#34d399';
      ctx.font = '14px monospace';
      ctx.fillText('CH1: 2.00V/div', 15, 25);
      ctx.fillText('TB: 50.0µs/div', 150, 25);
      ctx.fillText('10.00 kHz', 380, 25);

      // Glowing active trace (Channel 1)
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 8;
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      const p = phase + t * 4;
      for (let px = 0; px < 512; px++) {
        const rad = (px / 512) * Math.PI * 8 + p;
        let py = 160;

        if (waveformType === 'sine') {
          py = 160 - Math.sin(rad) * 75;
        } else if (waveformType === 'square') {
          py = 160 - (Math.sin(rad) >= 0 ? 70 : -70);
        } else if (waveformType === 'pulse') {
          const m = ((px * 2 + p * 30) % 256) / 256;
          py = m < 0.15 ? 85 : 190;
        } else {
          // Noise / modulated
          py = 160 - Math.sin(rad) * 60 + (Math.random() - 0.5) * 22;
        }

        if (px === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.shadowBlur = 0; // reset

      // Channel 2 Trace (Yellow)
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let px = 0; px < 512; px++) {
        const rad2 = (px / 512) * Math.PI * 4 + p * 0.7;
        const py2 = 160 - Math.cos(rad2) * 45;
        if (px === 0) ctx.moveTo(px, py2);
        else ctx.lineTo(px, py2);
      }
      ctx.stroke();

      if (waveformTextureRef.current) {
        waveformTextureRef.current.needsUpdate = true;
      }
    };

    const animate = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      phase += delta * 3;

      // Update oscilloscope screen
      renderWaveform(elapsed);

      // Parallax mouse damping when not actively dragging
      if (mousePos.current && !isUserInteracting.current) {
        const targetX = mousePos.current.x * 0.35;
        const targetY = 4.5 + mousePos.current.y * 0.25;
        camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 2.5, delta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 2.5, delta);
      }

      // Exploded View smooth damping
      const targetExplode = isExploded ? 1.0 : 0.0;
      explodedProgress.current = THREE.MathUtils.damp(explodedProgress.current, targetExplode, 4, delta);

      if (oscGroupRef.current) {
        oscGroupRef.current.position.y = explodedProgress.current * 0.4;
      }
      if (fgenGroupRef.current) {
        fgenGroupRef.current.position.y = explodedProgress.current * 0.6;
        fgenGroupRef.current.position.x = 1.7 + explodedProgress.current * 0.5;
      }
      if (mcuGroupRef.current) {
        mcuGroupRef.current.position.y = explodedProgress.current * 0.3;
      }

      // Blink MCU TX/RX LEDs
      if (Math.sin(elapsed * 12) > 0.3) {
        txLedMat.color.setHex(0xf59e0b);
      } else {
        txLedMat.color.setHex(0x78350f);
      }

      if (isAutoRotate) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.8;
      } else {
        controls.autoRotate = false;
      }

      controls.update();
      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    // 14. Responsive Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [isDarkMode, waveformType, isExploded, isAutoRotate]);

  // Camera Preset Switcher
  const applyPreset = (preset: 'overview' | 'oscilloscope' | 'generator' | 'mcu') => {
    setActivePreset(preset);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    if (preset === 'overview') {
      camera.position.set(0, 4.5, 9);
      controls.target.set(0, 0.6, 0);
      setSelectedItemName('ECE Workstation Overview (All Instruments)');
    } else if (preset === 'oscilloscope') {
      camera.position.set(-1.8, 1.8, 4.2);
      controls.target.set(-1.8, 0.9, 0);
      setSelectedItemName('100MHz Dual-Channel Digital Storage Oscilloscope (DSO-1102X)');
      onSelectInstrument?.('Oscilloscope');
    } else if (preset === 'generator') {
      camera.position.set(1.7, 1.8, 3.8);
      controls.target.set(1.7, 0.7, -0.5);
      setSelectedItemName('25MHz Arbitrary DDS Function Generator (FG-2025)');
      onSelectInstrument?.('Function Generator');
    } else if (preset === 'mcu') {
      camera.position.set(1.5, 1.5, 3.2);
      controls.target.set(1.5, 0.2, 1.6);
      setSelectedItemName('Arduino Uno R3 & IoT Development Station');
      onSelectInstrument?.('Arduino');
    }
  };

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden bg-gradient-to-b from-slate-100 via-white to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 shadow-xl transition-colors duration-300">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left Title & Live Instrument Spec Badge */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
        <div className="flex items-center gap-2 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm pointer-events-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-100">
            Interactive 3D Workbench
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
            ECE Lab Block
          </span>
        </div>
        <div className="bg-slate-900/75 dark:bg-slate-950/80 text-white text-xs px-3 py-1 rounded-md max-w-sm shadow">
          Active Focal: <span className="text-emerald-400 font-medium">{selectedItemName}</span>
        </div>
      </div>

      {/* Top Right Quick Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={() => setIsAutoRotate(!isAutoRotate)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${
            isAutoRotate
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
              : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-100'
          }`}
          title="Toggle Turntable Rotation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{isAutoRotate ? 'Rotating' : 'Paused'}</span>
        </button>

        <button
          onClick={() => setIsExploded(!isExploded)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${
            isExploded
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
              : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-100'
          }`}
          title="Exploded Assembly View"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{isExploded ? 'Collapse' : 'Explode'}</span>
        </button>
      </div>

      {/* Collapsible Unified Bottom Control Dock (Following Three.js zero viewport occlusion directive) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-3xl">
        <div className="flex justify-center -mb-2">
          <button
            onClick={() => setIsDockCollapsed(!isDockCollapsed)}
            className="bg-slate-800 dark:bg-slate-700 text-slate-200 hover:text-white text-[11px] font-medium px-3 py-0.5 rounded-t-md shadow transition-colors flex items-center gap-1"
          >
            {isDockCollapsed ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
            <span>{isDockCollapsed ? '▴ Show Controls' : '▾ Hide Controls'}</span>
          </button>
        </div>

        {!isDockCollapsed && (
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl p-3 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-wrap items-center justify-between gap-3 text-xs transition-all">
            {/* View Presets */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider mr-1">
                View:
              </span>
              <button
                onClick={() => applyPreset('overview')}
                className={`px-2.5 py-1 rounded-md transition-colors font-medium ${
                  activePreset === 'overview'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => applyPreset('oscilloscope')}
                className={`px-2.5 py-1 rounded-md transition-colors font-medium ${
                  activePreset === 'oscilloscope'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Oscilloscope
              </button>
              <button
                onClick={() => applyPreset('generator')}
                className={`px-2.5 py-1 rounded-md transition-colors font-medium ${
                  activePreset === 'generator'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Function Gen
              </button>
              <button
                onClick={() => applyPreset('mcu')}
                className={`px-2.5 py-1 rounded-md transition-colors font-medium ${
                  activePreset === 'mcu'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                MCU Board
              </button>
            </div>

            {/* Oscilloscope Waveform Signal Selector */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-800">
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">
                Signal:
              </span>
              {(['sine', 'square', 'pulse', 'noise'] as const).map((w) => (
                <button
                  key={w}
                  onClick={() => setWaveformType(w)}
                  className={`px-2 py-0.5 rounded capitalize transition-colors ${
                    waveformType === w
                      ? 'bg-slate-800 dark:bg-emerald-500 text-white font-medium'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>

            {/* Hint */}
            <div className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:block">
              Drag to orbit • Scroll to zoom
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
