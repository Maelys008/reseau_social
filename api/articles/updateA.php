<?php
header("Content-Type: application/json");
require_once('../database.php');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['statut' => 'error', 'message' => 'Méthode non autorisée']);
    exit();
}

$user_id = isset($_POST['user_id']) ? intval($_POST['user_id']) : null;
$article_id = isset($_POST['article_id']) ? intval($_POST['article_id']) : null;
$description = $_POST['description'] ?? null;

if (!$user_id || !$article_id || !$description) {
    echo json_encode(['statut' => 'error', 'message' => 'Paramètres manquants']);
    exit();
}

$stmt = $pdo->prepare("SELECT * FROM articles WHERE id = :id");
$stmt->execute(['id' => $article_id]);
$article = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$article) {
    echo json_encode(['statut' => 'error', 'message' => 'Article introuvable']);
    exit();
}

$imagePath = $article['image'];

// Si nouvelle image uploadée, validation et remplacement
if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
    $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
    if (!in_array($_FILES['image']['type'], $allowed_types)) {
        echo json_encode(['statut' => 'error', 'message' => 'Type d\'image non autorisé']);
        exit();
    }

    if (!is_dir('articles')) {
        mkdir('articles', 0777, true);
    }

    $ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
    $filename = uniqid('img_', true) . '.' . $ext;
    $destination = 'articles/' . $filename;

    if (!move_uploaded_file($_FILES['image']['tmp_name'], $destination)) {
        echo json_encode(['statut' => 'error', 'message' => 'Erreur lors de l\'upload de l\'image']);
        exit();
    }

    // Supprimer ancienne image
    if (file_exists($imagePath)) {
        unlink($imagePath);
    }

    $imagePath = $destination;
}

$update = $pdo->prepare("UPDATE articles SET description = :description, image = :image WHERE id = :id AND user_id = :user_id");
$success = $update->execute([
    'description' => strip_tags($description),
    'image' => $imagePath,
    'id' => $article_id,
    'user_id' => $user_id
]);

echo json_encode([
    'statut' => $success ? 'success' : 'error',
    'message' => $success ? 'Article modifié' : 'Erreur lors de la modification'
]);
