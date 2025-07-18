<?php
header("Content-Type: application/json");
require_once('../database.php');

$me = isset($_GET['user_id']) ? intval($_GET['user_id']) : null;
$autre = isset($_GET['utilisateur_id']) ? intval($_GET['utilisateur_id']) : null;

if (!$me || !$autre) {
    echo json_encode(['statut' => 'error', 'message' => 'Paramètres manquants']);
    exit();
}

try {
    
    $stmt = $pdo->prepare(" SELECT * FROM messages
                            WHERE (sender_id = :me AND receiver_id = :autre) OR (sender_id = :autre AND receiver_id = :me)
                            ORDER BY created_at ASC
                        ");
    $stmt->execute(['me' => $me, 'autre' => $autre]);

    echo json_encode(['statut' => 'success', 'messages' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
} catch (PDOException $e) {
    echo json_encode(['statut' => 'error', 'message' => 'Erreur lors de la récupération des messages : ' . $e->getMessage()]);
}
