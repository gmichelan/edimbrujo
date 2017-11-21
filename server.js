var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
//var sleep = require('sleep');
var sleep = require('system-sleep');

var cte_pixel = 53;

//---------------------------------------------------servidor rest-----------
var logica = require("./js/logica.js");
/**
 * 
 * @param {type} req
 * @param {type} res
 * 
 * Método REST que recibe por GET /inicio?Jugador=jjjj&Rol=rrrr&Equipo=eeeee
 * Donde Jugador va a ser el nombre que identifica al agente
 * Rol puede ser (Caballero, Arquero, )
 * Equipo va a ser el nómbre que identifica al equipo, agentes suman puntos para el Equipo
 * Gana el Equipo que mas vida tiene
 * 
 * Devuelve en texto plana un json con 
 * En caso de Error
 * ['ERROR',MensajeError] (Si no existe el rol,
 * En caso 
 * [Token, Fila, Columna]
 * Token identificador para siguientes mensajes.
 * Fila identifica la Fila que ocupa el agente
 * Columna identifica la Columna que ocupa el agente
 * 
 */
app.get('/inicio', function (req, res) {

    var jug = req.param('Jugador');
    var rol = req.param('Rol');
    var eq = req.param('Equipo');
    mensaje = 'Se crea desde Rest el Jugador ' + jug +
            ' asociado al Rol ' + rol +
            ' para el Equipo ' + eq + '.';

    console.log(mensaje);
    var jugador = logica.iniciarJugador(jug, eq, rol);


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
        io.emit('addbonos', ultimosBonos());
        io.emit('newplayer', player);
        io.emit('tabla', logica.getTabla());
        sleep(100);
        res.send(jugador);
        console.log('OK');
    } else {
        console.log(jugador);
    }

});

/**
 * 
 * @param {type} req
 * @param {type} res
 * 
 * Método REST que recibe por GET /mover?token=Token&num=NN
 * Donde Token el que identificador que recibió el agente del método iniciar
 * num es un entero de 0..7 que identifica la posición a donde se mueve el angente
 * si num=0 se mueve arriba a la izquierda resta en uno la fila y la columna
 * si num=1 se mueve arriba resta en uno la fila
 * si num=2 se mueve arriba a la derecha resta uno la fila y suma uno la columna
 * si num=3 se mueve a la derecha suma uno a la columna
 * ....
 * si num=7 se mueve a la izquierda resta uno la columna.
 * Devuelve en texto plana un json con 
 * [[Codigo,Mensaje, Agente], Mundo]
 * 
 * Mensaje
 * en caso de Error es
 * 'ERROR',MensajeError (Si no existe el rol,
 * en caso correcto es
 * 'OK',MensajeCorrecto 
 * 
 * Agente es
 * [Token, Jugador, Rol, Equipo, Fila, Columna, idEquipo, Vida, Fuerza,  Velocidad, Rango];
 * Token identificador para siguientes mensajes.
 * Fila identifica la Fila que ocupa el agente
 * Columna identifica la Columna que ocupa el agente
 * Vida (puntos) que suma al equipo
 * 
 * Mundo Arreglo que identifica el estado del mundo actual
 * Si Mundo[f][c] es:
 * 0: es una posición que se puede ocupar.
 * 1: es una posición con un obstáculo.
 * 3: bono.  Si el agente pasa a ocupar esa posición suma vida dependiendo del bono [10..300]
 * y el bono pasa a otra posición aleatoria.
 * 10X: representa que hay un agente del equipo X (idEquipo)
 * 
 */

app.get('/mover', function (req, res) {
    var tok = req.param('token');
    var num = req.param('num');
    mensaje = 'Se mueve el jugador de token ' + tok +
            ' a posición ' + num + '.';

    console.log(mensaje);
    jugador = logica.mover(tok, num);

    if (jugador[0] != "ERROR") {

        if (jugador[0] == "BONO") {
            var bono = {
                id: jugador[1],
                token: jugador[1],
                x: jugador[3][1] * cte_pixel,
                y: jugador[3][0] * cte_pixel,
                rol: 'Bono',
                equipo: 'Bono',
                usuario: 'Bono'
            };
            io.emit('mov', bono);
            io.emit('tabla', logica.getTabla());
        }
        player = {
            id: 0,
            token: tok,
            x: jugador[2][5] * cte_pixel,
            y: jugador[2][4] * cte_pixel,
            rol: 'xx',
            equipo: 'xx',
            usuario: 'jj'
        };
        io.emit('mov_rest', player);
        sleep(530);
        res.send([jugador, logica.getMundo()]);
        console.log('OK');
    } else {
        res.send([jugador, logica.getMundo()]);
        console.log(jugador);
    }
});
/**
 * 
 * @param {type} req
 * @param {type} res
 * 
 * Método REST que recibe por GET /atacar?token=Token
 * Donde Token el que identificador que recibió el agente del método iniciar
 * Si tiene un agente de un equipo oponente a menos del rango le descuenta la fuerza
 * Si el oponente tiene menos de 0 en vida se reubica
 * 
 * Devuelve en texto plana un json con 
 * [[Codigo,Mensaje, Agente], Mundo]
 * 
 * Mensaje
 * en caso de Error es
 * 'ERROR',MensajeError (Si no existe el token
 * en caso de concretar ataque
 * 'ATACA',MensajeCorrecto 
 * en caso de no concretar
 * 'NULL',Mensaje Correcto
 * 
 * Agente es idem mover.
 * Mundo Arreglo es idem Mover.
 * 
 */
