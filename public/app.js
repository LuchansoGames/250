function preload(){game.stage.backgroundColor=backgroundColor,game.scale.pageAlignHorizontally=!0,game.scale.pageAlignVertically=!0,game.physics.startSystem(Phaser.Physics.ARCADE),game.load.audio("music",["sounds/music.mp3","sounds/music.ogg"]),game.load.audio("coin",["sounds/coin.wav","sounds/coin.mp3"]),game.load.audio("coin",["sounds/jump.wav","sounds/jump.mp3"]),game.load.image("square","img/square.png"),game.load.image("instruction","img/instruction.png")}function create(){upKey=game.input.keyboard.addKey(Phaser.Keyboard.W),upKey.onDown.add(up,this),downKey=game.input.keyboard.addKey(Phaser.Keyboard.S),downKey.onDown.add(down,this),leftKey=game.input.keyboard.addKey(Phaser.Keyboard.A),leftKey.onDown.add(left,this),rightKey=game.input.keyboard.addKey(Phaser.Keyboard.D),rightKey.onDown.add(right,this),square=game.add.sprite(0,0,"square"),square.tint=playerColor,square.width=squareSize,square.height=squareSize,square.x=game.world.centerX-25,square.y=game.world.centerY-25;var e=game.add.sprite(0,0,"instruction");e.x=game.world.centerX-e.width/2,e.y=game.world.height-e.height-margin,setTimeout(function(){game.add.tween(e).to({alpha:0},instructionFadeTime).start()},instructionShowTime),addGameName(),addMusic();var a=game.add.graphics(0,0);drawBorder(a)}function update(){}function render(){}function drawBorder(e){e.lineStyle(5,1713022),e.drawRect(game.world.centerX-25-80,game.world.centerY-25-80,210,210)}function up(){if(!isMoving){var e,a=square.y-65,i=game.world.centerY-25-65;i>a?(a+=distance,e=game.add.tween(square).to({y:a},37.5).to({y:square.y},37.5).start()):e=game.add.tween(square).to({y:a},squareMoveTime).start(),isMoving=!0,e.onComplete.add(function(){isMoving=!1})}}function down(){if(!isMoving){var e,a=square.y+65,i=game.world.centerY-25+65;a>i?(a-=distance,e=game.add.tween(square).to({y:a},37.5).to({y:square.y},37.5).start()):e=game.add.tween(square).to({y:a},squareMoveTime).start(),isMoving=!0,e.onComplete.add(function(){isMoving=!1})}}function left(){if(!isMoving){var e,a=square.x-65,i=game.world.centerX-25-65;i>a?(a+=distance,e=game.add.tween(square).to({x:a},37.5).to({x:square.x},37.5).start()):e=game.add.tween(square).to({x:a},squareMoveTime).start(),isMoving=!0,e.onComplete.add(function(){isMoving=!1})}}function right(){if(!isMoving){var e,a=square.x+65,i=game.world.centerX-25+65;a>i?(a-=distance,e=game.add.tween(square).to({x:a},37.5).to({x:square.x},37.5).start()):e=game.add.tween(square).to({x:a},squareMoveTime).start(),isMoving=!0,e.onComplete.add(function(){isMoving=!1})}}function addGameName(){var e={font:"32px Arial",fill:"#fff",boundsAlignH:"center",boundsAlignV:"middle"};text=game.add.text(0,0,"250+",e),text.x=game.world.centerX-text.width/2,text.y=game.world.centerY-200}function addMusic(){music=game.add.audio("music"),music.loop=!0,music.sound=.8,music.play()}function spawnEnemies(){if(!(game.time.now<this.nextEnemy)){var e=1300,a=500,i=40,t=Math.max(e-(e-a)*this.score/i,a);this.nextEnemy=game.time.now+t;var n=[];n[0]=[[{i:-1,j:-1,ver:!0,speed:1}],[{i:-1,j:0,ver:!0,speed:1}],[{i:-1,j:1,ver:!0,speed:1}],[{i:1,j:-1,ver:!0,speed:1}],[{i:1,j:0,ver:!0,speed:1}],[{i:1,j:1,ver:!0,speed:1}],[{i:-1,j:-1,ver:!1,speed:1}],[{i:0,j:-1,ver:!1,speed:1}],[{i:1,j:-1,ver:!1,speed:1}],[{i:-1,j:1,ver:!1,speed:1}],[{i:0,j:1,ver:!1,speed:1}],[{i:1,j:1,ver:!1,speed:1}]];for(var o=n[0][game.rnd.integerInRange(0,n[0].length-1)],r=0;r<o.length;r++)this.addEnemy(o[r].i,o[r].j,o[r].ver,2*o[r].speed)}}function addEnemy(e,a,i,t){var n=this.enemies.getFirstDead();if(n){i?(n.reset(game.width/2+8*e*8+190*e,game.height/2+8*a*8),n.body.velocity.x=-100*e*t):(n.reset(game.width/2+8*e*8,game.height/2+8*a*8+190*a),n.body.velocity.y=-100*a*t),n.anchor.setTo(.5),n.checkWorldBounds=!0,n.outOfBoundsKill=!0}}function takeCoin(){if(!this.coinTaking){this.coinTaking=!0,this.emitter.x=this.coin.x,this.emitter.y=this.coin.y,this.coinSound.play(),this.updateScore();game.add.tween(this.coin.scale).to({x:0,y:0},100).start();game.time.events.add(500,this.addCoin,this)}}var game=new Phaser.Game(600,900,Phaser.AUTO,"",{preload:preload,create:create,update:update,render:render});const distance=50,margin=15,squareSize=50,backgroundColor=2635155,playerColor=15662913,enemyColor=16732754,squareMoveTime=75,instructionFadeTime=2e3,instructionShowTime=3e3;var square,isMoving=!1,music,upKey,downKey,leftKey,rightKey;