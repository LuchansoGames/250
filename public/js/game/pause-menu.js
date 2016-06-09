var PauseMenu = function(game) {
  this.game = game;
  this.btns = [];
  this.onHide = new Phaser.Signal();
  this.onShowMainMenu = new Phaser.Signal();
  this.onRestart = new Phaser.Signal();
}

PauseMenu.prototype = {
  preload: function() {
    game.load.image('play', 'img/ic-play.png');
    game.load.image('replay', 'img/ic-autorenew.png');
    game.load.image('menu', 'img/ic-reply.png');
  },

  create: function() {
    this.addBackground();
    this.addBtns();
    this.addScoreLable();
  },

  addBtns: function() {
    var btnMargin = 100;
    var menu = this.addBtn(
      this.game.world.centerX - Store.pauseMenuBtnsSize - btnMargin,
      this.game.world.centerY,
      'menu',
      'В главное меню',
      this.menuBtn_click
    );

    var play = this.addBtn(
      this.game.world.centerX,
      this.game.world.centerY,
      'play',
      'Продолжить',
      this.playBtn_click
    );

    var replay = this.addBtn(
      this.game.world.centerX + Store.pauseMenuBtnsSize + btnMargin,
      this.game.world.centerY,
      'replay',
      'Начать сначала',
      this.replayBtn_click
    );

    this.background.addChild(menu);
    this.background.addChild(play);
    this.background.addChild(replay);
  },

  show: function(score) {
    this.scoreLable.text = "Счёт " + Math.round(score);
    this.background.visible = true;
    this.background.bringToTop();
  },

  hide: function() {
    this.background.visible = false;
  },

  menuBtn_click: function() {
    this.onShowMainMenu.dispatch();
  },

  playBtn_click: function() {
    this.onHide.dispatch();
  },

  replayBtn_click: function() {
    this.onRestart.dispatch();
  },

  addBackground: function() {
    var rowBackground = this.game.add.bitmapData(this.game.width, this.game.height);
    rowBackground.fill(0, 0, 0, 0.95);

    this.background = this.game.add.sprite(0, 0, rowBackground);
    this.background.visible = false;
  },

  addBtn: function(x, y, name, text, callback) {
    var button = this.game.add.button(x, y, name, callback, this);
    const animationLableTime = 100;
    const btnTextStyle = {
      font: "31px Jura",
      fill: "#FFFFFF"
    };

    button.width = Store.pauseMenuBtnsSize;
    button.height = Store.pauseMenuBtnsSize;
    button.anchor.setTo(0.5, 0.5);

    button.lable = this.game.add.text(0, Store.pauseMenuBtnsSize, text, btnTextStyle);
    button.lable.anchor.setTo(0.5);
    button.lable.alpha = 0;
    button.addChild(button.lable);

    button.onInputOver.add(function(btn) {
      this.game.add.tween(btn.lable).to({
        alpha: 1
      }, animationLableTime).start();
    }, this);

    button.onInputOut.add(function(btn) {
      this.game.add.tween(btn.lable).to({
        alpha: 0
      }, animationLableTime).start();
    }, this);

    this.btns.push(button);

    return button;
  },

  addScoreLable: function() {
    const scoreLableStyle = {
      font: "46px Jura",
      fill: "#FFFFFF"
    }

    this.scoreLable = this.game.add.text(this.game.world.centerX, this.game.world.centerY / 2, 'Счёт: 0', scoreLableStyle);
    this.scoreLable.anchor.set(0.5);
    this.background.addChild(this.scoreLable);
  }
}