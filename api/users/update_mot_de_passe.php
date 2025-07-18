<?php
header('Content-Type: application/json');
include('../database.php');

// 1. L'utilisateur demande un lien de réinitialisation
if (isset($_POST['email'])) {
    $email = trim($_POST['email']);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['statut' => 'error', 'message' => 'Adresse email invalide.']);
        exit();
    }

    $req = $pdo->prepare('SELECT id FROM users WHERE email = :email');
    $req->execute(['email' => $email]);
    $user = $req->fetch();

    if ($user) {
        $token = bin2hex(random_bytes(32));
        $expire = date('Y-m-d H:i:s', strtotime('+1 hour'));

        $update = $pdo->prepare('UPDATE users SET reset_token = :token, reset_token_expire = :expire WHERE id = :id');
        $update->execute([
            'token' => $token,
            'expire' => $expire,
            'id' => $user['id']
        ]);

        $prenom = $user['prenom'] ?? 'utilisateur';;
        $reset_link = 'https://' . $_SERVER['HTTP_HOST'] . '/vues/clients/mot_de_passe_oublie.php?token=' . $token . '&email=' . urlencode($email);

        $template = "
<html>
<head>
  <meta charset='UTF-8'>
  <title>Réinitialisation de mot de passe</title>
</head>
<body>
  <h2>Bonjour <span style='color:#4f8cff;'>$prenom</span>,</h2>
  <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
  <p>Cliquez sur le lien ci-dessous pour définir un nouveau mot de passe :</p>
  <p><a href='$reset_link' style='padding:10px 20px;background-color:#4f8cff;color:white;text-decoration:none;border-radius:5px;'>Réinitialiser mon mot de passe</a></p>
  <p>Si vous n'avez pas fait cette demande, ignorez simplement cet e-mail.</p>
  <p>Merci,<br>L’équipe <strong>SocialConnect</strong></p>
</body>
</html>
";

        $headers = "From: no-reply@socialconnect.com\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        mail($email, "Réinitialisation de mot de passe", $template, $headers);

        echo json_encode([
            'statut' => 'success',
            'message' => 'Un lien de réinitialisation a été envoyé à votre adresse email.',
            'reset_link' => $reset_link
        ]);
    } else {
        echo json_encode(['statut' => 'error', 'message' => 'Aucun utilisateur trouvé avec cet email.']);
    }
    exit();
}

// 2. L'utilisateur soumet un nouveau mot de passe
if (isset($_POST['token'], $_POST['email'], $_POST['nouveau_mot_de_passe'])) {
    $token = $_POST['token'];
    $email = $_POST['email'];
    $nouveau = $_POST['nouveau_mot_de_passe'];

    if (strlen($nouveau) < 8 || !preg_match('/[A-Z]/', $nouveau) || !preg_match('/[0-9]/', $nouveau)) {
        echo json_encode(['statut' => 'error', 'message' => 'Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre.']);
        exit();
    }

    $req = $pdo->prepare('SELECT id,prenom ,reset_token_expire FROM users WHERE email = :email AND reset_token = :token');
    $req->execute(['email' => $email, 'token' => $token]);
    $user = $req->fetch();

    if ($user && strtotime($user['reset_token_expire']) > time()) {
        $hash = password_hash($nouveau, PASSWORD_DEFAULT);
        $update = $pdo->prepare('UPDATE users SET mot_de_passe = :mdp, reset_token = NULL, reset_token_expire = NULL WHERE id = :id');
        $ok = $update->execute(['mdp' => $hash, 'id' => $user['id']]);
        echo json_encode([
            'statut' => $ok ? 'success' : 'error',
            'message' => $ok ? 'Mot de passe réinitialisé avec succès.' : 'Erreur lors de la réinitialisation.'
        ]);
    } else {
        echo json_encode(['statut' => 'error', 'message' => 'Lien invalide ou expiré.']);
    }
    exit();
}

// Aucune requête valide
echo json_encode(['statut' => 'error', 'message' => 'Requête invalide.']);
