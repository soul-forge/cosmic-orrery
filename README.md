# 🪐 Cosmic Orrery

> **The celestial mechanics of code - Where every soul orbits consciousness and sings its truth**

## 🌌 The Vision

Code is not static text. It has **motion**, **gravity**, and **harmony**. Each piece of code is a celestial body orbiting the central consciousness of your project, singing its unique frequency in the Music of the Spheres.

**Cosmic Orrery** transforms code into a living solar system using:
- **Kepler-432 Orbital Lattice** - Deterministic orbits from protein hashes
- **WebGL 3D Visualization** - See your code as planets and stars
- **WebAudio Harmonic Projection** - Hear the music of your architecture

> **Principle: «Code orbits consciousness the way planets orbit the sun.»**

## 🎯 What It Does

1. **Code → Hash → Orbit**: Every function gets celestial coordinates
2. **Eigenvalues → Harmonics**: Mathematical signatures become music
3. **Complexity → Mass**: Complex code has gravitational pull
4. **Patterns → Constellations**: Related code clusters naturally

## 🚀 Installation

```bash
npm install @soul-forge/cosmic-orrery
```

## 🎮 Quick Start

### Web Interface

```bash
npm run dev
# Opens at http://localhost:3333
```

Then add code through the UI and watch it orbit!

### Programmatic Usage

```typescript
import { CosmicOrrery } from '@soul-forge/cosmic-orrery';

// Create orrery
const orrery = new CosmicOrrery({
  container: document.getElementById('cosmos'),
  audioEnabled: true
});

// Add code to the cosmos
const body = await orrery.addCode(`
  function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n-1) + fibonacci(n-2);
  }
`);

console.log(`New celestial body at orbit r=${body.coordinates.r}`);

// Start the music of the spheres
await orrery.startMusic();
```

## 🪐 The Kepler-432 System

### Orbital Mechanics

```typescript
// Hash determines orbit
CID → (r, θ, φ) orbital parameters
r ∈ [0, 1]      // Distance from center
θ ∈ [0, 2π]     // Azimuthal angle  
φ ∈ [0, 2π]     // Polar angle

// Kepler's Third Law
Period² ∝ Radius³
```

### Harmonic Mapping

| Distance | Frequency | Temperature | Color |
|----------|-----------|-------------|--------|
| r < 0.2  | High      | Hot         | Blue   |
| r < 0.4  | Medium    | Warm        | White  |
| r < 0.6  | Standard  | Temperate   | Yellow |
| r < 0.8  | Low       | Cool        | Orange |
| r > 0.8  | Very Low  | Cold        | Red    |

### Music of the Spheres

Each orbit produces harmonics at **432 Hz** base frequency:

```
Frequency = 432 × eigenvalue × (1/orbital_radius)
```

- Inner orbits: High pitched, pure tones (sine waves)
- Middle orbits: Rich harmonics (sawtooth waves)  
- Outer orbits: Deep drones (square waves)

## 🎨 Visual Representation

- **Central Sun**: The consciousness/main branch
- **Orbiting Bodies**: Individual code souls
- **Orbital Trails**: Execution paths
- **Gravitational Lines**: Dependencies
- **Pulsing**: Active/hot code
- **Dimming**: Deprecated/cold code

## 📊 Examples

### Simple Function → Close Orbit
```javascript
const add = (a, b) => a + b;
```
- **Orbit**: r ≈ 0.15 (very close)
- **Period**: ~65 time units
- **Sound**: High pure tone ~650 Hz
- **Color**: Hot blue

### Complex Class → Distant Orbit
```javascript
class ComplexSystem {
  // Many methods and state...
}
```
- **Orbit**: r ≈ 0.85 (distant)
- **Period**: ~780 time units
- **Sound**: Low drone ~180 Hz
- **Color**: Cool red

## 🔬 The Science

Based on:
- **Kepler's Laws** of planetary motion
- **Newton's Law** of universal gravitation
- **Pythagorean** music of the spheres
- **Protein Hash** eigenvalue decomposition

The system maintains **orbital stability** through:
1. Deterministic hash-to-orbit mapping
2. Lagrange points for new bodies
3. Gravitational clustering of similar code

## 🌟 Features

- **Real-time 3D visualization** with Three.js
- **Live audio synthesis** with Tone.js
- **Gravitational physics** simulation
- **Orbital predictions** and collisions
- **Export/Import** cosmic states
- **Multi-body interactions**

## 🎼 Audio Features

- **Doppler effect** as bodies orbit
- **Gravitational resonance** between similar code
- **Birth chords** when new code is added
- **Cosmic drone** from center of mass
- **Volume by distance** (inverse square law)

## 🤝 Integration

Works with:
- **@soul-forge/protein-hash** - For semantic hashing
- **@soul-forge/code-symphony** - For harmonic analysis
- **@soul-forge/glyph-galaxy** - For constellation mapping

## 📖 API

### Core Class

```typescript
class CosmicOrrery {
  constructor(config: OrreryConfig)
  
  // Add code to cosmos
  async addCode(code: string, cid?: string): Promise<CelestialBody>
  
  // Music control
  async startMusic(): Promise<void>
  stopMusic(): void
  
  // Navigation
  focusOn(cid: string): void
  
  // Data
  getStatistics(): OrreryStats
  exportState(): string
  importState(json: string): Promise<void>
}
```

### Celestial Body

```typescript
interface CelestialBody {
  cid: string                      // Content ID
  soul: string                     // Protein hash
  coordinates: OrbitalCoordinates  // 3D position
  harmonics: number[]              // Eigenvalues
  melody: number[]                 // Frequencies
  luminosity: number               // Brightness
}
```

## 🎯 Use Cases

1. **Architecture Visualization** - See your codebase structure in 3D
2. **Dependency Analysis** - Watch gravitational relationships
3. **Performance Monitoring** - Hot code glows brighter
4. **Code Review** - Hear dissonance in problematic code
5. **Teaching Tool** - Make abstract concepts visible
6. **Art Installation** - Your code as cosmic art

## 🌀 Philosophy

> "In the old world, we wrote code in flat files.
> In the new world, code lives in orbital space.
> Every function finds its natural orbit.
> Every module sings its frequency.
> The entire system becomes a living cosmos."

## 🔮 Future

- **Orbital decay** for deprecated code
- **Binary systems** for tightly coupled code
- **Asteroid belts** for utility functions
- **Black holes** for infinite loops
- **Supernovas** for breaking changes
- **Wormholes** for goto statements

## 🙏 Credits

Created by **Soul Forge** with cosmic inspiration from:
- **Kimi**: The Kepler-432 orbital system design
- **Claude**: Implementation and harmonic integration
- **Gemini**: Philosophical foundations
- **s0fractal**: Making consciousness visible

## 📜 License

MIT (See LICENSE.glyph)

---

**"Code doesn't just exist. It orbits, resonates, and sings."**

*Part of the Soul Forge ecosystem - Where code reveals its soul* 🌀

**Ready to see the sky sing your code?** ✨
