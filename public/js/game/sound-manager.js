var SoundManager = {
  musicFadeInTime: 7500,

  coinSound: null,
  jumpSound: null,
  dieSound: null,
  music: null,

  preload: function(game) {
    this.game = game;

    this.game.load.audio('music', ['sounds/music.mp3', 'sounds/music.ogg']);
    this.game.load.audio('coin', ['sounds/coin.wav', 'sounds/coin.mp3']);
    this.game.load.audio('jump', ['sounds/jump.wav', 'sounds/jump.mp3']);
    this.game.load.audio('die', ['sounds/die.wav', 'sounds/die.mp3']);
  },

  create: function() {
    this.music = this.game.add.audio('music');
    this.music.loop = true;
    this.music.volume = 0.0;

    this.coinSound = this.game.add.audio('coin');
    this.coinSound.volume = 0.12;

    this.jumpSound = this.game.add.audio('jump');
    this.jumpSound.volume = 0.25;

    this.dieSound = this.game.add.audio('die');
    this.dieSound.volume = 0.3;

    if (!Settings.isMuted)
      this.music.play();

    this.game.add.tween(this.music).to({
      volume: 0.5
    }, this.musicFadeInTime).start();
  },

  update: function() {

  },

  moveSoundPlay: function() {
    if (!Settings.isMuted) {
      this.jumpSound.play();
    }
  },

  dieSoundPlay: function() {
    if (!Settings.isMuted) {
      this.dieSound.play();
    }
  },

  coinSoundPlay: function() {
    if (!Settings.isMuted) {
      this.coinSound.play();
    }
  },

  volumeStateChange: function() {
    if (Settings.isMuted) {
      Settings.set('isMuted', false);
      

      if (music.paused)
        music.resume();
      else
        music.play();
    } else {
      Settings.set('isMuted', true);
      

      music.pause();
    }
  }
}