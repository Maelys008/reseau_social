
// assets/js/stats.js

function calculerPourcentage(semaine, total) {
    if (!total || total === 0) return '0%';
    return ((semaine / total) * 100).toFixed(1) + '%';
}

async function chargerStatsDashboard() {
    try {
        const res = await fetch('/N/api/dashboard/stats.php');
        const stats = await res.json();

        // UTILISATEURS
        const elUsersTotal = document.getElementById('nb-users-total');
        const elUsersWeek = document.getElementById('nb-users-week');
        const elUsersPourcent = document.getElementById('nb-users-pourcent');

        if (elUsersTotal) elUsersTotal.innerText = stats.nb_users_total;
        if (elUsersWeek) elUsersWeek.innerText = stats.nb_users_semaine;
        if (elUsersPourcent) elUsersPourcent.innerText = calculerPourcentage(stats.nb_users_semaine, stats.nb_users_total);

        // PUBLICATIONS
        const elPublicationsTotal = document.getElementById('nb-publications-total');
        const elPublicationsWeek = document.getElementById('nb-publications-week');
        const elPublicationsPourcent = document.getElementById('nb-publications-pourcent');

        if (elPublicationsTotal) elPublicationsTotal.innerText = stats.nb_articles_total;
        if (elPublicationsWeek) elPublicationsWeek.innerText = stats.nb_articles_semaine;
        if (elPublicationsPourcent) elPublicationsPourcent.innerText = calculerPourcentage(stats.nb_articles_semaine, stats.nb_articles_total);

        // COMMENTAIRES
        const elCommentairesTotal = document.getElementById('nb-commentaires-total');
        const elCommentairesWeek = document.getElementById('nb-commentaires-week');
        const elCommentairesPourcent = document.getElementById('nb-commentaires-pourcent');

        if (elCommentairesTotal) elCommentairesTotal.innerText = stats.nb_commentaires_total;
        if (elCommentairesWeek) elCommentairesWeek.innerText = stats.nb_commentaires_semaine;
        if (elCommentairesPourcent) elCommentairesPourcent.innerText = calculerPourcentage(stats.nb_commentaires_semaine, stats.nb_commentaires_total);

    } catch (error) {
        console.error("Erreur lors du chargement des statistiques :", error);
    }
}
