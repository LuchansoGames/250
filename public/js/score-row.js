var Score = function(userimage, username, url, score, position) {
  this.sprite = game.add.sprite(0, 0, 'score-background');
  this.userImage = game.make.sprite(0, 0, userimage);
  this.userName = game.add.text();
  this.score = game.add.text();

  this.sprite.addChild(this.userImage);

  return this.sprite;
}