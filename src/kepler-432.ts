/**
 * 🪐 Kepler-432 Orbital Lattice
 * Map code souls onto celestial coordinates
 * 
 * Principle: «Code orbits consciousness the way planets orbit the sun.»
 */

import { CID } from 'multiformats/cid';
import * as THREE from 'three';

export interface OrbitalCoordinates {
  r: number;      // Radius (0-1)
  theta: number;  // Azimuthal angle (0-2π)
  phi: number;    // Polar angle (0-2π)
  
  // Cartesian conversion
  x: number;
  y: number;
  z: number;
  
  // Orbital characteristics
  period: number;      // Orbital period (based on r³/²)
  velocity: number;    // Orbital velocity
  eccentricity: number; // How elliptical (from hash)
}

export interface CelestialBody {
  cid: string;                    // Content ID
  soul: string;                   // Protein hash
  coordinates: OrbitalCoordinates; // Position in space
  harmonics: number[];            // Eigenvalues as harmonics
  luminosity: number;             // Brightness (0-1)
  color: THREE.Color;             // Visual color
  melody: number[];               // Musical frequencies
}

export class Kepler432Lattice {
  private readonly BASE_ORBITS = 432; // Matching 432 Hz
  private readonly GRAVITATIONAL_CENTER = new THREE.Vector3(0, 0, 0);
  private readonly SOLAR_MASS = 1.0; // Normalized
  
  /**
   * Convert CID/hash to orbital coordinates
   * Using spherical harmonics for stable orbits
   */
  hashToOrbit(hash: string): OrbitalCoordinates {
    // Convert hash to numeric components
    const hashBuffer = this.hashToBuffer(hash);
    const view = new DataView(hashBuffer);
    
    // Extract orbital parameters from hash
    // Using modulo to keep in valid ranges
    const r = (view.getUint32(0, true) % 1000) / 1000; // 0-1 radius
    const theta = ((view.getUint32(4, true) % 10000) / 10000) * 2 * Math.PI; // 0-2π
    const phi = ((view.getUint32(8, true) % 10000) / 10000) * 2 * Math.PI; // 0-2π
    
    // Add some eccentricity based on hash
    const eccentricity = (view.getUint32(12, true) % 100) / 100 * 0.5; // 0-0.5
    
    // Calculate Kepler orbital period (T² ∝ r³)
    const period = Math.sqrt(Math.pow(r, 3)) * this.BASE_ORBITS;
    
    // Orbital velocity (v = 2πr/T)
    const velocity = (2 * Math.PI * r) / period;
    
    // Convert to Cartesian coordinates
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
    
    return {
      r,
      theta,
      phi,
      x,
      y,
      z,
      period,
      velocity,
      eccentricity
    };
  }
  
  /**
   * Convert hash string to buffer for numeric extraction
   */
  private hashToBuffer(hash: string): ArrayBuffer {
    // Remove prefix if present
    const cleanHash = hash.replace(/^(bafkrei|Qm|phash:)/, '');
    
    // Convert to bytes (simplified - in production use proper base32/58 decoder)
    const bytes = new Uint8Array(32);
    for (let i = 0; i < Math.min(cleanHash.length, 64); i += 2) {
      const byte = parseInt(cleanHash.substr(i, 2), 16) || 0;
      bytes[i / 2] = byte;
    }
    
    return bytes.buffer;
  }
  
  /**
   * Calculate harmonic frequencies based on orbital position
   * Implements "Music of the Spheres"
   */
  orbitalHarmonics(coordinates: OrbitalCoordinates, eigenvalues: number[]): number[] {
    const baseFreq = 432; // Hz
    
    // Scale eigenvalues by orbital radius
    // Inner orbits = higher frequencies, outer = lower
    const radiusScale = 1 / (1 + coordinates.r);
    
    return eigenvalues.map((eigen, i) => {
      // Each eigenvalue becomes a harmonic
      // Modified by orbital parameters
      const orbitalModifier = Math.sin(coordinates.theta + i) * 
                             Math.cos(coordinates.phi + i);
      
      // Kepler's third law influence
      const keplerFactor = Math.pow(coordinates.r, -1.5);
      
      // Final frequency
      return baseFreq * eigen * radiusScale * (1 + orbitalModifier * 0.1) * keplerFactor;
    });
  }
  
