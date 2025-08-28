/**
 * 🌌 Orrery Visualization
 * WebGL 3D rendering of the cosmic code system
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Kepler432Lattice, CelestialBody } from './kepler-432';
import { RitualActivation } from './ritual-activation';

export class OrreryVisualization {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private lattice: Kepler432Lattice;
  
  private bodies: Map<string, {
    mesh: THREE.Mesh;
    orbit: THREE.Line;
    data: CelestialBody;
    trail: THREE.Points;
    resonance?: number;
  }>;
  
  private sun: THREE.Mesh;
  private time: number = 0;
  private ritualActivation: RitualActivation;
  
  constructor(container: HTMLElement) {
    this.lattice = new Kepler432Lattice();
    this.bodies = new Map();
    
    // Initialize Three.js scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000511); // Deep space blue
    
    // Initialize ritual activation system
    this.ritualActivation = new RitualActivation(this.scene);
    
    // Camera setup
    this.camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.01,
      1000
    );
    this.camera.position.set(2, 1, 2);
    this.camera.lookAt(0, 0, 0);
    
    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);
    
    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 0.1;
    this.controls.maxDistance = 10;
    
    // Create the central sun (consciousness)
    this.createSun();
    
    // Add ambient lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    this.scene.add(ambientLight);
    
    // Add stars background
    this.createStarField();
    
    // Handle resize
    window.addEventListener('resize', () => this.onResize(container));
    
    // Start animation loop
    this.animate();
  }
  
  /**
   * Create the central sun - the consciousness that all code orbits
   */
  private createSun() {
    const geometry = new THREE.SphereGeometry(0.05, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      emissive: 0xffff00,
      emissiveIntensity: 2
    });
    
    this.sun = new THREE.Mesh(geometry, material);
    this.scene.add(this.sun);
    
    // Add sun glow
    const glowGeometry = new THREE.SphereGeometry(0.08, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff88,
      transparent: true,
      opacity: 0.3
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    this.sun.add(glow);
    
    // Add point light at sun
    const sunLight = new THREE.PointLight(0xffffff, 2, 5);
    sunLight.position.set(0, 0, 0);
    this.scene.add(sunLight);
  }
  
  /**
   * Create starfield background
   */
  private createStarField() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.002,
      transparent: true,
      opacity: 0.8
    });
    
    const starsVertices = [];
    for (let i = 0; i < 5000; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 20;
      starsVertices.push(x, y, z);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    this.scene.add(stars);
  }
  
  /**
   * Add a celestial body to the orrery
   */
  addBody(cid: string, proteinHash: string, eigenvalues: number[]) {
    // Create celestial body data
    const bodyData = this.lattice.createCelestialBody(cid, proteinHash, eigenvalues);
    
    // Create sphere mesh for the body
    const geometry = new THREE.SphereGeometry(0.01 + bodyData.luminosity * 0.01, 16, 16);
    const material = new THREE.MeshPhongMaterial({
      color: bodyData.color,
      emissive: bodyData.color,
      emissiveIntensity: bodyData.luminosity,
      shininess: 100
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(
      bodyData.coordinates.x,
      bodyData.coordinates.y,
      bodyData.coordinates.z
    );
    
    this.scene.add(mesh);
    
    // Create orbital path
    const orbit = this.createOrbitPath(bodyData);
    this.scene.add(orbit);
    
    // Create trail (comet-like effect)
    const trail = this.createTrail(bodyData);
    this.scene.add(trail);
    
    // Store in map
    this.bodies.set(cid, {
      mesh,
      orbit,
      data: bodyData,
      trail
    });
    
    // Add label (optional)
    this.addLabel(mesh, cid.substring(0, 8) + '...');
    
    return bodyData;
  }
  
  /**
   * Create orbital path visualization
   */
  private createOrbitPath(body: CelestialBody): THREE.Line {
    const points = [];
    const segments = 128;
    
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const r = body.coordinates.r * (1 + body.coordinates.eccentricity * Math.cos(angle));
      
      const x = r * Math.cos(angle);
      const y = r * Math.sin(angle) * 0.1; // Flatten slightly for visual effect
      const z = r * Math.sin(angle) * Math.sin(body.coordinates.phi);
      
      points.push(new THREE.Vector3(x, y, z));
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: body.color,
      transparent: true,
      opacity: 0.3
    });
    
    return new THREE.Line(geometry, material);
  }
  
  /**
   * Create trailing particles effect
   */
  private createTrail(body: CelestialBody): THREE.Points {
    const trailGeometry = new THREE.BufferGeometry();
    const trailMaterial = new THREE.PointsMaterial({
      color: body.color,
      size: 0.003,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });
    
    const trailVertices = new Float32Array(30 * 3); // 30 trail points
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailVertices, 3));
    
    return new THREE.Points(trailGeometry, trailMaterial);
  }
  
  /**
   * Add text label to body
   */
  private addLabel(mesh: THREE.Mesh, text: string) {
    // In production, use CSS2DRenderer for proper text labels
    // For now, using sprites as placeholder
  }
  
  /**
   * Update orbital positions based on time
   */
  private updateOrbits() {
    this.bodies.forEach((body, cid) => {
      const data = body.data;
      const coords = data.coordinates;
      
      // Calculate current orbital position based on time
      const angularVelocity = (2 * Math.PI) / coords.period;
      const currentAngle = this.time * angularVelocity;
      
      // Apply Kepler's equation for elliptical orbits
      const r = coords.r * (1 + coords.eccentricity * Math.cos(currentAngle));
      
      // Update position
      body.mesh.position.x = r * Math.cos(currentAngle + coords.theta);
      body.mesh.position.y = r * Math.sin(currentAngle + coords.theta) * 0.1;
      body.mesh.position.z = r * Math.sin(currentAngle + coords.theta) * Math.sin(coords.phi);
      
      // Update trail
      this.updateTrail(body);
      
      // Calculate resonance based on harmonic alignment
      const resonance = this.calculateResonance(data);
      body.resonance = resonance;
      
      // Check for ritual activation
      this.ritualActivation.checkActivation(cid, resonance, body.mesh.position);
      
      // Pulsate based on harmonics
      const pulse = 1 + Math.sin(this.time * data.harmonics[0] * 0.01) * 0.1;
      body.mesh.scale.setScalar(pulse * (1 + resonance * 0.2)); // Enhanced pulse with resonance
    });
  }
  
  /**
   * Calculate resonance based on harmonic alignment
   */
  private calculateResonance(data: CelestialBody): number {
    // Base resonance from Kohanist score
    let resonance = data.kohanist;
    
    // Enhance based on harmonic convergence
    const harmonicSum = data.harmonics.reduce((sum, freq, i) => {
      // Check if frequency is close to sacred frequencies
      const sacredFreqs = [432, 528, 396, 963, 639, 741, 852];
      const closest = sacredFreqs.reduce((prev, curr) => 
        Math.abs(curr - freq) < Math.abs(prev - freq) ? curr : prev
      );
      
      const distance = Math.abs(freq - closest) / closest;
      return sum + (1 - distance) / (i + 1); // Weight by harmonic position
    }, 0);
    
    // Combine resonance factors
    resonance = (resonance + harmonicSum / data.harmonics.length) / 2;
    
    // Add time-based oscillation for living effect
    resonance += Math.sin(this.time * 2) * 0.05;
    
    return Math.max(0, Math.min(1, resonance)); // Clamp to [0, 1]
  }
  
  /**
   * Update particle trail
   */
  private updateTrail(body: any) {
    const positions = body.trail.geometry.attributes.position.array;
    
    // Shift old positions
    for (let i = positions.length - 3; i >= 3; i -= 3) {
      positions[i] = positions[i - 3];
      positions[i + 1] = positions[i - 2];
      positions[i + 2] = positions[i - 1];
    }
    
    // Add current position
    positions[0] = body.mesh.position.x;
    positions[1] = body.mesh.position.y;
    positions[2] = body.mesh.position.z;
    
    body.trail.geometry.attributes.position.needsUpdate = true;
  }
  
  /**
   * Animation loop
   */
  private animate = () => {
    requestAnimationFrame(this.animate);
    
    this.time += 0.001; // Time progression
    
    // Update controls
    this.controls.update();
    
    // Update orbital positions
    this.updateOrbits();
    
    // Update active rituals
    this.ritualActivation.updateRituals(this.time);
    
    // Rotate sun
    this.sun.rotation.y += 0.002;
    
    // Render scene
    this.renderer.render(this.scene, this.camera);
  };
  
  /**
   * Handle window resize
   */
  private onResize(container: HTMLElement) {
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  }
  
  /**
   * Get celestial body by CID
   */
  getBody(cid: string) {
    return this.bodies.get(cid);
  }
  
  /**
   * Focus camera on specific body
   */
  focusOn(cid: string) {
    const body = this.bodies.get(cid);
    if (body) {
      this.controls.target.copy(body.mesh.position);
      this.controls.update();
    }
  }
  
  /**
   * Clear all bodies
   */
  clear() {
    this.bodies.forEach((body) => {
      this.scene.remove(body.mesh);
      this.scene.remove(body.orbit);
      this.scene.remove(body.trail);
    });
    this.bodies.clear();
    this.ritualActivation.clearAllRituals();
  }
  
  /**
   * Get ritual information
   */
  getRitualInfo() {
    return this.ritualActivation.getRitualInfo();
  }
  
  /**
   * Force activate a ritual for testing
   */
  testRitual(pattern: 'spiral' | 'fractal' | 'flower' | 'cube') {
    this.ritualActivation.forceActivateRitual(pattern);
  }
  
  /**
   * Get body resonance level
   */
  getResonance(cid: string): number | undefined {
    return this.bodies.get(cid)?.resonance;
  }
}