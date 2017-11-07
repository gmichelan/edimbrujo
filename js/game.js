/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

var Game = {};

Game.init = function(){
    game.stage.disableVisibilityChange = true;
};

//Cargamos los recursos del juego.
Game.preload = function() {
    game.load.tilemap('map', 'assets/map/map.csv', null, Phaser.Tilemap.TILED_CSV);	
	game.load.image('tile', 'assets/map/tiles.png');
    game.load.image('sprite','assets/sprites/sprite.png');
	
	game.load.spritesheet('caballero','assets/Personajes/caballero/parado/caballero-parado-sureste.png',72,72);
	game.load.spritesheet('arquero','assets/Personajes/arquero/arquero-parado.png',53,91);
	game.load.spritesheet('curador','assets/Personajes/curador/quieto-sureste.png',72,72);
	game.load.spritesheet('luchador','assets/Personajes/luchador/quieto-hacha-sureste.png',72,72);
	
	//IMG para los disparos.
	game.load.image('esfera','assets/sprites/esfera.png');
};

Game.create = function(){
	game.physics.startSystem(Phaser.Physics.ARCADE);
	
	//Objeto json para guardar los jugadores que se conectan al servidor.
    Game.playerMap = {};
    var testKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    testKey.onDown.add(Client.sendTest, this);
	
	//Capturamos las teclas que pulsa el usuario.
	var q=game.input.keyboard.addKey(Phaser.Keyboard.Q);
	//Si el usuario presiona la tecla Q, llamamos a la funcion mover.
	q.onDown.add(Client.mover,this);
	
	var w=game.input.keyboard.addKey(Phaser.Keyboard.W);
	w.onDown.add(Client.mover,this);
	
	var e=game.input.keyboard.addKey(Phaser.Keyboard.E);
	e.onDown.add(Client.mover,this);
	
	var d=game.input.keyboard.addKey(Phaser.Keyboard.D);
	d.onDown.add(Client.mover,this);
	
	var c=game.input.keyboard.addKey(Phaser.Keyboard.C);
	c.onDown.add(Client.mover,this);
	
	var x=game.input.keyboard.addKey(Phaser.Keyboard.X);
	x.onDown.add(Client.mover,this);
	
	var z=game.input.keyboard.addKey(Phaser.Keyboard.Z);
	z.onDown.add(Client.mover,this);
	
	var a=game.input.keyboard.addKey(Phaser.Keyboard.A);
	a.onDown.add(Client.mover,this);
	
	//Creamos un grupo para emitir disparos.
	esferas=game.add.group();
	esferas.enableBody=true;
	esferas.physicsBodyType=Phaser.Physics.ARCADE;
	esferas.createMultiple(20, 'esfera');
	
	//Si presionamos la tecla S, obtenemos un disparo y lo enviamos al servidor.
	var s=game.input.keyboard.addKey(Phaser.Keyboard.S);
	s.onDown.add(Client.disparar);
		
	//Incluimos el tilemap del juego.
    var map = game.add.tilemap('map',53,53);
    map.addTilesetImage('tile'); // tilesheet is the key of the tileset in map's JSON file
    var layer;
    for(var i = 0; i < map.layers.length; i++) {
        layer = map.createLayer(i);
    }
    layer.inputEnabled = true; // Allows clicking on the map ; it's enough to do it on the last layer
    layer.events.onInputUp.add(Game.getCoordinates, this);
	
    //Client.askNewPlayer();
	
};

Game.getCoordinates = function(layer,pointer){
    Client.sendClick(pointer.worldX,pointer.worldY);
};

Game.addNewPlayer = function(id,x,y,rol){
	
	//Agregamos el sprite correspondiente al nuevo jugador.
	switch(rol){
		case "Caballero" : console.log('Este es el rol seleccionado en game.js');
						   console.log(Client.rol);
						   Game.playerMap[id] = game.add.sprite(x,y,'caballero');
						   game.physics.arcade.enable(Game.playerMap[id]);
						   break;
		case "Arquero"   : Game.playerMap[id] = game.add.sprite(x,y,'arquero');
						   game.physics.arcade.enable(Game.playerMap[id]);
						   break;
		case "Luchador"  : Game.playerMap[id] = game.add.sprite(x,y,'luchador');
						   game.physics.arcade.enable(Game.playerMap[id]);
						   break;
		case "Curador"   : Game.playerMap[id] = game.add.sprite(x,y,'curador');
						   game.physics.arcade.enable(Game.playerMap[id]);
						   break;
		default : Game.playerMap[id] = game.add.sprite(x,y,'sprite');
			      game.physics.arcade.enable(Game.playerMap[id]);
	}
	
	//Game.playerMap[id] = game.add.sprite(x,y,'sprite');
	
	//Activamos la fisica del jugador.
	
	//game.camera.follow(Game.playerMap[Client.id], Phaser.Camera.FOLLOW_LOCKON);
};

//Movemos un jugador en el ambiente del juego.
Game.movePlayer = function(id,x,y){
    var player = Game.playerMap[id];
    var distance = Phaser.Math.distance(player.x,player.y,x,y);
    var tween = game.add.tween(player);
    var duration = distance*10;
    tween.to({x:x,y:y}, duration);
    tween.start();
	
	if(id === Client.id){
		console.log(id+" x: "+x+" y: "+y);
	}
};

//Eliminamos un jugador del grupo.
Game.removePlayer = function(id){
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};