<?php
header("Content-Type: application/json");
include('../../database.php');

// On attend les données en POST (user_id, article_id, contenu)
$user_id = isset($_POST['user_id']) ? intval($_POST['user_id']) : null;
$article_id = isset($_POST['article_id']) ? intval($_POST['article_id']) : null;
$contenu = isset($_POST['contenu']) ? strip_tags(trim($_POST['contenu'])) : null;

// Vérification des données requises
if (!$user_id || !$article_id || !$contenu) {
    echo json_encode([
        'statut' => 'error',
        'message' => 'Champs manquants'
    ]);
    exit();
}

try {
    // Prépare et exécute l'insertion
    $stmt = $pdo->prepare("INSERT INTO commentaires (article_id, user_id, contenu) VALUES (:article_id, :user_id, :contenu)");
    $stmt->execute([
        'article_id' => $article_id,
        'user_id' => $user_id,
        'contenu' => $contenu
    ]);

    echo json_encode([
        'statut' => 'success',
        'message' => 'Commentaire ajouté'
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'statut' => 'error',
        'message' => "Erreur lors de l'ajout du commentaire"
    ]);
}
?>
