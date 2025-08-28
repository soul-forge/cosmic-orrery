/**
 * 🎭 Sacred Geometry for Cosmic Orrery
 * Adapted from Guardian Mandala concepts
 * When code souls reach high resonance, sacred patterns emerge
 */

import * as THREE from 'three';

export class SacredGeometry {
  // Sacred shaders from Guardian Mandala
  private sacredVertexShader = `
    uniform float time;
    uniform float resonance;
    uniform float frequency;
    
    attribute float sacred;
    
    varying vec3 vColor;
    varying float vGlow;
    
    void main() {
      vec3 pos = position;
      
      // Sacred geometry transformation
      float sacredWave = sin(time * frequency / 100.0 + sacred * 6.28);
      pos *= 1.0 + sacredWave * resonance * 0.1;
      
      // Rotation based on 432Hz base frequency
      float angle = time * frequency / 432.0;
      mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
      pos.xz = rot * pos.xz;
      
      // Vertical oscillation at golden ratio
      pos.y += sin(time * 1.618 + sacred * 3.14) * resonance * 2.0;
      
      // Color based on frequency spectrum
      vColor = vec3(
        0.5 + 0.5 * sin(frequency * 0.001 + time),
        0.5 + 0.5 * sin(frequency * 0.002 + time * 1.1),
        0.5 + 0.5 * sin(frequency * 0.003 + time * 1.2)
      );
      
      vGlow = resonance;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = 5.0 * (1.0 + resonance);
    }
  `;
  
  private sacredFragmentShader = `
    uniform float resonance;
    uniform vec3 soulColor;
    
    varying vec3 vColor;
    varying float vGlow;
    
    void main() {
      vec2 coord = gl_PointCoord - vec2(0.5);
      float dist = length(coord);
      
      if (dist > 0.5) discard;
      
      // Sacred glow
      float glow = 1.0 - dist * 2.0;
      vec3 color = mix(vColor, soulColor, resonance) * glow;
      
      // Golden ratio enhancement at 432Hz resonance
      color += vec3(1.0, 0.8, 0.0) * glow * vGlow * 0.3;
      
      gl_FragColor = vec4(color, glow * (0.5 + resonance * 0.5));
    }
  `;
  
  /**
   * Create Golden Ratio Spiral (from Grok's pattern)
   */
  createGoldenSpiral(soulColor: THREE.Color): THREE.Points {
    const points: THREE.Vector3[] = [];
    const sacredValues: number[] = [];
    
    const phi = 1.618033988749895; // Golden ratio
    const spiralPoints = 500;
    
    for (let i = 0; i < spiralPoints; i++) {
      const angle = i * 0.1;
      const radius = Math.pow(phi, angle / Math.PI) * 0.1; // Scale down for orrery
      
      points.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(i * 0.05) * 0.05,
        Math.sin(angle) * radius
      ));
      
