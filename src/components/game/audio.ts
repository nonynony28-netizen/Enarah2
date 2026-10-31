// ============================================================================
// BATAL AL ENARA — LEGENDARY POLYPHONIC WEB AUDIO SOUNDTRACK & SFX ENGINE
// 8 Unique Level Soundtracks + Boss Battle Theme + Separate Music & SFX Volume
// Zero external MP3 dependencies — Instant load, seamless looping & transitions
// ============================================================================

export type MusicTrackId =
  | 'none'
  | 'level_1' // Heroic orchestral adventure (مدينة النور)
  | 'level_2' // Energetic electronic platform music (شارع الكهرباء)
  | 'level_3' // Industrial electronic soundtrack (مصنع الإنارة)
  | 'level_4' // Futuristic rhythmic adventure (حي الإنترفون)
  | 'level_5' // Epic orchestral-electronic hybrid (محطة الطاقة)
  | 'level_6' // Mysterious dark cinematic music (المدينة المظلمة)
  | 'level_7' // Fast heroic orchestral soundtrack (برج الإنارة)
  | 'level_8' // Legendary orchestral final battle (قلعة الظلام)
  | 'boss_battle' // Intense Boss Encounter transition theme

interface TrackPattern {
  bpm: number
  // MIDI note numbers (0 = rest) for 16 steps
  melody: number[]
  bass: number[]
  arp: number[]
  padChord: number[]
  leadWave: OscillatorType
  bassWave: OscillatorType
  arpWave: OscillatorType
  filterFreq: number
  percussionPattern: ('k' | 's' | 'h' | 'ks' | '.')[]
}

