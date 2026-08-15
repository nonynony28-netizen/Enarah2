// Web Audio API Sound Synthesizer for zero-latency, zero-download gaming audio

class SoundEngine {
  private ctx: AudioContext | null = null
  public isMuted: boolean = false

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioContextClass) {
        this.ctx = new AudioContextClass()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  // صوت التقاط شرارة الطاقة
  public playSpark() {
    if (this.isMuted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(587.33, now) // D5
    osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.15) // D6

    gain.gain.setValueAtTime(0.25, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.2)
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
    if (this.isMuted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(329.63, now) // E4
    osc.frequency.setValueAtTime(493.88, now + 0.08) // B4
    osc.frequency.setValueAtTime(659.25, now + 0.16) // E5
    osc.frequency.setValueAtTime(987.77, now + 0.24) // B5

    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.45)
  }

  // صوت تشغيل القاطع الكهربائي الرئيسي
  public playMasterSwitch() {
    if (this.isMuted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime

    // Click / Clack sound
    const noiseOsc = this.ctx.createOscillator()
    const noiseGain = this.ctx.createGain()
    noiseOsc.type = 'sawtooth'
    noiseOsc.frequency.setValueAtTime(120, now)
    noiseOsc.frequency.exponentialRampToValueAtTime(40, now + 0.08)
    noiseGain.gain.setValueAtTime(0.4, now)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09)

    noiseOsc.connect(noiseGain)
    noiseGain.connect(this.ctx.destination)
    noiseOsc.start(now)
    noiseOsc.stop(now + 0.09)

    // Power surge hum
    const humOsc = this.ctx.createOscillator()
    const humGain = this.ctx.createGain()
    humOsc.type = 'sine'
    humOsc.frequency.setValueAtTime(110, now + 0.1)
    humOsc.frequency.exponentialRampToValueAtTime(440, now + 0.5)
    humGain.gain.setValueAtTime(0.01, now)
    humGain.gain.linearRampToValueAtTime(0.3, now + 0.15)
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
      { freq: 523.25, time: 0, dur: 0.15 }, // C5
      { freq: 659.25, time: 0.15, dur: 0.15 }, // E5
      { freq: 783.99, time: 0.3, dur: 0.15 }, // G5
      { freq: 1046.5, time: 0.45, dur: 0.45 }, // C6
    ]

    notes.forEach((note) => {
      const osc = this.ctx!.createOscillator()
      const gain = this.ctx!.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(note.freq, now + note.time)

      gain.gain.setValueAtTime(0.3, now + note.time)
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.time + note.dur)

      osc.connect(gain)
      gain.connect(this.ctx!.destination)

      osc.start(now + note.time)
      osc.stop(now + note.time + note.dur)
    })
  }

  // صوت فتح بوابة الليزر / الباب الكهربائي
  public playGateOpen() {
    if (this.isMuted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(220, now)
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.3)

    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.35)
  }

  // صوت التماس الكهربائي / ملامسة العائق
  public playShock() {
    if (this.isMuted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(150, now)
    osc.frequency.setValueAtTime(80, now + 0.05)
    osc.frequency.setValueAtTime(200, now + 0.1)

    gain.gain.setValueAtTime(0.3, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.25)
  }

  // صوت انقطاع التيار والاحتراق عند الخسارة
  public playShortCircuit() {
    if (this.isMuted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(300, now)
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.4)

    gain.gain.setValueAtTime(0.4, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.45)
  }

  // صوت القاطع المقفل عند عدم جمع كافة العناصر
  public playLockedBuzz() {
    if (this.isMuted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'square'
    osc.frequency.setValueAtTime(100, now)
    osc.frequency.setValueAtTime(80, now + 0.08)

    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.18)
  }

  // صوت إضافة وقت إضافي
  public playBonusTime() {
    if (this.isMuted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(523.25, now) // C5
    osc.frequency.setValueAtTime(659.25, now + 0.08) // E5
    osc.frequency.setValueAtTime(783.99, now + 0.16) // G5
    osc.frequency.setValueAtTime(1046.5, now + 0.24) // C6

    gain.gain.setValueAtTime(0.25, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.35)
  }
}

export const sound = new SoundEngine()
