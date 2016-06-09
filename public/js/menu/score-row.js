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

    this.sprite = this.game.add.image(this.x, this.y, bitmap);
    this.sprite.inputEnabled = true;
    this.sprite.input.useHandCursor = true;
    this.sprite.events.onInputUp.add(this.click, this);
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
  }
}

/*var Score = function() {
  const margin = 15;
  // const padding = 23;
  // const textMarginTop = 19;

  this.sprite = game.add.sprite(0, 0, 'score-background');
  
  this.userImage = game.make.sprite(0, 0, userimage);
  this.userImage.anchor.set(0.5, 0.5);
  this.userImage.x = -this.sprite.width / 2 + this.userImage.width / 2 + margin;

  

  var positionStyle = {
    
  }

  this.username = game.make.text(0, 0, 'Jonh Strive', usernameStyle);
  this.username.anchor.set(0, 1);
  this.username.x = this.userImage.x + this.userImage.width / 2 + margin - 5;
  this.username.y = 5;

  this.score = game.make.text(0, 0, Math.round(Math.random() * 12000), scoreStyle);
  this.score.x = this.userImage.x + this.userImage.width / 2 + margin - 5;
  this.score.anchor.set(0, 0);
  this.score.y = 0;

  this.sprite.addChild(this.userImage);
  this.sprite.addChild(this.username);
  this.sprite.addChild(this.score);

  return this.sprite;
}*/