// assets/js/amis.js

// Supprimez l'import { loadPage } from './fonctions.js'; car il est déjà dans le script principal
// et vous ne devriez pas charger de page directement depuis un module de section.

// Supprimez aussi les déclarations initiales de user et l'alerte
// L'utilisateur doit être authentifié avant d'arriver ici, et l'ID sera passé à la fonction d'init.
// const user = JSON.parse(sessionStorage.getItem('user'));
// if (!user || !user.id) { alert("Utilisateur non authentifié !"); }


// Les conteneurs seront passés en argument ou sélectionnés à l'intérieur de la fonction d'initialisation
let suggestedContainer;
let requestContainer;
let friendListContainer;
let currentUser = null; // Définir l'utilisateur une fois que la fonction init est appelée

// Fonction d'initialisation pour cette section, qui sera exportée
export async function loadFriendsList(containerSelector = '#friends-section-container') { // J'ai changé le sélecteur par défaut
  const mainContainer = document.querySelector(containerSelector);
  if (!mainContainer) {
    console.error(`Conteneur amis (${containerSelector}) non trouvé.`);
    return;
  }

  // Assurez-vous que l'HTML de ami.php est déjà chargé ici.
  // Vous devrez avoir des IDs spécifiques dans ami.php pour ces conteneurs
  suggestedContainer = mainContainer.querySelector('#suggested-friends');
  requestContainer = mainContainer.querySelector('#friend-requests');
  friendListContainer = mainContainer.querySelector('#friend-list');

  if (!suggestedContainer || !requestContainer || !friendListContainer) {
    console.error("Un ou plusieurs conteneurs spécifiques aux amis n'ont pas été trouvés dans la section.");
    return;
  }

  currentUser = getUserSession();
  if (!currentUser || !currentUser.id) {
    mainContainer.innerHTML = '<p>Veuillez vous connecter pour voir la section amis.</p>';
    return;
  }

  // Appelez les fonctions de chargement une fois que les conteneurs sont prêts
  chargerSuggestions();
  chargerAmis(); // Appelé également dans le gestionnaire d'événements, donc assurez-vous qu'il est propre
  chargerDemandesRecues(); // J'ai créé une fonction pour cela, c'est plus propre
  bindFriendEvents(); // Attacher les événements une fois que le contenu est chargé
}


// Fonctions utilitaires pour l'utilisateur
function getUserSession() {
  const userData = sessionStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
}
function getUserId() {
  const user = getUserSession();
  return user ? user.id : null;
}


// 🔹 Suggestions d'amis
async function chargerSuggestions() {
  if (!suggestedContainer || !currentUser) return;
  try {
    const res = await fetch("api/amis/recuperer_utilisateurs.php", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentUser: currentUser.id })
    });
    const data = await res.json();

    if (data.statut === 'success') {
      suggestedContainer.innerHTML = '';
      if (data.utilisateurs && data.utilisateurs.length > 0) {
        let htmlContent = '';
        data.utilisateurs.forEach(u => {
          htmlContent += `
                        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2" data-id="${u.id}">
                            <div class="flex items-center space-x-3">
                                <img src="${u.photo || 'https://via.placeholder.com/150'}" class="h-12 w-12 rounded-full profile-pic" />
                                <div><h4 class="font-medium text-gray-800">${u.prenom} ${u.nom}</h4></div>
                            </div>
                            <button class="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 add-friend-btn">
                                <i class="fas fa-user-plus mr-1"></i> Ajouter
                            </button>
                        </div>`;
        });
        suggestedContainer.innerHTML = htmlContent;
      } else {
        suggestedContainer.innerHTML = '<p class="text-gray-600">Aucune suggestion d\'amis pour le moment.</p>';
      }
    } else {
      console.error('Erreur lors du chargement des suggestions:', data.message);
      suggestedContainer.innerHTML = '<p class="text-red-500">Erreur de chargement des suggestions.</p>';
    }
  } catch (error) {
    console.error('Erreur réseau lors du chargement des suggestions:', error);
    suggestedContainer.innerHTML = '<p class="text-red-500">Erreur réseau lors du chargement des suggestions.</p>';
  }
}

// 🔹 Demandes reçues
async function chargerDemandesRecues() {
  if (!requestContainer || !currentUser) return;
  try {
    const res = await fetch("api/amis/demande_recue.php", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentUser: currentUser.id })
    });
    const data = await res.json();

    if (data.statut === 'success') {
      requestContainer.innerHTML = '';
      if (data.demandes && data.demandes.length > 0) {
        let htmlContent = '';
        data.demandes.forEach(d => {
          htmlContent += `
                        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2" data-id="${d.id}">
                            <div class="flex items-center space-x-3">
                                <img src="${d.photo || 'https://via.placeholder.com/150'}" class="h-12 w-12 rounded-full profile-pic" />
                                <div><h4 class="font-medium text-gray-800">${d.prenom} ${d.nom}</h4></div>
                            </div>
                            <div class="flex space-x-2">
                                <button class="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 accept-friend-btn">Accepter</button>
                                <button class="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-300 reject-friend-btn">Refuser</button>
                            </div>
                        </div>`;
        });
        requestContainer.innerHTML = htmlContent;
      } else {
        requestContainer.innerHTML = '<p class="text-gray-600">Aucune demande d\'ami en attente.</p>';
      }
    } else {
      console.error('Erreur lors du chargement des demandes reçues:', data.message);
      requestContainer.innerHTML = '<p class="text-red-500">Erreur de chargement des demandes.</p>';
    }
  } catch (error) {
    console.error('Erreur réseau lors du chargement des demandes reçues:', error);
    requestContainer.innerHTML = '<p class="text-red-500">Erreur réseau lors du chargement des demandes.</p>';
  }
}