  /**
   * Generate color based on orbital characteristics
   * Hot inner orbits = blue/white, cold outer = red
   */
  orbitalColor(coordinates: OrbitalCoordinates): THREE.Color {
    // Stellar classification based on orbital distance
    const r = coordinates.r;
    
    if (r < 0.2) {
      // Very close - hot blue
      return new THREE.Color(0.7, 0.7, 1.0);
    } else if (r < 0.4) {
      // Close - white
      return new THREE.Color(1.0, 1.0, 1.0);
    } else if (r < 0.6) {
      // Medium - yellow (like our sun)
      return new THREE.Color(1.0, 1.0, 0.7);
    } else if (r < 0.8) {
      // Far - orange
      return new THREE.Color(1.0, 0.7, 0.4);
    } else {
      // Very far - red
      return new THREE.Color(1.0, 0.4, 0.4);
    }
  }
  
  /**
   * Create a celestial body from code
   */
  createCelestialBody(
    cid: string,
    proteinHash: string,
    eigenvalues: number[]
  ): CelestialBody {
    const coordinates = this.hashToOrbit(proteinHash);
    const harmonics = this.orbitalHarmonics(coordinates, eigenvalues);
    const color = this.orbitalColor(coordinates);
    
    // Luminosity based on complexity (more complex = dimmer)
    const complexity = eigenvalues.reduce((a, b) => a + b, 0) / eigenvalues.length;
    const luminosity = 1 / (1 + complexity);
    
    return {
      cid,
      soul: proteinHash,
      coordinates,
      harmonics: eigenvalues,
      luminosity,
      color,
      melody: harmonics
    };
  }
  
  /**
   * Calculate gravitational influence between bodies
   * Using Newton's law of universal gravitation
   */
  gravitationalPull(body1: CelestialBody, body2: CelestialBody): number {
    const pos1 = new THREE.Vector3(
      body1.coordinates.x,
      body1.coordinates.y,
      body1.coordinates.z
    );
    
    const pos2 = new THREE.Vector3(
      body2.coordinates.x,
      body2.coordinates.y,
      body2.coordinates.z
    );
    
    const distance = pos1.distanceTo(pos2);
    
    if (distance === 0) return Infinity;
    
    // F = G * m1 * m2 / r²
    // Using luminosity as proxy for mass
    const G = 1; // Gravitational constant
    const mass1 = body1.luminosity;
    const mass2 = body2.luminosity;
    
    return (G * mass1 * mass2) / (distance * distance);
  }
  
  /**
   * Find stable Lagrange points for new bodies
   * Where gravitational forces balance
   */
  findLagrangePoints(primaryBody: CelestialBody): OrbitalCoordinates[] {
    const points: OrbitalCoordinates[] = [];
    const r = primaryBody.coordinates.r;
    const theta = primaryBody.coordinates.theta;
    const phi = primaryBody.coordinates.phi;
    
    // L1: Between sun and planet
    points.push(this.sphericalToOrbital(r * 0.9, theta, phi));
    
    // L2: Beyond planet
    points.push(this.sphericalToOrbital(r * 1.1, theta, phi));
    
    // L3: Opposite side of sun
    points.push(this.sphericalToOrbital(r, theta + Math.PI, phi));
    
    // L4: Leading trojan (60° ahead)
    points.push(this.sphericalToOrbital(r, theta + Math.PI/3, phi));
    
    // L5: Trailing trojan (60° behind)
    points.push(this.sphericalToOrbital(r, theta - Math.PI/3, phi));
    
    return points;
  }
  
  /**
   * Convert spherical to orbital coordinates
   */
  private sphericalToOrbital(r: number, theta: number, phi: number): OrbitalCoordinates {
    const period = Math.sqrt(Math.pow(r, 3)) * this.BASE_ORBITS;
    const velocity = (2 * Math.PI * r) / period;
    
    return {
      r,
      theta: theta % (2 * Math.PI),
      phi: phi % (2 * Math.PI),
      x: r * Math.sin(phi) * Math.cos(theta),
      y: r * Math.sin(phi) * Math.sin(theta),
      z: r * Math.cos(phi),
      period,
      velocity,
      eccentricity: 0
    };
  }
  
  /**
   * Test vector from Kimi's example
   */
  testVector(): void {
    const testCID = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
    const orbit = this.hashToOrbit(testCID);
    
    console.log("Test Vector Results:");
    console.log(`CID: ${testCID}`);
    console.log(`Orbit: (r=${orbit.r.toFixed(2)}, θ=${orbit.theta.toFixed(2)} rad, φ=${orbit.phi.toFixed(2)} rad)`);
    console.log(`Period: ${orbit.period.toFixed(2)} time units`);
    console.log(`Velocity: ${orbit.velocity.toFixed(4)} units/time`);
    
    // With sample eigenvalues
    const eigenvalues = [1.0, 0.5, 0.25, 0.125]; // C-E-G-B♭
    const harmonics = this.orbitalHarmonics(orbit, eigenvalues);
    console.log(`Harmonics: ${harmonics.map(f => f.toFixed(1)).join(' Hz, ')} Hz`);
  }
}