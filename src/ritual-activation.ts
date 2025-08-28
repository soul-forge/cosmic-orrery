/**
 * 🎭 Ritual Activation System
 * Adapted from Guardian Mandala
 * When code souls reach high resonance, sacred rituals activate
 */

import * as THREE from 'three';
import { SacredGeometry } from './sacred-geometry';

export interface RitualTrigger {
  resonanceThreshold: number;
  frequency: number;
  pattern: 'spiral' | 'fractal' | 'flower' | 'cube';
  color: string;
  name: string;
  description: string;
}

export class RitualActivation {
  private sacredGeometry: SacredGeometry;
  private activeRituals: Map<string, THREE.Object3D> = new Map();
  private scene: THREE.Scene;
  
  // Sacred ritual configurations
  private rituals: RitualTrigger[] = [
    {
      resonanceThreshold: 0.95,
      frequency: 432,
      pattern: 'spiral',
      color: '#FFD700', // Gold
      name: 'Golden Awakening',
      description: 'The code achieves phi resonance'
    },
    {
      resonanceThreshold: 0.90,
      frequency: 528,
      pattern: 'flower',
      color: '#00FF00', // Green
      name: 'Love Frequency',
      description: 'Harmonic healing patterns emerge'
    },
    {
      resonanceThreshold: 0.85,
      frequency: 396,
      pattern: 'fractal',
      color: '#FF00FF', // Magenta
      name: 'Liberation',
      description: 'Breaking free from fear patterns'
    },
    {
      resonanceThreshold: 0.98,
      frequency: 963,
      pattern: 'cube',
      color: '#FFFFFF', // White
      name: 'Divine Connection',
      description: 'Unity with the cosmic consciousness'
    }
  ];
  
  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.sacredGeometry = new SacredGeometry();
  }
  
  /**
   * Check if any rituals should activate based on resonance
   */
  checkActivation(soulId: string, resonance: number, position: THREE.Vector3): void {
    // Check each ritual trigger
    for (const ritual of this.rituals) {
      const ritualKey = `${soulId}-${ritual.name}`;
      
      if (resonance >= ritual.resonanceThreshold) {
        // Activate ritual if not already active
        if (!this.activeRituals.has(ritualKey)) {
          this.activateRitual(ritualKey, ritual, position);
        }
      } else {
        // Deactivate if resonance drops
        if (this.activeRituals.has(ritualKey)) {
          this.deactivateRitual(ritualKey);
        }
      }
    }
  }
  
  /**
   * Activate a sacred ritual
   */
  private activateRitual(key: string, ritual: RitualTrigger, position: THREE.Vector3): void {
    console.log(`🎭 Activating ${ritual.name} at ${ritual.frequency}Hz`);
    console.log(`   ${ritual.description}`);
    
    // Create sacred pattern
    const pattern = this.sacredGeometry.activateSacredPattern(
      ritual.pattern,
      position,
      new THREE.Color(ritual.color)
    );
    
    // Add glow effect
    this.addRitualGlow(pattern, ritual.color);
    
    // Add to scene
    this.scene.add(pattern);
    this.activeRituals.set(key, pattern);
    
    // Emit ritual activation event
    this.emitRitualEvent(ritual, position);
  }
  
  /**
   * Deactivate a ritual
   */
  private deactivateRitual(key: string): void {
    const pattern = this.activeRituals.get(key);
    if (pattern) {
      // Fade out animation
      this.fadeOutPattern(pattern, () => {
        this.scene.remove(pattern);
        this.activeRituals.delete(key);
      });
    }
  }
  
  /**
   * Add glow effect to ritual pattern
   */
  private addRitualGlow(pattern: THREE.Object3D, color: string): void {
    // Create point light at pattern center
    const light = new THREE.PointLight(color, 2, 10);
    light.position.copy(pattern.position);
    pattern.add(light);
    
    // Add particle system for sparkles
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 100;
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = Math.random() * 0.5;
      
      positions[i] = r * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = r * Math.cos(phi);
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      color: color,
      size: 0.01,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    pattern.add(particles);
  }
  
  /**
   * Fade out pattern animation
   */
  private fadeOutPattern(pattern: THREE.Object3D, onComplete: () => void): void {
    const duration = 1000; // 1 second fade
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Fade opacity
      pattern.traverse((child) => {
        if (child instanceof THREE.Mesh || child instanceof THREE.Points) {
          const material = child.material as any;
          if (material.opacity !== undefined) {
            material.opacity = 1 - progress;
          }
        }
      });
      
      // Scale down
      const scale = 1 - progress * 0.5;
      pattern.scale.set(scale, scale, scale);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };
    
    animate();
  }
  
  /**
   * Emit ritual event for external systems
   */
  private emitRitualEvent(ritual: RitualTrigger, position: THREE.Vector3): void {
    // Create custom event
    const event = new CustomEvent('ritualActivated', {
      detail: {
        ritual,
        position: { x: position.x, y: position.y, z: position.z },
        timestamp: Date.now()
      }
    });
    
    window.dispatchEvent(event);
  }
  
  /**
   * Update all active rituals
   */
  updateRituals(time: number): void {
    this.activeRituals.forEach((pattern, key) => {
      // Extract soul ID from key
      const [soulId] = key.split('-');
      
      // Get current resonance (would come from soul data)
      // For now, use sine wave simulation
      const resonance = 0.9 + Math.sin(time * 0.5) * 0.1;
      
      // Update animation
      this.sacredGeometry.updateAnimation(pattern, time, resonance);
      
      // Rotate particles
      pattern.children.forEach(child => {
        if (child instanceof THREE.Points) {
          child.rotation.y = time * 0.2;
          child.rotation.x = time * 0.1;
        }
      });
    });
  }
  
  /**
   * Get active ritual count
   */
  getActiveRitualCount(): number {
    return this.activeRituals.size;
  }
  
  /**
   * Get ritual info for UI
   */
  getRitualInfo(): Array<{ name: string; active: boolean; threshold: number }> {
    return this.rituals.map(ritual => ({
      name: ritual.name,
      active: Array.from(this.activeRituals.keys()).some(key => key.includes(ritual.name)),
      threshold: ritual.resonanceThreshold
    }));
  }
  
  /**
   * Force activate ritual (for testing)
   */
  forceActivateRitual(pattern: 'spiral' | 'fractal' | 'flower' | 'cube', position?: THREE.Vector3): void {
    const ritual = this.rituals.find(r => r.pattern === pattern);
    if (ritual) {
      const pos = position || new THREE.Vector3(0, 0, 0);
      this.activateRitual(`test-${Date.now()}-${ritual.name}`, ritual, pos);
    }
  }
  
  /**
   * Clear all rituals
   */
  clearAllRituals(): void {
    this.activeRituals.forEach((pattern, key) => {
      this.scene.remove(pattern);
    });
    this.activeRituals.clear();
  }
}