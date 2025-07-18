<?php
header("Access-Control-Allow-Origin:*");
header("Content-Type: application/json");
include("../database.php");

$data = json_decode(file_get_contents('php://input'), true);

// Rôle par défaut : 'user'
$role = $data['role'] ?? 'user';

// Refus si rôle non autorisé (si nécessaire)
if (!in_array($role, ['user', 'admin', 'moderator'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Accès refusé'
    ]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';

    if (!empty($email) && !empty($password)) {
        try {
            $req = $pdo->prepare("SELECT * FROM users WHERE email = :email and role = :role");
            $req->execute(['email' => $email,'role' => $role]);
            $user = $req->fetch(PDO::FETCH_ASSOC);

            if (!$user) {
                echo json_encode(['success' => false, 'message' => 'Utilisateur non trouvé']);
                exit();
            }

            if (password_verify($password, $user['mot_de_passe'])) {
                echo json_encode([
                    'success' => true,
                    'user' => [
                        'id' => $user['id'],
                        'nom' => $user['nom'],
                        'prenom' => $user['prenom'],
                        'email' => $user['email'],
                        'photo' => $user['photo'],
                        'role' => $user['role']
                    ]
                ]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Mot de passe incorrect']);
            }
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Erreur BDD : ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Champs manquants']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
}