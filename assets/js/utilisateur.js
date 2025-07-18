// assets/js/utilisateur.js

// Fonctions utilitaires pour l'utilisateur
function getUserSession() {
    const userData = sessionStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
}

function getUserRole() {
    const user = getUserSession();
    return user ? user.role : null;
}

// Fonction pour configurer les événements du formulaire d'inscription admin
// Cette fonction sera appelée APRÈS que le HTML de registerA.php soit chargé
function setupAdminRegisterFormEvents() {
    const regForm = document.getElementById('admin-register-form');
    const annulerBtn = document.getElementById('annuler');

    const getInput = id => document.getElementById(id);
    const setError = (id, message) => {
        const errorElement = getInput(id + '-error');
        if (errorElement) errorElement.textContent = message;
    };
    const clearErrors = () => ['prenom', 'nom', 'email', 'mot_de_passe', 'role'].forEach(id => setError(id, ''));

    // Fonction pour recharger la page des utilisateurs (remplace showUserPage)
    const refreshUserList = () => {
        // Appelle directement la fonction loadUsers de ce même module
        loadUsers();
    };

    // 🔸 Bouton Annuler
    annulerBtn?.addEventListener('click', e => {
        e.preventDefault();
        refreshUserList(); // Affiche la page des utilisateurs sans enregistrer
    });

    // 🔸 Soumission du formulaire
    regForm?.addEventListener('submit', async e => {
        e.preventDefault();
        clearErrors();
        const divError = document.getElementById('div_error');
        if (divError) divError.textContent = ''; // Nettoyer l'erreur globale

        const prenom = getInput('prenom')?.value.trim();
        const nom = getInput('nom')?.value.trim();
        const email = getInput('email')?.value.trim();
        const mot_de_passe = getInput('mot_de_passe')?.value;
        const role = getInput('role')?.value;
        const photoInput = getInput('photo');
        const photo = photoInput ? photoInput.files[0] : null;

        let hasError = false;

        if (!prenom) { setError('prenom', 'Veuillez saisir votre prénom.'); hasError = true; }
        if (!nom) { setError('nom', 'Veuillez saisir votre nom.'); hasError = true; }
        if (!email) {
            setError('email', 'Veuillez saisir votre email.');
            hasError = true;
        } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
            setError('email', 'Format d\'email invalide.');
            hasError = true;
        }
        if (!mot_de_passe) {
            setError('mot_de_passe', 'Veuillez saisir un mot de passe.');
            hasError = true;
        } else if (mot_de_passe.length < 6) {
            setError('mot_de_passe', 'Le mot de passe doit contenir au moins 6 caractères.');
            hasError = true;
        }
        if (!role) {
            setError('role', 'Veuillez choisir un statut.');
            hasError = true;
        }
        if (hasError) return;

        const formData = new FormData();
        formData.append('prenom', prenom);
        formData.append('nom', nom);
        formData.append('email', email);
        formData.append('mot_de_passe', mot_de_passe);
        formData.append('role', role);
        formData.append('origine', 'admin'); // Indique que l'inscription vient de l'admin
        if (photo) formData.append('image', photo);

        try {
            // Chemin corrigé pour l'API register.php
            const res = await fetch('/N/api/auth/register.php', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (data.success) {
                alert("Utilisateur enregistré avec succès !"); // Utilisation de alert pour l'instant
                refreshUserList(); // Recharge la page des utilisateurs après l'ajout
            } else {
                if (data.errors) {
                    if (data.errors.prenom) setError('prenom', data.errors.prenom);
                    if (data.errors.nom) setError('nom', data.errors.nom);
                    if (data.errors.email) setError('email', data.errors.email);
                    if (data.errors.mot_de_passe) setError('mot_de_passe', data.errors.mot_de_passe);
                    if (data.errors.role) setError('role', data.errors.role);
                }
                if (divError) divError.textContent = data.message || 'Erreur lors de l\'inscription.';
            }
        } catch (err) {
            if (divError) divError.textContent = "Erreur serveur. Veuillez réessayer.";
            console.error("Erreur lors de la soumission du formulaire d'inscription admin:", err);
        }
    });
}