app.get('/atacar', function (req, res) {
    var tok = req.param('token');
    mensaje = 'Ataque del jugador de token ' + tok;

    console.log(mensaje);
    jugador = logica.atacar(tok);
    if (jugador[0] == "ATACA") {
        io.emit('tabla', logica.getTabla());

    }
    sleep(530);
    res.send([jugador, logica.getMundo()]);
    console.log(jugador);
    console.log('OK');

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
        var players = getAllPlayers();
        socket.emit('allplayers', getAllPlayers());
        console.log(players);
        socket.emit('tabla', logica.getTabla());
        //});

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
                io.emit('addbonos', ultimosBonos());
                io.emit('newplayer', socket.player);
                io.emit('tabla', logica.getTabla());
                console.log('OK');
            } else
                console.log(jugador);
            // socket.on('click',function(data){
            // console.log('click to '+data.x+', '+data.y);
            // socket.player.x = data.x;
            // socket.player.y = data.y;
            // io.emit('move',socket.player);
        });

        //Movemos un jugador 
        socket.on('mover', function (direccion) {
            //switch(direccion.id){
            
            console.log('Ejecutamos mover desde web del token ' + socket.player.token + ' a la dirección ' + direccion.id);
            var jugador = logica.mover(socket.player.token, direccion.id + '');


            //Enviamos la nueva posicion del jugador al cliente.
            if (jugador[0] != "ERROR") {
                socket.player.x = jugador[2][5] * cte_pixel;
                socket.player.y = jugador[2][4] * cte_pixel;
                if (jugador[0] == "BONO") {
                    var bono = {
                        id: jugador[1],
                        token: jugador[1],
                        x: jugador[3][1] * cte_pixel,
                        y: jugador[3][0] * cte_pixel,
                        rol: 'Bono',
                        equipo: 'Bono',
                        usuario: 'Bono'
                    };
                    io.emit('mov', bono);
                    io.emit('tabla', logica.getTabla());
                }

                io.emit('mov', socket.player);
                console.log('OK');
            } else {
                console.log(jugador);
            }

        });
        socket.on('atacar', function (direccion) {
            //switch(direccion.id){
            console.log('Ejecutamos atacar desde web del token ' + socket.player.token);
            var jugador = logica.atacar(socket.player.token);
            if (jugador[0] == "ATACA") {
                io.emit('tabla', logica.getTabla());

            }
            console.log(jugador);
            console.log('OK');

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
            x: playersAux[j][5] * cte_pixel,
            y: playersAux[j][4] * cte_pixel,
            rol: playersAux[j][2],
            equipo: playersAux[j][3],
            usuario: playersAux[j][1]
        };
        players[j] = player;
    }
    var bonosAux = logica.getBonos();
    for (var j = 0; j < bonosAux.length; j++) {
        var bono = {
            id: j,
            token: 'B' + j,
            x: bonosAux[j][1] * cte_pixel,
            y: bonosAux[j][0] * cte_pixel,
            rol: 'Bono',
            equipo: 'Bono',
            usuario: 'Bono'
        };
        players.push(bono);
    }

    return players;
}

function ultimosBonos() {
    var players = new Array();

    var bonosAux = logica.getBonos();
    for (var j = bonosAux.length - 3; j < bonosAux.length; j++) {
        var bono = {
            id: j,
            token: 'B' + j,
            x: bonosAux[j][1] * cte_pixel,
            y: bonosAux[j][0] * cte_pixel,
            rol: 'Bono',
            equipo: 'Bono',
            usuario: 'Bono'
        };
        players.push(bono);
    }

    return players;
}
