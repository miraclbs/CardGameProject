class AudioManager {
    constructor() {
        this.musicOn = false;
        this.sfxOn = true;


        this.sounds = {
            bgm: null,
            card: null,
            settings: null,
        };


        this.loadSounds();
    }

    loadSounds() {
        try {
            this.sounds.bgm = new Audio("/sounds/bg-sound.mp3");
            this.sounds.card = new Audio("/sounds/card-click.wav");
            this.sounds.settings = new Audio("/sounds/settings-click.mp3");


            if (this.sounds.bgm) {
                this.sounds.bgm.loop = true;
            }

        } catch (err) {
            console.error(err);
        }
    }

    play(name) {
        const sound = this.sounds[name];
        if (!sound) return;

        if (name === "bgm") {
            if (this.musicOn) sound.play();
            return;
        }

        if (!this.sfxOn) return;

        sound.currentTime = 0;
        sound.play();
    }

    stop(name) {
        const sound = this.sounds[name];
        if (!sound) return;

        sound.pause();

    }

    playMusic() { this.play("bgm"); }
    stopMusic() { this.stop("bgm"); }
    playCardSound() { this.play("card"); }
    playSfx() { this.play("settings"); }
}

export default new AudioManager();
