<?php

class Edimbrujo {
    /*
      modificar el token que le corresponde al equipo para el torneo
      y el numero de Problema a Trabajar
     */

    //public $token = 'eb1d954e6cfa2749f7624b0eda4a939f';
    public $tokenSolicitud='cc85php';
    public $jugador = null;
    public $rol = null;
    public $equipo = null;

        
    public $host = 'localhost:65000';//'edimbrujo.fi.uncoma.edu.ar';
    //public $host = 'localhost/yii/hornero';
    public function __construct($jugador,$rol,$equipo) {
        $this->jugador = $jugador;
        $this->rol=$rol;
        $this->equipo=$equipo;
    }

    public function iniciar() {
        $urlsolicitud = "http://".$this->host."/inicio?Jugador=".$this->jugador."&Rol=".$this->rol."&Equipo=".$this->equipo;
        echo $urlsolicitud;
        $handle = fopen($urlsolicitud, 'r');
        $json = fgets($handle);
        $solicitud = json_decode($json);
        print_r($solicitud);

        $this->tokenSolicitud = $solicitud[0];
//	$this->tokenSolicitud = $this->jugador.$this->equipo;
	echo 'tokenSolicitud: ';
	echo $this->tokenSolicitud;
	echo '      ';
        //$parametros = explode(',', $solicitud->parametrosEntrada);
        return $solicitud ;
    }

    public function mover($posicion) {
	echo $this->tokenSolicitud;
//	 print_r($this->tokenSolicitud);
        $urlrespuesta = "http://".$this->host."/mover?token=" . $this->tokenSolicitud . "&num=$posicion";
        echo $urlrespuesta;
        $handle = fopen($urlrespuesta, 'r');
        $json = fgets($handle);
        $respuesta = json_decode($json);
        return $respuesta;
    }
	
	public function atacar(){
	$urlrespuesta = "http://".$this->host."/atacar?token=" . $this->tokenSolicitud;
        echo $urlrespuesta;
	$handle = fopen($urlrespuesta, 'r');
	$json = fgets($handle);
        $respuesta = json_decode($json);
        return $respuesta;
	}
}

