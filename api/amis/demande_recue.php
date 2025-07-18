<?php  
header("Content-Type: application/json");
include('../database.php');

$input = json_decode(file_get_contents("php://input"), true);
$currentUser = intval($input['currentUser'] ?? 0);

try {
    $stmt = $pdo->prepare("SELECT amis.id, users.nom, users.prenom, users.photo
                           FROM amis
                           JOIN users ON users.id = amis.sender_id
                           WHERE amis.receiver_id = ? AND amis.status = 'en attente'");
    $stmt->execute([$currentUser]);
    $demandes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode([
        'statut' => 'success',
        'demandes' => $demandes
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'statut' => 'error',
        'message' => 'Erreur lors de la récupération des demandes : ' . $e->getMessage()
    ]);
}