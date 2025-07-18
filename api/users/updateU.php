<?php
header("Content-Type: application/json");
require_once('../database.php');

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
    $id = strip_tags($_GET['id']);
    $stmt = $pdo->prepare("SELECT * FROM users WHERE id = :id");
    $stmt->execute(['id' => $id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode(['statut' => 'success', 'user' => $user]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_POST['id'], $_POST['nom'], $_POST['prenom'], $_POST['email'], $_POST['role'])) {
        echo json_encode(['statut' => 'error', 'message' => 'Champs obligatoires manquants']);
        exit();
    }

    $id = strip_tags($_POST['id']);
    $nom = strip_tags($_POST['nom']);
    $prenom = strip_tags($_POST['prenom']);
    $email = strip_tags($_POST['email']);
    $role = $_POST['role'];

    if (!in_array($role, ['admin', 'moderator'])) {
        echo json_encode(['statut' => 'error', 'message' => 'Accès refusé']);
        exit();
    }

    // Ancienne photo
    $stmtOld = $pdo->prepare("SELECT photo FROM users WHERE id = ?");
    $stmtOld->execute([$id]);
    $old = $stmtOld->fetch();
    $anciennePhoto = $old['photo'] ?? '';

    $cheminBDD = $anciennePhoto;

    if (isset($_FILES['photo']) && $_FILES['photo']['error'] === 0) {
        $allowed_types = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!in_array($_FILES['photo']['type'], $allowed_types)) {
            echo json_encode(['statut' => 'error', 'message' => 'Type image invalide']);
            exit();
        }

        if (!is_dir('../profil')) mkdir('../profil', 0777, true);

        $ext = pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION);
        $filename = uniqid('profil_', true) . '.' . $ext;
        $cheminDestination = '../profil/' . $filename;

        if (move_uploaded_file($_FILES['photo']['tmp_name'], $cheminDestination)) {
            $cheminBDD = 'profil/' . $filename;
            // Optionnel : unlink($anciennePhoto); si on veut supprimer l’ancienne image
        }
    }

    try {
        $stmt = $pdo->prepare("UPDATE users SET nom = :nom, prenom = :prenom, email = :email, photo = :photo WHERE id = :id");
        $stmt->execute([
            'id' => $id,
            'nom' => $nom,
            'prenom' => $prenom,
            'email' => $email,
            'photo' => $cheminBDD
        ]);
        echo json_encode(['statut' => 'success', 'message' => 'Utilisateur modifié']);
    } catch (PDOException $e) {
        echo json_encode(['statut' => 'error', 'message' => $e->getMessage()]);
    }
}
