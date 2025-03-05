
// Sound utility to manage audio playback
class SoundManager {
  private static instance: SoundManager;
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private bgMusic: HTMLAudioElement | null = null;
  private enabled: boolean = true;

  private constructor() {
    // Initialize with common sounds
    this.preloadSound('click', '/sounds/click.mp3');
    this.preloadSound('hover', '/sounds/hover.mp3');
    this.preloadBgMusic('/sounds/background-music.mp3');
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  public preloadSound(name: string, path: string): void {
    const audio = new Audio(path);
    audio.preload = 'auto';
    this.sounds.set(name, audio);
  }

  public preloadBgMusic(path: string): void {
    this.bgMusic = new Audio(path);
    this.bgMusic.loop = true;
    this.bgMusic.volume = 0.3; // Lower volume for background music
  }

  public playSound(name: string): void {
    if (!this.enabled) return;
    
    const sound = this.sounds.get(name);
    if (sound) {
      // Create a clone to allow overlapping sounds
      const soundClone = sound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.6;
      soundClone.play().catch(e => console.log("Audio playback failed:", e));
    }
  }

  public playBgMusic(): void {
    if (!this.enabled || !this.bgMusic) return;
    
    this.bgMusic.play().catch(e => console.log("Background music playback failed:", e));
  }

  public pauseBgMusic(): void {
    if (this.bgMusic) {
      this.bgMusic.pause();
    }
  }

  public toggleSound(): boolean {
    this.enabled = !this.enabled;
    
    if (!this.enabled && this.bgMusic) {
      this.bgMusic.pause();
    } else if (this.enabled && this.bgMusic) {
      this.bgMusic.play().catch(e => console.log("Background music playback failed:", e));
    }
    
    return this.enabled;
  }
  
  public isSoundEnabled(): boolean {
    return this.enabled;
  }
}

export const soundManager = SoundManager.getInstance();
