// auth.js
const authContainer = document.getElementById('auth-container'); // div qui contient les formulaires de connexion
const btnAdmin = document.getElementById('btn-admin'); // bouton qui appelle le formulaire de l'admin
const btnModerator = document.getElementById('btn-moderator'); // bouton qui appelle le formulaire du modérateur
const btnUser = document.getElementById('btn-user'); // bouton qui appelle le formulaire de l'utilisateur
const adminForm = document.getElementById('admin-login-form'); // formulaire de l'admin
const moderatorForm = document.getElementById('moderator-login-form'); // formulaire du modérateur
const userForm = document.getElementById('user-login-form'); // formulaire de l'utilisateur
const forgotBtn = document.getElementById('forgot-password-link'); // bouton pour mot de passe oublié
const compteBtn = document.getElementById('compte'); // bouton pour register
const createCompte = document.getElementById('createCompte'); // Conteneur du bouton "Créer un compte"

const registerForm = document.getElementById('register-form'); // formulaire d'inscription
const forgotForm = document.getElementById('forgot-password-form'); // mot de passe oublié
const resetContainer = document.querySelector('.reset-container');
const resetBtn = document.getElementById('reset-btn'); // bouton pour réinitialiser le mot de passe dans l'email
const newPassContainer = document.querySelector('.container'); // Probablement pas utilisé directement ici
const backToLoginBtn = document.getElementById('back-to-login-btn'); // bouton retour à la connexion sur le formulaire demande de reset
const retour = document.getElementById('retour'); // bouton retour à la connexion sur le formulaire de nouveau mot de passe (à vérifier si utilisé)
const retour2 = document.getElementById('show-login-btn'); // bouton retour à la connexion sur le formulaire de register
const passwordform = document.getElementById('password-form'); // formulaire de nouveau mot de passe (à vérifier si utilisé)
const mainApp = document.getElementById('main-app'); // le main de l'app
const authentification = document.getElementById('app');

// Masquer/afficher formulaires selon rôle
btnAdmin?.addEventListener('click', function (e) { // Ajout du ?. pour sécurité
    e.preventDefault();
    adminForm.hidden = false;
    userForm.hidden = true;
    moderatorForm.hidden = true;
    btnAdmin.hidden = true;
    btnModerator.hidden = false;
    btnUser.hidden = false;
    if (createCompte) createCompte.style.display = 'none';
    if (registerForm) registerForm.hidden = true; // S'assurer que le formulaire d'inscription est caché
    if (forgotForm) forgotForm.hidden = true; // S'assurer que le formulaire de mot de passe oublié est caché
    if (authContainer) authContainer.style.display = 'block'; // Réafficher le conteneur principal d'authentification
});
btnModerator?.addEventListener('click', function (e) {
    e.preventDefault();
    moderatorForm.hidden = false;
    userForm.hidden = true;
    adminForm.hidden = true;
    btnModerator.hidden = true;
    btnUser.hidden = false;
    btnAdmin.hidden = false;
    if (createCompte) createCompte.style.display = 'none';
    if (registerForm) registerForm.hidden = true;
    if (forgotForm) forgotForm.hidden = true;
    if (authContainer) authContainer.style.display = 'block';
});

btnUser?.addEventListener('click', function (e) {
    e.preventDefault();
    userForm.hidden = false;
    adminForm.hidden = true;
    moderatorForm.hidden = true;
    btnUser.hidden = true;
    btnAdmin.hidden = false;
    btnModerator.hidden = false;
    if (createCompte) createCompte.style.display = 'block';
    if (registerForm) registerForm.hidden = true;
    if (forgotForm) forgotForm.hidden = true;
    if (authContainer) authContainer.style.display = 'block';
});

// Gestion du bouton "Créer un compte"
compteBtn?.addEventListener('click', function (e) {
    e.preventDefault();
    registerForm.hidden = false;
    authContainer.style.display = 'none';
});

// Gestion du bouton "Mot de passe oublié"
forgotBtn?.addEventListener('click', function (e) {
    e.preventDefault();
    userForm.hidden = true;
    forgotForm.hidden = false;
    authContainer.hidden = true;
});

// Bouton retour depuis mot de passe oublié
backToLoginBtn?.addEventListener('click', function (e) {
    e.preventDefault();
    forgotForm.hidden = true;
    authContainer.hidden = false;
    userForm.hidden = false;
});

// Bouton retour depuis inscription
retour2?.addEventListener('click', function (e) {
    e.preventDefault();
    registerForm.hidden = true;
    authContainer.style.display = 'block';
    userForm.hidden = false;
});

// Soumission formulaire admin
adminForm?.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;

    fetch('/N/api/auth/auth.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: 'admin' })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // Assurez-vous que data.user contient le rôle ou le gérez dans index.js
                sessionStorage.setItem('user', JSON.stringify({ ...data.user, role: 'admin' })); // Assurez-vous d'avoir le rôle dans l'objet user

                document.dispatchEvent(new CustomEvent('auth:loggedIn', {
                    detail: {
                        user: data.user,
                        role: 'admin' // Ici, vous pouvez passer le rôle explicitement
                    }
                }));
            } else {
                document.getElementById('div_error').textContent = data.message;
            }
        })
        .catch(() => {
            document.getElementById('div_error').textContent = 'Erreur réseau';
        });
});

