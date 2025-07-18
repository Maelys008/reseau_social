<?php
header("Content-Type: application/json");
require_once('../database.php');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['statut' => 'error', 'message' => 'Méthode non autorisée']);
    exit();
}

$user_id = isset($_POST['user_id']) ? intval($_POST['user_id']) : null;
if (!$user_id) {
    echo json_encode(['statut' => 'error', 'message' => 'Non authentifié']);
    exit();
}

if (empty($_POST['description']) || empty($_FILES['image']) || $_FILES['image']['error'] !== 0) {
    echo json_encode(['statut' => 'error', 'message' => 'Tous les champs sont obligatoires']);
    exit();
}

$description = strip_tags($_POST['description']);

// Validation image (types autorisés)
$allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
if (!in_array($_FILES['image']['type'], $allowed_types)) {
    echo json_encode(['statut' => 'error', 'message' => 'Type d\'image non autorisé']);
    exit();
}

if (!is_dir('articles')) {
    mkdir('articles', 0777, true);
}

// Générer un nom unique sécurisé pour éviter collisions
$ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
$filename = uniqid('img_', true) . '.' . $ext;
$destination = 'articles/' . $filename;

if (!move_uploaded_file($_FILES['image']['tmp_name'], $destination)) {
    echo json_encode(['statut' => 'error', 'message' => 'Erreur lors de l\'envoi de l\'image']);
    exit();
}

$stmt = $pdo->prepare("INSERT INTO articles(description, image, user_id) VALUES (:description, :image, :user_id)");
$success = $stmt->execute([
    'description' => $description,
    'image' => $destination,
    'user_id' => $user_id
]);

echo json_encode([
    'statut' => $success ? 'success' : 'error',
    'message' => $success ? 'Article créé' : 'Erreur lors de l\'enregistrement'
]);
