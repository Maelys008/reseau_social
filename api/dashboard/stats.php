<?php

require_once '../database.php'; 

header('Content-Type: application/json');

// 📆 Date du début de la semaine
$startOfWeek = date('Y-m-d', strtotime('monday this week'));

try {
    // Préparation des requêtes une seule fois pour les totaux de la semaine
    $stmtUsersWeek = $pdo->prepare("SELECT COUNT(*) FROM users WHERE created_at >= ?");
    $stmtArticlesWeek = $pdo->prepare("SELECT COUNT(*) FROM articles WHERE created_at >= ?");
    $stmtCommentairesWeek = $pdo->prepare("SELECT COUNT(*) FROM commentaires WHERE created_at >= ?");

    // Exécution et récupération des résultats
    $stmtUsersWeek->execute([$startOfWeek]);
    $nbUsersSemaine = (int) $stmtUsersWeek->fetchColumn();

    $stmtArticlesWeek->execute([$startOfWeek]);
    $nbArticlesSemaine = (int) $stmtArticlesWeek->fetchColumn();

    $stmtCommentairesWeek->execute([$startOfWeek]);
    $nbCommentairesSemaine = (int) $stmtCommentairesWeek->fetchColumn();


    $result = [
        // Total utilisateurs
        'nb_users_total' => (int) $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn(),

        // Utilisateurs cette semaine
        'nb_users_semaine' => $nbUsersSemaine,

        // Total publications
        'nb_articles_total' => (int) $pdo->query("SELECT COUNT(*) FROM articles")->fetchColumn(),

        // Publications cette semaine
        'nb_articles_semaine' => $nbArticlesSemaine,

        // Total commentaires
        'nb_commentaires_total' => (int) $pdo->query("SELECT COUNT(*) FROM commentaires")->fetchColumn(),

        // Commentaires cette semaine
        'nb_commentaires_semaine' => $nbCommentairesSemaine
    ];

    echo json_encode($result);
} catch (Exception $e) {
    // En cas d'erreur, renvoyer une réponse JSON d'erreur
    echo json_encode(['statut' => 'error', 'message' => 'Erreur serveur : ' . $e->getMessage()]);
}
echo json_encode(['statut' => 'success', 'data' => $result]);