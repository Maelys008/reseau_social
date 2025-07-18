<?php
header("Content-Type: application/json");
require_once('../database.php');


$id = $_GET['id'] ?? null; 


if ($id === null || !is_numeric($id)) {
    echo json_encode(['success' => false, 'message' => 'ID utilisateur manquant ou invalide.']);
    exit(); 
}

try {
    
    $stmt = $pdo->prepare("DELETE FROM users WHERE id = :id");
    $stmt->execute(['id' => $id]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Utilisateur supprimé avec succès.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Aucun utilisateur trouvé avec cet ID ou déjà supprimé.']);
    }

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erreur BDD : ' . $e->getMessage()]);
}

