var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var cte_pixel=53;
var super_socket;
//--------------------------------------------------------------
var logica = require("./js/logica.js");
app.get('/inicio',function(req,res){
	var jug = req.param('Jugador');
	var rol=req.param('Rol');
	var eq = req.param('Equipo');
    mensaje='Se crea el Jugador '+jug+
    ' asociado al Rol '+ rol+
    ' para el Equipo '+ eq+'.';
	
    console.log(mensaje);
	var jugador = logica.iniciarJugador(jug, eq, rol);
	res.send(jugador);
	
	if(jugador[0] != "error"){
	player={
		id: server.lastPlayderID++,
			token: jugador[0],
            x: jugador[1]*cte_pixel,
            y: jugador[2]*cte_pixel,
			rol:rol,
			equipo:eq,
			usuario:jug
	}
	
	io.emit('newplayer',player);
	}

});

app.get('/mover',function(req,res){
	var tok = req.param('token');
	var num = req.param('num');
	jugador = logica.mover(token, num);
	res.send([logica.getJugadores(), logica.getMundo()]);
	
	if(jugador[0] != "error"){
	player={
		id: 0,
			token: tok,
            x: jugador[0]*cte_pixel,
            y: jugador[1]*cte_pixel,
			rol:'xx',
			equipo:'xx',
			usuario:'jj'
	}	
	io.emit('mov_rest', player);
	}
});

app.get('/atacar',function(req,res){
	if (seEncuentra(req.param('token')))
	{
    res.send('el jugador '+jugador(token)+' ataca!');}
	else{
		res.send('El token no existe perrito, deja de paquearte jodi2');
	}
});

//--------------------------------------------------------------

//Definimos rutas para adjuntar librerias css y js.
app.use('/css',express.static(__dirname + '/css'));
//La carpeta js contiene el archivo logica.js. En ppio este archivo contiene:
//iniciarJugador(jugador, equipo, rol) devuelve un arreglo con [TK, X, Y]. En caso de fallo el arreglo contiene [null,null,null].
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));

//index.html contiene el ambiente del juego y un formulario para iniciar sesion en el mismo.
app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

//Definimos un id para cada jugador. Se incrementa en 1 cuando un nuevo jugador se conecta.
server.lastPlayderID = 0;

//Configuramos el servidor para que escuche peticiones en el puerto 8081
server.listen(process.env.PORT || 65000,function(){
    console.log('Listening on '+server.address().port);
});

io.on('connection',function(socket){

    socket.on('newplayer',function(datos_jugador){
		//Creamos un nuevo jugador.
        var jugador=logica.iniciarJugador(datos_jugador.usuario, datos_jugador.equipo, datos_jugador.rol);
		
		socket.player = {
            id: server.lastPlayderID++,
			token: jugador[0],
            x: jugador[1],
            y: jugador[2],
			rol:datos_jugador.rol,
			equipo:datos_jugador.equipo,
			usuario:datos_jugador.usuario
        };
		console.log(datos_jugador.rol);
		//Notificamos la existencia de un nuevo jugador a todos los miembros.
        socket.emit('allplayers',getAllPlayers());
        socket.broadcast.emit('newplayer',socket.player);
		
        // socket.on('click',function(data){
            // console.log('click to '+data.x+', '+data.y);
            // socket.player.x = data.x;
            // socket.player.y = data.y;
            // io.emit('move',socket.player);
        // });
		
		//Movemos un jugador 
		socket.on('mover', function(direccion){
			//switch(direccion.id){
				var posicion=logica.mover(socket.player.token,direccion.id);
				console.log('Ejecutamos mover del token'+socket.player.token);
				// case 3 : //Mos movemos hacia la derecha. Sumamos en x.
						 // socket.player.x += 50;
						 // break;
				// case 7 : //Mos movemos hacia la izquierda. Restamos en x.
						 // socket.player.x -= 50;
						 // break;
				// case 1 : //Subimos, sumamos en y.
						 // socket.player.y += 50;
						 // break;
				// case 5 : //Bajamos, restamos en y.
						 // socket.player.y -= 50;
						 // break;
				// case 2 : //Movimiento diagonal. Noreste.
						 // socket.player.x += 50;
						 // socket.player.y += 50;
						 // break;
				// case 4 : //Sureste.
					     // socket.player.x -= 50;
						 // socket.player.y += 50;
						 // break;
				// case 6 : //Suroeste.
						 // socket.player.x -= 50;
						 // socket.player.y -= 50;
						 // break;
				// case 0 : //Noroeste.
				         // socket.player.x += 50;
						 // socket.player.y -= 50;
						 // break;
				// case 9 : 
						 // console.log('Atacar');
						 
			//}
						
			//Enviamos la nueva posicion del jugador al cliente.
			socket.player.x = posicion[0]*cte_pixel;
			socket.player.y = posicion[1]*cte_pixel;
			io.emit('mov', socket.player);
			
		});
	
        socket.on('disconnect',function(){
            io.emit('remove',socket.player.id);
        });
    });

    socket.on('test',function(){
        console.log('test received');
    });
});

function getAllPlayers(){
    var players = [];
	//io.sockets.connected contiene un arreglo interno con todos los sockets conectados al servidor.
    //Object.keys(io.sockets.connected).forEach(function(socketID){
      //  var player = io.sockets.connected[socketID].player;
        //if(player) players.push(player);
    //});
    return logica.getJugadores();
}

//Crea un numero random para establecer la posicion inicial de un jugador.
function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
