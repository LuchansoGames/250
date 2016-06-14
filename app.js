var FullScreen = function(game) {
  this.game = game;
}

FullScreen.isFullScreen = false;

FullScreen.prototype = {
  preload: function() {
    this.game.load.spritesheet('fullscreen', 'img/ui/ic-fullscreen.png', 192, 192);
  },

  create: function() {
    this.btn = this.game.add.button(this.game.world.width, this.game.world.height, 'fullscreen', this.fullscreen_click, this, 0, 0, 0);
    this.btn.width = 50;
    this.btn.height = 50;
    this.btn.anchor.setTo(1);

    if (FullScreen.isFullScreen) {
      this.btn.setFrames(1, 1, 1);
    }
  },

  fullscreen_click: function() {
    if (this.btn.frame === 0) {
      this.btn.setFrames(1, 1, 1);
      game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
      game.scale.startFullScreen(true);
      FullScreen.isFullScreen = true;
    } else {
      this.btn.setFrames(0, 0, 0);
      game.scale.stopFullScreen();
      FullScreen.isFullScreen = false;
    }
  }
}
function isVkEnv() {
  return location.ancestorOrigins.length !== 0 && location.ancestorOrigins[0].indexOf('vk') !== -1;
}

function ADSOnLoad(callback) {
  var adsTimer = setInterval(function() {
    var isLoaded = document.getElementById('vk_ads_75686').style.background === 'none';

    if (isLoaded) {
      clearInterval(adsTimer);
      callback();
    }
  }, 3000);
}

function onLoad() {
  document.getElementById('vk_ads_75686').style['max-height'] = '';
}

setTimeout(function() {
  if (!isVkEnv()) {
    return;
  }

  var adsParams = {
    "ad_unit_id": 75686,
    "ad_unit_hash": "232dff1590ac9d07125fe39844d8d38a"
  };

  function vkAdsInit() {
    ADSOnLoad(onLoad);
    VK.Widgets.Ads('vk_ads_75686', {}, adsParams);
  }
  if (window.VK && VK.Widgets) {
    vkAdsInit();
  } else {
    if (!window.vkAsyncInitCallbacks) window.vkAsyncInitCallbacks = [];
    vkAsyncInitCallbacks.push(vkAdsInit);
    var protocol = ((location.protocol === 'https:') ? 'https:' : 'http:');
    var adsElem = document.getElementById('vk_ads_75686');
    var scriptElem = document.createElement('script');
    scriptElem.type = 'text/javascript';
    scriptElem.async = true;
    scriptElem.src = protocol + '//vk.com/js/api/openapi.js?121';
    adsElem.parentNode.insertBefore(scriptElem, adsElem.nextSibling);
  }

}, 0);
var Menu = {
  init: function() {
    this.score = new ScoreBuilder(this.game, this.game.world.centerX, game.world.centerY - ScoreBuilder.basePositionY);
    this.fullScreen = new FullScreen(this.game);
    this.soundManager = SoundManager.getInstance(this.game);
  },

  preload: function() {
    Settings.load();

    if (!isVkEnv()) {
      this.game.scale.pageAlignHorizontally = true;
      this.game.scale.pageAlignVertically = true;
    }
    this.game.load.crossOrigin = true;
    this.game.load.image('logo', 'img/ui/logo.png');
    this.game.load.image('play', 'img/ui/ic-play.png');
    this.game.load.image('help', 'img/ui/ic-help.png');
    this.game.load.image('list', 'img/ui/ic-list.png');
    this.game.load.image('unknown-user', 'img/ui/unknown-user.png');
    this.game.load.spritesheet('volume', 'img/ui/volume-spritesheet.png', 96, 96);
    this.game.load.json('rating-data', 'api/hydra/rating');

    this.soundManager.preload();

    this.score.preload();
    this.fullScreen.preload();
  },

  create: function() {
    this.game.stage.backgroundColor = Store.backgroundColor;

    var rating = this.game.cache.getJSON('rating-data').users;

    this.score.create();

    this.addVolumeButton();
    this.addLogotype();
    this.addControls();
    this.addScoreTable(rating);
    this.fullScreen.create();

    this.soundManager.create();
  },

  update: function() {
  },

  volumeButton_click: function() {
    if (this.isPause)
      return

    if (this.soundButton.frame === 0) {
      Settings.isMuted = false;
      this.soundButton.setFrames(1, 1, 1);
    } else if (this.soundButton.frame === 1) {
      Settings.isMuted = true;
      this.soundButton.setFrames(0, 0, 0);
    }
  },

  addVolumeButton: function() {
    var frames = 1;

    if (Settings.isMuted) {
      frames = 0;
    }

    this.soundButton = this.game.add.button(5, 5, 'volume', this.volumeButton_click, this, frames, frames, frames);
    this.soundButton.width = 48;
    this.soundButton.height = 48;
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
    this.buttonDistance = 250;
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
    var loader = new Phaser.Loader(this.game);
    loader.crossOrigin = true;

    data.forEach(function(row) {
      var userimage = 'img-id' + row.id;
      loader.image(userimage, row.avatar);

      var loaded = function(userimage) {
        if (row.isPlayer) {
          this.score.addPlayerScore(userimage, row.username, row.url, row.score, row.position);
        } else {
          this.score.add(userimage, row.username, row.url, row.score, row.position);
        }
      }

      loader.onLoadComplete.add(function() {
        loaded.bind(this)(userimage);
      }, this);

      loader.onFileError.add(function() {
        loaded.bind(this)('unknow-user');
      }, this);
    }, this);

    loader.start();
    loader.onLoadComplete.add(function() {
      this.score.runScrolling();
    }, this);
  }
}
var ScoreBuilder = function(game, x, y) {
  this.game = game;
  this.rows = [];
  /**
   * Скорость скролинга, 50 пикселей в 2 секунды (25px/sec)
   * @type {[type]}
   */
  this.scrollSpeed = 50 / 2000;
  this.x = x;
  this.y = y;
  this.fadeTween = null;
}

