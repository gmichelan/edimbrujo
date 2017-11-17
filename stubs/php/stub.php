<?php
require_once './edimbrujo.php';
/*
modificar el token que le corresponde al equipo para el torneo
y el numero de Problema a Trabajar
*/
//$token='f053daab9855fe42942624aef382729d';
//$problema=1;
$edimbrujo=new Edimbrujo("cc8","Curador","php");
$todo= $edimbrujo->iniciar();
print_r($todo);
$i=1;
while($i<=5){
	$i++;
	$todo=$edimbrujo->mover(1);
}


