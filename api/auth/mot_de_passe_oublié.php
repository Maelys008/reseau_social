<?php
// Assurez-vous que l'affichage des erreurs est activé pour le débogage (à désactiver en production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json'); // Indique que la réponse sera du JSON

require_once('../database.php'); // Assurez-vous que ce chemin est correct

$response = ['success' => false, 'message' => ''];

// Récupérer les données JSON envoyées par le client
$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? '';

if (empty($email)) {
    $response['message'] = 'Email manquant.';
    echo json_encode($response);
    exit();
}

try {
    // Vérifier si l'email existe dans la base de données
    $stmt = $pdo->prepare("SELECT id, prenom FROM users WHERE email = :email");
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        // --- LOGIQUE DE RÉINITIALISATION DU MOT DE PASSE ---
        // 1. Générer un jeton unique et sécurisé
        $token = bin2hex(random_bytes(32)); // Génère un jeton de 64 caractères hexadécimaux
        $expires_at = date('Y-m-d H:i:s', strtotime('+1 hour')); // Jeton valide pour 1 heure

        // 2. Stocker le jeton en base de données (vous aurez besoin d'une table 'password_resets' par exemple)
        // Exemple de table: CREATE TABLE password_resets (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, token VARCHAR(255), expires_at DATETIME);
        $stmt_insert_token = $pdo->prepare("INSERT INTO password_resets (user_id, token, expires_at) VALUES (:user_id, :token, :expires_at)");
        $stmt_insert_token->execute([
            'user_id' => $user['id'],
            'token' => $token,
            'expires_at' => $expires_at
        ]);

        // 3. Envoyer un email à l'utilisateur (SIMULATION ICI)
        // Dans une application réelle, vous utiliseriez une bibliothèque comme PHPMailer
        // ou une fonction mail() configurée sur votre serveur.
        $reset_link = "http://localhost/N/index.php?page=reset_password&token=" . $token . "&email=" . urlencode($email);
        
        // Pour le débogage, vous pouvez logguer le lien ou l'afficher temporairement
        error_log("Lien de réinitialisation pour " . $email . ": " . $reset_link);
        // echo "DEBUG: Lien de réinitialisation (pour test): <a href='{$reset_link}'>{$reset_link}</a><br>"; // À retirer en production

        $response['success'] = true;
        $response['message'] = "Un lien de réinitialisation a été envoyé à votre adresse email (vérifiez les logs ou la console pour le lien de simulation).";
    } else {
        // Ne pas révéler si l'email existe ou non pour des raisons de sécurité
        $response['success'] = false; // Ou true, pour ne pas donner d'indices sur les emails existants
        $response['message'] = "Si l'email existe, un lien de réinitialisation a été envoyé.";
    }

} catch (PDOException $e) {
    $response['message'] = 'Erreur de base de données: ' . $e->getMessage();
    // Loggez l'erreur détaillée pour le débogage, mais ne l'affichez pas directement à l'utilisateur final
    error_log('PDOException in mot_de_passe_oublie.php: ' . $e->getMessage());
} catch (Exception $e) {
    $response['message'] = 'Une erreur inattendue est survenue: ' . $e->getMessage();
    error_log('Exception in mot_de_passe_oublie.php: ' . $e->getMessage());
}

echo json_encode($response); // Renvoie la réponse JSON
exit(); // Termine le script
?>
