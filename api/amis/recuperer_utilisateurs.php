<?php  
header("Access-Control-Allow-Origin:*");
header("Content-Type: application/json");
include('../database.php');

$input = json_decode(file_get_contents("php://input"), true);
$currentUser = intval($input['currentUser'] ?? 0);

try {
    $stmt = $pdo->prepare("SELECT id, nom, prenom, photo FROM users WHERE id != ?");
    $stmt->execute([$currentUser]);
    $utilisateurs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode([
        'statut' => 'success',
        'utilisateurs' => $utilisateurs
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'statut' => 'error',
        'message' => 'Erreur lors de la récupération des utilisateurs : ' . $e->getMessage()
    ]);
}