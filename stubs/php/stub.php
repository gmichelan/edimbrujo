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
        
        if (isset($_POST['num'])){
            $edimbrujo = new Edimbrujo($_POST['num'], "Arquero", "php");
            $todo = $edimbrujo->iniciar();
        //else {
        for ($index2 = 0; $index2 < 500 ; $index2++) {
            
        
                $acc=rand(0, 8);
                if($acc==8){
                    $todo = $edimbrujo->atacar();
                }else
                $todo = $edimbrujo->mover(rand(0, 7));
                
                print_r($todo[0]);


                $x = $todo[0][2][4];
                $y = $todo[0][2][5];
                for ($index = $x - 5; $index < $x + 5; $index++) {
                    for ($index1 = $y - 5; $index1 < $y + 5; $index1++) {
                        if (isset($todo[1][$index][$index1]))
                            echo $todo[1][$index][$index1] . " ";
                    }
                    echo '<br>';
                }
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

