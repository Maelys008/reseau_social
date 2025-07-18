<?php
header("Content-Type: application/json");
require_once('../database.php');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['statut' => 'error', 'message' => 'Méthode non autorisée']);
    exit();
}

$user_id = isset($_POST['user_id']) ? intval($_POST['user_id']) : null;
$destinataire = isset($_POST['receiver_id']) ? intval($_POST['receiver_id']) : null;
$texte = $_POST['message'] ?? '';

if (!$user_id || !$destinataire || trim($texte) === '') {
    echo json_encode(['statut' => 'error', 'message' => 'Paramètres manquants ou invalides']);
    exit();
}

$image = '';
// Upload image facultatif
if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
    $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
    if (!in_array($_FILES['image']['type'], $allowed_types)) {
        echo json_encode(['statut' => 'error', 'message' => 'Type d\'image non autorisé']);
        exit();
    }

    if (!is_dir('../../uploads')) {
        mkdir('../../uploads', 0777, true);
    }

    $ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
    $filename = uniqid('msg_', true) . '.' . $ext;
    $destination = '../../uploads/' . $filename;

    if (!move_uploaded_file($_FILES['image']['tmp_name'], $destination)) {
        echo json_encode(['statut' => 'error', 'message' => 'Erreur lors de l\'upload de l\'image']);
        exit();
    }

    $image = 'uploads/' . $filename;
}

try {
    $stmt = $pdo->prepare("INSERT INTO messages (sender_id, receiver_id, message, image) VALUES (:sender_id, :receiver_id, :message, :image)");
    $stmt->execute([
        'sender_id' => $user_id,
        'receiver_id' => $destinataire,
        'message' => $texte,
        'image' => $image
    ]);
    echo json_encode(['statut' => 'success', 'message' => 'Message envoyé avec succès.']);
} catch (PDOException $e) {
    echo json_encode(['statut' => 'error', 'message' => 'Erreur lors de l\'envoi du message : ' . $e->getMessage()]);
}
