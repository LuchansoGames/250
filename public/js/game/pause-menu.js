var PauseMenu = {
  btnTextStyle: {
    font: "31px Jura",
    fill: "#FFFFFF"
  },

  init: function(game) {
    this.game = game;
    this.btns = [];
    this.onHide = new Phaser.Signal();
  },

  preload: function() {
    game.load.image('play', 'img/ic-play.png');
    game.load.image('replay', 'img/ic-autorenew.png');
    game.load.image('menu', 'img/ic-reply.png');
  },

  create: function() {

  },

  show: function() {
    if (!this.background) {
      var rowBackground = this.game.add.bitmapData(this.game.width, this.game.height);
      rowBackground.fill(0, 0, 0, 0.95);

      this.background = this.game.add.sprite(0, 0, rowBackground);

      var btnMargin = 100;
      this.addBtn(
        this.game.world.centerX - Store.pauseMenuBtnsSize - btnMargin,
        this.game.world.centerY,
        'В главное меню',
        'menu',
        this.menuBtn_click
      );
      this.addBtn(
        this.game.world.centerX, 
        this.game.world.centerY, 
        'Продолжить',
        'play', 
        this.playBtn_click
        );
      this.addBtn(
        this.game.world.centerX + Store.pauseMenuBtnsSize + btnMargin, 
        this.game.world.centerY, 
        'Начать сначала',
        'replay', 
        this.replayBtn_click
        );

      this.background.addChild(this.btns.menu);
      this.background.addChild(this.btns.play);
      this.background.addChild(this.btns.replay);
    } else {
      this.background.visible = true;
      this.background.bringToTop();      
    }
  },

  hide: function() {
    this.background.visible = false;
  },

  menuBtn_click: function() {
    this.game.state.start('Menu');
  },

  playBtn_click: function() {
    this.onHide.dispatch();
  },

  replayBtn_click: function() {
    this.onHide.dispatch();
  },

  backgroundSet: function(screen) {
    var image = new Image();
    image.src = screen;
    this.screen = {
      image: image,
      data: screen
    }
    this.game.cache.addImage('screen', this.screen.data, this.screen.image);
    this.background = this.game.add.sprite(0, 0, 'screen');
  },

  addBtn: function(x, y, text, name, callback) {
    this.btns[name] = this.game.add.button(x, y, name, callback, this);
    this.btns[name].width = Store.pauseMenuBtnsSize;
    this.btns[name].height = Store.pauseMenuBtnsSize;
    this.btns[name].anchor.setTo(0.5, 0.5);

    this.btns[name].lable = this.game.add.text(0, Store.pauseMenuBtnsSize, text, this.btnTextStyle);
    this.btns[name].lable.anchor.setTo(0.5);
    this.btns[name].lable.alpha = 0;
    this.btns[name].addChild(this.btns[name].lable);

    const animationLableTime = 100;

    this.btns[name].onInputOver.add(function(btn) {      
      this.game.add.tween(btn.lable).to({alpha: 1}, animationLableTime).start();
    }, this);

    this.btns[name].onInputOut.add(function(btn) {
      this.game.add.tween(btn.lable).to({alpha: 0}, animationLableTime).start();
    }, this);
  }
}