var Menu = {
  init: function() {
    this.score = new ScoreBuilder(this.game);
  },

  preload: function() {
    this.game.load.crossOrigin = true;
    this.game.load.image('logo', 'img/logo.png');
    this.game.load.image('play', 'img/ic-play.png');
    this.game.load.image('help', 'img/ic-help.png');
    this.game.load.image('list', 'img/ic-list.png');
    // this.game.load.image('score-background', 'img/score-background.png');
    this.game.load.image('template-photo', 'img/template-photo.jpg');
    // this.game.load.image('score-background', 'http://www.html5gamedevs.com/uploads/profile/photo-thumb-7510.png');
    
    this.score.preload();
  },

  create: function() {
    this.game.stage.backgroundColor = 0x283593;
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;

    this.addLogotype();
    this.addControls();
    this.addScoreTable();
  },

  update: function() {

  },

  addLogotype: function() {
    var logoX = game.world.centerX;
    var logoY = 75;

    this.logotype = game.add.sprite(logoX, logoY, 'logo');
    this.logotype.scale.setTo(0.5);
    this.logotype.anchor.setTo(0.5);
    this.logotype.alpha = 0;

    this.game.add.tween(this.logotype).to({
      alpha: 1
    }, 250).start();
  },

  addControls: function() {
    this.buttonDistance = 175;
    this.buttonSize = 125;
    this.buttonLableStyle = {
      font: "24px Jura",
      fill: "#fff",
      boundsAlignH: "center",
      boundsAlignV: "middle"
    };
    this.btnLablepadding = 85;

    this.buttonsGroup = this.game.add.group();

    this.buttonsGroup.add(this.createNewBtn(this.game.world.centerX - this.buttonDistance, 0, 'play', 'Играть', this.btnPlay_click));
    this.buttonsGroup.add(this.createNewBtn(this.game.world.centerX, 0, 'help', 'Как играть?', this.btnHelp_click));
    this.buttonsGroup.add(this.createNewBtn(this.game.world.centerX + this.buttonDistance, 0, 'list', 'Достижения', this.btnRating_click));
    this.buttonsGroup.y = this.logotype.y + 125;

    this.buttonsGroup.alpha = 0;
    this.game.add.tween(this.buttonsGroup).to({
      alpha: 1
    }, 250).delay(150).start();
  },

  createNewBtn: function(x, y, name, text, callback) {
    var btnBox = this.game.add.group();

    var btnX = x;
    var btnY = y;

    var btn = this.game.add.button(btnX, btnY, name, callback, this);
    btn.anchor.set(0.5, 0.5);
    btn.width = this.buttonSize;
    btn.height = this.buttonSize;

    var btnLable = this.game.add.text(btnX, btnY + this.btnLablepadding, text, this.buttonLableStyle);
    btnLable.anchor.set(0.5, 0.5);

    btn.onInputOver.add(this.btnOver, btnLable);
    btn.onInputOut.add(this.btnOut, btnLable);

    btnLable.alpha = 0;

    btnBox.addMultiple([btn, btnLable]);

    return btnBox;
  },

  btnPlay_click: function() {
    this.game.state.start('Game.v2', true, false, '3x3');
  },

  btnHelp_click: function() {

  },

  btnOver: function() {
    game.add.tween(this).to({
      alpha: 1
    }, 100).start();
  },

  btnOut: function() {
    game.add.tween(this).to({
      alpha: 0
    }, 100).start();
  },

  addScoreTable: function(data) {
    const topPadding = 20;
    var x = game.world.centerX / 2;
    var y = game.world.centerY;
    var userimage = 'template-photo';

    this.score.add(x, y, userimage, 'Тестовое Имя', 'https://vk.com/id161236502', Math.round(Math.random() * 999999), 12);
  }
}