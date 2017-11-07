/**
 * Created by Jerome on 03-03-17.
 */

var Client = {};
//Nos conectamos al servidor.
Client.socket = io.connect();
Client.id;
Client.rol;

Client.sendTest = function(){
    console.log("test sent");
    Client.socket.emit('test');
};

Client.mover = function(direccion){
	console.log(direccion.event.key);
	var id=0;
	switch(direccion.event.key){
		case "q" : id=0;
				   break;
		case "w" : id=1;
				   break;
		case "e" : id=2;
				   break;
		
		case "d" : id=3;
				   break;
		
		case "c" : id=4;
				   break;
		
		case "x" : id=5;
				   break;
		
		case "z" : id=6;
				   break;
		
		case "a" : id=7;
				   break;
		
		case "s" : //Atacar
				   id=9;
				   break;
				   
	}
	
	//Enviamos al servidor in id con la tecla que acabamos de pulsar.
	Client.socket.emit('mover', { id : id });
};

Client.disparar = function(){
	var disparo=esferas.getFirstExists(false);
	console.log('Ejecutamos la funcion disparar');
	console.log(disparo);
	if(disparo){
		disparo.reset(100,200);
		disparo.body.velocity.y += 100;
	}
	//Client.socket.emit('disparar');
};

//Enviamos un mensje al servidor cuando un  nuevo jugador se conecta al mismo.
Client.askNewPlayer = function(){
	Client.rol=document.getElementById(2).value;
	//Enviamos al servidor datos relacionados al nuevo jugador.
    Client.socket.emit('newplayer', { usuario : document.getElementById(1).value, rol : document.getElementById(2).value, equipo : document.getElementById(3).value });
};

Client.sendClick = function(x,y){
  Client.socket.emit('click',{x:x,y:y});
};

//data es el objeto socket.player que envia el servidor.
Client.socket.on('newplayer',function(data){
    Game.addNewPlayer(data.id,data.x,data.y,data.rol);
	console.log(Client.rol);
});

Client.socket.on('allplayers',function(data){
    for(var i = 0; i < data.length; i++){
		//id, x, y, rol
        Game.addNewPlayer(data[i][0],data[i][4],data[i][5],data[i][2]);
    }

	//ID del ultimo jugador.
	Client.id=i-1;
	console.log(i-1);
	
    Client.socket.on('move',function(data){
        Game.movePlayer(data.id,data.x,data.y);
    });

    Client.socket.on('remove',function(id){
        Game.removePlayer(id);
    });
	
	Client.socket.on('mov', function(posicion){
		Game.movePlayer(posicion.token, posicion.x, posicion.y);
	});
});


