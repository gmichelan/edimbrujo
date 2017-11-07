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

});

app.post('/mover',function(req,res){
	var tok = req.param('token');
	var num = req.param('num');
	msg = logica.mover(token, num);
	res.send(msg);
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
	if (seEncuentra(req.param('token')))
	{
    res.send('el jugador '+jugador(token)+' ataca!');}
	else{
		res.send('El token no existe perrito, deja de paquearte jodi2');
	}
});

server.lastPlayderID = 0;

server.listen(process.env.PORT || 80,function(){
    console.log('Listening on '+server.address().port);
});
