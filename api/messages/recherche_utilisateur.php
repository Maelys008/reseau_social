<?php
header("Content-Type: application/json");
require_once('../../database.php');

$me = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;
$motcle = trim($_GET['q'] ?? '');

if ($me === 0) {
    echo json_encode(['statut' => 'error', 'message' => 'Utilisateur non authentifié (user_id manquant)']);
    exit();
}

if ($motcle === '') {
    echo json_encode(['statut' => 'error', 'message' => 'Mot-clé vide']);
    exit();
}

try {
    
    $stmt = $pdo->prepare(" SELECT id, nom, prenom, photo
                            FROM users
                            WHERE (nom LIKE :motcle OR prenom LIKE :motcle) AND id != :me
                            LIMIT 10
                        ");
    $stmt->execute([':motcle' => '%' . $motcle . '%', ':me' => $me]);

    echo json_encode(['statut' => 'success', 'utilisateurs' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
} catch (PDOException $e) {
    echo json_encode(['statut' => 'error', 'message' => 'Erreur lors de la recherche : ' . $e->getMessage()]);
}
