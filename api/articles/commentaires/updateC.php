<?php
header("Content-Type: application/json");
include('../../database.php');

// Récupération des données JSON envoyées
$data = json_decode(file_get_contents("php://input"), true);

$comment_id = isset($_GET['id']) ? intval($_GET['id']) : null;
$contenu = isset($data['contenu']) ? trim($data['contenu']) : null;
$currentUser = isset($data['user_id']) ? intval($data['user_id']) : null;

if (!$comment_id || !$contenu || !$currentUser) {
    echo json_encode(['statut' => 'error', 'message' => 'Données manquantes']);
    exit();
}

try {
    // Vérifie si l'utilisateur est bien l'auteur du commentaire
    $check = $pdo->prepare("SELECT * FROM commentaires WHERE id = ? AND user_id = ?");
    $check->execute([$comment_id, $currentUser]);

    if ($check->rowCount() === 0) {
        echo json_encode(['statut' => 'error', 'message' => 'Non autorisé']);
        exit();
    }

    // Met à jour le commentaire
    $stmt = $pdo->prepare("UPDATE commentaires SET contenu = :contenu WHERE id = :id");
    $stmt->execute(['contenu' => $contenu, 'id' => $comment_id]);

    echo json_encode(['statut' => 'success', 'message' => 'Commentaire modifié']);
} catch (PDOException $e) {
    echo json_encode(['statut' => 'error', 'message' => 'Erreur : ' . $e->getMessage()]);
}