// 🔹 Liste des amis
async function chargerAmis() {
  if (!friendListContainer || !currentUser) return;
  try {
    const res = await fetch("api/amis/liste_ami.php", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentUser: currentUser.id })
    });
    const data = await res.json();

    if (data.statut === 'success') {
      friendListContainer.innerHTML = '';
      if (data.amis && data.amis.length > 0) {
        let htmlContent = '';
        data.amis.forEach(d => {
           htmlContent  += `
                        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2" data-id="${d.id}">
                            <div class="flex items-center space-x-3">
                                <img src="${d.photo || 'https://via.placeholder.com/150'}" class="h-12 w-12 rounded-full profile-pic" />
                                <div><h4 class="font-medium text-gray-800">${d.prenom} ${d.nom}</h4></div>
                            </div>
                            <div class="flex space-x-2">
                                <button class="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 message-friend-btn">Message</button>
                                <button class="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-300 delete-friend-btn">Supprimer</button>
                            </div>
                        </div>`;
        });
        friendListContainer.innerHTML += htmlContent;
      } else {
        friendListContainer.innerHTML = '<p class="text-gray-600">Vous n\'avez pas encore d\'amis.</p>';
      }
    } else {
      console.error('Erreur lors du chargement des amis:', data.message);
      friendListContainer.innerHTML = '<p class="text-red-500">Erreur de chargement de la liste d\'amis.</p>';
    }
  } catch (error) {
    console.error('Erreur réseau lors du chargement des amis:', error);
    friendListContainer.innerHTML = '<p class="text-red-500">Erreur réseau lors du chargement de la liste d\'amis.</p>';
  }
}

// 🔁 Gérer toutes les interactions d'amis (ajout, acceptation, refus, suppression)
async function handleFriendAction(action, targetId, cardElement) {
  if (!currentUser) return alert("Utilisateur non authentifié.");

  try {
    const res = await fetch("api/amis/amis_actions.php", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: action,
        currentUser: currentUser.id,
        targetUser: targetId
      })
    });
    const data = await res.json();
    alert(data.message || 'Action effectuée.');

    if (data.statut === 'success') {
      // Recharger les listes pertinentes après une action réussie
      chargerSuggestions();
      chargerDemandesRecues();
      chargerAmis();

      // Supprimer la carte si l'action le nécessite
      if (cardElement && (action === 'ajouter' || action === 'accepter' || action === 'supprimer' || action === 'refuser')) {
        if (!(action === 'ajouter' && data.statut === 'info')) { // Ne pas supprimer si c'est une info sur une demande existante
          cardElement.remove();
        }
      }
    }
  } catch (error) {
    console.error('Erreur lors de l\'action d\'ami:', error);
    alert('Erreur réseau ou du serveur lors de l\'action.');
  }
}


function bindFriendEvents() {
  // Utiliser la délégation d'événements pour les boutons d'amis
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('button');
    if (!btn) return;

    const card = btn.closest('[data-id]');
    const targetId = card?.dataset.id;
    if (!targetId) return;

    // Déterminer l'action basée sur les classes ou le texte (plus robuste avec les classes)
    if (btn.classList.contains('add-friend-btn')) {
      handleFriendAction('ajouter', targetId, card);
    } else if (btn.classList.contains('accept-friend-btn')) {
      handleFriendAction('accepter', targetId, card);
    } else if (btn.classList.contains('reject-friend-btn')) {
      handleFriendAction('refuser', targetId, card);
    } else if (btn.classList.contains('delete-friend-btn')) {
      handleFriendAction('supprimer', targetId, card);
    } else if (btn.classList.contains('message-friend-btn')) {
      // Ouvrir la messagerie
      // Assurez-vous que la fonction loadPage est disponible dans le scope parent
      // ou importez-la ici si nécessaire, ou utilisez window.loadSection si elle est globale
      // NOTE: C'est un peu un couplage fort avec le script principal.
      // Idéalement, ce module ne devrait pas connaître loadPage directement,
      // mais plutôt émettre un événement personnalisé que le script principal écouterait.
      // Pour l'instant, on va simuler l'appel direct pour que ça fonctionne.
      // Assuming loadPage is defined in the global scope or somehow available
      // If loadPage is meant to be part of the main script, you'd need to emit an event
      // that the main script listens for to change the section.
      console.log(`Naviguer vers message avec user_id=${targetId}`);
      // Si loadPage est globale:
      // loadPage(`vues/clients/message.php?user_id=${targetId}`, '#page-content');
      // Ou si vous voulez juste charger la section message
      // Trigger an event for the main app to handle navigation
      const event = new CustomEvent('navigate', {
        detail: {
          sectionId: 'nav-message',
          params: { user_id: targetId }
        }
      });
      document.dispatchEvent(event);
    }
  });
}

// Supprimez tous les appels initiaux à chargerSuggestions(), chargerAmis(), et le document.addEventListener('click') ici.
// C'est la fonction loadFriendsList() qui les appellera une fois le module chargé.