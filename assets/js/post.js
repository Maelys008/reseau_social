function getUserSession() {
    const userData = sessionStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
}

function getUserId() {
    const user = getUserSession();
    return user ? user.id : null;
}

export async function loadArticles(containerSelector = '#posts-container') {
    const container = document.querySelector(containerSelector);
    if (!container) {
        console.error(`Conteneur pour les articles (${containerSelector}) non trouvé.`);
        return;
    }

    try {
        const res = await fetch('api/articles/affichageA.php');
        const data = await res.json();

        if (data.statut !== 'success') {
            container.innerHTML = '<p>Impossible de charger les articles pour le moment.</p>';
            return;
        }

        const articles = data.articles;
        container.innerHTML = ''; // Nettoyer le conteneur avant d'ajouter de nouveaux articles

        articles.forEach(article => {
            const articleEl = document.createElement('div');
            articleEl.classList.add('bg-white', 'rounded-lg', 'shadow', 'mb-6', 'post-item');

            // --- CORRECTION DU CHEMIN DE LA PHOTO DE PROFIL DE L'AUTEUR DE L'ARTICLE ---
            // Si article.photo_profil est "profil/nom_photo.jpg", le chemin complet est /N/api/profil/nom_photo.jpg
            const authorPhotoPath = article.photo_profil ? `/N/api/${article.photo_profil}` : '/N/api/profil/default.jpg';

           
            const articleImagePath = article.image ? `/N/api/${article.image}` : ''; // Pas d'image par défaut pour l'article lui-même

            // Utilisez des template literals pour l'HTML, c'est plus propre
            articleEl.innerHTML = `
                <div class="p-4">
                    <div class="flex items-center space-x-3">
                        <img src="${authorPhotoPath}" alt="Profile"
                            class="h-10 w-10 rounded-full profile-pic">
                        <div>
                            <h3 class="text-sm font-semibold text-gray-800">${article.nom} ${article.prenom}</h3>
                            <p class="text-xs text-gray-500">${formatRelativeTime(article.created_at)}</p>
                        </div>
                    </div>
                    <div class="mt-3">
                        <p class="text-gray-800">${article.description}</p>
                    </div>
                    <div class="mt-3">
                        ${article.image ? `<img src="${articleImagePath}" alt="Post image" class="rounded-lg w-full post-image">` : ''}
                    </div>
                    <div class="mt-3 flex items-center justify-between text-gray-500 text-sm">
                        <div><span>${article.comment_count || 0} commentaire(s)</span></div>
                    </div>
                </div>
                <div class="border-t border-gray-100 px-4 py-3 flex justify-around">
                    <button class="flex items-center text-gray-500 hover:bg-gray-100 px-3 py-1 rounded-md like-button" data-id="${article.id}">
                        <i class="far fa-thumbs-up mr-2"></i>
                        <span>${article.likes || 0}</span>
                    </button>
                    <button class="flex items-center text-gray-500 hover:bg-gray-100 px-3 py-1 rounded-md comment-button" data-id="${article.id}">
                        <i class="far fa-comment-alt mr-2"></i>
                        <span>Commenter</span>
                    </button>
                </div>
                <div class="comments-section px-4 py-2 bg-gray-50 rounded-b-lg hidden" id="comments-${article.id}">
                    <div class="comments-list"></div>
                    <form class="flex items-center mt-2 comment-form" data-id="${article.id}">
                        <input type="text" name="commentaire" class="flex-1 p-2 rounded border mr-2" placeholder="Votre commentaire..." required>
                        <button class="bg-blue-500 text-white px-3 py-1 rounded" type="submit">Envoyer</button>
                    </form>
                </div>
            `;
            container.appendChild(articleEl);
        });

        // Attacher les écouteurs d'événements après que les articles soient ajoutés au DOM
        bindArticleEvents();

    } catch (error) {
        console.error('Erreur lors du chargement des articles:', error);
        container.innerHTML = '<p style="color: red;">Une erreur est survenue lors du chargement des articles.</p>';
    }
}

function formatRelativeTime(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return "à l'instant";
    if (diff < 3600) return `${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} h`;
    return `${Math.floor(diff / 86400)} j`;
}

