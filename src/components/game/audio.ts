// Web Audio API Sound Synthesizer for zero-latency, zero-download gaming audio

class SoundEngine {
  private ctx: AudioContext | null = null
  public isMuted: boolean = false

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioContextClass) {
        this.ctx = new AudioContextClass()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  // صوت القفز الكلاسيكي السلس (Mario-inspired original jump sound)
  public playJump(isHigh = false) {
    if (this.isMuted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sine'
    const startFreq = isHigh ? 290 : 250
    const endFreq = isHigh ? 660 : 540
    osc.frequency.setValueAtTime(startFreq, now)
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.14)

    gain.gain.setValueAtTime(0.22, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.16)
  }

  // صوت الهبوط الخفيف على المنصة
  public playLand() {
    if (this.isMuted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(140, now)
    osc.frequency.exponentialRampToValueAtTime(65, now + 0.06)

    gain.gain.setValueAtTime(0.14, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.07)
  }

  // صوت جمع نجوم الطاقة (نجوم الطاقة)
  public playStarPickup() {
    if (this.isMuted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(783.99, now) // G5
    osc.frequency.setValueAtTime(1046.5, now + 0.06) // C6

    gain.gain.setValueAtTime(0.22, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.2)
  }

  // صوت تفعيل نقطة الحفظ (Checkpoint)
  public playCheckpoint() {
    if (this.isMuted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const freqs = [440, 554.37, 659.25]
    freqs.forEach((f, idx) => {
      const osc = this.ctx!.createOscillator()
      const gain = this.ctx!.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(f, now + idx * 0.06)
      gain.gain.setValueAtTime(0.2, now + idx * 0.06)
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.18)
      osc.connect(gain)
      gain.connect(this.ctx!.destination)
      osc.start(now + idx * 0.06)
      osc.stop(now + idx * 0.06 + 0.18)
    })
  }

  // صوت القفز فوق الروبوت أو الزنبرك النحاسي
  public playEnemyStomp() {
    if (this.isMuted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(220, now)
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.12)

    gain.gain.setValueAtTime(0.28, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.14)
  }

  // صوت النقر على أزرار القوائم
  public playButton() {
    if (this.isMuted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(520, now)
    osc.frequency.exponentialRampToValueAtTime(680, now + 0.04)

    gain.gain.setValueAtTime(0.12, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.05)
  }

  // صوت التقاط شرارة الطاقة
  public playSpark() {
    this.playStarPickup()
  }

  // صوت التقاط لفة السلك الإيطالي
  public playWire() {
    if (this.isMuted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc1 = this.ctx.createOscillator()
    const osc2 = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc1.type = 'triangle'
    osc2.type = 'sine'
    osc1.frequency.setValueAtTime(440, now) // A4
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.18)
    osc2.frequency.setValueAtTime(659.25, now) // E5
    osc2.frequency.exponentialRampToValueAtTime(1318.5, now + 0.18)

    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22)

    osc1.connect(gain)
    osc2.connect(gain)
    gain.connect(this.ctx.destination)

    osc1.start(now)
    osc2.start(now)
    osc1.stop(now + 0.22)
    osc2.stop(now + 0.22)
  }

  // صوت إنارة مصباح أو ثريا
  public playLampOn() {
    this.playCheckpoint()
  }

  // صوت تشغيل القاطع الكهربائي الرئيسي
  public playMasterSwitch() {
    if (this.isMuted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime

    const noiseOsc = this.ctx.createOscillator()
    const noiseGain = this.ctx.createGain()
    noiseOsc.type = 'sawtooth'
    noiseOsc.frequency.setValueAtTime(120, now)
    noiseOsc.frequency.exponentialRampToValueAtTime(40, now + 0.08)
    noiseGain.gain.setValueAtTime(0.35, now)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09)

    noiseOsc.connect(noiseGain)
    noiseGain.connect(this.ctx.destination)
    noiseOsc.start(now)
    noiseOsc.stop(now + 0.09)

    const humOsc = this.ctx.createOscillator()
    const humGain = this.ctx.createGain()
    humOsc.type = 'sine'
    humOsc.frequency.setValueAtTime(110, now + 0.1)
    humOsc.frequency.exponentialRampToValueAtTime(440, now + 0.5)
    humGain.gain.setValueAtTime(0.01, now)
    humGain.gain.linearRampToValueAtTime(0.28, now + 0.15)
    humGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6)

    humOsc.connect(humGain)
    humGain.connect(this.ctx.destination)
    humOsc.start(now + 0.1)
    humOsc.stop(now + 0.6)
  }

  // نغمة الفوز وإنارة العالم
  public playVictory() {
    if (this.isMuted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const notes = [
      { freq: 523.25, time: 0, dur: 0.14 }, // C5
      { freq: 659.25, time: 0.14, dur: 0.14 }, // E5
      { freq: 783.99, time: 0.28, dur: 0.14 }, // G5
      { freq: 1046.5, time: 0.42, dur: 0.42 } // C6
    ]

    notes.forEach((note) => {
      const osc = this.ctx!.createOscillator()
      const gain = this.ctx!.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(note.freq, now + note.time)

      gain.gain.setValueAtTime(0.28, now + note.time)
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.time + note.dur)

      osc.connect(gain)
      gain.connect(this.ctx!.destination)

      osc.start(now + note.time)
      osc.stop(now + note.time + note.dur)
    })
  }

  // صوت فتح بوابة الطاقة
  public playGateOpen() {
    if (this.isMuted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(220, now)
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.28)

    gain.gain.setValueAtTime(0.18, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.32)
  }

  // صوت التماس الكهربائي / تلقي الضرر
  public playShock() {
    if (this.isMuted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(160, now)
    osc.frequency.setValueAtTime(85, now + 0.05)
    osc.frequency.setValueAtTime(190, now + 0.1)

    gain.gain.setValueAtTime(0.28, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.25)
  }

  // صوت الخسارة (Defeat)
  public playShortCircuit() {
    if (this.isMuted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(280, now)
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.38)

    gain.gain.setValueAtTime(0.32, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.42)
  }

  public playLockedBuzz() {
    if (this.isMuted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'square'
    osc.frequency.setValueAtTime(110, now)
    osc.frequency.setValueAtTime(85, now + 0.08)

    gain.gain.setValueAtTime(0.18, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.18)
  }

  public playBonusTime() {
    this.playCheckpoint()
  }

  public playBossRoar() {
    if (this.isMuted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(95, now)
    osc.frequency.linearRampToValueAtTime(48, now + 0.55)

    gain.gain.setValueAtTime(0.3, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.6)
  }

  public playBossHit() {
    if (this.isMuted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'square'
    osc.frequency.setValueAtTime(440, now)
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.28)

    gain.gain.setValueAtTime(0.35, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.32)
  }

  public playTurbo() {
    this.playJump(true)
  }

  public playFlashStun() {
    this.playCheckpoint()
  }
}

export const sound = new SoundEngine()
