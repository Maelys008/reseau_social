
let mainContainer;

// Fonction utilitaire pour calculer le pourcentage
function calculerPourcentage(semaine, total) {
    if (!total || total === 0) return '0%';
    return ((semaine / total) * 100).toFixed(1) + '%';
}

// Fonction d'initialisation principale pour le dashboard
export async function initDashboard(containerSelector = '#dashboard-content') {
    // Assigner la valeur à la variable mainContainer déclarée au niveau du module
    mainContainer = document.querySelector(containerSelector);
    if (!mainContainer) {
        console.error(`Conteneur du dashboard (${containerSelector}) non trouvé.`);
        return;
    }

    // Charge les statistiques du dashboard
    await chargerStatsDashboard();

}


async function chargerStatsDashboard() {
   
    if (!mainContainer) {
        console.error("mainContainer n'est pas défini. Impossible de charger les statistiques.");
        return;
    }

    try {
        const res = await fetch('/N/api/dashboard/stats.php');
        const stats = await res.json();

        if (stats.statut === 'success') {
            // UTILISATEURS
            const elUsersTotal = mainContainer.querySelector('#nb-users-total'); 
            const elUsersWeek = mainContainer.querySelector('#nb-users-week'); 
            const elUsersPourcent = mainContainer.querySelector('#nb-users-pourcent'); 

            if (elUsersTotal) elUsersTotal.innerText = stats.nb_users_total;
            if (elUsersWeek) elUsersWeek.innerText = stats.nb_users_semaine;
            if (elUsersPourcent) elUsersPourcent.innerText = calculerPourcentage(stats.nb_users_semaine, stats.nb_users_total);

            // PUBLICATIONS
            const elPublicationsTotal = mainContainer.querySelector('#nb-publications-total'); 
            const elPublicationsWeek = mainContainer.querySelector('#nb-publications-week'); 
            const elPublicationsPourcent = mainContainer.querySelector('#nb-publications-pourcent'); 

            if (elPublicationsTotal) elPublicationsTotal.innerText = stats.nb_articles_total;
            if (elPublicationsWeek) elPublicationsWeek.innerText = stats.nb_articles_semaine;
            if (elPublicationsPourcent) elPublicationsPourcent.innerText = calculerPourcentage(stats.nb_articles_semaine, stats.nb_articles_total);

            // COMMENTAIRES
            const elCommentairesTotal = mainContainer.querySelector('#nb-commentaires-total'); 
            const elCommentairesWeek = mainContainer.querySelector('#nb-commentaires-week'); 
            const elCommentairesPourcent = mainContainer.querySelector('#nb-commentaires-pourcent'); 

            if (elCommentairesTotal) elCommentairesTotal.innerText = stats.nb_commentaires_total;
            if (elCommentairesWeek) elCommentairesWeek.innerText = stats.nb_commentaires_semaine;
            if (elCommentairesPourcent) elCommentairesPourcent.innerText = calculerPourcentage(stats.nb_commentaires_semaine, stats.nb_commentaires_total);
        } else {
            console.error("API Dashboard a retourné une erreur:", stats.message);
            // Ici, mainContainer est accessible et sa vérification est maintenue
            if (mainContainer) mainContainer.innerHTML = '<p class="text-red-500">Erreur lors du chargement des statistiques du dashboard: ' + stats.message + '</p>';
        }

    } catch (error) {
        console.error("Erreur lors du chargement des statistiques :", error);
        // Ici aussi, mainContainer est accessible
        if (mainContainer) mainContainer.innerHTML = '<p class="text-red-500">Erreur réseau ou du serveur lors du chargement des statistiques.</p>';
    }
}