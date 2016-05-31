var game = new Phaser.Game(1000, 900, Phaser.AUTO, 'game');


game.state.add('Game', GameState);
game.state.add('Game.v2', GameStateNew);
game.state.add('Menu', Menu);

function RunGame() {
  game.state.start('Game.v2', true, false, '3x3');
}

RunGame();