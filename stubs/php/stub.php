<?php
require_once './edimbrujo.php';
/*
modificar el token que le corresponde al equipo para el torneo
y el numero de Problema a Trabajar
*/
//$token='f053daab9855fe42942624aef382729d';
//$problema=1;
$edimbrujo=new Edimbrujo("cc8","Curador","php");
//$todo= $edimbrujo->iniciar();
 $todo= $edimbrujo->mover(0);
 print_r($todo[0]);
 
 $x=$todo[0][0][4];
 $y=$todo[0][0][5];
 echo $todo[1][$x-1][$y-1]." ";
 echo $todo[1][$x][$y-1]." ";
 echo $todo[1][$x+1][$y-1]."-";
 
 echo $todo[1][$x-1][$y]." ";
 echo $todo[1][$x][$y]." ";
 echo $todo[1][$x+1][$y]."-";
 
 echo $todo[1][$x-1][$y+1]." ";
 echo $todo[1][$x][$y+1]." ";
 echo $todo[1][$x+1][$y+1]." ";

 //print_r($todo);
//$i=1;
//while($i<=5){
//	$i++;
//	$todo=$edimbrujo->mover(1);
//}


