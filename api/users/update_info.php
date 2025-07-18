<?php
header("Content-Type: application/json");
include('../database.php');

// Récupération de l'ID depuis le client
$user_id = $_POST['user_id'] ?? null;

if (!$user_id) {
    echo json_encode([
        'statut' => 'error',
        'message' => 'Non authentifié'
    ]);
    exit();
}

if (isset($_POST['nom']) && isset($_POST['prenom']) && isset($_POST['email'])) {
    $nom = strip_tags(trim($_POST['nom']));
    $prenom = strip_tags(trim($_POST['prenom']));
    $email = strip_tags(trim($_POST['email']));

    // Récupération de l'ancienne photo
    $stmt = $pdo->prepare("SELECT photo FROM users WHERE id = :id");
    $stmt->execute(['id' => $user_id]);
    $row = $stmt->fetch();
    $anciennePhoto = $row ? $row['photo'] : null;

    $cheminBDD = $anciennePhoto;

    if (isset($_FILES['photo']) && $_FILES['photo']['error'] == 0 && $_FILES['photo']['size'] > 0) {
        if (!is_dir('../profil/')) {
            mkdir('../profil/', 0777, true);
        }
        $nomTemporaire = $_FILES['photo']['tmp_name'];
        $nomFichier = uniqid() . '_' . basename($_FILES['photo']['name']);
        $cheminDestination = '../profil/' . $nomFichier;
        $cheminBDD = 'profil/' . $nomFichier;

        if (!move_uploaded_file($nomTemporaire, $cheminDestination)) {
            $cheminBDD = $anciennePhoto;
        }
    }

    try {
        $req = $pdo->prepare('UPDATE users SET nom = :nom, prenom = :prenom, email = :email, photo = :photo WHERE id = :id');
        $stmt = $req->execute([
            'id' => $user_id,
            'nom' => $nom,
            'prenom' => $prenom,
            'email' => $email,
            'photo' => $cheminBDD
        ]);
        echo json_encode([
            'statut' => $stmt ? 'success' : 'error',
            'message' => $stmt ? 'Informations modifiées' : 'Erreur lors de la modification'
        ]);
    } catch (PDOException $e) {
        echo json_encode([
            'statut' => 'error',
            'message' => $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        'statut' => 'error',
        'message' => 'Champs manquants'
    ]);
}
