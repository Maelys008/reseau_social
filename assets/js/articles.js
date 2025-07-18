document.addEventListener('DOMContentLoaded', () => {
  chargerArticles();

  async function chargerArticles() {
    const res = await fetch('api/articles/affichageA.php');
    const data = await res.json();
    if (data.statut === 'success') {
      const container = document.getElementById('posts-container');
      container.innerHTML = data.articles.map(article => `
        <div class="article">
          <p>${article.description}</p>
          <img src="${article.image}" width="100">
          <button onclick="modifierArticle(${article.id}, '${article.description}', '${article.image}')">Modifier</button>
          <button onclick="supprimerArticle(${article.id})">Supprimer</button>
        </div>`).join('');
    }
  }

  window.modifierArticle = (id, description, image) => {
    const userId = localStorage.getItem('user_id');
    const html = `
      <form id="form-edit-article" enctype="multipart/form-data">
        <input type="hidden" name="user_id" value="${userId}">
        <input type="hidden" name="article_id" value="${id}">
        <textarea name="description">${description}</textarea>
        <input type="file" name="image">
        <button type="submit">Enregistrer</button>
      </form>`;
    openModal(html);

    document.getElementById('form-edit-article').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const res = await fetch('api/articles/updateA.php', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      alert(data.message);
      chargerArticles();
      document.getElementById('globalModal').style.display = 'none';
    });
  };

  window.supprimerArticle = async (id) => {
    const userId = localStorage.getItem('user_id');
    const userRole = localStorage.getItem('user_role');
    if (!confirm("Supprimer cet article ?")) return;
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('user_role', userRole);
    formData.append('article_id', id);

    const res = await fetch('api/articles/deleteA.php', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    alert(data.message);
    chargerArticles();
  };

  function openModal(content) {
    document.getElementById('modal-body').innerHTML = content;
    document.getElementById('globalModal').style.display = 'block';
  }
});
