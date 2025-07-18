<?php
session_start();
include('../database.php');

header('Content-Type: application/json');

$user_id = $_POST['user_id'] ?? null;
$article_id = $_POST['article_id'] ?? null;
$type = $_POST['type'] ?? null;

if (!$user_id || !$article_id || !in_array($type, ['like', 'dislike'])) {
  echo json_encode(['statut' => 'error', 'message' => 'Paramètres manquants']);
  exit();
}

// Supprime la réaction précédente (si elle existe)
$pdo->prepare("DELETE FROM reactions WHERE article_id = :aid AND user_id = :uid")->execute([
  'aid' => $article_id,
  'uid' => $user_id
]);

// Réinsère si pas identique à l'ancienne
if ($_POST['action'] === 'set') {
  $stmt = $pdo->prepare("INSERT INTO reactions (article_id, user_id, type) VALUES (:aid, :uid, :type)");
  $stmt->execute(['aid' => $article_id, 'uid' => $user_id, 'type' => $type]);
}

echo json_encode(['statut' => 'success']);