ScoreBuilder.basePositionY = 125;
ScoreBuilder.startScrollingDelay = 3000;

ScoreBuilder.prototype = {
  preload: function() {
    this.game.load.image('score-row', 'img/menu/score-row.png');
    this.game.load.image('score-filter', 'img/menu/score-filter.png');
    this.game.load.image('score-hover-effect', 'img/menu/score-hover-effect.png');
    this.game.load.image('score-hover-effect-2', 'img/menu/score-hover-effect-2.png');
  },

  create: function() {
    this.backgroundScoreRow = this.game.make.image(0, 0, 'score-row');
    var rowBitmap = new Phaser.BitmapData(this.game, null, this.backgroundScoreRow.width, 1);
    this.tableRatingSprite = this.game.add.sprite(this.x - this.backgroundScoreRow.width / 2, this.y, rowBitmap);    

    this.addLableTop100();
  },

  add: function(userimage, username, url, score, position) {
    var y = 0;

    if (this.rows.length === 0) {
      y = ScoreBuilder.basePositionY;
    } else {
      y = this.rows[this.rows.length - 1].sprite.y + this.backgroundScoreRow.height;
    }

    var scoreRow = new ScoreRow(this.game, 0, y, userimage, username, url, score, position);

    this.rows.push(scoreRow);
    this.tableRatingSprite.addChild(scoreRow.sprite);

    return scoreRow;
  },

  addPlayerScore: function(userimage, username, url, score, position) {
    var scoreRow = new ScoreRow(this.game, 0, 0, userimage, username, url, score, position);

    this.tableRatingSprite.addChild(scoreRow.sprite);
    this.add(userimage, username, url, score, position);

    return scoreRow;
  },

  runScrolling: function() {
    this.rows.forEach(function(scoreRow) {
      this.addScrolling(scoreRow.sprite, ScoreBuilder.startScrollingDelay);
    }, this);
  },

  addScrolling: function(sprite, delay) {
    delay = delay || 0;

    this.addSpeed(sprite, delay);
    this.addFadeOutTrigger(sprite, delay);
  },

  addSpeed: function(sprite, delay) {
    var timeScrolling = (sprite.y / this.scrollSpeed);

    this.game.add.tween(sprite).to({
      y: 0
    }, timeScrolling).delay(delay).start();
  },

  addFadeOutTrigger: function(sprite, delay) {
    var timeTrigger = ((sprite.y - ScoreBuilder.basePositionY) / this.scrollSpeed);

    this.game.add.tween(sprite).to({
      alpha: 0
    }, 1000).delay(timeTrigger + delay).start().onComplete.add(function() {
      sprite.inputEnabled = false;
    }, this);
  },

  addLableTop100: function() {
    var style = {
      font: '21px Jura',
      fontWeight: 'Bold',
      fill: '#fff'
    }
    
    var lable = this.game.make.text(this.tableRatingSprite.width / 2, ScoreBuilder.basePositionY / 2, 'Рейтинг - TOP 100', style);
    lable.anchor.setTo(0.5, 0);
    
    this.tableRatingSprite.addChild(lable);
  }
}
var ScoreRow = function(game, x, y, userimage, username, url, score, position) {
  this.game = game;
  this.url = url;
  this.score = score;
  this.username = username;
  this.userimage = userimage;
  this.x = x;
  this.y = y;
  this.position = position.toString();

  this.addBorder();
  this.addLabels();
}

ScoreRow.prototype = {
  click: function() {
    window.open(this.url, '_blank');
  },

  addBorder: function() {
    var borders = this.game.make.sprite(0, 0, 'score-row');
    var filter = this.game.make.sprite(0, 0, 'score-filter');
    this.avatar = this.game.make.sprite(0, 0, this.userimage);

    var bitmap = new Phaser.BitmapData(this.game, null, borders.width, borders.height);

    bitmap.draw(this.avatar);
    bitmap.draw(filter);
    bitmap.draw(borders);

    this.sprite = this.game.make.image(this.x, this.y, bitmap);
    this.sprite.inputEnabled = true;
    this.sprite.input.useHandCursor = true;
    this.sprite.events.onInputUp.add(this.click, this);
    this.sprite.events.onInputOver.add(this.over, this);
    this.sprite.events.onInputOut.add(this.out, this);

    this.hoverEffeect = this.game.make.image(this.sprite.width - 15, 0, 'score-hover-effect');
    this.hoverEffeect2 = this.game.make.image(35, 0, 'score-hover-effect-2');

    this.hoverEffeect.alpha = 0;
    this.hoverEffeect2.alpha = 0;

    this.sprite.addChild(this.hoverEffeect);
    this.sprite.addChild(this.hoverEffeect2);
  },

  over: function() {    
    if (this.hoverEffeectFadeOut)
      this.hoverEffeectFadeOut.stop();

    if (this.hoverEffeect2FadeOut)
      this.hoverEffeect2FadeOut.stop();

    if (this.hoverTween2)
      this.hoverTween2.stop();
    
    this.hoverEffeect.alpha = 1;
    this.hoverEffeect2.alpha = 1;
    this.hoverEffeect2.x = 35;

    this.hoverTween2 = this.game.add.tween(this.hoverEffeect2).to({x: this.sprite.width - 15}, 5000).start();
    this.hoverTween2.repeat(-1, 0);
  },

  out: function() {
    this.hoverEffeectFadeOut = this.game.add.tween(this.hoverEffeect).to({alpha: 0}, 500).start();    
    
    this.hoverEffeect2FadeOut = this.game.add.tween(this.hoverEffeect2).to({alpha: 0}, 500).start();
  },

  addLabels: function() {
    var usernameStyle = {
      font: "17px Jura",
      fill: "#fff",
      fontWeight: "bold",
      boundsAlignH: "center",
      boundsAlignV: "middle"
    }

    var scoreStyle = {
      font: "17px Jura",
      fill: "#FFEB3B",
      fontWeight: "bold",
      boundsAlignH: "center",
      boundsAlignV: "middle"
    }

    var positionStyle = {
      font: "30px Jura",
      fill: "#2196F3",
      fontWeight: "bold",
      boundsAlignH: "center",
      boundsAlignV: "middle"
    }

    this.lableUsername = this.game.make.text(this.avatar.width + 5, 3, this.username, usernameStyle);

    this.lableScore = this.game.make.text(this.avatar.width + 5, 0, this.score, scoreStyle);
    this.lableScore.y = this.lableUsername.y + this.lableUsername.height;
    
    this.lablePosition = this.game.make.text(this.sprite.width - 15, 10, this.position, positionStyle)
    this.lablePosition.anchor.setTo(1, 0);

    this.sprite.addChild(this.lableUsername);
    this.sprite.addChild(this.lableScore);
    this.sprite.addChild(this.lablePosition);
  },

  hide: function() {
    this.game.tween(this).to({alpha: 0}, 100).start();
  },

  show: function() {
    this.game.tween(this).to({alpha: 1}, 100).start();
  }
}
var ScoreTable = function(count) {
  var score = new Score();
  score.anchor.set(0.5, 0.5);
  score.x = game.world.centerX;
  score.y = game.world.centerY;
}
var Achivment = function(game) {
  this.game = game;
}

