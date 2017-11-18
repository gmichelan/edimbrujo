var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var cte_pixel = 53;

//---------------------------------------------------servidor rest-----------
var logica = require("./js/logica.js");

app.get('/inicio', function (req, res) {
   
    var jug = req.param('Jugador');
    var rol = req.param('Rol');
    var eq = req.param('Equipo');
    mensaje = 'Se crea desde Rest el Jugador ' + jug +
            ' asociado al Rol ' + rol +
            ' para el Equipo ' + eq + '.';

    console.log(mensaje);
    var jugador = logica.iniciarJugador(jug, eq, rol);
    res.send(jugador);

    if (jugador[0] != "ERROR") {
        player = {
            id: server.lastPlayderID++,
            token: jugador[0],
            x: jugador[2] * cte_pixel,
            y: jugador[1] * cte_pixel,
            rol: rol,
            equipo: eq,
            usuario: jug
        };

        io.emit('newplayer', player);
        io.emit('tabla',logica.getTabla());
        console.log('OK');
    } else {
        console.log(jugador);
    }

});

app.get('/mover', function (req, res) {
    var tok = req.param('token');
    var num = req.param('num');
    mensaje = 'Se mueve el jugador de token ' + tok +
            ' a posición ' + num + '.';

    console.log(mensaje);
    jugador = logica.mover(tok, num);

    if (jugador[0] != "ERROR") {
        res.send([['OK', 'MOVIMIENTO CORRECTO'], logica.getJugadores(), logica.getMundo()]);
        player = {
            id: 0,
            token: tok,
            x: jugador[1] * cte_pixel,
            y: jugador[0] * cte_pixel,
            rol: 'xx',
            equipo: 'xx',
            usuario: 'jj'
        };
        io.emit('mov_rest', player);
        console.log('OK');
    } else {
        res.send([jugador, logica.getJugadores(), logica.getMundo()]);
        console.log(jugador);
    }
});

app.get('/atacar', function (req, res) {
    var tok = req.param('token');
    jugador = logica.atacar(tok);

});

//---------------------------------servidor web------------------------

//Definimos rutas para adjuntar librerias css y js.
app.use('/css', express.static(__dirname + '/css'));
//La carpeta js contiene el archivo logica.js. En ppio este archivo contiene:
//iniciarJugador(jugador, equipo, rol) devuelve un arreglo con [TK, X, Y]. En caso de fallo el arreglo contiene [null,null,null].
app.use('/js', express.static(__dirname + '/js'));
app.use('/assets', express.static(__dirname + '/assets'));

//index.html contiene el ambiente del juego y un formulario para iniciar sesion en el mismo.
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

//------------------------servidor socket io
//Definimos un id para cada jugador. Se incrementa en 1 cuando un nuevo jugador se conecta.
server.lastPlayderID = 0;

//Configuramos el servidor para que escuche peticiones en el puerto 8081
server.listen(process.env.PORT || 65000, function () {
    console.log('Listening on ' + server.address().port);
});

io.on('connection', function (socket) {
    socket.on('getallplayers', function () {
        socket.emit('allplayers', getAllPlayers());
        socket.emit('tabla',logica.getTabla());
    });

    socket.on('newplayer', function (datos_jugador) {
        //Creamos un nuevo jugador.
        mensaje = 'Se crea desde Web el Jugador ' + datos_jugador.usuario +
                ' asociado al Rol ' + datos_jugador.rol +
                ' para el Equipo ' + datos_jugador.equipo + '.';

        console.log(mensaje);
        var jugador = logica.iniciarJugador(datos_jugador.usuario, datos_jugador.equipo, datos_jugador.rol);
        if (jugador[0] != "ERROR") {
            socket.player = {
                id: server.lastPlayderID++,
                token: jugador[0],
                x: jugador[2] * cte_pixel,
                y: jugador[1] * cte_pixel,
                rol: datos_jugador.rol,
                equipo: datos_jugador.equipo,
                usuario: datos_jugador.usuario
            };
            console.log(datos_jugador.rol);
            //Notificamos la existencia de un nuevo jugador a todos los miembros.
            //socket.emit('allplayers', getAllPlayers());
            io.emit('newplayer', socket.player);
            io.emit('tabla',logica.getTabla());
            console.log('OK');
        } else
            console.log(jugador);
        // socket.on('click',function(data){
        // console.log('click to '+data.x+', '+data.y);
        // socket.player.x = data.x;
        // socket.player.y = data.y;
        // io.emit('move',socket.player);
        //});

        //Movemos un jugador 
        socket.on('mover', function (direccion) {
            //switch(direccion.id){
            console.log('Ejecutamos mover desde web del token ' + socket.player.token + ' a la dirección '+direccion.id);
            var posicion = logica.mover(socket.player.token, direccion.id+'');
            

            //Enviamos la nueva posicion del jugador al cliente.
            if (posicion[0] != "ERROR") {
                socket.player.x = posicion[1] * cte_pixel;
                socket.player.y = posicion[0] * cte_pixel;
                io.emit('mov', socket.player);
                console.log('OK');
            }else{
                console.log(posicion);
            }

        });

        socket.on('disconnect', function () {
            io.emit('remove', socket.player.id);
        });
    });
});


function getAllPlayers() {
    var players = new Array();

    var playersAux = logica.getJugadores();
    for (var j = 0; j < playersAux.length; j++) {
        var player = {
                id: playersAux[j][0],
                token: playersAux[j][0],
                x: playersAux[j][5] * cte_pixel ,
                y: playersAux[j][4] * cte_pixel ,
                rol: playersAux[j][2],
                equipo: playersAux[j][3],
                usuario: playersAux[j][1]
            };
        players[j]=player;
    }
    var bonosAux= logica.getBonos();
    for (var j=0; j < bonosAux.length; j++) {
        var bono = {
                id: j,
                token: 'B'+j,
                x: bonosAux[j][1] * cte_pixel ,
                y: bonosAux[j][0] * cte_pixel ,
                rol: 'Bono',
                equipo: 'Bono',
                usuario: 'Bono'
            };
        players.push(bono);
    }
    
    return players;
}


