<!-- Formulaire d'ajout d'un utilisateur par l'administrateur -->
<div class="container">
  <div class="row justify-content-center">
    <div class="col-md-6 col-lg-5">
      <div class="card p-4 mt-5">
        <h4 class="mb-3 text-center">Créer un compte</h4>
        <form id="admin-register-form" autocomplete="off">
          <div class="mb-3">
            <label for="prenom" class="form-label">Prénom</label>
            <input type="text" id="prenom" class="form-control rounded-pill" required>
            <div id="prenom-error" class="text-danger small mt-1"></div>
          </div>
          <div class="mb-3">
            <label for="nom" class="form-label">Nom</label>
            <input type="text" id="nom" class="form-control rounded-pill" required>
            <div id="nom-error" class="text-danger small mt-1"></div>
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" id="email" class="form-control rounded-pill" required>
            <div id="email-error" class="text-danger small mt-1"></div>
          </div>
          <div class="mb-3">
            <label for="mot_de_passe" class="form-label">Mot de passe</label>
            <input type="password" id="mot_de_passe" class="form-control rounded-pill" required>
            <div id="mot_de_passe-error" class="text-danger small mt-1"></div>
          </div>
          <div class="mb-3">
            <label for="role" class="form-label">Statut</label>
            <select id="role" class="form-control rounded-pill" required>
              <option value="user">Utilisateur</option>
              <option value="moderator">Modérateur</option>
              <option value="admin">Administrateur</option>
            </select>
            <div id="role-error" class="text-danger small mt-1"></div>
          </div>
          <div>
            <label for="photo" class="form-label">Photo de profil (optionnelle)</label>
            <input type="file" id="photo" accept="image/*" class="form-control rounded-pill" />
          </div>
          <div id="div_error" class="text-danger text-center small mb-2"></div>
          <div class="d-grid mb-2">
            <button type="submit" class="btn btn-primary rounded-pill fw-bold">Créer le compte</button>
          </div>
        </form>
        <div class="text-center mt-3">
          <button id="annuler" class="btn btn-outline-primary rounded-pill">Annuler</button>
        </div>
      </div>
    </div>
  </div>
</div>



<script>
    const regForm = document.getElementById('admin-register-form');
  const annulerBtn = document.getElementById('annuler');

  const getInput = id => document.getElementById(id);
  const setError = (id, message) => getInput(id + '-error').textContent = message;
  const clearErrors = () => ['prenom', 'nom', 'email', 'mot_de_passe', 'role'].forEach(id => setError(id, ''));

  const showUserPage = () => {
    fetch('vues/back-office/utilisateur.php')
      .then(res => res.text())
      .then(html => {
        const content = document.getElementById('page-content');
        if (content) content.innerHTML = html;
      });
  };

  // 🔸 Bouton Annuler
  annulerBtn?.addEventListener('click', e => {
    e.preventDefault();
    showUserPage(); // Affiche utilisateur.php sans enregistrer
  });

  // 🔸 Soumission du formulaire
  regForm?.addEventListener('submit', async e => {
    e.preventDefault();
    clearErrors();
    document.getElementById('div_error').textContent = '';

    const prenom = getInput('prenom').value.trim();
    const nom = getInput('nom').value.trim();
    const email = getInput('email').value.trim();
    const mot_de_passe = getInput('mot_de_passe').value;
    const role = getInput('role').value;
    const photo = getInput('photo').files[0];

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
    formData.append('origine', 'admin');
    if (photo) formData.append('image', photo);

    try {
      const res = await fetch('/N/api/auth/register.php', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        showUserPage(); // Recharge page utilisateurs après ajout
      } else {
        if (data.errors) {
          if (data.errors.prenom) setError('prenom', data.errors.prenom);
          if (data.errors.nom) setError('nom', data.errors.nom);
          if (data.errors.email) setError('email', data.errors.email);
          if (data.errors.mot_de_passe) setError('mot_de_passe', data.errors.mot_de_passe);
          if (data.errors.role) setError('role', data.errors.role);
        }
        document.getElementById('div_error').textContent = data.message || 'Erreur lors de l\'inscription.';
      }
    } catch (err) {
      document.getElementById('div_error').textContent = "Erreur serveur. Veuillez réessayer.";
    }
  });
</script>
</body>
</html>