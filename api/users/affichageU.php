<?php
header("Content-Type: application/json");
require_once('../database.php');



try {
    $stmt = $pdo->query("SELECT * FROM users");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['statut' => 'success', 'users' => $users]);
} catch (PDOException $e) {
    echo json_encode(['statut' => 'error', 'message' => 'Erreur BDD : ' . $e->getMessage()]);
}
