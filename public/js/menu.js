var Menu = {
  preload: function() {
    game.load.crossOrigin = true;
    game.load.image('logo', 'img/logo.png');
    game.load.image('play', 'img/ic-play.png');
    game.load.image('help', 'img/ic-help.png');
    game.load.image('list', 'img/ic-list.png');
    game.load.image('score-background', 'img/score-background.png');
    // game.load.image('score-background', 'http://www.html5gamedevs.com/uploads/profile/photo-thumb-7510.png');
  },

  create: function() {
    game.stage.backgroundColor = 0x283593;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

    this.addLogotype();
    this.addControls();
    this.addScoreTable();
  },

  update: function() {

  },

  addLogotype: function() {
    var logoX = game.world.centerX;
    var logoY = 100;

    this.logotype = game.add.sprite(logoX, logoY, 'logo');
    this.logotype.anchor.setTo(0.5, 0.5);
    this.logotype.alpha = 0;

    game.add.tween(this.logotype).to({ alpha: 1 }, 1000).start();
  },

  addControls: function() {
    this.buttonDistance = 175;
    this.buttonSize = 125;
    this.buttonLableStyle = {
      font: "21px Arial",
      fill: "#fff",
      boundsAlignH: "center",
      boundsAlignV: "middle"
    }
    this.btnLablepadding = 85;

    this.buttonsGroup = game.add.group();

    this.buttonsGroup.add(this.addBtnPlay());
    this.buttonsGroup.add(this.addBtnHelp());
    this.buttonsGroup.add(this.addBtnList());
    this.buttonsGroup.y = this.logotype.y + 125;

    this.buttonsGroup.alpha = 0;
    game.add.tween(this.buttonsGroup).to({ alpha: 1 }, 1000).delay(250).start();
  },

  addBtnPlay: function() {
    var btnBox = game.add.group();

    var btnX = game.world.centerX - this.buttonDistance;
    var btnY = 0;

    var btn = game.add.button(btnX, btnY, 'play', this.btnPlay_click, this);
    btn.anchor.set(0.5, 0.5);
    btn.width = this.buttonSize;
    btn.height = this.buttonSize;

    var btnLable = game.add.text(btnX, btnY + this.btnLablepadding, "Играть", this.buttonLableStyle);
    btnLable.anchor.set(0.5, 0.5);
    
    btn.onInputOver.add(this.btnOver, btnLable);
    btn.onInputOut.add(this.btnOut, btnLable);
    
    btnLable.alpha = 0;

    btnBox.addMultiple([btn, btnLable]);

    return btnBox;
  },

  addBtnHelp: function() {
    var btnBox = game.add.group();

    var btnX = game.world.centerX;
    var btnY = 0;

    var btn = game.add.button(btnX, btnY, 'help', this.btnHelp_click, this);
    btn.anchor.set(0.5, 0.5);
    btn.width = this.buttonSize;
    btn.height = this.buttonSize;

    var btnLable = game.add.text(btnX, btnY + this.btnLablepadding, "Как играть?", this.buttonLableStyle);
    btnLable.anchor.set(0.5, 0.5);
    
    btn.onInputOver.add(this.btnOver, btnLable);
    btn.onInputOut.add(this.btnOut, btnLable);
    
    btnLable.alpha = 0;

    btnBox.addMultiple([btn, btnLable]);

    return btnBox;
  },

  addBtnList: function() {
    var btnBox = game.add.group();
    var btnX = game.world.centerX + this.buttonDistance;
    var btnY = 0;

    var btn = game.add.button(btnX, btnY, 'list', this.btnRating_click, this);
    btn.anchor.set(0.5, 0.5);
    btn.width = this.buttonSize;
    btn.height = this.buttonSize;

    var btnLable = game.add.text(btnX, btnY + this.btnLablepadding, "Рекорды друзей", this.buttonLableStyle);
    btnLable.anchor.set(0.5, 0.5);
    
    btn.onInputOver.add(this.btnOver, btnLable);
    btn.onInputOut.add(this.btnOut, btnLable);
    
    btnLable.alpha = 0;

    btnBox.addMultiple([btn, btnLable]);

    return btnBox;
  },

  btnPlay_click: function() {
    game.state.start('Game');
  },

  btnHelp_click: function() {

  },

  btnOver: function() {
    game.add.tween(this).to({alpha: 1}, 150).start();
  },

  btnOut: function() {
    game.add.tween(this).to({alpha: 0}, 150).start();
  },

  addScoreTable: function() {
    var score = new Score();
    score.anchor.set(0.5, 0.5);
    score.x = game.world.centerX;
    score.y = game.world.centerY;
  },
}