<?php
header("Content-Type: application/json");
include('../database.php');

$input = json_decode(file_get_contents("php://input"), true);
$currentUser = intval($input['currentUser'] ?? 0);

try {
    $stmt = $pdo->prepare("SELECT u.id, u.nom, u.prenom, u.photo
                           FROM amis a
                           JOIN users u ON (u.id = a.sender_id AND a.receiver_id = :id AND a.status = 'accepte')
                            OR (u.id = a.receiver_id AND a.sender_id = :id AND a.status = 'accepte')");
    $stmt->execute(['id' => $currentUser]);
    $amis = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'statut' => 'success',
        'amis' => $amis
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'statut' => 'error',
        'message' => "Erreur lors de l'affichage des amis : " . $e->getMessage()
    ]);
}