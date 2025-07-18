// index.js

// Sélection des éléments principaux
const mainApp = document.getElementById('main-app');
const authentificationApp = document.getElementById('app'); // Conteneur global de l'authentification
const infoContainer = document.getElementById('info'); // Conteneur pour les infos utilisateur
const pageContentContainer = document.getElementById('page-content');

// Sélection des éléments des modales globales
const globalModal = document.getElementById('globalModal');
const closeModalBtn = document.getElementById('closeModal');
const modalContent = document.getElementById('modal-content');

const editProfileModal = document.getElementById('edit-profile-modal');
const closeEditProfileModalBtn = document.getElementById('close-edit-profile-modal');
const cancelEditProfileModalBtn = document.getElementById('cancel-edit-profile-modal');
const formEditProfile = document.getElementById('formEditProfile');

const changePasswordModal = document.getElementById('change-password-modal');
const closeChangePasswordModalBtn = document.getElementById('close-change-password-modal');
const cancelChangePasswordModalBtn = document.getElementById('cancel-change-password-modal');
const formChangePassword = document.getElementById('formChangePassword');

// Tableau des boutons de navigation et de leurs correspondances

const navLinks = [
    { id: 'nav-home', phpPage: 'vues/clients/post.php', jsModule: '/N/assets/js/post.js', jsFunction: 'loadArticles', containerId: '#posts-container', roles: ['admin', 'moderator', 'user'] },
    { id: 'nav-friends', phpPage: 'vues/clients/ami.php', jsModule: '/N/assets/js/ami.js', jsFunction: 'loadFriendsList', containerId: '#friends-section-container', roles: ['admin', 'moderator', 'user'] },
    { id: 'nav-message', phpPage: 'vues/clients/message.php', jsModule: '/N/assets/js/message.js', jsFunction: 'initMessaging', containerId: '#message-interface', roles: ['admin', 'moderator', 'user'] },
    { id: 'nav-profile', phpPage: 'vues/clients/profil.php', jsModule: '/N/assets/js/profil.js', jsFunction: 'loadProfileData', containerId: '#profile-main-container', roles: ['admin', 'moderator', 'user'] },
    { id: 'nav-users', phpPage: 'vues/back-office/utilisateur.php', jsModule: '/N/assets/js/utilisateur.js', jsFunction: 'loadUsers', containerId: '#user-list', roles: ['admin', 'moderator'] },
    { id: 'nav-publications', phpPage: 'vues/back-office/publication.php', jsModule: '/N/assets/js/publication.js', jsFunction: 'loadPublications', containerId: '#articlesBody', roles: ['admin', 'moderator'] },
    { id: 'nav-dashboard', phpPage: 'vues/back-office/dashboard.php', jsModule: '/N/assets/js/dashboard.js', jsFunction: 'initDashboard', containerId: '#dashboard-main-container', roles: ['admin', 'moderator'] }
];

// Fonction pour appliquer le style au bouton de navigation actif
function setActiveNav(id) {
    navLinks.forEach(link => {
        const btn = document.getElementById(link.id);
        if (btn) {
            btn.classList.remove('border-blue-500', 'text-blue-600');
            btn.classList.add('text-gray-500');
        }
    });
    const activeBtn = document.getElementById(id);
    if (activeBtn) {
        activeBtn.classList.add('border-blue-500', 'text-blue-600');
        activeBtn.classList.remove('text-gray-500');
    }
}

// Fonction générique pour charger une page et son JS
async function loadSection(linkConfig) {
    if (!pageContentContainer) {
        console.error("L'élément #page-content n'a pas été trouvé.");
        return;
    }

    setActiveNav(linkConfig.id);

    try {
        const response = await fetch(`/N/${linkConfig.phpPage}`); // Chemin PHP corrigé
        const htmlContent = await response.text();
        pageContentContainer.innerHTML = htmlContent;

        if (linkConfig.jsModule) {
            const module = await import(linkConfig.jsModule);
            if (module[linkConfig.jsFunction]) {
                module[linkConfig.jsFunction](linkConfig.containerId);
            } else {
                console.warn(`Fonction ${linkConfig.jsFunction} non trouvée dans ${linkConfig.jsModule}`);
            }
        }
    } catch (error) {
        console.error(`Erreur lors du chargement de la section ${linkConfig.id}:`, error);
        pageContentContainer.innerHTML = `<p style="color: red;">Impossible de charger cette section. Veuillez réessayer.</p>`;
    }
}

/**
 * Ouvre une modale spécifique en lui injectant du contenu HTML.
 * @param {HTMLElement} modalElement L'élément DOM de la modale à ouvrir (ex: globalModal, editProfileModal).
 * @param {string} contentHtml Le contenu HTML à injecter dans la modale (optionnel, pour globalModal).
 */
function openModal(modalElement, contentHtml = '') {
    if (modalElement) {
        if (modalElement === globalModal && modalContent) {
            modalContent.innerHTML = contentHtml;
        }
        modalElement.classList.remove('hidden');
        modalElement.style.display = 'flex'; // Assure que le flexbox est appliqué pour centrer
    }
}

/**
 * Ferme une modale spécifique.
 * @param {HTMLElement} modalElement L'élément DOM de la modale à fermer.
 */
function closeModal(modalElement) {
    if (modalElement) {
        modalElement.classList.add('hidden');
        modalElement.style.display = 'none'; // Cache complètement
        if (modalElement === globalModal && modalContent) {
            modalContent.innerHTML = ''; // Nettoie le contenu de la modale globale
        }
    }
}



