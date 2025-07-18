// assets/js/messages.js (renommé de chat.js pour correspondre à navLinks)

function getUserSession() {
    const userData = sessionStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
}
function getUserId() {
    const user = getUserSession();
    return user ? user.id : null;
}

let currentChatUserId = null;
let intervalId = null;

// Exportez la fonction d'initialisation principale
export async function initMessaging(containerSelector = '#message-interface', initialUserId = null) {
    const mainContainer = document.querySelector(containerSelector);
    if (!mainContainer) {
        console.error(`Conteneur de messagerie (${containerSelector}) non trouvé.`);
        return;
    }

    // Assurez-vous que l'HTML de message.php est déjà chargé ici.
    // Il doit contenir les éléments pour #contact-list, #chat-messages, #message-input, etc.

    // Charge les conversations au démarrage de la section messagerie
    await loadConversations('#contact-list');

    // Attache les événements après que le DOM de la section messagerie soit prêt
    setupMessageEvents();
    setupEmojiPicker();

    // Si un utilisateur cible est passé (ex: depuis la page amis)
    if (initialUserId) {
        openConversation(initialUserId);
    }
}


// 📋 Charger les conversations existantes
export async function loadConversations(containerSelector = '#contact-list') {
    const container = document.querySelector(containerSelector);
    const user_id = getUserId();
    if (!user_id || !container) return;

    try {
        const res = await fetch(`/N/api/messages/liste_conversation.php?user_id=${user_id}`);
        const data = await res.json();
        const users = data.conversations || [];

        container.innerHTML = '';
        if (users.length === 0) {
            container.innerHTML = '<p class="p-3 text-gray-600">Aucune conversation. Cherchez un ami !</p>';
            return;
        }

        users.forEach(user => {
            const div = document.createElement('div');
            div.setAttribute('data-id', user.id);
            div.className = 'contact-item p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100';
            div.innerHTML = `
                <div class="flex items-center space-x-3">
                    <img src="${user.photo ? `/N/api/${user.photo}` : '/N/api/profil/default.jpg'}" alt="Profile" class="h-10 w-10 rounded-full">
                    <div>
                        <h3 class="font-medium text-gray-800">${user.nom} ${user.prenom}</h3>
                        <p class="text-sm text-gray-500">${user.last_message || ''}</p>
                    </div>
                </div>
            `;
            div.onclick = () => openConversation(user.id);
            container.appendChild(div);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des conversations:', error);
        container.innerHTML = '<p class="p-3 text-red-500">Erreur de chargement des conversations.</p>';
    }
}

// 🔍 Rechercher un utilisateur (pour démarrer une nouvelle conversation ou filtrer)
export async function searchUtilisateurs(query, containerSelector = '#contact-list') {
    const container = document.querySelector(containerSelector);
    const user_id = getUserId();
    if (!user_id || !container) return;

    try {
        // Adaptez cette URL si la recherche d'utilisateurs est différente de liste_conversation
        const res = await fetch(`/N/api/messages/liste_conversation.php?user_id=${user_id}&q=${encodeURIComponent(query)}`);
        const data = await res.json();
        const users = data.utilisateurs || data.conversations || []; // Peut-être que l'API renvoie 'utilisateurs' ou 'conversations'

        container.innerHTML = '';
        if (users.length === 0) {
            container.innerHTML = '<p class="p-3 text-gray-600">Aucun utilisateur trouvé.</p>';
            return;
        }

        users.forEach(user => {
            const div = document.createElement('div');
            div.className = 'contact-item p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100';
            div.innerHTML = `
                 <div class="flex items-center space-x-3">
                    <img src="${user.photo ? `/N/api/${user.photo}` : '/N/api/profil/default.jpg'} alt="Profile" class="h-10 w-10 rounded-full">
                    <div>
                        <h3 class="font-medium text-gray-800">${user.nom} ${user.prenom}</h3>
                        <p class="text-sm text-gray-500">${user.email || ''}</p>
                    </div>
                </div>
            `;
            div.onclick = () => openConversation(user.id);
            container.appendChild(div);
        });
    } catch (error) {
        console.error('Erreur lors de la recherche d\'utilisateurs:', error);
        container.innerHTML = '<p class="p-3 text-red-500">Erreur lors de la recherche.</p>';
    }
}

// 💬 Ouvrir une conversation
async function openConversation(receiver_id) {
    if (currentChatUserId === receiver_id) return; // Évite de recharger si déjà la bonne conversation

    currentChatUserId = receiver_id;
    clearInterval(intervalId); // Arrête l'intervalle précédent

    // Mettre à jour visuellement qui est sélectionné (si vous avez cette logique HTML/CSS)
    document.querySelectorAll('.contact-item').forEach(item => {
        item.classList.remove('bg-blue-100'); // Exemple de classe active
    });
    const selectedContact = document.querySelector(`.contact-item[data-id="${receiver_id}"]`);
    if (selectedContact) {
        selectedContact.classList.add('bg-blue-100');
    }

    await loadMessages('#chat-messages', receiver_id); // Charge les messages une première fois
    // Commence à recharger les messages toutes les 3 secondes
    intervalId = setInterval(() => loadMessages('#chat-messages', receiver_id), 3000);
}

// 📨 Charger les messages
async function loadMessages(containerSelector, receiver_id) {
    const container = document.querySelector(containerSelector);
    const user_id = getUserId();
    if (!container || !user_id) return;

    try {
        const res = await fetch(`/N/api/messages/message_entre_utilisateur.php?user_id=${user_id}&utilisateur_id=${receiver_id}`);
        const data = await res.json();
        const messages = data.messages || [];

        container.innerHTML = '';
        messages.forEach(msg => {
            const div = renderMessage(msg, user_id);
            container.appendChild(div);
        });

        // Faire défiler vers le bas pour voir le dernier message
        container.scrollTop = container.scrollHeight;
    } catch (error) {
        console.error('Erreur lors du chargement des messages:', error);
        container.innerHTML = '<p style="color: red;">Impossible de charger les messages.</p>';
    }
}

// 🧱 Rendu d'un message
function renderMessage(msg, currentUserId) {
    const div = document.createElement('div');
    // Ajout de classes Tailwind pour un espacement et un style corrects
    div.className = `flex ${msg.sender_id == currentUserId ? 'justify-end' : 'justify-start'} mb-2`;

    const bubble = document.createElement('div');
    bubble.className = `p-3 rounded-lg max-w-xs ${
        msg.sender_id == currentUserId ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
    }`;

    if (msg.image) {
        const img = document.createElement('img');
        img.src = msg.image;
        img.className = 'max-w-full rounded mb-1'; // Ajuster les classes pour l'image dans la bulle
        bubble.appendChild(img);
    }

    if (msg.message) {
        const p = document.createElement('p');
        p.innerText = msg.message;
        bubble.appendChild(p);
    }

    div.appendChild(bubble);
    return div;
}

// ✉️ Envoyer un message
export async function envoyerMessage(contenu, imageFile = null) {
    const user_id = getUserId();
    const receiver_id = currentChatUserId;
    if (!user_id || !receiver_id || (!contenu.trim() && !imageFile)) {
        alert("Veuillez saisir un message ou sélectionner une image.");
        return;
    }

    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('receiver_id', receiver_id);
    formData.append('message', contenu);
    if (imageFile) formData.append('image', imageFile);

    try {
        const res = await fetch('/N/api/messages/envoyer_message.php', {
            method: 'POST',
            body: formData
        });

        const result = await res.json();
        if (result.statut === 'success') {
            await loadMessages('#chat-messages', receiver_id);
            const messageInput = document.getElementById('message-input');
            if (messageInput) messageInput.value = ''; // Vider l'input après envoi
            const imageInput = document.getElementById('image-input'); // Si vous avez un input file
            if (imageInput) imageInput.value = ''; // Vider l'input file
        } else {
            alert(result.message || "Erreur lors de l'envoi du message.");
        }
    } catch (error) {
        console.error('Erreur lors de l\'envoi du message:', error);
        alert('Erreur réseau ou du serveur lors de l\'envoi du message.');
    }
}

// 😎 Gestion des stickers/emoji
function toggleEmojiPicker() {
    const picker = document.getElementById('emoji-picker');
    if (picker) picker.classList.toggle('hidden');
}

function setupEmojiPicker() {
    const emojiPicker = document.getElementById('emoji-picker');
    if (!emojiPicker) return;

    const emojis = emojiPicker.querySelectorAll('.emoji');
    const input = document.getElementById('message-input');

    if (!input) {
        console.warn("Input message-input non trouvé pour les emojis.");
        return;
    }

    emojis.forEach(emoji => {
        emoji.classList.remove('hidden'); // S'assurer que tous les emojis sont visibles
        emoji.onclick = null; // Supprime l'ancien écouteur si existant
        emoji.addEventListener('click', (e) => {
            e.stopPropagation(); // Empêche l'événement de se propager au document et de fermer le picker
            input.value += emoji.textContent;
            // Ne pas fermer le picker automatiquement, l'utilisateur peut vouloir en mettre plusieurs
            // toggleEmojiPicker();
        });
    });
}

// Fonction pour attacher tous les écouteurs d'événements de la messagerie
function setupMessageEvents() {
    // Recherche
    const searchInput = document.querySelector('#contact-search-input'); // Assurez-vous que le sélecteur est correct
    if (searchInput) {
        searchInput.oninput = null;
        searchInput.addEventListener('input', (e) => {
            searchUtilisateurs(e.target.value, '#contact-list');
        });
    }

    // Bouton Emoji
    document.getElementById('emoji-button')?.addEventListener('click', toggleEmojiPicker);

    // Envoi message
    const sendMessageBtn = document.getElementById('send-message');
    if (sendMessageBtn) {
        sendMessageBtn.onclick = null;
        sendMessageBtn.addEventListener('click', () => {
            const content = document.getElementById('message-input').value;
            // Gérer l'image si vous avez un input file pour ça
            const imageInput = document.getElementById('image-input');
            const imageFile = imageInput ? imageInput.files[0] : null;
            envoyerMessage(content, imageFile);
        });
    }

    // Gestion du formulaire d'envoi avec la touche Entrée
    const messageInput = document.getElementById('message-input');
    if (messageInput) {
        messageInput.onkeypress = null;
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) { // Permet d'aller à la ligne avec Shift+Enter
                e.preventDefault(); // Empêche le retour à la ligne par défaut dans le textarea
                sendMessageBtn?.click(); // Simule le clic sur le bouton d'envoi
            }
        });
    }


    // Fermer le picker lorsque l'utilisateur clique en dehors de l'input et du picker
    document.onclick = null; // Supprime l'ancien écouteur si existant
    document.addEventListener('click', (event) => {
        const picker = document.getElementById('emoji-picker');
        const emojiButton = document.getElementById('emoji-button');
        const messageInput = document.getElementById('message-input'); // L'input du message

        // Si le clic n'est ni sur le picker, ni sur le bouton emoji, ni sur l'input, on ferme
        if (picker && !picker.contains(event.target) &&
            emojiButton && !emojiButton.contains(event.target) &&
            messageInput && !messageInput.contains(event.target)) {
            picker.classList.add('hidden');
        }
    });

}

