<?php
header("Content-Type: application/json");
require_once('../database.php');


$req = $pdo->query("SELECT users.nom, users.prenom, articles.id, articles.description, articles.image, articles.created_at
                    FROM articles
                    JOIN users ON users.id = articles.user_id
                    ORDER BY articles.created_at DESC
                ");
$articles = $req->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(['statut' => 'success', 'articles' => $articles]);