Achivment.prototype = {
  preload: function() {
    this.game.load.image('ach+1', 'img/achivments/ach+1.png');
    this.game.load.image('achivments-background', 'img/achivments/achivments-background.png');
  },

  show: function(msg, name) {
    this.group = game.add.group();
    this.background = game.add.image(0, 0, 'achivments-background');
    this.icon = game.add.image(0, 0, 'ach' + name);

    var textLeftPadding = 10;

    var styleHeader = {
      font: "16px Jura",
      fill: "#fff",
      fontWeight: "bold",
      boundsAlignH: "center",
      boundsAlignV: "middle"
    }

    var styleBody = {
      font: "14px Jura",
      fill: "#fff",
      boundsAlignH: "center",
      wordWrap: true,
      wordWrapWidth: this.background.width - this.icon.height - textLeftPadding * 2,
      boundsAlignV: "middle"
    }

    this.headerText = game.add.text(this.icon.height + textLeftPadding, 5, 'Новое достижение', styleHeader);
    this.bodyText = game.add.text(this.icon.height + textLeftPadding, this.headerText.y + 20, msg, styleBody);
    this.bodyText.lineSpacing = -5;

    this.group.addMultiple([this.background, this.icon, this.headerText, this.bodyText]);
    this.group.x = game.world.width;
    this.group.y = 150;
    this.group.alpha = 1;

    game.add.tween(this.group).to({alpha: 1, x: game.world.width - this.background.width}, 100).start();
    game.add.tween(this.group).to({alpha: 0, y: this.group.y + 150}, 400).delay(7000).start();
  }
}
var PauseMenu = function(game) {
  this.game = game;
  this.btns = [];
  this.onHide = new Phaser.Signal();
  this.onShowMainMenu = new Phaser.Signal();
  this.onRestart = new Phaser.Signal();
}

