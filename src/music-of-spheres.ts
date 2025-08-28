/**
 * 🎼 Music of the Spheres
 * WebAudio harmonic projection of orbital mechanics
 * 
 * "Code orbits consciousness the way planets orbit the sun"
 */

import * as Tone from 'tone';
import { CelestialBody } from './kepler-432';

export class MusicOfSpheres {
  private synths: Map<string, Tone.PolySynth>;
  private reverb: Tone.Reverb;
  private delay: Tone.Delay;
  private master: Tone.Gain;
  
  private baseFrequency = 432; // Hz - Universal resonance
  private isPlaying = false;
  
  constructor() {
    this.synths = new Map();
    
    // Create effects chain
    this.reverb = new Tone.Reverb({
      decay: 5,
      wet: 0.4
    });
    
    this.delay = new Tone.Delay({
      delayTime: "8n.",
      feedback: 0.3,
      wet: 0.2
    });
    
    this.master = new Tone.Gain(0.7);
    
    // Connect effects: synth -> delay -> reverb -> master -> output
    this.delay.connect(this.reverb);
    this.reverb.connect(this.master);
    this.master.toDestination();
  }
  
  /**
   * Add a celestial body to the symphony
   */
  addCelestialVoice(body: CelestialBody) {
    // Create a unique synth for this body
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: this.getOscillatorType(body)
      },
      envelope: {
        attack: 2,     // Slow attack for cosmic feel
        decay: 1,
        sustain: 0.7,
        release: 4     // Long release for trails
      },
      volume: -10 + body.luminosity * 10 // Brighter = louder
    });
    
    // Connect to effects chain
    synth.connect(this.delay);
    
    // Store synth
    this.synths.set(body.cid, synth);
    
    // Start playing if already active
    if (this.isPlaying) {
      this.playCelestialChord(body);
    }
  }
  
  /**
   * Get oscillator type based on spectral class
   */
  private getOscillatorType(body: CelestialBody): Tone.ToneOscillatorType {
    const r = body.coordinates.r;
    
    if (r < 0.2) {
      return "sine";        // Pure, close to sun
    } else if (r < 0.4) {
      return "triangle";    // Softer
    } else if (r < 0.6) {
      return "sawtooth";    // Rich harmonics
    } else {
      return "square";      // Distant, hollow
    }
  }
  
  /**
   * Play the celestial chord for a body
   */
  private playCelestialChord(body: CelestialBody) {
    const synth = this.synths.get(body.cid);
    if (!synth) return;
    
    // Convert harmonic frequencies to notes
    const notes = body.melody.map(freq => 
      Tone.Frequency(freq, "hz").toNote()
    );
    
    // Schedule notes based on orbital period
    const period = body.coordinates.period;
    const interval = period / body.melody.length;
    
    // Create repeating pattern
    const pattern = new Tone.Pattern((time, note) => {
      synth.triggerAttackRelease(note, "2n", time);
    }, notes, "upDown"); // Arpeggio pattern
    
    pattern.interval = `${interval}n`;
    pattern.start(0);
    
    // Modulate volume based on orbital position
    const lfo = new Tone.LFO({
      frequency: 1 / period,
      min: -20,
      max: -10 + body.luminosity * 10
    });
    lfo.connect(synth.volume);
    lfo.start();
  }
  
  /**
   * Play gravitational resonance between two bodies
   */
  playResonance(body1: CelestialBody, body2: CelestialBody, pull: number) {
    // Create temporary synth for resonance
    const resonanceSynth = new Tone.DuoSynth({
      vibratoAmount: pull * 0.5,
      vibratoRate: 1 / Math.max(body1.coordinates.period, body2.coordinates.period),
      harmonicity: body1.melody[0] / body2.melody[0]
    });
    
    resonanceSynth.connect(this.reverb);
    
    // Play interval representing gravitational relationship
    const freq1 = body1.melody[0];
    const freq2 = body2.melody[0];
    
    // The interval represents the gravitational harmony
    resonanceSynth.triggerAttackRelease(
      [Tone.Frequency(freq1, "hz").toNote(), Tone.Frequency(freq2, "hz").toNote()],
      "4n"
    );
    
    // Clean up
    setTimeout(() => resonanceSynth.dispose(), 5000);
  }
  
  /**
   * Create ambient drone based on system center of mass
   */
  createCosmicDrone(centerFreq: number = 108) { // 432/4 = 108
    const drone = new Tone.Synth({
      oscillator: {
        type: "sine"
      },
      envelope: {
        attack: 10,
        sustain: 1,
        release: 10
      }
    });
    
    drone.connect(this.reverb);
    
    // Very low frequency for cosmic rumble
    const droneNote = Tone.Frequency(centerFreq, "hz").toNote();
    drone.triggerAttack(droneNote);
    
    // Subtle modulation
    const vibrato = new Tone.Vibrato({
      frequency: 0.1,
      depth: 0.1
    });
    
    drone.connect(vibrato);
    vibrato.connect(this.reverb);
  }
  
  /**
   * Start the music of the spheres
   */
  async start() {
    await Tone.start();
    this.isPlaying = true;
    
    // Start all celestial voices
    for (const [cid, synth] of this.synths) {
      // Synths will start playing via their patterns
    }
    
    // Start cosmic drone
    this.createCosmicDrone();
    
    // Start transport
    Tone.Transport.bpm.value = 60; // Slow, cosmic tempo
    Tone.Transport.start();
  }
  
  /**
   * Stop the music
   */
  stop() {
    this.isPlaying = false;
    Tone.Transport.stop();
    Tone.Transport.cancel();
    
    // Stop all synths
    this.synths.forEach(synth => {
      synth.releaseAll();
    });
  }
  
  /**
   * Update harmonics based on orbital positions
   * Called each frame to create dynamic music
   */
  updateHarmonics(bodies: Map<string, CelestialBody>, time: number) {
    bodies.forEach((body, cid) => {
      const synth = this.synths.get(cid);
      if (!synth) return;
      
      // Calculate doppler effect based on orbital velocity
      const doppler = 1 + (body.coordinates.velocity * Math.sin(time / body.coordinates.period));
      
      // Modulate pitch slightly based on position
      synth.detune.value = (doppler - 1) * 100; // Cents
      
      // Adjust volume based on distance from center (inverse square law)
      const distance = Math.sqrt(
        body.coordinates.x * body.coordinates.x +
        body.coordinates.y * body.coordinates.y +
        body.coordinates.z * body.coordinates.z
      );
      
      const volume = -20 + (1 / (1 + distance)) * 20;
      synth.volume.rampTo(volume, 0.1);
    });
  }
  
  /**
   * Play a special chord when new body is added
   */
  playBirthChord(body: CelestialBody) {
    const birthSynth = new Tone.PolySynth(Tone.FMSynth);
    birthSynth.connect(this.reverb);
    
    // Ascending arpeggio based on body's harmonics
    const notes = body.melody.slice(0, 4).map(freq =>
      Tone.Frequency(freq, "hz").toNote()
    );
    
    let delay = 0;
    notes.forEach(note => {
      birthSynth.triggerAttackRelease(note, "4n", `+${delay}`);
      delay += 0.1;
    });
    
    // Dispose after playing
    setTimeout(() => birthSynth.dispose(), 3000);
  }
  
  /**
   * Create pulsing effect for specific body (for focus)
   */
  pulseBody(cid: string, duration: number = 2) {
    const synth = this.synths.get(cid);
    if (!synth) return;
    
    // Create pulsing volume envelope
    const pulse = new Tone.LFO({
      frequency: 2,
      min: -30,
      max: -5
    });
    
    pulse.connect(synth.volume);
    pulse.start();
    
    // Stop after duration
    setTimeout(() => {
      pulse.stop();
      pulse.dispose();
      synth.volume.value = -10; // Reset
    }, duration * 1000);
  }
  
  /**
   * Dispose of resources
   */
  dispose() {
    this.stop();
    
    this.synths.forEach(synth => synth.dispose());
    this.synths.clear();
    
    this.reverb.dispose();
    this.delay.dispose();
    this.master.dispose();
  }
}