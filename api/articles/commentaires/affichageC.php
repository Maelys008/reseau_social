<?php
header("Content-Type: application/json");
include('../../database.php');

// Vérifie que l'article_id est bien fourni
$article_id = isset($_GET['article_id']) ? intval($_GET['article_id']) : null;

if (!$article_id) {
    echo json_encode([
        'statut' => 'error',
        'message' => "ID de l'article manquant ou invalide."
    ]);
    exit();
}

try {
    // Requête pour récupérer les commentaires et les infos utilisateur
    
    $stmt = $pdo->prepare(" SELECT commentaires.*, users.nom, users.prenom, users.photo 
                            FROM commentaires 
                            JOIN users ON users.id = commentaires.user_id 
                            WHERE article_id = :article_id 
                            ORDER BY commentaires.created_at ASC
                        ");
    $stmt->execute(['article_id' => $article_id]);

    $commentaires = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'statut' => 'success',
        'commentaires' => $commentaires
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'statut' => 'error',
        'message' => "Erreur lors de la récupération des commentaires : " . $e->getMessage()
    ]);
}
