<?php
include('../database.php');

if (isset($_POST['nom'], $_POST['prenom'], $_POST['email'], $_POST['mot_de_passe'])) {
    $nom = strip_tags(trim($_POST['nom']));
    $prenom = strip_tags(trim($_POST['prenom']));
    $email = strip_tags(trim($_POST['email']));
    $mot_de_passe = password_hash($_POST['mot_de_passe'], PASSWORD_DEFAULT);
    $role = strip_tags(trim($_POST['role'] ?? 'user'));
    $origine = $_POST['origine'] ?? 'user';

    // Vérifie si l'email existe déjà
    $check = $pdo->prepare('SELECT id FROM users WHERE email = ?');
    $check->execute([$email]);

    if ($check->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Email déjà utilisé']);
        exit();
    }

    if (!is_dir('../profil/')) {
        mkdir('../profil/', 0777, true);
    }

    if (!empty($_FILES['image']['tmp_name'])) {
        $nomTemporaire = $_FILES['image']['tmp_name'];
        $nomFichier = uniqid() . '_' . basename($_FILES['image']['name']);
        $cheminDestination = '../profil/' . $nomFichier;
        $cheminBDD = 'profil/' . $nomFichier;

        if (!move_uploaded_file($nomTemporaire, $cheminDestination)) {
            echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'upload de la photo']);
            exit();
        }
    } else {
        $cheminBDD = 'profil/default.jpg';
    }

    try {
        $req = $pdo->prepare('INSERT INTO users(nom, prenom, email, mot_de_passe, photo, role) VALUES (:nom, :prenom, :email, :mot_de_passe, :photo, :role)');
        $stmt = $req->execute([
            'nom' => $nom,
            'prenom' => $prenom,
            'email' => $email,
            'mot_de_passe' => $mot_de_passe,
            'photo' => $cheminBDD,
            'role' => $role
        ]);

        if ($stmt) {
            $redirect = ($origine === 'admin') ? 'admin/utilisateur.php' : 'clients/loginU.php';
            echo json_encode(['success' => true, 'message' => 'Inscription réussie', 'redirect' => $redirect]);
        } else {
            echo json_encode(['success' => false, 'message' => "Erreur lors de l'inscription"]);
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => "Erreur : " . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Champs manquants']);
}