<?php
header("Content-Type: application/json");
include('../../database.php');

// Lecture des données JSON envoyées par le client
$data = json_decode(file_get_contents("php://input"), true);

$comment_id = isset($_GET["id"]) ? intval($_GET["id"]) : null;
$currentUser = isset($data["user_id"]) ? intval($data["user_id"]) : null;

if (!$comment_id || !$currentUser) {
    echo json_encode(['statut' => 'error', 'message' => 'Données manquantes']);
    exit();
}

try {
    // Vérifie que l'utilisateur est bien l'auteur du commentaire
    $stmt = $pdo->prepare("SELECT * FROM commentaires WHERE id = :id AND user_id = :user_id");
    $stmt->execute(['id' => $comment_id, 'user_id' => $currentUser]);

    if ($stmt->rowCount() === 0) {
        echo json_encode(['statut' => 'error', 'message' => 'Action non autorisée']);
        exit();
    }

    // Supprime le commentaire
    $req = $pdo->prepare("DELETE FROM commentaires WHERE id = :id");
    $req->execute(['id' => $comment_id]);

    echo json_encode(['statut' => 'success', 'message' => 'Commentaire supprimé']);
} catch (PDOException $e) {
    echo json_encode(['statut' => 'error', 'message' => "Erreur : " . $e->getMessage()]);
}
