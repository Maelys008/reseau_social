<?php
header("Content-Type: application/json");
require_once('../database.php');

$role = $_POST['role'] ?? '';
if (!in_array($role, ['admin', 'moderator'])) {
    echo json_encode(['statut' => 'error', 'message' => 'Accès refusé']);
    exit();
}

if (!isset($_POST['nom'], $_POST['prenom'], $_POST['email'], $_POST['mot_de_passe'])) {
    echo json_encode(['statut' => 'error', 'message' => 'Champs manquants']);
    exit();
}
try {
    
$nom = strip_tags($_POST['nom']);
$prenom = strip_tags($_POST['prenom']);
$email = strip_tags($_POST['email']);
$mot_de_passe = password_hash($_POST['mot_de_passe'], PASSWORD_DEFAULT);

// Vérification image
if (isset($_FILES['photo'])) {
   $allowed_types = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!in_array($_FILES['photo']['type'], $allowed_types)) {
        echo json_encode(['statut' => 'error', 'message' => 'Type d\'image non autorisé']);
        exit();
    } 



    if (!is_dir('../profil')) mkdir('../profil', 0777, true);
    $ext = pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION);
    $filename = uniqid('profil_', true) . '.' . $ext;
    $path = '../profil/' . $filename;
    $pathBDD = 'profil/' . $filename;

    if (!move_uploaded_file($_FILES['photo']['tmp_name'], $path)) {
        echo json_encode(['statut' => 'error', 'message' => 'Erreur upload photo']);
        exit();
    }

        // Insertion de la photo dans la base de données
    $stmt = $pdo->prepare("INSERT INTO users(nom, prenom, email, mot_de_passe, photo) VALUES (:nom, :prenom, :email, :mot_de_passe, :photo)");
    $stmt->execute([
        'nom' => $nom,
        'prenom' => $prenom,
        'email' => $email,
        'mot_de_passe' => $mot_de_passe,
        'photo' => $pathBDD
    ]);
} else {
    // Insertion sans photo dans la base de données
    $stmt = $pdo->prepare("INSERT INTO users(nom, prenom, email, mot_de_passe) VALUES (:nom, :prenom, :email, :mot_de_passe)");
    $stmt->execute([
        'nom' => $nom,
        'prenom' => $prenom,
        'email' => $email,
        'mot_de_passe' => $mot_de_passe
    ]);
}
    echo json_encode(['statut' => 'success', 'message' => 'Utilisateur ajouté']);
} catch (PDOException $e) {
    echo json_encode(['statut' => 'error', 'message' => 'Erreur BDD : ' . $e->getMessage()]);
}
