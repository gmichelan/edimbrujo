var arreglo = [];   
function CSVToArray(){
const obj = {};
const fs = require('fs');
const lr = require('readline');
var i=0;

var lineReader = lr.createInterface({
  input: fs.createReadStream('assets/map/mapa.csv')
});
lineReader.on('line', function (line) {
	arreglo[i] = new Array();
    arreglo[i]= line.split(',');
	for(var j =0; j < arreglo[i].length ; j++){
	arreglo[i][j] =parseInt(arreglo[i][j], 10);
        if(arreglo[i][j]!=28 && arreglo[i][j]!=3 && arreglo[i][j]!=4 && arreglo[i][j]!=5 && arreglo[i][j]!=6){
            arreglo[i][j]=1;
        }else{
            arreglo[i][j]=0;
        }
	}
	i++;
});

lineReader.on('close', ()=>{
 //   console.log(arreglo[11][5]);
 //   console.log(arreglo[11][6]);
//	  console.log(i);

});
    }
	
   function Pos(x, y){
//	console.log(x);
//console.log(y);
//console.log(arreglo[x][y]);	
	return arreglo[x][y];
    }
	
   function Mapa(){
//	 var limite = arreglo.length;
//	 console.log(limite);
//  for (var i = 0; i < limite; i++) {
	//console.log(arreglo[0][i]);
 // }
	//return arreglo;
        //transponer matriz a array de filas como se representa en phaser
    /*for (var i = 0; i < arreglo.lenth; i++) {
            for (var j = 0; j <i; j++) {
      //swap element[i,j] and element[j,i]
            var temp = arreglo[i][j];
            arreglo[i][j] = arreglo[j][i];
            arreglo[j][i] = temp;
            }
        }*/
        return arreglo;
    }	

	
module.exports.csvtoarray = CSVToArray;
module.exports.posicion = Pos;
module.exports.mapa = Mapa;