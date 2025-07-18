<?php
header("Content-Type: application/json");
require_once('../database.php');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit();
}

$user_id = isset($_POST['user_id']) ? intval($_POST['user_id']) : null;
$user_role = $_POST['user_role'] ?? null;
$article_id = isset($_POST['article_id']) ? intval($_POST['article_id']) : null;

if (!$user_id || !$article_id) {
    echo json_encode(['success' => false, 'message' => 'Non authentifié ou ID manquant']);
    exit();
}

$stmt = $pdo->prepare('SELECT user_id, image FROM articles WHERE id = ?');
$stmt->execute([$article_id]);
$article = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$article) {
    echo json_encode(['success' => false, 'message' => 'Article introuvable']);
    exit();
}

if (in_array($user_role, ['admin', 'moderator']) || $article['user_id'] == $user_id) {
    $del = $pdo->prepare('DELETE FROM articles WHERE id = ?');
    $ok = $del->execute([$article_id]);
    if ($ok) {
        // Supprimer l'image physique aussi
        if (file_exists($article['image'])) {
            unlink($article['image']);
        }
    }
    echo json_encode(['success' => $ok, 'message' => $ok ? 'Article supprimé' : 'Erreur lors de la suppression']);
} else {
    echo json_encode(['success' => false, 'message' => 'Action non autorisée']);
}
