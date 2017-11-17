var express = require('express');
var app = express();
var server = require('http').Server(app);
var logica = require("./logica.js");

app.get('/inicio',function(req,res){
	var jug = req.param('Jugador');
	var rol=req.param('Rol');
	var eq = req.param('Equipo');
    mensaje='Se crea el Jugador '+jug+
    ' asociado al Rol '+ rol+
    ' para el Equipo '+ eq+'.';
	
    console.log(mensaje);
	var ar = logica.iniciarJugador(jug, eq, rol);
	res.send(ar[0] + ' ' + ar[1] + ' ' + ar[2]);
	console.log("Jugador creado salida del método inicio");

});

app.post('/mover',function(req,res){
	
	var tok = req.param('token');
	var num = req.param('num');
	msg = logica.mover(tok, num);
	console.log("Se movio el jugador: "+tok+" en la posición"+num);
	res.send(msg);
	console.log("terminado el método mover");
	
});


function jugador(token) {
	
	var tmp = 'nada';
	  for (var i=0; i<arreglo.length; i++) {
			if (arreglo[i]==token)
				tmp = arreglo[i+1];
				}
				return tmp;
}

app.post('/atacar',function(req,res){
	console.log("Entro al método atacar");
	if (seEncuentra(req.param('token')))
	{
    res.send('el jugador '+jugador(token)+' ataca!');}//hay que revisar el token que recibe este método
	else{
		res.send('El token no existe perrito, deja de paquearte jodi2');
	}
});

server.lastPlayderID = 0;

server.listen(process.env.PORT || 80,function(){
    console.log('Listening on '+server.address().port);
});
