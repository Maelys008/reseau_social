document.addEventListener('DOMContentLoaded', () => {
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
});
