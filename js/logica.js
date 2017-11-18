var arreglo;
var jugador = [];
var bonos = [];
var cantidadJugadores = 0;
var indiceActual;
var cantEquipo = 0;
var jeje = require("./bd.js");
jeje.csvtoarray();
arreglo = jeje.mapa();
var atributos = [["Mago", 1300, 300, 10, 5], ["Arquero", 1000, 400, 20, 10], ["Caballero", 2000, 200, 40, 1], ["Curador", 1500, 100, 30, 2]];





function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
function buscoXY(){
    var x = randomInt(0, 40);
        var y = randomInt(0, 40);
        //28:pasto.
        while (arreglo[x][y] !== 0) {
            x = randomInt(0, 40);
            y = randomInt(0, 40);
        }
        return([x,y]);
}

function iniciarBonos() {
    //console.log(arreglo);
    for(var j =0; j < 10 ; j++){
        var pos=buscoXY();
        var x = pos[0];
        var y = pos[1];
        
        bonos.push([ x, y, randomInt(10,300)]);
        arreglo[x][y]=3;
    }
    return bonos;
}





function iniciarJugador(jug, eq, rol) {
    token = jug + '' + eq;
    if (!seEncuentra(token)) {
        //Definimos la posicion del sprite.
        var pos=buscoXY();
        var x = pos[0];
        var y = pos[1];
        

        var limite = jugador.length;
        var i = 0;
        var bandera = true;
        var equipo;
        //Para tener id de equipo.
        while (bandera && i < limite) {
            if (jugador[i][3] == eq) {
                equipo = jugador[i][6];
                bandera = false;
            }
            i++;
        }
        if (bandera) {

            equipo = cantEquipo;
            cantEquipo++;
        }
        var j = 0;
        //Buscamos el j del rol.
        while (j < atributos.length && rol != atributos[j][0]) {
            j++;
        }
        if (j == atributos.length) {
            //res.send("Rol inexistente "+rol);
            return ["ERROR", "Rol inexistente "];
        } else {
            jugador[cantidadJugadores] = [token, jug, rol, eq, x, y, equipo, atributos[j][1], atributos[j][2], atributos[j][3], atributos[j][4]];
            arreglo[x][y] = equipo + 100;
            cantidadJugadores++;
            iniciarBonos();
            return[token, x, y];
        }
    } else {
        return ["ERROR", "ya existe el jugador " + jug + " en el equipo " + eq];
    }
}

function getJugadores() {
    return jugador;
}
function getBonos(){
    return bonos;
}

function getMundo() {
    return arreglo;
}

function mover(tok, pos) {
    indiceActual = seEncuentra(tok);
    if (indiceActual != null) {
        console.log(jugador[indiceActual]);
        var px = jugador[indiceActual][4];
        var py = jugador[indiceActual][5];
        var limx = arreglo.length;
        var limy = arreglo[0].length;
        switch (pos) {
            case '0':
                if (px - 1 >= 0 && py - 1 >= 0) {
                    px = px - 1;
                    py = py - 1;
                }
                break;
            case '1':
                if (px - 1 >= 0) {
                    px = px - 1;
                }
                break;
            case '2':
                if (py + 1 <= limx && px - 1 >= 0) {
                    px = px - 1;
                    py = py + 1;
                }
                break;
            case '3':
                if (py + 1 <= limx) {
                    py = py + 1;
                }
                break;
            case '4':
                if (px + 1 <= limx && py + 1 <= limy) {
                    px = px + 1;
                    py = py + 1;
                }
                break;
            case '5':
                if (px + 1 <= limy) {
                    px = px + 1;
                }
                break;
            case '6':
                if (py - 1 >= 0 && px + 1 <= limy) {
                    px = px + 1;
                    py = py - 1;
                }
                break;
            case '7':
                if (py - 1 >= 0) {
                    py = py - 1;
                }
                break;

        }
        /*
         * si la nueva posición es 0 pasto o 3 bono
         */
        if (arreglo[px][py] == 0 || arreglo[px][py] == 3) {
            arreglo[jugador[indiceActual][4]][jugador[indiceActual][5]] = 0;
            if (arreglo[px][py] == 3)
            { //bono
                //recalculo bono
                for (var j =0; j < bonos.length&& ( bonos[j][0]!=px || bonos[j][1]!=py) ; j++);
                if (j==bonos.length)
                    console.log('Error al buscar el bono');
                else{
                   var pos=buscoXY();
                   bonos[j][0]=pos[0];
                   bonos[j][1]=pos[1];
                   arreglo[pos[0]][pos[1]]=3;
                   jugador[indiceActual][7]+=bonos[j][2];
                }
                //sumo vida
            }
            jugador[indiceActual][4] = px;
            jugador[indiceActual][5] = py;
            arreglo[px][py] = jugador[indiceActual][6] + 100;
            return [px, py];
        } else
            return ["ERROR", "posicion ocupada"];

    } else
        return ["ERROR", "no se encuentra token"];


}

function seEncuentra(token) {

    var esta = false;
    for (var i = 0; i < jugador.length; i++) {
        if (jugador[i][0] == token) {
            esta = true;
            return i;


        }
    }
    return null;
}
function atacar(token) {
    indiceActual = seEncuentra(token);
    if (indiceActual != null) {
        var px = jugador[indiceActual][4];//posición en x del token 
        var py = jugador[indiceActual][5];//posición en y del token
        var limx = arreglo.length;//limite del mundo en x 
        var limy = arreglo[0].length;//limite del mundo en y
        //m einteresa del 6:equipo, 7:vida, 8:fuerza, 9:velocidad, 10:rango
        //si el jugador tiene en 10 algun otro agente que no es del equipo lo ataca y le resta
        //arreglo esta el mapa

        for (var i = 0; i < jugador.length; i++) {
            if (i != indiceActual && jugador[i][6] != jugador[indiceActual][6] && Math.sqrt(Math.pow(jugador[i][4] - px) + Math.pow(jugador[i][5] - py) < jugador[indiceActual][10])) {
                if (jugador[i][7] - jugador[indiceActual][8] < 0)
                {
                    jugador.pop(i);//murio el jugador 1
                } else {
                    jugador[i][7] -= jugador[indiceActual][8];
                }
            }
        }

    }

}

function getTabla() {
    var tabla = new Array();
    for (var i = 0; i < jugador.length; i++) {
        if (typeof tabla[jugador[i][6]] == 'undefined') {
            tabla[jugador[i][6]] = [jugador[i][3],
                jugador[i][7]];
        } else {
            tabla[jugador[i][6]][1] += jugador[i][7];
        }
    }
    return tabla;
}
module.exports.iniciarJugador = iniciarJugador;
module.exports.mover = mover;
module.exports.getJugadores = getJugadores;
module.exports.getMundo = getMundo;
module.exports.getTabla = getTabla;
module.exports.getBonos = getBonos;