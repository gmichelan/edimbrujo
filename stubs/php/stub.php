<html>
    <body>
        <form method="post">
            Mover a <input name="num" type="text" focus>
            <input type="submit">
        </form>
    
<?php
require_once './edimbrujo.php';
/*
  modificar el token que le corresponde al equipo para el torneo
  y el numero de Problema a Trabajar
 */
//$token='f053daab9855fe42942624aef382729d';
//$problema=1;
$edimbrujo = new Edimbrujo("cc8", "Curador", "php");
if (!isset($_POST['num']))
    $todo = $edimbrujo->iniciar();
else {
    $todo = $edimbrujo->mover($_POST['num']);
    echo '<pre>';
    print_r($todo[0]);
    print_r($todo[1]);

    $x = $todo[1][1][4];
    $y = $todo[1][1][5];
    for ($index = $x-5; $index < $x+5; $index++) {
        for ($index1 = $y-5; $index1 < $y+5; $index1++) {
            if (isset($todo[2][$index][$index1]))
                echo $todo[2][$index][$index1] . " ";
        }
        echo '<br>';
        
    }
}
 //print_r($todo);
//$i=1;
//while($i<=5){
//	$i++;
//	$todo=$edimbrujo->mover(1);
//}
?>
</body>
</html>

