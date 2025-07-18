<?php
header("Content-Type: application/json");
include('../database.php');

$input = json_decode(file_get_contents("php://input"), true);
$action = $input['action'] ?? '';
$currentUser = intval($input['currentUser'] ?? 0);
$targetUser = intval($input['targetUser'] ?? 0);

if (!$action || !$currentUser || !$targetUser) {
    echo json_encode(['statut' => 'error', 'message' => 'Données manquantes.']);
    exit();
}

try {
    if ($action === 'ajouter') {
        // Étape 1 : Vérifier s'il existe déjà une relation dans les deux sens
        $check_stmt = $pdo->prepare("SELECT sender_id, receiver_id, status FROM amis WHERE 
                                      (sender_id = :current AND receiver_id = :target) OR 
                                      (sender_id = :target AND receiver_id = :current)");
        $check_stmt->execute([':current' => $currentUser, ':target' => $targetUser]);
        $existing_relation = $check_stmt->fetch(PDO::FETCH_ASSOC);

        if ($existing_relation) {
            // Cas 1 : La relation existe déjà
            if ($existing_relation['status'] === 'en attente') {
                // Vérifier s'il s'agit d'une demande en attente du targetUser vers le currentUser
                // (ce qui signifie que le currentUser peut accepter)
                if ($existing_relation['sender_id'] === $targetUser && $existing_relation['receiver_id'] === $currentUser) {
                    echo json_encode(['statut' => 'info', 'message' => 'Cette personne vous a déjà envoyé une demande.']);
                    // Vous pourriez vouloir renvoyer un type d'action ici pour inviter le client à appeler 'accepter'
                } else {
                    echo json_encode(['statut' => 'error', 'message' => 'Vous avez déjà envoyé une demande à cet utilisateur.']);
                }
            } elseif ($existing_relation['status'] === 'accepte') {
                echo json_encode(['statut' => 'error', 'message' => 'Vous êtes déjà amis avec cet utilisateur.']);
            }
            exit(); // Quitter après avoir géré les relations existantes
        }

        // Cas 2 : Aucune relation existante, procéder à l'insertion d'une nouvelle demande en attente
        $insert_stmt = $pdo->prepare("INSERT INTO amis (sender_id, receiver_id, `status`) VALUES (?, ?, 'en attente')");
        $insert_stmt->execute([$currentUser, $targetUser]);
        echo json_encode(['statut' => 'success', 'message' => 'Demande d\'ami envoyée !']);

    } elseif ($action === 'accepter') {
        // S'assurer que la demande existe et est 'en attente' avant d'accepter
        $stmt = $pdo->prepare("UPDATE amis SET `status` = 'accepte' WHERE sender_id = ? AND receiver_id = ? AND `status` = 'en attente'");
        $stmt->execute([$targetUser, $currentUser]);
        if ($stmt->rowCount() > 0) {
            echo json_encode(['statut' => 'success', 'message' => 'Demande acceptée !']);
        } else {
            echo json_encode(['statut' => 'error', 'message' => 'Demande non trouvée ou déjà traitée.']);
        }

    } elseif ($action === 'refuser') {
        // S'assurer de supprimer la bonne demande en attente
        $stmt = $pdo->prepare("DELETE FROM amis WHERE sender_id = ? AND receiver_id = ? AND `status` = 'en attente'");
        $stmt->execute([$targetUser, $currentUser]);
        if ($stmt->rowCount() > 0) {
            echo json_encode(['statut' => 'success', 'message' => 'Demande refusée.']);
        } else {
            echo json_encode(['statut' => 'error', 'message' => 'Demande non trouvée ou déjà traitée.']);
        }

    } elseif ($action === 'supprimer') {
        // Supprimer la relation dans les deux sens si le statut est 'accepte'
        $stmt = $pdo->prepare("DELETE FROM amis WHERE 
            (sender_id = :currentUser AND receiver_id = :targetUser AND `status` = 'accepte') OR 
            (sender_id = :targetUser AND receiver_id = :currentUser AND `status` = 'accepte')");
        $stmt->execute([
            'currentUser' => $currentUser,
            'targetUser' => $targetUser
        ]);
        if ($stmt->rowCount() > 0) {
            echo json_encode(['statut' => 'success', 'message' => 'Ami supprimé.']);
        } else {
            echo json_encode(['statut' => 'error', 'message' => 'Relation d\'ami non trouvée ou déjà supprimée.']);
        }
    } else {
        echo json_encode(['statut' => 'error', 'message' => 'Action invalide.']);
    }
} catch (PDOException $e) {
    // Ne capturer la violation de contrainte unique que pour un message plus précis
    if ($e->getCode() === '23000') { // SQLSTATE pour Violation de Contrainte d'Intégrité
        echo json_encode(['statut' => 'error', 'message' => 'Erreur de base de données : Cette relation d\'amitié existe déjà. Code: ' . $e->getCode()]);
    } else {
        echo json_encode(['statut' => 'error', 'message' => 'Erreur : ' . $e->getMessage()]);
    }
}