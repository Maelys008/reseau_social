// assets/js/publication.js

export function loadPublications() {
    const articlesBody = document.getElementById('articlesBody');
    if (!articlesBody) {
        console.error("L'élément #articlesBody n'a pas été trouvé. La page des publications n'est peut-être pas chargée.");
        return;
    }
    articlesBody.innerHTML = ''; t

    fetch('/N/api/articles/affichageA.php') 
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!data.articles || data.articles.length === 0) {
                articlesBody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-gray-500">Aucune publication trouvée.</td></tr>';
                return;
            }

            data.articles.forEach(article => {
                const row = document.createElement('tr');
                const articleImagePath = article.image ? `/N/${article.image}` : ''; 
                row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap">${article.nom || ''} ${article.prenom || ''}</td>
                    <td class="px-6 py-4 whitespace-nowrap max-w-xs truncate">${article.description || ''}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        ${article.image ? `<img src="${articleImagePath}" class="h-16 w-auto rounded object-cover">` : 'Aucune'}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">${article.created_at || ''}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button class="btn-supprimer-article text-red-500 hover:underline" data-id="${article.id}">Supprimer</button>
                    </td>
                `;
                articlesBody.appendChild(row);
            });

            // Ajout des événements de suppression après insertion
            document.querySelectorAll('.btn-supprimer-article').forEach(button => {
                button.addEventListener('click', () => {
                    const articleId = button.getAttribute('data-id');
                    const user = JSON.parse(sessionStorage.getItem('user') || '{}');

                    if (!confirm("Êtes-vous sûr de vouloir supprimer cette publication ?")) {
                        return;
                    }

                    fetch('/N/api/articles/deleteA.php', { // Chemin corrigé
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            article_id: articleId,
                            user_id: user?.id,
                            user_role: user?.role
                        })
                    })
                        .then(res => res.json())
                        .then(response => {
                            if (response.success) {
                                button.closest('tr').remove();
                                alert("Article supprimé !");
                            } else {
                                alert(response.message || 'Erreur lors de la suppression.'); // Utiliser alert pour les messages utilisateur
                                console.error(response.message || 'Erreur lors de la suppression.');
                            }
                        })
                        .catch(error => {
                            console.error('Erreur serveur lors de la suppression :', error);
                            alert('Erreur réseau lors de la suppression de l\'article.');
                        });
                });
            });
        })
        .catch(err => {
            console.error('Erreur lors du chargement des articles :', err);
            articlesBody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-red-500">Erreur lors du chargement des publications.</td></tr>';
        });
}