var Score = function(userimage, username, url, score, position) {
  const margin = 15;
  // const padding = 23;
  // const textMarginTop = 19;

  this.sprite = game.add.sprite(0, 0, 'score-background');
  
  this.userImage = game.make.sprite(0, 0, userimage);
  this.userImage.anchor.set(0.5, 0.5);
  this.userImage.x = -this.sprite.width / 2 + this.userImage.width / 2 + margin;

  var usernameStyle = {
    font: "17px Arial",
    fill: "#fff",
    fontWeight: "bold",
    boundsAlignH: "center",
    boundsAlignV: "middle"
  }

  var scoreStyle = {
    font: "17px Arial",
    fill: "#FFEB3B",
    fontWeight: "bold",
    boundsAlignH: "center",
    boundsAlignV: "middle"
  }

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
}