// Fonction principale pour charger la liste des utilisateurs
export async function loadUsers() {
    const currentUserRole = getUserRole();
    const newButton = document.getElementById('Nusers');
    const userListContainer = document.getElementById('user-list');

    if (!userListContainer) {
        console.error("L'élément #user-list n'a pas été trouvé. La page des utilisateurs n'est peut-être pas chargée.");
        return;
    }
    userListContainer.innerHTML = ''; // Nettoyer le contenu existant

    if (newButton) { // S'assurer que le bouton existe avant d'y accéder
        if (currentUserRole !== 'admin') {
            newButton.hidden = true;
        } else {
            newButton.hidden = false; // Assurez-vous qu'il est visible pour l'admin
        }

        newButton.addEventListener('click', () => {
            // Ici, vous chargez le formulaire d'ajout d'utilisateur dans page-content
            fetch('/N/vues/back-office/registerA.php') // Chemin corrigé
                .then(res => res.text())
                .then(html => {
                    document.getElementById('page-content').innerHTML = html;
                    
                    setupAdminRegisterFormEvents();
                })
                .catch(err => console.error("Erreur lors du chargement du formulaire d'ajout :", err));
        });
    }

    try {
        const res = await fetch("/N/api/users/affichageU.php", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                role: currentUserRole
            })
        });
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();

        if (data.statut !== 'success') {
            console.error("Erreur : ", data.message);
            userListContainer.innerHTML = `<p class="text-red-500">Erreur lors du chargement des utilisateurs: ${data.message}</p>`;
            return;
        }

        if (data.users.length === 0) {
            userListContainer.innerHTML = '<p class="text-gray-500">Aucun utilisateur trouvé.</p>';
            return;
        }

        data.users.forEach(user => {
            const userCard = document.createElement("div");
            userCard.classList.add('flex', 'items-center', 'justify-between', 'p-3', 'bg-gray-50', 'rounded-lg', 'user-card');

            // Chemin de l'image de profil par défaut corrigé
            const userPhotoSrc = user.photo ? `/N/${user.photo}` : '/N/assets/images/default_profile.png';

            userCard.innerHTML = `
                <div class="flex items-center space-x-3">
                    <img src="${userPhotoSrc}" alt="Profile"
                    class="h-12 w-12 rounded-full profile-pic object-cover">
                    <div>
                        <h4 class="font-medium text-gray-800">${user.nom || ''} ${user.prenom || ''}</h4>
                        <p class="text-sm text-gray-500">${user.email || ''}</p>
                        <p class="text-xs text-gray-400">Rôle: ${user.role || 'Non défini'}</p>
                    </div>
                </div>
                <div class="flex space-x-2">
                    ${(currentUserRole === 'admin' || (currentUserRole === 'moderator' && user.role === 'user')) ? `
                        <button
                            class="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 supp"
                            data-id="${user.id}"
                            title="Supprimer l'utilisateur">
                            <i class="fas fa-trash mr-1"></i> Supprimer
                        </button>
                    ` : ''}
                </div>
            `;

            // Ajout de l'événement de suppression
            const deleteButton = userCard.querySelector('.supp');
            if (deleteButton) {
                deleteButton.addEventListener('click', function() {
                    const userId = this.dataset.id;
                    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
                        return;
                    }

                    fetch(`/N/api/users/deleteU.php?id=${userId}`)
                        .then(res => res.json())
                        .then(data => {
                            if (data.success) {
                                userCard.remove();
                                alert("Utilisateur supprimé !");
                            } else {
                                alert(data.message || "Erreur lors de la suppression");
                                console.error(data.message || "Erreur lors de la suppression");
                            }
                        })
                        .catch(err => {
                            console.error("Erreur réseau lors de la suppression :", err);
                            alert("Erreur réseau lors de la suppression de l'utilisateur.");
                        });
                });
            }
            userListContainer.appendChild(userCard);
        });
    } catch (error) {
        console.error("Erreur réseau lors du chargement des utilisateurs :", error);
        userListContainer.innerHTML = '<p class="text-red-500">Erreur lors du chargement des utilisateurs.</p>';
    }
}