PauseMenu.prototype = {
  preload: function() {
    game.load.image('play', 'img/ui/ic-play.png');
    game.load.image('replay', 'img/ui/ic-autorenew.png');
    game.load.image('menu', 'img/ui/ic-reply.png');
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
var ProgressBar = function(game) {
  this.game = game;
  this.value = 0;
}

ProgressBar.prototype = {
  preload: function() {
    this.game.load.image('progress-bar', 'img/ui/progress-bar.png');
    this.game.load.image('progress-bar-head', 'img/ui/progress-bar-head.png');
  },

  create: function() {
    this.body = this.game.add.sprite(0, 0, 'progress-bar');
    this.head = this.game.add.sprite(this.body.width, 0, 'progress-bar-head');

    this.body.tint = Store.progressBarColor;
    this.head.tint = Store.progressBarColor;

    this.minWidth = this.body.width;
    this.maxWidth = this.game.width - this.body.width - this.minWidth - 50;

    this.setValue(0.5);
  },

  setValue: function(value) {
    this.value = value;

    var bodyWidth = this.minWidth + this.value * this.maxWidth;

    this.game.add.tween(this.body)
    .to({width: bodyWidth}, 1000, Phaser.Easing.Exponential.Out)
    .start();

    this.game.add.tween(this.head)
    .to({x: bodyWidth}, 1000, Phaser.Easing.Exponential.Out)
    .start();
  }
}
var Screenshoot = function(game) {
    this.game = game;
}

Screenshoot.prototype = {
  takeScreen: function(callback) {
    this.callback = callback;
    this.makeScreenShoot = true;
  },

  render: function() {
    if (this.makeScreenShoot) {
      this.makeScreenShoot = false;
      var data = this.game.canvas.toDataURL();
      this.callback(data);
    }
  }
}
var UI = function(game, soundManager) {
  this.game = game;
  this.soundManager = soundManager;
  this.score = 0;
  this.fullScreen = new FullScreen(this.game);
  progressBar = this.progressBar = new ProgressBar(this.game);
}

UI.prototype = {
  preload: function() {
    this.game.load.spritesheet('volume', 'img/ui/volume-spritesheet.png', 96, 96);
    this.game.load.image('pause', 'img/ui/ic-pause.png');
    
    this.fullScreen.preload();
    this.progressBar.preload();
  },

  create: function() {
    this.addPauseButton();
    this.addVolumeButton();

    this.addScoreLable();
    this.addScoreRatioLable();

    this.progressBar.create();

    this.fullScreen.create();
    this.addEvents();
  },

  pause: function() {
    this.pauseButton.inputEnabled = false;
    this.soundButton.inputEnabled = false;
  },

  resume: function() {
    this.pauseButton.inputEnabled = true;
    this.soundButton.inputEnabled = true;
  },

  addEvents: function() {
    this.onPauseButtonClick = new Phaser.Signal();
  },

  addScoreLable: function() {
    var style = {
      font: "30px Jura",
      fill: "#fff"
    }

    this.scoreLable = game.add.text(this.game.world.width - 4, 5, 'Очки 0', style);
    this.scoreLable.anchor.set(1, 0);
  },

  setScore: function(newScore) {
    var scoreObj = {
      score: this.score
    }

    this.score = newScore;

    var newAnimation = this.game.add.tween(scoreObj).to({
      score: newScore
    }, 100).onUpdateCallback(function() {
      this.scoreLable.text = "Очки " + Math.round(scoreObj.score);
    }, this);

    newAnimation.onComplete.add(function() {
      this.scoreLable.text = "Очки " + Math.round(scoreObj.score);
    }, this);

    if (this.animationScore && this.animationScore.isRunning) {
      this.animationScore.chain(newAnimation);
    } else {
      this.animationScore = newAnimation;
      this.animationScore.start();
    }
  },

  addScoreRatioLable: function() {
    var style = {
      font: "56px Jura",
      fill: "#FFFFFF"
    }

    this.scoreRatioLable = game.add.text(this.game.world.centerX, this.game.world.centerY, 'x1', style);
    this.scoreRatioLable.anchor.set(0.5, 0.5);
    this.scoreRatioLable.alpha = 0.2;
  },

  updateRatio: function(ratio) {
    this.scoreRatioLable.text = 'x' + Math.round(ratio * 100) / 100;
  },

  addVolumeButton: function() {
    var frames = 1;

    if (Settings.isMuted) {
      frames = 0;
    }

    this.soundButton = this.game.add.button(5 + this.pauseButton.width, 5, 'volume', this.volumeButton_click, this, frames, frames, frames);
    this.soundButton.width = 48;
    this.soundButton.height = 48;
  },

  addPauseButton: function() {
    this.pauseButton = this.game.add.button(5, 5, 'pause', this.pauseButton_click, this);
    this.pauseButton.width = 48;
    this.pauseButton.height = 48;
  },

  volumeButton_click: function() {
    if (this.isPause)
      return

    this.soundManager.volumeStateChange();
    if (this.soundButton.frame === 0) {
      this.soundButton.setFrames(1, 1, 1);
    } else if (this.soundButton.frame === 1) {
      this.soundButton.setFrames(0, 0, 0);
    }
  },

  pauseButton_click: function() {
    this.onPauseButtonClick.dispatch();
  }
}

var Border = function(game, lvl) {
  this.game = game;
  this.lvl =lvl;
}

Border.prototype = {
  /**
   * Функция которая проверяет, может ли объект двигаться дальше
   * @param  {[type]} square   [description]
   * @param  {[type]} position [description]
   * @return {[type]}          [description]
   */
  canMove: function(square, position) {
    var result = false;
    var x = (square.x - this.position.x) / this.squareSize;
    var y = (square.y - this.position.y) / this.squareSize;

    var targetX = (position.x - this.position.x) / this.squareSize;
    var targetY = (position.y - this.position.y) / this.squareSize;

    var direction;

    if (x - targetX > 0) {
      direction = 'left';
    } else if (x - targetX < 0) {
      direction = 'right';
    } else if (y - targetY > 0) {
      direction = 'top';
    } else {
      direction = 'bottom';
    }

    var terrain = this.getTerrainByPosition(x, y);

    return !terrain.borders[direction];
  },

  draw: function(graphics) {
    this.map.forEach(function(terrain) {
      terrain.draw(graphics);
    });
  },

  preload: function() {
    this.game.load.json('3x3', 'maps/3x3.json');
  },

  create: function() {
    this.squareSize = (Store.moveDistance + Store.squareMargin);
    this.map = [];

    this.loadMap(this.lvl);
  },

  loadMap: function(lvl) {
    var rowMap = this.game.cache.getJSON(lvl).terrains;

    this.map = rowMap.map(function(rowTerrain) {
      return new Terrain(rowTerrain.x, rowTerrain.y, rowTerrain.borders);
    });

    this.mapSize = calculateSizeMap(this.map, this.squareSize);
    this.position = new Phaser.Point(this.game.world.centerX - this.mapSize.width / 2, this.game.world.centerY - this.mapSize.height / 2);

    var graphics = game.add.graphics(this.position.x, this.position.y);

    this.draw(graphics);
  },

  /**
   * Получение позиции площади, по координатам системы
   * @param  {[type]} x [description]
   * @param  {[type]} y [description]
   * @return {[type]}   [description]
   */
  getTerrainByPosition: function(x, y) {
    var result;

    this.map.forEach(function(terrain) {
      var terrainRectangle = new Phaser.Rectangle(terrain.x, terrain.y, 1, 1);
      if (terrainRectangle.contains(x, y)) {
        result = terrain;
      }
    });

    return result;
  }
};

function calculateSizeMap(map, squareSize) {
  var minX = 0;
  var minY = 0;
  var maxX = 0;
  var maxY = 0;

  map.forEach(function(terrain) {
    var x = terrain.x;
    var y = terrain.y;

    maxX = Math.max(x, maxX);
    maxY = Math.max(y, maxY);
    minX = Math.min(x, minX);
    minY = Math.min(y, minY);
  });

  return {
    width: (maxX + Math.abs(minX)) * squareSize,
    height: (maxY + Math.abs(minY)) * squareSize
  }
}
var Coin = function(game, border, soundManager) {
  this.game = game;
  this.border = border;
  this.soundManager = soundManager;
}

Coin.prototype = {
  preload: function() {
    this.game.load.image('square', 'img/game/square.png');
    this.game.load.image('square-particle', 'img/game/square-particle.png');
  },

  create: function() {
    this.createSprite();
    this.createParticlesEmitter();

    this.addCoin();
  },

  pause: function() {
    this.tweenRotation.pause();
  },

  resume: function() {
    this.tweenRotation.resume();
  },

  createParticlesEmitter: function() {
    this.particlesEmitter = this.game.add.emitter(0, 0);
    this.particlesEmitter.makeParticles('square-particle');
    this.particlesEmitter.setXSpeed(-150, 150);
    this.particlesEmitter.setYSpeed(-150, 150);
    this.particlesEmitter.setScale(2, 0, 2, 0, 800);
  },

  createSprite: function() {
    this.sprite = this.game.add.sprite(-Store.coinSize, -Store.coinSize, 'square');
    this.sprite.tint = Store.coinColor;
    this.sprite.width = Store.coinSize;
    this.sprite.height = Store.coinSize;
    this.sprite.anchor.setTo(0.5, 0.5);
  },

  take: function() {
    this.particlesEmitter.x = this.sprite.x;
    this.particlesEmitter.y = this.sprite.y;
    this.particlesEmitter.start(true, 800, null, 20);

    this.soundManager.coinSoundPlay();

    this.game.add.tween(this.sprite).to({
      width: 0,
      height: 0
    }, 100).start();

    this.sprite.x = -Store.coinSize;
    this.sprite.y = -Store.coinSize;
    
    this.game.time.events.add(Store.coinInterval, this.addCoin, this);
  },

  addCoin: function() {
    var terrain = game.rnd.pick(this.border.map);
    var x = this.border.position.x + terrain.x * terrain.size + terrain.size / 2;
    var y = this.border.position.y + terrain.y * terrain.size + terrain.size / 2;

    this.sprite.x = x;
    this.sprite.y = y;

    this.game.add.tween(this.sprite).to({
      width: Store.coinSize,
      height: Store.coinSize
    }, 100).start();

    this.startRotate(this.sprite);
  },

  startRotate: function(sprite) {
    if (this.tweenRotation) {
      this.tweenRotation.stop();
      sprite.angle = 0;
    }
    
    this.tweenRotation = this.game.add.tween(sprite).to({
      angle: 360 * this.game.rnd.pick([-1, 1])
    }, 750).start();
    this.tweenRotation.repeat(-1, 0);
  }
};
var Controll = function(game) {
  this.game = game;
}

Controll.prototype = {
  create: function(flows, context) {
    context = context || {};

    var keys = this.game.input.keyboard.addKeys({
      'up': Phaser.KeyCode.W,
      'down': Phaser.KeyCode.S,
      'left': Phaser.KeyCode.A,
      'right': Phaser.KeyCode.D
    });

    keys.up.onDown.add(flows.up, context);
    keys.down.onDown.add(flows.down, context);
    keys.left.onDown.add(flows.left, context);
    keys.right.onDown.add(flows.right, context);

    keys = this.game.input.keyboard.addKeys({
      'up': Phaser.KeyCode.UP,
      'down': Phaser.KeyCode.DOWN,
      'left': Phaser.KeyCode.LEFT,
      'right': Phaser.KeyCode.RIGHT
    });

    keys.up.onDown.add(flows.up, context);
    keys.down.onDown.add(flows.down, context);
    keys.left.onDown.add(flows.left, context);
    keys.right.onDown.add(flows.right, context);
  }
};
EnemyBulder = function(game) {
  this.game = game;
  this.enemys = [];
}

EnemyBulder.prototype = {
  preload: function() {
    this.game.load.image('enemy', 'img/game/enemy.png');
    this.game.load.image('enemy-particle', 'img/game/enemy-particle.png');
  },

  create: function() {
    this.emitter = this.game.add.emitter(0, 0);

    this.emitter.makeParticles('enemy-particle');
    this.emitter.setXSpeed(-150, 150);
    this.emitter.setYSpeed(-150, 150);
    this.emitter.setScale(2, 0, 2, 0, 800);
  },

  add: function(x, y, velocity) {
    var enemy = new Enemy(this.game, x, y, velocity, this);
    this.enemys.push(enemy);
    return enemy;
  }
}
EnemySpawnBulder = function(game, lvl, border, enemyBulder) {
  this.game = game;
  this.lvl = lvl;
  this.border = border;
  this.enemyBulder = enemyBulder;
  this.spawns = [];
}

EnemySpawnBulder.prototype = {
  preload: function() {
    this.game.load.image('enemySpawn', 'img/game/enemy-spawn.png');
    this.game.load.json(this.lvl, 'maps/' + this.lvl + '.json');
  },

  create: function() {
    var rowSpawns = this.game.cache.getJSON(this.lvl).enemySpawns;    

    this.spawns = rowSpawns.map(function(spawn) {
      return new EnemySpawn(
        this.game,
        spawn,
        this.border,
        this.enemyBulder
      );
    }, this);
  },

  pause: function() {
    this.spawns.forEach(function(spawn) {
      spawn.pause();
    });
  },

  resume: function() {
    this.spawns.forEach(function(spawn) {
      spawn.resume();
    });
  }
}
/**
 * Создаёт спаун врагов
 * @param {[type]} game             [description]
 * @param {[type]} x                [description]
 * @param {[type]} y                [description]
 * @param {[type]} speed            [description]
 * @param {[type]} angle            [description]
 * @param {[type]} intervalSpawn    Время, в мс., через которое спаунятся враги. Если установлен флаг randomSpawn = true, то это время в течении которого заспаунтся враг
 * @param {[type]} randomSpawn      Если правда, то враги спаунятся в случайный момент времени, если ложь, то враги спаунтся переодично
 * @param {[type]} minIntervalSpawn Минимальное время через, которое заспаунится враг, работает только при установке флага randomSpawn = true
 */
var EnemySpawn = function(game, spawn, border, enemyBulder) {
  this.game = game;

  this.border = border;
  this.speed = spawn.speed || 0;
  this.enemyBulder = enemyBulder;
  this.randomSpawn = spawn.randomSpawn || false;
  this.intervalSpawn = spawn.intervalSpawn || 0;
  this.minIntervalSpawn = spawn.minIntervalSpawn || 0;

  this.sprite = game.add.sprite(0, 0, 'enemySpawn');

  this.game.physics.arcade.enable([this.sprite]);
  this.sprite.body.velocity.x = spawn.spawnVelocity.x;
  this.sprite.body.velocity.y = spawn.spawnVelocity.y;
  this.sprite.angle = spawn.angle || 0;
  this.sprite.anchor.set(0.5, 0.5);

  this.sprite.x = (spawn.x || 0) * Store.terrainSize + Store.terrainSize / 2 + this.border.position.x;
  this.sprite.y = (spawn.y || 0) * Store.terrainSize + Store.terrainSize / 2 + this.border.position.y;

  // this.game.add.tween(this.sprite).to({
  //   angle: 360
  // }, 3000).start().repeat(-1, 0);

  this.start();
}

EnemySpawn.prototype = {
  pause: function() {
    this.timer.pause();
  },

  resume: function() {
    this.timer.resume();
  },

  spawn: function() {
    var velocity = new Phaser.Point(0, 0);
    velocity.rotate(0, 0, this.sprite.angle, true, this.speed);

    var enemy = this.enemyBulder.add(this.sprite.x, this.sprite.y, velocity);
    enemy.sprite.alpha = 0;
    enemy.sprite.scale.setTo(0.01, 0.01);

    this.game.add.tween(enemy.sprite).to({
      alpha: 1,
    }, 100).start();

    this.game.add.tween(enemy.sprite.scale).to({
      x: 1,
      y: 1
    }, 100).start();

    return enemy;
  },

  startRandomSpawn: function() {
    var nextTick = this.minIntervalSpawn + this.game.rnd.between(0, this.intervalSpawn);
    this.timer.add(nextTick, function() {
      this.spawn();
      this.startRandomSpawn();
    }, this);
    this.timer.start();
  },

  start: function() {
    this.timer = this.game.time.create(false) || this.timer;

    if (this.randomSpawn) {
      this.startRandomSpawn();
    } else {
      this.timer.loop(this.intervalSpawn, this.spawn, this);
      this.timer.start();
    }
  },

  stop: function() {
    this.timer.stop(true);
  },

  changeSpawTime: function(time) {
    this.intervalSpawn = time;
    this.stop();
    this.start();
  }
}
var Enemy = function(game, x, y, velocity, enemyBulder) {
  this.game = game;
  this.enemyBulder = enemyBulder;

  this.sprite = this.game.add.sprite(x, y, 'enemy');
  this.game.physics.arcade.enable([this.sprite]);
  this.sprite.body.velocity = velocity;
  this.sprite.outOfBoundsKill = true;
  this.sprite.checkWorldBounds = true;

  this.sprite.anchor.setTo(0.5, 0.5);

  this.sprite.events.onOutOfBounds.add(this.destroy, this);
}

Enemy.prototype = {
  destroy: function() {
    var position = this.enemyBulder.enemys.indexOf(this);
    this.enemyBulder.enemys.splice(position, 1);
  },

  die: function() {
    this.sprite.destroy();
    this.destroy();

    this.enemyBulder.emitter.x = this.sprite.x;
    this.enemyBulder.emitter.y = this.sprite.y;
    this.enemyBulder.emitter.start(true, 800, null, 20);
  }
};
var GameStateNew = {
  init: function(lvl) {
    this.game.stage.backgroundColor = Store.backgroundColor;

    this.lvl = lvl;
    this.isPause = false;

    this.soundManager = new SoundManager.getInstance(this.game);
    this.scoreManager = new ScoreManager(this.game);
    this.screenshoot = new Screenshoot(this.game);
    this.enemyBulder = new EnemyBulder(this.game);
    this.pauseMenu = new PauseMenu(this.game);
    this.achivment = new Achivment(this.game);
    this.controll = new Controll(this.game);
    this.border = new Border(this.game, this.lvl);
    this.square = new Square(this.game, this.border, this.soundManager);
    this.coin = new Coin(this.game, this.border, this.soundManager);
    this.ui = new UI(this.game, this.soundManager, this.scoreManager);
    this.enemySpawnBulder = new EnemySpawnBulder(this.game, this.lvl, this.border, this.enemyBulder);

    this.pauseMenu.onShowMainMenu.add(this.onShowMainMenu, this);
    this.pauseMenu.onRestart.add(this.restartGame, this);
    this.pauseMenu.onHide.add(this.resume, this);
  },

  preload: function() {
    if (!isVkEnv()) {
      this.game.scale.pageAlignHorizontally = true;
      this.game.scale.pageAlignVertically = true;
    }

    this.enemySpawnBulder.preload();
    this.soundManager.preload();
    this.enemyBulder.preload();
    this.pauseMenu.preload();
    this.achivment.preload();
    this.border.preload();
    this.square.preload();
    this.coin.preload();
    this.ui.preload();
  },

  create: function() {
    this.soundManager.create();
    this.enemyBulder.create();
    this.pauseMenu.create();
    this.border.create();
    this.square.create();
    this.coin.create();
    this.ui.create();
    this.enemySpawnBulder.create();

    this.controll.create({
      up: function() { this.square.move(Square.directionType.UP) },
      down: function() { this.square.move(Square.directionType.DOWN) },
      left: function() { this.square.move(Square.directionType.LEFT) },
      right: function() { this.square.move(Square.directionType.RIGHT) }
    }, this);

    this.addEventsListener();

    if (!Settings.isMuted && this.soundManager.music.paused) {      
      this.soundManager.music.play();
    }
  },

  update: function() {
    if (this.isPause) {
      return;
    }

    if (this.overlap(this.square.sprite, this.coin.sprite)) {
      this.coin.take();

      this.ui.setScore(this.scoreManager.takeCoin());
      this.ui.updateRatio(this.scoreManager.ratio);
    }

    for (var i = 0; i < this.enemyBulder.enemys.length; i++) {
      enemy = this.enemyBulder.enemys[i];
      if (this.overlap(enemy.sprite, this.square.sprite)) {
        this.soundManager.dieSoundPlay();
        enemy.die();

        this.ui.setScore(this.scoreManager.loseScore());
        this.ui.updateRatio(this.scoreManager.ratio);
      }
    }
  },

  addEventsListener: function() {
    this.ui.onPauseButtonClick.add(function() {
      this.pause(true);
    }, this);
  },

  overlap: function(obj1, obj2) {
    return Phaser.Rectangle.intersects(obj1.getBounds(), obj2.getBounds());
  },

  render: function() {
    this.screenshoot.render();
  },

  pause: function(isShowPauseMenu) {
    this.game.physics.arcade.isPaused = this.isPause = true;

    this.enemySpawnBulder.pause();
    this.ui.pause();

    this.square.pause();
    this.coin.pause();

    if (isShowPauseMenu)
      this.pauseMenu.show(this.scoreManager.score);
  },

  resume: function() {
    this.game.physics.arcade.isPaused = this.isPause = false;

    this.enemySpawnBulder.resume();
    this.ui.resume();

    this.square.resume();
    this.coin.resume();

    this.pauseMenu.hide();
  },

  onShowMainMenu: function() {
    this.resume();
    this.soundManager.music.pause();
    this.game.state.start('Menu');
  },

  restartGame: function() {
    this.resume();
    this.game.state.restart(true, false, this.lvl);
  },

  screenFadeInWhite: function() {
    this.pause();

    var graphics = this.game.add.graphics(0, 0);
    graphics.beginFill(0xFFFFFF);
    graphics.drawRect(0, 0, this.game.width, this.game.height);
    graphics.alpha = 0;

    this.game.add.tween(graphics).to({alpha: 1}, 750/*, Phaser.*/).start();
  }
}
var ScoreManager = function(game) {
  this.game = game;
  this.score = 0;
  this.ratio = 1.0;

  this.coinScoreAdd = 15;
  this.coinRatioAdd = 0.05;

  this.coinsTaked = 0;
}

ScoreManager.prototype = {
  takeCoin: function() {
    this.score += this.coinScoreAdd * this.ratio;
    this.ratio += this.coinRatioAdd;

    this.coinsTaked++;

    return this.score;
  },

  loseScore: function() {
    this.score /= 2;
    this.ratio = 1;
    
    return this.score;
  },

  loseRateByTime: function() {
    this.ratio = 1;

    return this.ratio;
  },

  doubleRatio: function() {
    this.ratio *= 2;

    return this.ratio;
  }
}
var Settings = {
  isMuted: false,
  storeName: '250-settings',

  load: function() {
    var settings = JSON.parse(localStorage.getItem(this.storeName)) || {};

    this.isMuted = settings.isMuted || this.isMuted;
  },

  save: function() {
    localStorage.setItem(this.storeName, JSON.stringify(this));
  },

  set: function(key, value) {
    this[key] = value;
    this.save();
  }
}
var SoundManagerClass = function(game) {
  this.game = game;

  this.musicFadeInTime = 7500;

  this.coinSound = null;
  this.jumpSound = null;
  this.dieSound = null;
  this.music = null;

  this.isCreated = false;
}

SoundManagerClass.prototype = {
  preload: function() {
    if (this.isCreated)
      return;

    this.game.load.audio('music', ['sounds/music.mp3', 'sounds/music.ogg']);
    this.game.load.audio('coin', ['sounds/coin.wav', 'sounds/coin.mp3']);
    this.game.load.audio('jump', ['sounds/jump.wav', 'sounds/jump.mp3']);
    this.game.load.audio('die', ['sounds/die.wav', 'sounds/die.mp3']);
  },

  create: function() {
    if (this.isCreated)
      return;

    this.music = this.game.add.audio('music');
    this.music.loop = true;
    this.music.volume = 0.0;

    this.coinSound = this.game.add.audio('coin');
    this.coinSound.volume = 0.12;

    this.jumpSound = this.game.add.audio('jump');
    this.jumpSound.volume = 0.25;

    this.dieSound = this.game.add.audio('die');
    this.dieSound.volume = 0.3;

    this.game.add.tween(this.music).to({
      volume: 0.5
    }, this.musicFadeInTime).start();

    this.isCreated = true;
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

      if (this.music.paused)
        this.music.resume();
      else
        this.music.play();
    } else {
      Settings.set('isMuted', true);

      this.music.pause();
    }
  }
}

var SoundManager = (function() {
  var instance;

  function createInstance(game) {
    var soundManagerClass = new SoundManagerClass(game);
    return soundManagerClass;
  }

  return {
    getInstance: function(game) {
      if (!instance) {
        instance = createInstance(game);
      }
      return instance;
    }
  };

})();
var Square = function(game, border, soundManager) {
  this.game = game;
  this.playerColor = Store.playerColor;
  this.squareMoveTime = Store.squareMoveTime;
  this.squareSize = Store.squareSize;
  this.sprite = {};
  this.isMoving = false;
  this.border = border;
  this.soundManager = soundManager;
}

Square.directionType = {
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3
}

Square.prototype = {
  preload: function() {
    this.game.load.image('square', 'img/game/square.png');
  },

  create: function() {
    this.sprite = this.game.add.sprite(0, 0, 'square');
    this.sprite.tint = this.playerColor;
    this.sprite.width = this.squareSize;
    this.sprite.height = this.squareSize;
    this.sprite.x = this.game.world.centerX;
    this.sprite.y = this.game.world.centerY;
    this.sprite.anchor.setTo(0.5, 0.5);

    this.game.physics.arcade.enable([this.sprite]);
  },

  pause: function() {
    this.isPause = true;
  },

  resume: function() {
    this.isPause = false;
  },

  move: function(direction) {
    if (this.isMoving || this.isPause)
      return;

    this.soundManager.moveSoundPlay();

    var XYDirection = this.calcDirection(direction, this.sprite);

    var calcX = XYDirection.calcX;
    var calcY = XYDirection.calcY;
    var isCanMove;
    var tween;
    var backPositionX = XYDirection.backPositionX;
    var backPositionY = XYDirection.backPositionY;

    isCanMove = this.border.canMove(this.sprite, new Phaser.Point(calcX, calcY));

    if (isCanMove) {
      tween = this.game.add.tween(this.sprite).to({
        x: calcX,
        y: calcY
      }, this.squareMoveTime).start();
    } else {
      calcX += backPositionX;
      calcY += backPositionY;

      tween = this.game.add.tween(this.sprite).to({
          x: calcX,
          y: calcY
        }, this.squareMoveTime / 2)
        .to({
          x: this.sprite.x,
          y: this.sprite.y
        }, this.squareMoveTime / 2).start();
    }

    this.isMoving = true;
    tween.onComplete.add(function() {
      this.isMoving = false;
    }, this);
  },

  calcDirection: function(direction, sprite) {
    var calcX = sprite.x;
    var calcY = sprite.y;
    var backPositionX = 0;
    var backPositionY = 0;

    switch (direction) {
      case Square.directionType.UP:
        calcY = sprite.y - Store.terrainSize;
        backPositionY = +Store.moveDistance;

        break;

      case Square.directionType.DOWN:
        calcY = sprite.y + Store.terrainSize;
        backPositionY = -Store.moveDistance;

        break;

      case Square.directionType.LEFT:
        calcX = sprite.x - Store.terrainSize;
        backPositionX = +Store.moveDistance;

        break;

      case Square.directionType.RIGHT:
        calcX = sprite.x + Store.terrainSize;
        backPositionX = -Store.moveDistance;

        break;
    }

    return {
      calcX: calcX,
      calcY: calcY,
      backPositionX: backPositionX,
      backPositionY: backPositionY
    }
  }
};
var Store = { };

Store.width = 1000;
Store.height = 900;

Store.squareMargin = 20;
Store.playerColor = 0xEEFF41;
Store.squareMoveTime = 75;
Store.squareSize = 50;
Store.moveDistance = Store.squareSize + Store.squareMargin;

Store.borderColor = 0x1A237E;
Store.borderLineWidth = 5;

Store.coinColor = 0x2196F3;
Store.coinInterval = 500;
Store.coinSize = 24;
Store.coinInterval = 500;

Store.backgroundColor = 0x283593;

Store.terrainSize = (Store.moveDistance + Store.squareMargin);

Store.pauseMenuBtnsSize = 150;

Store.progressBarColor = 0xFF9800;
var Terrain = function(x, y, borders) {
  this.x = x;
  this.y = y;

  this.borders = borders || {
    top: false,
    bottom: false,
    left: false,
    right: false
  };

  this.borders.top = this.borders.top || false;
  this.borders.bottom = this.borders.bottom || false;
  this.borders.left = this.borders.left || false;
  this.borders.right = this.borders.right || false;

  this.color = Store.borderColor;
  this.lineWidth = Store.borderLineWidth;

  this.size = Store.terrainSize;
  this.width = this.size;
  this.height = this.size;
}

Terrain.prototype = {
  draw: function(graphics) {
    graphics.lineStyle(this.lineWidth, this.color);

    if (this.borders.top) {
      this.drawTopBorder(graphics);
    }
    if (this.borders.bottom) {
      this.drawBottomBorder(graphics);
    }
    if (this.borders.left) {
      this.drawLeftBorder(graphics);
    }
    if (this.borders.right) {
      this.drawRightBorder(graphics);
    }
  },

  drawTopBorder: function(graphics) {
    graphics.moveTo(this.x * this.size, this.y * this.size);
    graphics.lineTo(this.x * this.size + this.size, this.y * this.size);
  },

  drawBottomBorder: function(graphics) {
    graphics.moveTo(this.x * this.size, this.y * this.size + this.size);
    graphics.lineTo(this.x * this.size + this.size, this.y * this.size + this.size);
  },

  drawLeftBorder: function(graphics) {
    graphics.moveTo(this.x * this.size, this.y * this.size);
    graphics.lineTo(this.x * this.size, this.y * this.size + this.size);
  },

  drawRightBorder: function(graphics) {
    graphics.moveTo(this.x * this.size + this.size, this.y * this.size);
    graphics.lineTo(this.x * this.size + this.size, this.y * this.size + this.size);
  }
};

var game = new Phaser.Game(Store.width, Store.height, Phaser.AUTO, 'game');

game.state.add('Game.v2', GameStateNew);
game.state.add('Menu', Menu);

function RunGame() {
  // game.state.start('Game.v2', true, false, '3x3');  
  game.state.start('Menu', Menu);  
}

RunGame();

function isVkEnv() {
  return location.ancestorOrigins.length !== 0 && location.ancestorOrigins[0] === "https://vk.com";
}