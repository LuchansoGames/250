var Achivment = function(game) {
  this.game = game;
}

Achivment.prototype = {
  preload: function() {
    this.game.load.image('ach+1', 'img/achivments/ach+1.png');
    this.game.load.image('achivments-background', 'img/achivments-background.png');
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