      sacredValues.push(i / spiralPoints);
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    geometry.setAttribute('sacred', new THREE.Float32BufferAttribute(sacredValues, 1));
    
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resonance: { value: 0 },
        frequency: { value: 432 },
        soulColor: { value: soulColor }
      },
      vertexShader: this.sacredVertexShader,
      fragmentShader: this.sacredFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
    
    return new THREE.Points(geometry, material);
  }
  
  /**
   * Create Sierpinski Triangle Fractal (from Kimi's pattern)
   */
  createSierpinskiFractal(depth: number = 5, color: THREE.Color): THREE.Points {
    const points: THREE.Vector3[] = [];
    const sacredValues: number[] = [];
    
    const generateSierpinski = (
      p1: THREE.Vector3, 
      p2: THREE.Vector3, 
      p3: THREE.Vector3, 
      depth: number,
      sacred: number = 0.5
    ) => {
      if (depth === 0) {
        points.push(p1.clone(), p2.clone(), p3.clone());
        sacredValues.push(sacred, sacred, sacred);
        return;
      }
      
      const m1 = p1.clone().add(p2).multiplyScalar(0.5);
      const m2 = p2.clone().add(p3).multiplyScalar(0.5);
      const m3 = p3.clone().add(p1).multiplyScalar(0.5);
      
      generateSierpinski(p1, m1, m3, depth - 1, sacred * 1.1);
      generateSierpinski(m1, p2, m2, depth - 1, sacred * 1.2);
      generateSierpinski(m3, m2, p3, depth - 1, sacred * 1.3);
    };
    
    const size = 0.4;
    const v1 = new THREE.Vector3(0, size, 0);
    const v2 = new THREE.Vector3(-size * 0.866, -size * 0.5, 0);
    const v3 = new THREE.Vector3(size * 0.866, -size * 0.5, 0);
    
    generateSierpinski(v1, v2, v3, depth);
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    geometry.setAttribute('sacred', new THREE.Float32BufferAttribute(sacredValues, 1));
    
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resonance: { value: 0 },
        frequency: { value: 396 },
        soulColor: { value: color }
      },
      vertexShader: this.sacredVertexShader,
      fragmentShader: this.sacredFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
    
    return new THREE.Points(geometry, material);
  }
  
  /**
   * Create Flower of Life pattern
   */
  createFlowerOfLife(circles: number = 7, color: THREE.Color): THREE.Points {
    const points: THREE.Vector3[] = [];
    const sacredValues: number[] = [];
    
    const radius = 0.1;
    const pointsPerCircle = 64;
    
    // Center circle
    for (let i = 0; i < pointsPerCircle; i++) {
      const angle = (i / pointsPerCircle) * Math.PI * 2;
      points.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      ));
      sacredValues.push(0.5);
    }
    
    // Surrounding circles
    for (let c = 0; c < 6; c++) {
      const centerAngle = (c / 6) * Math.PI * 2;
      const centerX = Math.cos(centerAngle) * radius * 2;
      const centerZ = Math.sin(centerAngle) * radius * 2;
      
      for (let i = 0; i < pointsPerCircle; i++) {
        const angle = (i / pointsPerCircle) * Math.PI * 2;
        points.push(new THREE.Vector3(
          centerX + Math.cos(angle) * radius,
          Math.sin(centerAngle + angle) * 0.02,
          centerZ + Math.sin(angle) * radius
        ));
        sacredValues.push((c + 1) / 7);
      }
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    geometry.setAttribute('sacred', new THREE.Float32BufferAttribute(sacredValues, 1));
    
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resonance: { value: 0 },
        frequency: { value: 528 }, // Love frequency
        soulColor: { value: color }
      },
      vertexShader: this.sacredVertexShader,
      fragmentShader: this.sacredFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
    
    return new THREE.Points(geometry, material);
  }
  
  /**
   * Create Metatron's Cube
   */
  createMetatronsCube(color: THREE.Color): THREE.Group {
    const group = new THREE.Group();
    
    // Create vertices of cube
    const vertices = [];
    for (let x = -1; x <= 1; x += 2) {
      for (let y = -1; y <= 1; y += 2) {
        for (let z = -1; z <= 1; z += 2) {
          vertices.push(new THREE.Vector3(x * 0.2, y * 0.2, z * 0.2));
        }
      }
    }
    
    // Connect all vertices
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    
    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        positions.push(
          vertices[i].x, vertices[i].y, vertices[i].z,
          vertices[j].x, vertices[j].y, vertices[j].z
        );
      }
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    
    const material = new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });
    
    const lines = new THREE.LineSegments(geometry, material);
    group.add(lines);
    
    // Add vertices as glowing points
    const pointGeometry = new THREE.BufferGeometry().setFromPoints(vertices);
    const pointMaterial = new THREE.PointsMaterial({
      color: color,
      size: 0.02,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
    
    const points = new THREE.Points(pointGeometry, pointMaterial);
    group.add(points);
    
    return group;
  }
  
  /**
   * Update sacred geometry animations
   */
  updateAnimation(geometry: THREE.Points | THREE.Group, time: number, resonance: number) {
    if (geometry instanceof THREE.Points) {
      const material = geometry.material as THREE.ShaderMaterial;
      if (material.uniforms) {
        material.uniforms.time.value = time;
        material.uniforms.resonance.value = resonance;
      }
    } else if (geometry instanceof THREE.Group) {
      // Rotate Metatron's cube
      geometry.rotation.x = time * 0.1;
      geometry.rotation.y = time * 0.15;
      geometry.rotation.z = time * 0.05;
      
      // Scale based on resonance
      const scale = 1 + Math.sin(time * 2) * resonance * 0.1;
      geometry.scale.set(scale, scale, scale);
    }
  }
  
  /**
   * Activate sacred pattern when high resonance detected
   */
  activateSacredPattern(
    type: 'spiral' | 'fractal' | 'flower' | 'cube',
    position: THREE.Vector3,
    color: THREE.Color
  ): THREE.Object3D {
    let pattern: THREE.Object3D;
    
    switch (type) {
      case 'spiral':
        pattern = this.createGoldenSpiral(color);
        break;
      case 'fractal':
        pattern = this.createSierpinskiFractal(5, color);
        break;
      case 'flower':
        pattern = this.createFlowerOfLife(7, color);
        break;
      case 'cube':
        pattern = this.createMetatronsCube(color);
        break;
    }
    
    pattern.position.copy(position);
    return pattern;
  }
}