<?php
header("Content-Type: application/json");
require_once('../database.php');

$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : null;
if (!$user_id) {
    echo json_encode(['statut' => 'error', 'message' => 'Utilisateur non authentifié']);
    exit();
}

try {
    $stmt = $pdo->prepare("SELECT DISTINCT users.id, users.nom, users.prenom, users.photo,N 
                            FROM users  
                            JOIN messages ON (
                                (messages.sender_id = :user_id AND messages.receiver_id = users.id) OR
                                (messages.receiver_id = :user_id AND messages.sender_id = users.id)
                            )
                            WHERE users.id != :user_id
                        ");
    $stmt->execute(['user_id' => $user_id]);

    echo json_encode([
        'statut' => 'success',
        'conversations' => $stmt->fetchAll(PDO::FETCH_ASSOC)
    ]);
} catch (PDOException $e) {
    echo json_encode(['statut' => 'error', 'message' => 'Erreur lors de la récupération des conversations : ' . $e->getMessage()]);
}
