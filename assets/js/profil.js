import { openModal, closeModal } from './index.js'; 

function getUserSession() {
    const userData = sessionStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
}
function getUserId() {
    const user = getUserSession();
    return user ? user.id : null;
}

// Fonction d'initialisation principale pour le profil
export async function loadProfileData(containerSelector = '#profile-details') {
    const mainContainer = document.querySelector(containerSelector);
    if (!mainContainer) {
        console.error(`Conteneur de profil (${containerSelector}) non trouvé.`);
        return;
    }

    const userId = getUserId(); 
    if (!userId) {
        mainContainer.innerHTML = '<p>Veuillez vous connecter pour voir votre profil.</p>';
        return;
    }

    const btnModifierProfil = document.getElementById('btn-modifier-profil');
    const btnModifierMdp = document.getElementById('btn-modifier-mdp');
    const btnAPropos = document.getElementById('btn-a-propos');

    if (btnModifierProfil) btnModifierProfil.onclick = () => afficherFormulaireProfil(userId);
    if (btnModifierMdp) btnModifierMdp.onclick = () => afficherFormulaireMDP(userId);
    if (btnAPropos) btnAPropos.onclick = () => afficherProfilAvecArticles(userId);

    await afficherProfilAvecArticles(userId);
}


async function afficherProfilAvecArticles(userId) { 
    if (!userId) return; 

    
    let profilPhotoPath; 

    try {
        const res = await fetch(`api/users/profil_utilisateur.php?id=${userId}`); 
        const data = await res.json();

        if (data.statut === 'success') {
            const profil = data.profil;
            const articles = data.articles;

           
            profilPhotoPath = profil.photo ? `/N/api/${profil.photo}` : '/N/api/profil/default.jpg'; // Corrigé pour default.jpg

            let html = `
                <div class="p-4 bg-white shadow rounded-lg">
                    <h3 class="text-xl font-bold text-gray-800 mb-4">Profil de ${profil.nom} ${profil.prenom}</h3>
                    <p class="text-gray-700 mb-2">Email : ${profil.email}</p>
                    <img src="${profilPhotoPath}" alt="Photo de profil" class="w-24 h-24 rounded-full object-cover mb-4">
                    <h4 class="text-lg font-semibold text-gray-800 mb-3">Derniers articles</h4>
                    <ul class="list-disc list-inside text-gray-700">
                        ${articles && articles.length > 0 ? articles.map(a => `<li>${a.description}</li>`).join('') : '<li>Aucun article récent.</li>'}
                    </ul>
                </div>
            `;
            
            const globalModal = document.getElementById('globalModal');
            if (globalModal) {
                openModal(globalModal, html); 
            } else {
                console.error("Modal globale non trouvée pour afficher le profil.");
                document.getElementById('page-content').innerHTML = html;
            }
        } else {
            const globalModal = document.getElementById('globalModal');
            if (globalModal) {
                 openModal(globalModal, `<p style="color: red;">Erreur lors du chargement du profil: ${data.message || 'Inconnu'}</p>`);
            } else {
                console.error("Modal globale non trouvée pour afficher l'erreur de profil.");
                document.getElementById('page-content').innerHTML = `<p style="color: red;">Erreur lors du chargement du profil: ${data.message || 'Inconnu'}</p>`;
            }
        }
    } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
        const globalModal = document.getElementById('globalModal');
        if (globalModal) {
            openModal(globalModal, '<p style="color: red;">Erreur réseau ou du serveur lors du chargement du profil.</p>');
        } else {
            console.error("Modal globale non trouvée pour afficher l'erreur réseau du profil.");
            document.getElementById('page-content').innerHTML = '<p style="color: red;">Erreur réseau ou du serveur lors du chargement du profil.</p>';
        }
    }
}

