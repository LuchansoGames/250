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
      font: "21px Jura",
      fill: "#fff",
      boundsAlignH: "center",
      boundsAlignV: "middle"
    };
    this.btnLablepadding = 85;

    this.buttonsGroup = this.game.add.group();

    this.buttonsGroup.add(this.addBtnPlay());
    this.buttonsGroup.add(this.addBtnHelp());
    this.buttonsGroup.add(this.addBtnList());
    this.buttonsGroup.y = this.logotype.y + 125;

    this.buttonsGroup.alpha = 0;
    this.game.add.tween(this.buttonsGroup).to({
      alpha: 1
    }, 250).delay(150).start();
  },

  addBtnPlay: function() {
    var btnBox = this.game.add.group();

    var btnX = this.game.world.centerX - this.buttonDistance;
    var btnY = 0;

    var btn = this.game.add.button(btnX, btnY, 'play', this.btnPlay_click, this);
    btn.anchor.set(0.5, 0.5);
    btn.width = this.buttonSize;
    btn.height = this.buttonSize;

    var btnLable = this.game.add.text(btnX, btnY + this.btnLablepadding, "Играть", this.buttonLableStyle);
    btnLable.anchor.set(0.5, 0.5);

    btn.onInputOver.add(this.btnOver, btnLable);
    btn.onInputOut.add(this.btnOut, btnLable);

    btnLable.alpha = 0;

    btnBox.addMultiple([btn, btnLable]);

    return btnBox;
  },

  addBtnHelp: function() {
    var btnBox = this.game.add.group();

    var btnX = this.game.world.centerX;
    var btnY = 0;

    var btn = this.game.add.button(btnX, btnY, 'help', this.btnHelp_click, this);
    btn.anchor.set(0.5, 0.5);
    btn.width = this.buttonSize;
    btn.height = this.buttonSize;

    var btnLable = this.game.add.text(btnX, btnY + this.btnLablepadding, "Как играть?", this.buttonLableStyle);
    btnLable.anchor.set(0.5, 0.5);

    btn.onInputOver.add(this.btnOver, btnLable);
    btn.onInputOut.add(this.btnOut, btnLable);

    btnLable.alpha = 0;

    btnBox.addMultiple([btn, btnLable]);

    return btnBox;
  },

  addBtnList: function() {
    var btnBox = this.game.add.group();
    var btnX = this.game.world.centerX + this.buttonDistance;
    var btnY = 0;

    var btn = this.game.add.button(btnX, btnY, 'list', this.btnRating_click, this);
    btn.anchor.set(0.5, 0.5);
    btn.width = this.buttonSize;
    btn.height = this.buttonSize;

    var btnLable = this.game.add.text(btnX, btnY + this.btnLablepadding, "Достижения", this.buttonLableStyle);
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

  addScoreTable: function() {
    const topPadding = 20;
    var x = game.world.centerX;
    var y = game.world.centerY;
    var userimage = 'template-photo';

    this.score.add(x, y, userimage);

    // const interval = 150;
    // var summ = interval;

    // var score = new Score('template-photo');
    // score.anchor.set(0.5, 0.5);
    // score.x = game.world.centerX;
    // score.y = game.world.centerY + topPadding - score.height - 10;
    // score.alpha = 0;
    // game.add.tween(score).to({alpha: 1}, 250).delay(summ).start();
    // summ += interval;

    // var score1 = new Score('template-photo');
    // score1.anchor.set(0.5, 0.5);
    // score1.x = game.world.centerX;
    // score1.y = game.world.centerY + topPadding;
    // score1.alpha = 0;
    // game.add.tween(score1).to({alpha: 1}, 250).delay(summ).start();
    // summ += interval;    

    // var score2 = new Score('template-photo');
    // score2.anchor.set(0.5, 0.5);
    // score2.x = game.world.centerX;
    // score2.y = game.world.centerY + topPadding + score.height + 10;
    // score2.alpha = 0;
    // game.add.tween(score2).to({alpha: 1}, 250).delay(summ).start();
    // summ += interval;

    // var score3 = new Score('template-photo');
    // score3.anchor.set(0.5, 0.5);
    // score3.x = game.world.centerX;
    // score3.y = game.world.centerY + topPadding + (score.height + 10) * 2;
    // score3.alpha = 0;
    // game.add.tween(score3).to({alpha: 1}, 250).delay(summ).start();
    // summ += interval;

    // var score4 = new Score('template-photo');
    // score4.anchor.set(0.5, 0.5);
    // score4.x = game.world.centerX;
    // score4.y = game.world.centerY + topPadding + (score.height + 10) * 3;
    // score4.alpha = 0;
    // game.add.tween(score4).to({alpha: 1}, 250).delay(summ).start();
    // summ += interval;

    // var score5 = new Score('template-photo');
    // score5.anchor.set(0.5, 0.5);
    // score5.x = game.world.centerX;
    // score5.y = game.world.centerY + topPadding + (score.height + 10) * 4 + 16;
    // score5.alpha = 0;
    // game.add.tween(score5).to({alpha: 1}, 1000).delay(summ).start();
    // summ += interval;
  }
}