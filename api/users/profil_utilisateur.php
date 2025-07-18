<?php 
header("Content-Type: application/json");
include('../database.php');

// Vérifie que l'ID est fourni
if (!isset($_GET['id'])) {
    echo json_encode(['statut' => 'error', 'message' => 'ID manquant']);
    exit();
}

$userId = intval($_GET['id']);

try {
    $stmt = $pdo->prepare("SELECT id, nom, prenom, email, photo 
                           FROM users 
                           WHERE id = ?"); 
    $stmt->execute([$userId]); 
    $profil = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$profil) {
        echo json_encode(['statut' => 'error', 'message' => 'Utilisateur non trouvé']);
        exit();
    }

    $stmtarticles = $pdo->prepare("SELECT id, description, image, created_at 
                                   FROM articles 
                                   WHERE user_id = ? 
                                   ORDER BY created_at DESC 
                                   LIMIT 10");
    $stmtarticles->execute([$userId]);
    $articles = $stmtarticles->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'statut' => 'success',
        'profil' => $profil,
        'articles' => $articles
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'statut' => 'error',
        'message' => 'Erreur lors de la récupération : ' . $e->getMessage()
    ]);
}
