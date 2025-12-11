class AudioManager {
    constructor() {
        this.musicOn = false;
        this.sfxOn = true;
        this.userInteracted = false;

        this.sounds = {
            bgm: null,
            card: null,
            cardLock: null,
            settings: null,
        };

        this.storyMusic = {
            "space": "/sounds/space-bg-song.wav",
        };

        this.loadSounds();
        this.setupUserInteractionListener();
    }

    setupUserInteractionListener() {
        const handleInteraction = () => {
            this.userInteracted = true;
            document.removeEventListener('click', handleInteraction);
            document.removeEventListener('keydown', handleInteraction);
        };
        document.addEventListener('click', handleInteraction);
        document.addEventListener('keydown', handleInteraction);
    }

    loadSounds() {
        try {
            this.sounds.card = new Audio("/sounds/card-click.wav");
            this.sounds.cardLock = new Audio("/sounds/card-click-lock.wav");
            this.sounds.settings = new Audio("/sounds/settings-click.mp3");
        } catch (err) {
            console.error("Ses yükleme hatası:", err);
        }
    }

    play(name) {
        if (!this.userInteracted) return;

        const sound = this.sounds[name];
        if (!sound) return;

        if (name === "bgm") {
            if (this.musicOn) {
                sound.play().catch(err => { });
            }
            return;
        }

        if (!this.sfxOn) return;

        sound.currentTime = 0;
        sound.play().catch(err => { });
    }

    stop(name) {
        const sound = this.sounds[name];
        if (!sound) return;
        sound.pause();
    }

    loadStoryMusic(storyId) {
        this.stopMusic();
        const musicPath = this.storyMusic[storyId];
        if (!musicPath) return;

        try {
            this.sounds.bgm = new Audio(musicPath);
            this.sounds.bgm.loop = true;
            this.sounds.bgm.volume = 0.5;
            if (this.musicOn) this.playMusic();
        } catch (err) {
            console.error("Müzik yükleme hatası:", err);
        }
    }

    playMusic() {
        if (this.sounds.bgm && this.musicOn) {
            this.sounds.bgm.play().catch(err => { });
        }
    }

    stopMusic() {
        if (this.sounds.bgm) {
            this.sounds.bgm.pause();
        }
    }

    changeStory(storyId) {
        this.loadStoryMusic(storyId);
    }

    playCardSound() { this.play("card"); }
    playLockedCardSound() { this.play("cardLock"); }
    playSfx() { this.play("settings"); }
}

export default new AudioManager();
