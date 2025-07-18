// assets/js/chat.js

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

// 📋 Charger les conversations existantes
export async function loadConversations(containerSelector = '#contact-list') {
  const container = document.querySelector(containerSelector);
  const user_id = getUserId();
  if (!user_id) return;

  const res = await fetch(`/N/api/messages/liste_conversation.php?user_id=${user_id}`);
  const data = await res.json();
  const users = data.conversations || [];

  container.innerHTML = '';
  users.forEach(user => {
    const div = document.createElement('div');
    div.className = 'contact-item p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100';
    div.innerHTML = `
      <div class="flex items-center space-x-3">
        <img src="${user.photo || ''}" alt="Profile" class="h-10 w-10 rounded-full">
        <div>
          <h3 class="font-medium text-gray-800">${user.nom} ${user.prenom}</h3>
          <p class="text-sm text-gray-500">${user.last_message || ''}</p>
        </div>
      </div>
    `;
    div.onclick = () => openConversation(user.id);
    container.appendChild(div);
  });
}

// 🔍 Rechercher un utilisateur
export async function searchUtilisateurs(query, containerSelector = '#contact-list') {
  const container = document.querySelector(containerSelector);
  const user_id = getUserId();
  const res = await fetch(`/N/api/messages/liste_conversation.php?/user_id=${user_id}&q=${encodeURIComponent(query)}`);
  const data = await res.json();
  const users = data.utilisateurs || [];

  container.innerHTML = '';
  users.forEach(user => {
    const div = document.createElement('div');
    div.className = 'contact-item p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100';
    div.innerText = `${user.nom} ${user.prenom}`;
    div.onclick = () => openConversation(user.id);
    container.appendChild(div);
  });
}

// 💬 Ouvrir une conversation
async function openConversation(receiver_id) {
  currentChatUserId = receiver_id;
  clearInterval(intervalId);
  await loadMessages('#chat-messages', receiver_id);
  intervalId = setInterval(() => loadMessages('#chat-messages', receiver_id), 3000);
}

// 📨 Charger les messages
async function loadMessages(containerSelector, receiver_id) {
  const container = document.querySelector(containerSelector);
  const user_id = getUserId();

  const res = await fetch(`/N/api/messages/message_entre_utilisateur.php?user_id=${user_id}&utilisateur_id=${receiver_id}`);
  const data = await res.json();
  const messages = data.messages || [];

  container.innerHTML = '';
  messages.forEach(msg => {
    const div = renderMessage(msg, user_id);
    container.appendChild(div);
  });

  container.scrollTop = container.scrollHeight;
}

// 🧱 Rendu d'un message
function renderMessage(msg, currentUserId) {
  const div = document.createElement('div');
  div.className = 'flex items-end ' + (msg.sender_id == currentUserId ? 'justify-end' : '');

  const bubble = document.createElement('div');
  bubble.className = msg.sender_id == currentUserId ? 'chat-message chat-message-mine p-3' : 'chat-message chat-message-other p-3';

  if (msg.image) {
    const img = document.createElement('img');
    img.src = msg.image;
    img.className = 'max-w-xs rounded';
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
  if (!receiver_id || (!contenu.trim() && !imageFile)) return;

  const formData = new FormData();
  formData.append('user_id', user_id);
  formData.append('receiver_id', receiver_id);
  formData.append('message', contenu);
  if (imageFile) formData.append('image', imageFile);

  const res = await fetch('/N/api/messages/envoyer_message.php', {
    method: 'POST',
    body: formData
  });

  const result = await res.json();
  if (result.statut === 'success') {
    await loadMessages('#chat-messages', receiver_id);
    document.getElementById('message-input').value = '';
  }
}

// 😎 Gestion des stickers/emoji
function toggleEmojiPicker() {
  const picker = document.getElementById('emoji-picker');
  picker.classList.toggle('hidden');
}

function setupEmojiPicker() {
  const emojis = document.querySelectorAll('#emoji-picker .emoji');
  const input = document.getElementById('message-input');

  emojis.forEach(emoji => {
    emoji.classList.remove('hidden'); // rendre visibles tous les emojis
    emoji.addEventListener('click', () => {
      input.value += emoji.textContent;
      toggleEmojiPicker(); // Fermer le picker après sélection
    });
  });
}


  loadConversations();
  setupEmojiPicker();

  // Recherche
  const searchInput = document.querySelector('#contact-list').previousElementSibling.querySelector('input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchUtilisateurs(e.target.value);
    });
  }

  // Emoji button
  document.getElementById('emoji-button')?.addEventListener('click', toggleEmojiPicker);

  // Envoi message
  document.getElementById('send-message')?.addEventListener('click', () => {
    const content = document.getElementById('message-input').value;
    envoyerMessage(content);
  });


// Fermer le picker lorsque l'utilisateur clique en dehors
document.addEventListener('click', (event) => {
  if (!event.target.closest('#emoji-picker')) {
    toggleEmojiPicker();
  }
});