// Soumission formulaire moderateur
moderatorForm?.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('moderator-email').value;
    const password = document.getElementById('moderator-password').value;

    fetch('/N/api/auth/auth.php', { // Chemin corrigé pour l'API
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: 'moderator' })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                sessionStorage.setItem('user', JSON.stringify({ ...data.user, role: 'moderator' }));

                document.dispatchEvent(new CustomEvent('auth:loggedIn', {
                    detail: {
                        user: data.user,
                        role: 'moderator'
                    }
                }));
            } else {
                document.getElementById('div_error').textContent = data.message;
            }
        })
        .catch(() => {
            document.getElementById('div_error').textContent = 'Erreur réseau';
        });
});

// Soumission formulaire utilisateur
userForm?.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('user-email').value;
    const password = document.getElementById('user-password').value;

    fetch('/N/api/auth/auth.php', { // Chemin corrigé pour l'API
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: 'user' })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                sessionStorage.setItem('user', JSON.stringify({ ...data.user, role: 'user' }));

                document.dispatchEvent(new CustomEvent('auth:loggedIn', {
                    detail: {
                        user: data.user,
                        role: 'user'
                    }
                }));
            } else {
                document.getElementById('div_error_user').textContent = data.message;
            }
        })
        .catch(() => {
            document.getElementById('div_error_user').textContent = 'Erreur réseau';
        });
});

// Soumission formulaire inscription
document.addEventListener('submit', async (e) => {
    if (e.target.id === 'register-form-element') { // Assurez-vous que c'est bien l'ID de votre formulaire d'inscription
        e.preventDefault();

        const nom = document.querySelector("#nom");
        const prenom = document.querySelector("#prenom");
        const email = document.querySelector("#email");
        const mot_de_passe = document.querySelector("#mot_de_passe");
        const password_confirm = document.querySelector("#password_confirm");
        const div_erreur = document.querySelector("#div_erreur");
        const span = div_erreur?.querySelector("span");

        const infoNom = nom.nextElementSibling;
        const infoPrenom = prenom.nextElementSibling;
        const infoEmail = email.nextElementSibling;

        let valid = true;
        if (div_erreur) div_erreur.classList.add('hidden');
        if (span) span.textContent = "";

        // Réinitialiser les messages d'erreur des champs
        infoNom.textContent = "";
        infoPrenom.textContent = "";
        infoEmail.textContent = "";

        if (mot_de_passe.value !== password_confirm.value) {
            if (span) span.textContent = "Mot de passe incorrect. Réessayez.";
            div_erreur?.classList.remove('hidden');
            valid = false;
        }

        if (/\d/.test(nom.value)) {
            infoNom.textContent = "Le nom ne doit pas contenir de chiffre";
            valid = false;
        }

        if (/\d/.test(prenom.value)) {
            infoPrenom.textContent = "Le prénom ne doit pas contenir de chiffre";
            valid = false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
            infoEmail.textContent = "Adresse email invalide";
            valid = false;
        }

        if (!valid) return;

        const formData = new FormData();
        formData.append('prenom', prenom.value.trim());
        formData.append('nom', nom.value.trim());
        formData.append('email', email.value.trim());
        formData.append('mot_de_passe', mot_de_passe.value);
        formData.append('origine', 'user');

        const photoInput = document.getElementById('photo');
        if (photoInput?.files.length > 0) {
            formData.append('image', photoInput.files[0]);
        }

        try {
            const response = await fetch('/N/api/auth/register.php', { 
                method: 'POST',
                body: formData
            });
            const data = await response.json();

            if (data.success) {
                alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
                registerForm.hidden = true;
                userForm.hidden = false;
                if (authContainer) authContainer.style.display = 'block'; // Réafficher le conteneur principal d'authentification
                // Vider les champs du formulaire après une inscription réussie
                nom.value = '';
                prenom.value = '';
                email.value = '';
                mot_de_passe.value = '';
                password_confirm.value = '';
                if (photoInput) photoInput.value = ''; // Réinitialiser le champ de fichier
            } else {
                if (span) span.textContent = data.message || 'Erreur lors de l\'inscription.';
                div_erreur?.classList.remove('hidden');
            }
        } catch (error) {
            console.error('Erreur lors de l\'inscription :', error);
            if (span) span.textContent = "Erreur serveur. Veuillez réessayer.";
            div_erreur?.classList.remove('hidden');
        }
    }
});

// Écoute de l'événement de déconnexion de l'application
document.addEventListener('app:logout', () => {
    authentification.style.display = 'block'; // Affiche la vue d'authentification
    mainApp.hidden = true; // Cache l'application principale
    // Réinitialiser l'état des formulaires et des boutons d'authentification
    userForm.hidden = false; // Afficher le formulaire utilisateur par défaut
    adminForm.hidden = true;
    moderatorForm.hidden = true;
    btnUser.hidden = true; // Cacher le bouton utilisateur car son formulaire est visible
    btnAdmin.hidden = false;
    btnModerator.hidden = false;
    if (createCompte) createCompte.style.display = 'block'; // Afficher le bouton "Créer un compte"
});