const TRACK_PATTERNS: Record<Exclude<MusicTrackId, 'none'>, TrackPattern> = {
  // Level 1: Heroic orchestral adventure (C Major / G Major uplifting brass & strings feel)
  level_1: {
    bpm: 122,
    melody: [60, 0, 64, 67, 72, 0, 71, 67, 69, 0, 65, 69, 67, 0, 64, 62],
    bass: [48, 48, 0, 48, 43, 43, 0, 43, 45, 45, 0, 41, 43, 43, 47, 43],
    arp: [60, 64, 67, 72, 59, 62, 67, 71, 57, 60, 65, 69, 55, 59, 62, 67],
    padChord: [60, 64, 67],
    leadWave: 'triangle',
    bassWave: 'sawtooth',
    arpWave: 'sine',
    filterFreq: 1900,
    percussionPattern: ['k', 'h', 's', 'h', 'k', 'k', 's', 'h', 'k', 'h', 's', 'h', 'k', 's', 'k', 'h'],
  },
  // Level 2: Energetic electronic platform music (A Minor funky synth lead)
  level_2: {
    bpm: 132,
    melody: [69, 72, 76, 0, 74, 72, 69, 0, 67, 71, 74, 76, 72, 0, 69, 0],
    bass: [45, 45, 57, 45, 41, 41, 53, 41, 43, 43, 55, 43, 40, 40, 52, 43],
    arp: [69, 76, 72, 76, 65, 72, 69, 72, 67, 74, 71, 74, 64, 71, 68, 71],
    padChord: [57, 60, 64],
    leadWave: 'sawtooth',
    bassWave: 'square',
    arpWave: 'triangle',
    filterFreq: 2400,
    percussionPattern: ['k', 'h', 's', 'h', 'k', 'h', 's', 'k', 'k', 'h', 's', 'h', 'k', 'k', 's', 'h'],
  },
  // Level 3: Industrial electronic soundtrack (D Minor mechanical pulse)
  level_3: {
    bpm: 136,
    melody: [62, 0, 65, 62, 69, 0, 68, 69, 65, 0, 62, 58, 61, 0, 64, 61],
    bass: [38, 38, 50, 38, 38, 38, 46, 45, 38, 38, 50, 38, 37, 37, 49, 37],
    arp: [62, 65, 69, 65, 62, 68, 69, 65, 58, 62, 65, 62, 57, 61, 64, 61],
    padChord: [50, 53, 57],
    leadWave: 'square',
    bassWave: 'sawtooth',
    arpWave: 'sawtooth',
    filterFreq: 1650,
    percussionPattern: ['k', 's', 'k', 'h', 's', 'k', 's', 'h', 'k', 's', 'k', 'k', 's', 'h', 's', 'h'],
  },
  // Level 4: Futuristic rhythmic adventure (E Minor smart neighborhood groove)
  level_4: {
    bpm: 128,
    melody: [64, 67, 71, 74, 76, 0, 74, 71, 72, 0, 69, 64, 66, 69, 71, 0],
    bass: [40, 0, 52, 40, 43, 0, 55, 43, 45, 0, 57, 45, 47, 47, 42, 47],
    arp: [64, 71, 76, 71, 67, 71, 74, 71, 60, 64, 69, 64, 59, 63, 66, 71],
    padChord: [52, 55, 59],
    leadWave: 'triangle',
    bassWave: 'triangle',
    arpWave: 'sine',
    filterFreq: 2100,
    percussionPattern: ['k', 'h', 's', 'h', 'h', 'k', 's', 'h', 'k', 'h', 's', 'h', 'k', 'h', 's', 'k'],
  },
  // Level 5: Epic orchestral-electronic hybrid (C Minor high-voltage power station)
  level_5: {
    bpm: 140,
    melody: [60, 63, 67, 72, 70, 67, 63, 60, 65, 68, 72, 75, 74, 71, 67, 62],
    bass: [36, 36, 48, 36, 39, 39, 51, 39, 41, 41, 53, 41, 43, 43, 35, 43],
    arp: [60, 67, 72, 75, 58, 63, 67, 70, 56, 60, 65, 68, 55, 59, 62, 67],
    padChord: [48, 51, 55],
    leadWave: 'sawtooth',
    bassWave: 'sawtooth',
    arpWave: 'triangle',
    filterFreq: 2250,
    percussionPattern: ['k', 'k', 's', 'h', 'k', 'k', 's', 'h', 'k', 's', 'k', 's', 'k', 'k', 's', 'ks'],
  },
  // Level 6: Mysterious dark cinematic music (F# Minor blackout atmosphere)
  level_6: {
    bpm: 112,
    melody: [66, 0, 69, 73, 0, 71, 69, 66, 64, 0, 68, 71, 0, 65, 68, 0],
    bass: [42, 0, 42, 0, 38, 0, 38, 0, 40, 0, 40, 0, 37, 0, 37, 42],
    arp: [66, 69, 73, 69, 62, 66, 69, 66, 64, 68, 71, 68, 61, 65, 68, 65],
    padChord: [54, 57, 61],
    leadWave: 'sine',
    bassWave: 'triangle',
    arpWave: 'sine',
    filterFreq: 1200,
    percussionPattern: ['k', '.', 'h', '.', 's', '.', 'h', 'k', 'k', '.', 'h', '.', 's', '.', 'h', '.'],
  },
  // Level 7: Fast heroic orchestral soundtrack (G Minor high-altitude tower ascent)
  level_7: {
    bpm: 148,
    melody: [67, 70, 74, 79, 77, 74, 70, 67, 63, 67, 70, 75, 74, 70, 69, 66],
    bass: [43, 43, 55, 43, 41, 41, 53, 41, 39, 39, 51, 39, 38, 38, 50, 42],
    arp: [67, 70, 74, 79, 65, 69, 74, 77, 63, 67, 70, 75, 62, 66, 69, 74],
    padChord: [55, 58, 62],
    leadWave: 'sawtooth',
    bassWave: 'square',
    arpWave: 'triangle',
    filterFreq: 2500,
    percussionPattern: ['k', 'h', 's', 'h', 'k', 'k', 's', 'h', 'k', 'h', 's', 'k', 'k', 's', 'k', 'ks'],
  },
  // Level 8: Legendary orchestral final battle (D Harmonic Minor fortress climax)
  level_8: {
    bpm: 154,
    melody: [62, 65, 69, 74, 73, 74, 76, 74, 70, 69, 65, 64, 62, 61, 62, 69],
    bass: [38, 38, 50, 38, 37, 37, 49, 37, 34, 34, 46, 34, 33, 33, 45, 37],
    arp: [62, 69, 74, 77, 61, 69, 73, 76, 58, 65, 70, 74, 57, 64, 69, 73],
    padChord: [50, 53, 57],
    leadWave: 'sawtooth',
    bassWave: 'sawtooth',
    arpWave: 'square',
    filterFreq: 2650,
    percussionPattern: ['k', 'k', 's', 'k', 'k', 'k', 's', 'h', 'k', 'k', 's', 'k', 'k', 's', 'ks', 'ks'],
  },
  // Boss Battle Theme: Intense high-energy boss encounter
  boss_battle: {
    bpm: 160,
    melody: [60, 63, 66, 67, 72, 67, 66, 63, 60, 62, 65, 66, 71, 67, 65, 62],
    bass: [36, 36, 48, 36, 42, 42, 36, 42, 36, 36, 48, 36, 43, 43, 35, 43],
    arp: [60, 66, 67, 72, 60, 66, 67, 75, 59, 62, 65, 71, 59, 62, 67, 74],
    padChord: [48, 51, 54],
    leadWave: 'sawtooth',
    bassWave: 'square',
    arpWave: 'sawtooth',
    filterFreq: 2800,
    percussionPattern: ['k', 'k', 's', 'k', 'k', 's', 'k', 's', 'k', 'k', 's', 'k', 's', 'k', 'ks', 'ks'],
  },
}

