<div id="profile-page" class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ">
    <div id="profile-main-container" class="bg-white rounded-lg shadow mb-6">
        <div class="h-48 bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-lg relative">
            <div class="absolute bottom-0 left-0 w-full p-4 flex items-end">
                <div class="relative">
                    <img id="profile-page-pic" src="https://via.placeholder.com/96"
                        alt="Profile"
                        class="h-24 w-24 rounded-full border-4 border-white profile-pic">
                    <button id="change-profile-pic"
                        class="absolute bottom-0 right-0 bg-gray-200 rounded-full p-1 text-gray-600 hover:bg-gray-300"
                        title="Changer la photo de profil">
                        <i class="fas fa-camera"></i>
                    </button>
                </div>
                <div class="ml-4 pb-1">
                    <h1 id="profile-name" class="text-2xl font-bold text-white"></h1>
                    <p id="profile-friends-count" class="text-white text-opacity-90"></p>
                </div>
            </div>
        </div>
        <div class="border-b border-gray-200">
            <div class="px-4 py-3 flex items-center justify-between">
                <div class="flex space-x-4">
                    <button id="profile-nav-publications"
                        class="px-3 py-2 text-blue-600 font-medium border-b-2 border-blue-600">Publications</button>
                    <button id="profile-nav-about"
                        class="px-3 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-md">À
                        propos</button>
                    <button id="profile-nav-friends"
                        class="px-3 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-md">Amis</button>
                </div>
                <div class="flex space-x-2">
                    <button id="edit-profile-btn"
                        class="bg-blue-600 text-white px-4 py-1 rounded-md text-sm hover:bg-blue-700">
                        <i class="fas fa-edit mr-1"></i> Modifier le profil
                    </button>
                    <button id="edit-password-btn"
                        class="bg-blue-600 text-white px-4 py-1 rounded-md text-sm hover:bg-blue-700">
                        <i class="fas fa-key mr-1"></i> Modifier le mot de passe
                    </button>
                </div>
            </div>
        </div>
        <div class="p-4">
            <div id="about-section" class="bg-gray-50 rounded-lg p-4 mb-6">
                <h2 class="text-lg font-semibold text-gray-800 mb-2">À propos</h2>
                <div class="space-y-3" id="about-details">
                    <p class="text-gray-600">Chargement des informations...</p>
                </div>
            </div>

            <div id="user-posts-section">
                <h2 class="text-lg font-semibold text-gray-800 mb-4">Publications</h2>
                <div class="mb-4 flex justify-end">
                    <button id="Npublication" class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 flex items-center">
                        <i class="fas fa-plus mr-2"></i> Nouvelle publication
                    </button>
                </div>
                <div id="user-posts-container">
                    <p class="text-center text-gray-500">Chargement des publications de l'utilisateur...</p>
                    </div>
            </div>

            <div id="form-ajout-article" class="bg-white rounded-lg shadow p-6 mt-4 hidden">
                <h3 class="text-lg font-semibold mb-4">Nouvelle publication</h3>
                <form id="formArticle" enctype="multipart/form-data">
                    <div class="mb-4">
                        <label for="new-post-description" class="block text-gray-700">Description :</label>
                        <textarea name="description" id="new-post-description" rows="4" required class="w-full border rounded px-3 py-2"></textarea>
                    </div>
                    <div class="mb-4">
                        <label for="new-post-image" class="block text-gray-700">Image :</label>
                        <input type="file" name="image" id="new-post-image" accept="image/*" class="w-full">
                    </div>
                    <div class="text-right space-x-2">
                        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Publier</button>
                        <button type="button" id="cancel-new-post-btn" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Annuler</button>
                    </div>
                </form>
            </div>

            <div id="edit-article-modal" class="fixed inset-0 bg-black bg-opacity-30 hidden items-center justify-center z-50">
                <div class="bg-white rounded-lg shadow p-6 w-full max-w-md relative">
                    <button id="close-edit-article-modal" class="absolute top-2 right-2 text-gray-500 hover:text-gray-800">&times;</button>
                    <h3 class="text-lg font-semibold mb-4">Modifier la publication</h3>
                    <form id="formEditArticle" enctype="multipart/form-data">
                        <input type="hidden" name="id" id="edit-article-id">
                        <div class="mb-2">
                            <label for="edit-article-titre" class="block text-gray-700">Titre :</label>
                            <input type="text" name="titre" id="edit-article-titre" class="w-full border rounded px-3 py-1" required>
                        </div>
                        <div class="mb-2">
                            <label for="edit-article-description" class="block text-gray-700">Description :</label>
                            <textarea name="description" id="edit-article-description" class="w-full border rounded px-3 py-1" rows="3" required></textarea>
                        </div>
                        <div class="mb-2">
                            <label for="edit-article-image" class="block text-gray-700">Image :</label>
                            <input type="file" name="image" id="edit-article-image" class="w-full">
                        </div>
                        <div class="text-right space-x-2">
                            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Enregistrer</button>
                            <button type="button" id="cancel-edit-article-btn" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Annuler</button>
                        </div>
                    </form>
                </div>
            </div>
            
            </div>
    </div>
</div>