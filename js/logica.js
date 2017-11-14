var arreglo;
var jugador=[];
var cantidadJugadores = 0;
var indiceActual;
var cantEquipo=0;
var jeje = require("./bd.js");
	jeje.csvtoarray();
	arreglo = jeje.mapa();
	atributos = [["Mago",1300,300,10,5],["Arquero",1000,400,20,10],["Caballero",2000,200,40,1],["Curador",1500,100,30,2]];

function iniciarJugador(jug, eq, rol){
	token = jug+''+eq;
	if(!seEncuentra(token)){
	//Definimos la posicion del sprite.
	var x = Math.floor(Math.random()* 40);
	var y = Math.floor(Math.random()* 40);
	while(arreglo[x][y]!=28){
	x = Math.floor(Math.random()* 40);
	y = Math.floor(Math.random()* 40);	
	}
	
	var limite = jugador.length;
	var i=0;
	var bandera=true;
	var equipo;
	while(bandera && i<limite){
		if(jugador[i][3] == eq){
		equipo=jugador[i][6];
		bandera = false;
		}
		i++;
	}
		if(bandera){
			cantEquipo++;
			equipo=cantEquipo;
		}
		var j=0;
	while(j<atributos.length  && rol != atributos[j][0]){
		j++;
	}
	if(j==atributos.length){
	res.send("Rol inexistente "+rol);
	}else{
	jugador[cantidadJugadores] = [token, jug, rol,eq, x, y,equipo,atributos[j][1],atributos[j][2],atributos[j][3],atributos[j][4]];
	arreglo[x][y] = equipo;
	cantidadJugadores++;
	return[token, x, y];
	}
	}	else {
		return [null,null,null];
	}
}

function getJugadores(){
	return jugador;
}

function mover(tok,pos){
	if (seEncuentra(tok)){
	var px = jugador[indiceActual][4];
	var py = jugador[indiceActual][5];
	var limx = arreglo.length;
	var limy = arreglo[0].length;
	switch(pos) {
    case '0':
        if (px-1 >= 0 && py -1>=0){
					px = px-1;
					py = py-1;}
        break;
    case '1':
        if (py -1 >=0){
					py = py-1;}
        break;
	case '2':
        if (px+1 <= limx && py -1 >=0){
					px = px+1;
					py = py-1;}
        break;
	case '3':
        if (px+1 <= limx){
					px = px+1;}
        break;
	case '4':
        if (px+1 <= limx && py+1 <= limy){
					px = px+1;
					py = py+1;}
        break;
	case '5':
        if (py+1 <= limy){
					py = py+1;}
        break;
	case '6':
        if (px-1 >= 0 && py+1 <= limy){
					px = px-1;
					py = py+1;}
        break;
    case '7':
        if (px-1 >= 0){
					px = px-1;}
	}
		if (arreglo[px][py] == 28){
			arreglo[jugador[indiceActual][4]][jugador[indiceActual][5]] = 28;
			jugador[indiceActual][4] = px;
			jugador[indiceActual][5] = py;
			arreglo[px][py] = jugador[indiceActual][6];}
	}
	//return [arreglo, jugador];
	return [px, py];
		
}

function seEncuentra(token) {
	
	var esta = false;
	  for (var i=0; i<jugador.length; i++) {
			if (jugador[i][0]==token){
					esta = true;
					indiceActual=i;
			}
				}
		return esta;
}

module.exports.iniciarJugador = iniciarJugador;
module.exports.mover = mover;
module.exports.getJugadores = getJugadores;