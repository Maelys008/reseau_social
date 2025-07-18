<?php
header("Access-Control-Allow-Origin:*");
header("Content-Type: application/json");
try{
    $pdo = new PDO('mysql:host=localhost;dbname=reseau_social;charset=utf8','root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

}
catch (PDOException $e) {
    echo "Erreur de connexion : " . $e->getMessage();
}

?>