function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12)
}

class SoundEngine {
  private ctx: AudioContext | null = null
  private musicGainNode: GainNode | null = null
  private sfxGainNode: GainNode | null = null

  public isMuted = false
  public musicVolume = 0.55
  public sfxVolume = 0.8

  private currentTrack: MusicTrackId = 'none'
  private sequencerTimer: number | null = null
  private currentStep = 0
  private isPlayingMusic = false

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const savedMute = localStorage.getItem('enarah_platformer_muted')
        const savedMusicVol = localStorage.getItem('enarah_platformer_music_vol')
        const savedSfxVol = localStorage.getItem('enarah_platformer_sfx_vol')
        if (savedMute !== null) this.isMuted = savedMute === 'true'
        if (savedMusicVol !== null) this.musicVolume = Math.max(0, Math.min(1, Number(savedMusicVol)))
        if (savedSfxVol !== null) this.sfxVolume = Math.max(0, Math.min(1, Number(savedSfxVol)))
      } catch {}
    }
  }

  private initContext(): AudioContext | null {
    if (this.isMuted) return null
    if (typeof window === 'undefined') return null

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
        this.musicGainNode = this.ctx.createGain()
        this.sfxGainNode = this.ctx.createGain()
        this.musicGainNode.gain.value = this.isMuted ? 0 : this.musicVolume
        this.sfxGainNode.gain.value = this.isMuted ? 0 : this.sfxVolume
        this.musicGainNode.connect(this.ctx.destination)
        this.sfxGainNode.connect(this.ctx.destination)
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {})
    }
    this.syncGains()
    return this.ctx
  }

  private syncGains() {
    if (!this.ctx) return
    const now = this.ctx.currentTime
    if (this.musicGainNode) {
      this.musicGainNode.gain.setTargetAtTime(this.isMuted ? 0 : this.musicVolume, now, 0.04)
    }
    if (this.sfxGainNode) {
      this.sfxGainNode.gain.setTargetAtTime(this.isMuted ? 0 : this.sfxVolume, now, 0.02)
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted
    this.syncGains()
    if (muted) {
      this.stopMusic()
    }
    try {
      localStorage.setItem('enarah_platformer_muted', String(muted))
    } catch {}
  }

  public setMusicVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol))
    this.syncGains()
    try {
      localStorage.setItem('enarah_platformer_music_vol', String(this.musicVolume))
    } catch {}
  }

  public setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol))
    this.syncGains()
    try {
      localStorage.setItem('enarah_platformer_sfx_vol', String(this.sfxVolume))
    } catch {}
  }

  // ==========================================================================
  // PROCEDURAL INSTRUMENTAL MUSIC SEQUENCER (8 LEVELS + BOSS THEME)
  // ==========================================================================

  public getTrackForLevel(levelNumber: number, isBossArena = false): MusicTrackId {
    if (isBossArena) return 'boss_battle'
    const map: Record<number, MusicTrackId> = {
      1: 'level_1',
      2: 'level_2',
      3: 'level_3',
      4: 'level_4',
      5: 'level_5',
      6: 'level_6',
      7: 'level_7',
      8: 'level_8',
    }
    return map[levelNumber] || 'level_1'
  }

  public startMusic(trackId: MusicTrackId) {
    if (trackId === 'none' || this.isMuted || this.musicVolume <= 0.01) {
      this.stopMusic()
      this.currentTrack = trackId
      return
    }
    if (this.isPlayingMusic && this.currentTrack === trackId) return

    this.stopMusic()
    this.currentTrack = trackId
    const ctx = this.initContext()
    if (!ctx) return

    const pattern = TRACK_PATTERNS[trackId]
    if (!pattern) return

    this.isPlayingMusic = true
    this.currentStep = 0
    const stepMs = (60 / pattern.bpm / 4) * 1000 // 16th note interval

    const tick = () => {
      if (!this.isPlayingMusic || this.isMuted || this.musicVolume <= 0.01) return
      const activePattern = TRACK_PATTERNS[this.currentTrack as Exclude<MusicTrackId, 'none'>]
      if (!activePattern) return
      this.playSequencerStep(activePattern, this.currentStep)
      this.currentStep = (this.currentStep + 1) % 16
    }

    tick()
    this.sequencerTimer = window.setInterval(tick, stepMs)
  }

  public stopMusic() {
    this.isPlayingMusic = false
    if (this.sequencerTimer !== null) {
      clearInterval(this.sequencerTimer)
      this.sequencerTimer = null
    }
  }

  private playSequencerStep(pattern: TrackPattern, step: number) {
    const ctx = this.ctx
    const out = this.musicGainNode
    if (!ctx || !out || ctx.state !== 'running') return

    const now = ctx.currentTime
    const stepDur = 60 / pattern.bpm / 4

    // 1. Lead Melody Voice
    const melNote = pattern.melody[step % pattern.melody.length]
    if (melNote > 0) {
      this.triggerMusicVoice(ctx, out, midiToFreq(melNote), pattern.leadWave, now, stepDur * 1.6, 0.11, pattern.filterFreq)
    }

    // 2. Bassline Voice
    const bassNote = pattern.bass[step % pattern.bass.length]
    if (bassNote > 0) {
      this.triggerMusicVoice(ctx, out, midiToFreq(bassNote), pattern.bassWave, now, stepDur * 1.35, 0.14, 650)
    }

    // 3. Arpeggio Voice
    const arpNote = pattern.arp[step % pattern.arp.length]
    if (arpNote > 0) {
      this.triggerMusicVoice(ctx, out, midiToFreq(arpNote), pattern.arpWave, now, stepDur * 0.85, 0.055, pattern.filterFreq)
    }

    // 4. Warm Pad Chord on Step 0 and Step 8
    if (step === 0 || step === 8) {
      for (const chordMidi of pattern.padChord) {
        const shifted = step === 8 ? chordMidi + 5 : chordMidi
        this.triggerMusicVoice(ctx, out, midiToFreq(shifted), 'sine', now, stepDur * 7.2, 0.035, 1100)
      }
    }

    // 5. Synthesized Percussion
    const perc = pattern.percussionPattern[step % pattern.percussionPattern.length]
    if (perc === 'k' || perc === 'ks') {
      this.triggerKick(ctx, out, now)
    }
    if (perc === 's' || perc === 'ks') {
      this.triggerSnare(ctx, out, now, 0.055)
    } else if (perc === 'h') {
      this.triggerSnare(ctx, out, now, 0.018)
    }
  }

  private triggerMusicVoice(
    ctx: AudioContext,
    dest: AudioNode,
    freq: number,
    type: OscillatorType,
    startTime: number,
    duration: number,
    peakGain: number,
    cutoff: number
  ) {
    try {
      const osc = ctx.createOscillator()
      const filter = ctx.createBiquadFilter()
      const gain = ctx.createGain()

      osc.type = type
      osc.frequency.setValueAtTime(freq, startTime)

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(cutoff, startTime)

      gain.gain.setValueAtTime(0.0001, startTime)
      gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.015)
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(dest)

      osc.start(startTime)
      osc.stop(startTime + duration + 0.02)
    } catch {}
  }

  private triggerKick(ctx: AudioContext, dest: AudioNode, startTime: number) {
    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(135, startTime)
      osc.frequency.exponentialRampToValueAtTime(38, startTime + 0.11)

      gain.gain.setValueAtTime(0.18, startTime)
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.13)

      osc.connect(gain)
      gain.connect(dest)
      osc.start(startTime)
      osc.stop(startTime + 0.14)
    } catch {}
  }

  private triggerSnare(ctx: AudioContext, dest: AudioNode, startTime: number, vol: number) {
    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(320, startTime)
      osc.frequency.exponentialRampToValueAtTime(110, startTime + 0.06)

      gain.gain.setValueAtTime(vol, startTime)
      gain.gain.exponentialRampToValueAtTime(0.0008, startTime + 0.07)

      osc.connect(gain)
      gain.connect(dest)
      osc.start(startTime)
      osc.stop(startTime + 0.08)
    } catch {}
  }

  // ==========================================================================
  // GAMEPLAY SOUND EFFECTS (SECTION 9)
  // ==========================================================================

  private playTone(
    startFreq: number,
    endFreq: number,
    durationSec: number,
    type: OscillatorType = 'sine',
    volume = 0.12,
    delaySec = 0
  ) {
    const ctx = this.initContext()
    const dest = this.sfxGainNode
    if (!ctx || !dest || this.isMuted) return

    try {
      const now = ctx.currentTime + delaySec
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = type
      osc.frequency.setValueAtTime(startFreq, now)
      if (endFreq !== startFreq) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), now + durationSec)
      }

      gain.gain.setValueAtTime(0.001, now)
      gain.gain.linearRampToValueAtTime(volume, now + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.0008, now + durationSec)

      osc.connect(gain)
      gain.connect(dest)

      osc.start(now)
      osc.stop(now + durationSec + 0.02)
    } catch {}
  }

  // 1. Jumping & Double Jumping
  public playJump(isDoubleOrSpring = false) {
    if (isDoubleOrSpring) {
      this.playTone(340, 880, 0.18, 'triangle', 0.15, 0)
      this.playTone(580, 1180, 0.14, 'sine', 0.1, 0.04)
    } else {
      this.playTone(260, 620, 0.13, 'triangle', 0.13, 0)
    }
  }

  // 2. Landing
  public playLand() {
    this.playTone(145, 72, 0.07, 'sine', 0.09, 0)
  }

  // 3. Running Footstep
  public playFootstep() {
    this.playTone(190, 95, 0.04, 'triangle', 0.045, 0)
  }

  // 4. Dash
  public playDash() {
    this.playTone(480, 960, 0.12, 'sawtooth', 0.12, 0)
    this.playTone(720, 320, 0.14, 'sine', 0.1, 0.03)
  }

  // 5. Light Bulb Pulse Attack
  public playAttackPulse() {
    this.playTone(520, 1040, 0.11, 'triangle', 0.14, 0)
    this.playTone(880, 1480, 0.13, 'sine', 0.11, 0.03)
  }

  // 6. Collecting Wires (1.5mm, 2.5mm, 4mm, 6mm)
  public playCollectWire(gauge: '1.5' | '2.5' | '4' | '6' = '1.5') {
    const base = gauge === '6' ? 660 : gauge === '4' ? 587 : gauge === '2.5' ? 523 : 440
    this.playTone(base, base * 1.25, 0.09, 'triangle', 0.13, 0)
    this.playTone(base * 1.25, base * 1.5, 0.12, 'sine', 0.13, 0.06)
  }

  // 7. Collecting LED Bulbs (Health / Energy)
  public playCollectBulb() {
    this.playTone(523.25, 659.25, 0.1, 'sine', 0.14, 0)
    this.playTone(659.25, 783.99, 0.1, 'sine', 0.14, 0.07)
    this.playTone(783.99, 1046.5, 0.16, 'triangle', 0.15, 0.14)
  }

  // 8. Collecting Spotlights / Floodlights (Illumination & Secret Reveal)
  public playCollectSpotlight() {
    this.playTone(587.33, 880, 0.12, 'triangle', 0.15, 0)
    this.playTone(880, 1174.66, 0.18, 'sine', 0.15, 0.08)
    this.playTone(1174.66, 1567.98, 0.22, 'sine', 0.12, 0.16)
  }

  // 9. Collecting Intercoms / Security Accessories
  public playCollectIntercom() {
    this.playTone(784, 987.77, 0.1, 'square', 0.1, 0)
    this.playTone(987.77, 1318.5, 0.16, 'triangle', 0.13, 0.09)
  }

  // Generic pickup alias for backward compatibility
  public playStarPickup(tier = 1) {
    if (tier >= 2) {
      this.playCollectSpotlight()
    } else {
      this.playCollectWire('2.5')
    }
  }

  // 10. Enemy Damage / Stomp
  public playEnemyStomp() {
    this.playTone(210, 480, 0.1, 'square', 0.12, 0)
    this.playTone(480, 720, 0.12, 'triangle', 0.13, 0.05)
  }

  // 11. Player Damage / Short Circuit
  public playShortCircuit() {
    this.playTone(220, 75, 0.22, 'sawtooth', 0.16, 0)
    this.playTone(155, 52, 0.26, 'square', 0.13, 0.06)
  }

  // 12. Electrical Switches & Security Doors
  public playGateOpen() {
    this.playTone(392, 523.25, 0.11, 'triangle', 0.13, 0)
    this.playTone(523.25, 659.25, 0.13, 'triangle', 0.13, 0.08)
    this.playTone(659.25, 783.99, 0.18, 'sine', 0.14, 0.16)
  }

  // 13. Checkpoints
  public playCheckpoint() {
    this.playTone(440, 554.37, 0.1, 'triangle', 0.12, 0)
    this.playTone(554.37, 659.25, 0.12, 'triangle', 0.13, 0.07)
    this.playTone(659.25, 880, 0.2, 'sine', 0.15, 0.14)
  }

  // 14. Boss Attack / Shockwave / Roar
  public playBossRoar() {
    this.playTone(130, 55, 0.35, 'sawtooth', 0.16, 0)
    this.playTone(98, 44, 0.4, 'square', 0.12, 0.08)
  }

  public playBossHit() {
    this.playTone(160, 520, 0.14, 'sawtooth', 0.16, 0)
    this.playTone(520, 880, 0.18, 'triangle', 0.15, 0.08)
  }

  public playMasterSwitch() {
    this.playGateOpen()
  }

  // 15. Victory Fanfare & Defeat Theme
  public playVictory() {
    const notes = [523.25, 659.25, 783.99, 1046.5, 987.77, 1046.5]
    const delays = [0, 0.1, 0.2, 0.32, 0.48, 0.6]
    const durs = [0.1, 0.1, 0.12, 0.15, 0.11, 0.36]
    notes.forEach((n, idx) => {
      this.playTone(n, n * 1.01, durs[idx], 'triangle', 0.16, delays[idx])
    })
  }

  public playDefeat() {
    const notes = [392, 369.99, 349.23, 311.13]
    notes.forEach((n, idx) => {
      this.playTone(n, n * 0.96, 0.22, 'sawtooth', 0.13, idx * 0.16)
    })
  }

  public playButton() {
    this.playTone(540, 720, 0.055, 'sine', 0.08, 0)
  }

  public playBonusTime() {
    this.playCollectBulb()
  }
}

export const sound = new SoundEngine()
