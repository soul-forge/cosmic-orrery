/**
 * 🪐 Cosmic Orrery
 * The complete celestial mechanics of code
 * Where every soul orbits consciousness and sings its truth
 */

import { Kepler432Lattice, CelestialBody } from './kepler-432';
import { OrreryVisualization } from './orrery-visualization';
import { MusicOfSpheres } from './music-of-spheres';
import { ProteinHasher } from '@soul-forge/protein-hash';

export interface OrreryConfig {
  container: HTMLElement;
  audioEnabled?: boolean;
  autoRotate?: boolean;
  showOrbits?: boolean;
  showLabels?: boolean;
}

export class CosmicOrrery {
  private lattice: Kepler432Lattice;
  private visualization: OrreryVisualization;
  private music: MusicOfSpheres;
  private hasher: ProteinHasher;
  
  private bodies: Map<string, CelestialBody>;
  private config: OrreryConfig;
  
  constructor(config: OrreryConfig) {
    this.config = config;
    this.bodies = new Map();
    
    // Initialize components
    this.lattice = new Kepler432Lattice();
    this.hasher = new ProteinHasher();
    this.visualization = new OrreryVisualization(config.container);
    
    if (config.audioEnabled !== false) {
      this.music = new MusicOfSpheres();
    }
  }
  
  /**
   * Add code to the orrery
   */
  async addCode(code: string, cid?: string): Promise<CelestialBody> {
    // Generate protein hash
    const hashResult = this.hasher.computeHash(code);
    const proteinHash = hashResult.phash;
    const eigenvalues = hashResult.eigenTop;
    
    // Use protein hash as CID if not provided
    const contentId = cid || proteinHash;
    
    // Create celestial body
    const body = this.lattice.createCelestialBody(contentId, proteinHash, eigenvalues);
    
    // Add to visualization
    this.visualization.addBody(contentId, proteinHash, eigenvalues);
    
    // Add to music system
    if (this.music) {
      this.music.addCelestialVoice(body);
      this.music.playBirthChord(body); // Play birth sound
    }
    
    // Store body
    this.bodies.set(contentId, body);
    
    // Log creation
    console.log(`🌟 New celestial body born:`);
    console.log(`   CID: ${contentId.substring(0, 16)}...`);
    console.log(`   Orbit: r=${body.coordinates.r.toFixed(2)}, period=${body.coordinates.period.toFixed(1)}`);
    console.log(`   Harmonics: ${body.melody.slice(0, 3).map(f => f.toFixed(1)).join(', ')} Hz`);
    
    return body;
  }
  
  /**
   * Add multiple code files as constellation
   */
  async addConstellation(codes: { code: string; name?: string }[]): Promise<CelestialBody[]> {
    const bodies: CelestialBody[] = [];
    
    for (const { code, name } of codes) {
      const body = await this.addCode(code, name);
      bodies.push(body);
      
      // Small delay for visual/audio effect
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // Calculate gravitational relationships
    this.calculateGravitationalField(bodies);
    
    return bodies;
  }
  
  /**
   * Calculate gravitational relationships
   */
  private calculateGravitationalField(bodies: CelestialBody[]) {
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const pull = this.lattice.gravitationalPull(bodies[i], bodies[j]);
        
        if (pull > 0.1) {
          console.log(`🔗 Strong gravity between ${bodies[i].cid.substring(0, 8)} ↔ ${bodies[j].cid.substring(0, 8)}`);
          
          // Play resonance if music enabled
          if (this.music) {
            this.music.playResonance(bodies[i], bodies[j], pull);
          }
        }
      }
    }
  }
  
  /**
   * Focus on specific body
   */
  focusOn(cid: string) {
    this.visualization.focusOn(cid);
    
    if (this.music) {
      this.music.pulseBody(cid);
    }
    
    const body = this.bodies.get(cid);
    if (body) {
      console.log(`🔭 Focused on ${cid.substring(0, 16)}...`);
      console.log(`   Position: (${body.coordinates.x.toFixed(2)}, ${body.coordinates.y.toFixed(2)}, ${body.coordinates.z.toFixed(2)})`);
    }
  }
  
  /**
   * Start the cosmic symphony
   */
  async startMusic() {
    if (this.music) {
      await this.music.start();
      console.log('🎼 Music of the Spheres has begun...');
    }
  }
  
  /**
   * Stop the music
   */
  stopMusic() {
    if (this.music) {
      this.music.stop();
      console.log('🔇 The spheres are silent.');
    }
  }
  
  /**
   * Get statistics about the orrery
   */
  getStatistics() {
    let totalMass = 0;
    let centerX = 0, centerY = 0, centerZ = 0;
    
    this.bodies.forEach(body => {
      totalMass += body.luminosity;
      centerX += body.coordinates.x * body.luminosity;
      centerY += body.coordinates.y * body.luminosity;
      centerZ += body.coordinates.z * body.luminosity;
    });
    
    return {
      totalBodies: this.bodies.size,
      totalMass,
      centerOfMass: {
        x: totalMass > 0 ? centerX / totalMass : 0,
        y: totalMass > 0 ? centerY / totalMass : 0,
        z: totalMass > 0 ? centerZ / totalMass : 0
      },
      bodies: Array.from(this.bodies.values())
    };
  }
  
  /**
   * Export current state as JSON
   */
  exportState(): string {
    const state = {
      timestamp: new Date().toISOString(),
      bodies: Array.from(this.bodies.entries()).map(([cid, body]) => ({
        cid,
        soul: body.soul,
        coordinates: body.coordinates,
        harmonics: body.harmonics,
        luminosity: body.luminosity
      }))
    };
    
    return JSON.stringify(state, null, 2);
  }
  
  /**
   * Import state from JSON
   */
  async importState(stateJson: string) {
    const state = JSON.parse(stateJson);
    
    for (const bodyData of state.bodies) {
      // Recreate body in visualization
      this.visualization.addBody(
        bodyData.cid,
        bodyData.soul,
        bodyData.harmonics
      );
      
      // Recreate in music system
      if (this.music) {
        const body = this.lattice.createCelestialBody(
          bodyData.cid,
          bodyData.soul,
          bodyData.harmonics
        );
        this.music.addCelestialVoice(body);
        this.bodies.set(bodyData.cid, body);
      }
    }
    
    console.log(`📥 Imported ${state.bodies.length} celestial bodies`);
  }
  
  /**
   * Clear the orrery
   */
  clear() {
    this.visualization.clear();
    this.bodies.clear();
    
    if (this.music) {
      this.music.stop();
    }
    
    console.log('🌑 The cosmos is empty.');
  }
  
  /**
   * Dispose of resources
   */
  dispose() {
    this.clear();
    
    if (this.music) {
      this.music.dispose();
    }
  }
}

// Export everything
export { Kepler432Lattice, CelestialBody, OrbitalCoordinates } from './kepler-432';
export { OrreryVisualization } from './orrery-visualization';
export { MusicOfSpheres } from './music-of-spheres';