// Gère la déconnexion
function handleLogout() {
    sessionStorage.removeItem('user');
    mainApp.hidden = true; // Cache l'application principale
    authentificationApp.style.display = 'block'; // Affiche la div 'app' 

    // Informer auth.js que l'application a demandé une déconnexion
    document.dispatchEvent(new CustomEvent('app:logout'));

    // Nettoyer les infos utilisateur dans la barre de navigation
    if (infoContainer) {
        infoContainer.innerHTML = '';
    }
    // Masquer tous les boutons de navigation spécifiques au rôle
    navLinks.forEach(link => {
        const btn = document.getElementById(link.id);
        if (btn) btn.hidden = true;
    });
}


// Cette fonction sera appelée par l'événement personnalisé 'auth:loggedIn' depuis auth.js
function onAuthSuccess(event) {
    const profil = event.detail.user;
    const userRole = event.detail.role;

    authentificationApp.style.display = 'none'; // Cache la section d'authentification
    mainApp.hidden = false; // Affiche l'application principale

    // Afficher les informations utilisateur dans la barre de navigation
    if (infoContainer && profil) {
       
        const profilPhotoPath = profil.photo ? `/N/api/${profil.photo}` : '/N/api/profil/default.jpg'; 

        infoContainer.innerHTML = `
            <div class="flex items-center space-x-4"> <!-- Utilisation de flex pour l'alignement horizontal -->
    <img src="${profilPhotoPath}" alt="photo de profil" class="h-12 w-12 rounded-full object-cover"> <!-- Classes Tailwind pour taille et forme -->
    <span class="text-gray-800 font-semibold text-lg">${profil.nom || ''} ${profil.prenom || ''}</span>
    <button class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors" id="deconnexion-btn">
        Déconnexion
    </button>
</div>
        `;

        const deconnexionBtn = document.getElementById('deconnexion-btn');
        if (deconnexionBtn) {
            deconnexionBtn.addEventListener('click', handleLogout);
        }
    }

    // Afficher ou masquer les boutons de navigation en fonction du rôle
    navLinks.forEach(link => {
        const btn = document.getElementById(link.id);
        if (btn) {
            if (link.roles.includes(userRole)) {
                btn.hidden = false; // Afficher le bouton si le rôle est autorisé
            } else {
                btn.hidden = true; // Masquer le bouton si le rôle n'est pas autorisé
            }
        }
    });

    
    const initialPageConfig = navLinks.find(link => link.id === 'nav-home' && link.roles.includes(userRole)) ||
        navLinks.find(link => link.id === 'nav-dashboard' && link.roles.includes(userRole)) ||
        navLinks.find(link => link.roles.includes(userRole)); // Fallback pour charger n'importe quelle page autorisée

    if (initialPageConfig) {
        loadSection(initialPageConfig);
    } else {
        // Si aucun lien n'est accessible, afficher un message d'erreur ou une page vide
        pageContentContainer.innerHTML = `< p > Bienvenue! Aucune page par défaut disponible pour votre rôle.</p > `;
    }
}


// --- Initialisation de l'application après le chargement du DOM ---
document.addEventListener('DOMContentLoaded', () => {

    // Écouteur pour la connexion réussie depuis auth.js
    document.addEventListener('auth:loggedIn', onAuthSuccess);

    // Vérifier l'état de connexion au chargement initial de la page
    const userString = sessionStorage.getItem('user');
    const profil = userString ? JSON.parse(userString) : null;

    if (profil) {
        // Simuler l'événement de connexion réussie pour initialiser l'UI de main-app
        onAuthSuccess(new CustomEvent('auth:loggedIn', { detail: { user: profil, role: profil.role } }));
    } else {
        // Si personne n'est connecté, s'assurer que la section d'authentification est visible
        authentificationApp.style.display = 'block';
        mainApp.hidden = true;
        // Masquer tous les boutons de navigation au démarrage si non connecté
        navLinks.forEach(link => {
            const btn = document.getElementById(link.id);
            if (btn) btn.hidden = true;
        });
    }

    // Attacher les écouteurs pour tous les boutons de navigation
    navLinks.forEach(linkConfig => {
        const button = document.getElementById(linkConfig.id);
        if (button) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                loadSection(linkConfig);
            });
        }
    });

    // --- Gestionnaires d'événements pour les modales globales ---
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => closeModal(globalModal));
    }
    if (globalModal) {
        globalModal.addEventListener('click', (e) => {
            if (e.target === globalModal) {
                closeModal(globalModal);
            }
        });
    }

    if (closeEditProfileModalBtn) {
        closeEditProfileModalBtn.addEventListener('click', () => closeModal(editProfileModal));
    }
    if (cancelEditProfileModalBtn) {
        cancelEditProfileModalBtn.addEventListener('click', () => closeModal(editProfileModal));
    }

    if (closeChangePasswordModalBtn) {
        closeChangePasswordModalBtn.addEventListener('click', () => closeModal(changePasswordModal));
    }
    if (cancelChangePasswordModalBtn) {
        cancelChangePasswordModalBtn.addEventListener('click', () => closeModal(changePasswordModal));
    }
});

// Vous pouvez exposer les fonctions openModal/closeModal si d'autres modules en ont besoin.
export { openModal, closeModal };