async function toggleLike(articleId) {
    const userId = getUserId();
    if (!userId) {
        alert("Connectez-vous pour liker.");
        return { success: false, message: "Non authentifié" }; 
    }

    try {
        const res = await fetch('api/articles/reactions.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_utilisateur: userId, id_article: articleId })
        });
        return await res.json();
    } catch (error) {
        console.error('Erreur lors de la requête de like:', error);
        return { success: false, message: "Erreur réseau ou du serveur." };
    }
}

async function loadComments(articleId) {
    const container = document.querySelector(`#comments-${articleId} .comments-list`);
    if (!container) return;

    try {
        const res = await fetch('api/articles/commentaires/affichageC.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_article: articleId })
        });

        const commentsData = await res.json();
        const comments = commentsData.comments || []; 

        container.innerHTML = comments.map(c => {
           
            const commentAuthorPhotoPath = c.photo ? `/N/api/${c.photo}` : '/N/api/profil/default.jpg';

            return `
                <div class="flex items-start space-x-2 mb-3">
                    <img src="${commentAuthorPhotoPath}" alt="Profile"
                        class="h-8 w-8 rounded-full profile-pic">
                    <div class="bg-white rounded-2xl px-3 py-2 flex-1">
                        <h4 class="text-xs font-semibold text-gray-800">${c.nom} ${c.prenom}</h4>
                        <p class="text-sm text-gray-800">${c.commentaire}</p>
                        <div class="flex items-center mt-1 text-xs text-gray-500">
                            <button class="font-semibold mr-2 hover:underline">J'aime</button>
                            <span class="ml-2">${formatRelativeTime(c.created_at)}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        document.getElementById(`comments-${articleId}`).classList.remove('hidden');
    } catch (error) {
        console.error('Erreur lors du chargement des commentaires:', error);
        container.innerHTML = '<p style="color: red;">Impossible de charger les commentaires.</p>';
    }
}

async function addComment(articleId, commentaire) {
    const userId = getUserId();
    if (!userId) {
        alert("Connectez-vous pour commenter.");
        return { success: false, message: "Non authentifié" };
    }

    try {
        const res = await fetch('api/articles/commentaires/ajoutC.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_utilisateur: userId, id_article: articleId, commentaire })
        });
        return await res.json();
    } catch (error) {
        console.error('Erreur lors de l\'ajout du commentaire:', error);
        return { success: false, message: "Erreur réseau ou du serveur." };
    }
}

function bindArticleEvents() {
   
    document.querySelectorAll('.like-button').forEach(btn => {
        btn.onclick = null; 
        btn.onclick = async () => {
            const articleId = btn.dataset.id;
            const result = await toggleLike(articleId);
            if (result.success) {
               
                const likesSpan = btn.querySelector('span');
                if (likesSpan) {
                    likesSpan.textContent = parseInt(likesSpan.textContent || '0') + (result.action === 'liked' ? 1 : -1);
                }
                
                 loadArticles();
            }
        };
    });

    document.querySelectorAll('.comment-button').forEach(btn => {
        btn.onclick = null;
        btn.onclick = () => {
            const id = btn.dataset.id;
            // Affiche ou masque la section des commentaires
            const commentsSection = document.getElementById(`comments-${id}`);
            if (commentsSection) {
                if (commentsSection.classList.contains('hidden')) {
                    loadComments(id);
                } else {
                    commentsSection.classList.add('hidden');
                }
            }
        };
    });

    document.querySelectorAll('.comment-form').forEach(form => {
        form.onsubmit = null;
        form.onsubmit = async e => {
            e.preventDefault();
            const articleId = form.dataset.id;
            const commentaireInput = form.querySelector('input[name="commentaire"]');
            const commentaire = commentaireInput ? commentaireInput.value.trim() : '';

            if (commentaire) {
                const result = await addComment(articleId, commentaire);
                if (result.success) {
                    commentaireInput.value = ''; // Vider l'input après envoi
                    loadComments(articleId); // Recharger les commentaires pour voir le nouveau
                } else {
                    alert(result.message || "Erreur lors de l'ajout du commentaire.");
                }
            }
        };
    });
}