async function afficherFormulaireProfil(userId) {
    if (!userId) return;

    
    let userPhotoSrc;

    try {
        const res = await fetch(`api/users/profil_utilisateur.php?id=${userId}`);
        const data = await res.json();

        if (data.statut !== 'success' || !data.profil) {
            alert("Impossible de charger les données du profil pour modification.");
            return;
        }
        const currentProfilData = data.profil;

   
        userPhotoSrc = currentProfilData.photo ? `/N/api/${currentProfilData.photo}` : '/N/api/profil/default.jpg'; // Corrigé pour default.jpg

        const html = `
            <form id="form-modif-profil" enctype="multipart/form-data" class="p-4 bg-white shadow rounded-lg">
                <input type="hidden" name="user_id" value="${userId}">
                <div class="mb-4">
                    <label for="nom" class="block text-gray-700 text-sm font-bold mb-2">Nom:</label>
                    <input type="text" id="nom" name="nom" value="${currentProfilData.nom || ''}" placeholder="Nom" class="w-full p-2 border rounded">
                </div>
                <div class="mb-4">
                    <label for="prenom" class="block text-gray-700 text-sm font-bold mb-2">Prénom:</label>
                    <input type="text" id="prenom" name="prenom" value="${currentProfilData.prenom || ''}" placeholder="Prénom" class="w-full p-2 border rounded">
                </div>
                <div class="mb-4">
                    <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                    <input type="email" id="email" name="email" value="${currentProfilData.email || ''}" placeholder="Email" class="w-full p-2 border rounded">
                </div>
                <div class="mb-4">
                    <label for="photo" class="block text-gray-700 text-sm font-bold mb-2">Photo de profil actuelle:</label>
                    <img src="${userPhotoSrc}" alt="Photo de profil actuelle" class="w-16 h-16 rounded-full object-cover mb-2">
                    <input type="file" id="photo" name="photo" class="w-full p-2 border rounded">
                </div>
                <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Enregistrer</button>
            </form>`;
        
        const globalModal = document.getElementById('globalModal');
        if (globalModal) {
            openModal(globalModal, html);
        } else {
            console.error("Modal globale non trouvée pour afficher le formulaire de profil.");
            document.getElementById('page-content').innerHTML = html;
        }

        const form = document.getElementById('form-modif-profil');
        if (form) {
            form.onsubmit = null; 
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                try {
                    const res = await fetch('api/users/update_info.php', {
                        method: 'POST',
                        body: formData
                    });
                    const data = await res.json();
                    alert(data.message);
                    if (data.success) {
                        closeModal();
                        afficherProfilAvecArticles(userId);
                    }
                } catch (error) {
                    console.error("Erreur lors de la mise à jour du profil:", error);
                    alert("Erreur réseau ou du serveur lors de la mise à jour.");
                }
            });
        }
    } catch (error) {
        console.error("Erreur lors du chargement du formulaire de modification de profil:", error);
        alert("Erreur réseau ou du serveur lors du chargement du formulaire.");
    }
}

function afficherFormulaireMDP(userId) {
    if (!userId) return;
    const html = `
        <form id="form-mdp" class="p-4 bg-white shadow rounded-lg">
            <input type="hidden" name="user_id" value="${userId}">
            <div class="mb-4"><input type="email" name="email" placeholder="Votre email" class="w-full p-2 border rounded" required></div>
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Envoyer lien de réinitialisation</button>
        </form>`;
    
    const globalModal = document.getElementById('globalModal');
    if (globalModal) {
        openModal(globalModal, html);
    } else {
        console.error("Modal globale non trouvée pour afficher le formulaire de mot de passe.");
        document.getElementById('page-content').innerHTML = html;
    }

    const form = document.getElementById('form-mdp');
    if (form) {
        form.onsubmit = null; 
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            try {
                const res = await fetch('api/users/update_mot_de_passe.php', {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();
                alert(data.message);
                if (data.success) {
                    closeModal();
                }
            } catch (error) {
                console.error("Erreur lors de l'envoi du lien de réinitialisation:", error);
                alert("Erreur réseau ou du serveur lors de l'envoi du lien.");
            }
        });
    }
}
