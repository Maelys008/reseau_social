<div id="posts-container" class="my-6">
    <p class="text-center text-gray-500">Chargement des publications...</p>
</div>
    <!-- Sample Post -->
    <div class="bg-white rounded-lg shadow mb-6 post-item">
        <div class="p-4">
            <div class="flex items-center space-x-3">
                <img src="" alt="Profile"
                    class="h-10 w-10 rounded-full profile-pic">
                <div>
                    <h3 class="text-sm font-semibold text-gray-800"><!--nom et prenom de l'auteur du post--></h3>
                    <p class="text-xs text-gray-500"><!--poster depuis ...--></p>
                </div>
            </div>
            <div class="mt-3">
                <p class="text-gray-800"><!-- Contenu du post--></p>
            </div>
            <div class="mt-3">
                <img src="" alt="Post image"
                    class="rounded-lg w-full post-image">
            </div>
            <div class="mt-3 flex items-center justify-between text-gray-500 text-sm">
                <div>
                    <span><!--nombre de commentaires relatif au post--></span>
                </div>
            </div>
        </div>
        <div class="border-t border-gray-100 px-4 py-3 flex justify-around">
            <button
                class="flex items-center text-gray-500 hover:bg-gray-100 px-3 py-1 rounded-md like-button">
                <i class="far fa-thumbs-up mr-2"></i>
                <span></span>
            </button>
            <button
                class="flex items-center text-gray-500 hover:bg-gray-100 px-3 py-1 rounded-md comment-button">
                <i class="far fa-comment-alt mr-2"></i>
                <span>Commenter</span>
            </button>
        </div>
        <div class="comments-section px-4 py-2 bg-gray-50 rounded-b-lg hidden">
            <div class="comments-list">
                <div class="flex items-start space-x-2 mb-3">
                    <img src="" alt="Profile"
                        class="h-8 w-8 rounded-full profile-pic">
                    <div class="bg-white rounded-2xl px-3 py-2 flex-1">
                        <h4 class="text-xs font-semibold text-gray-800"><!--nom et prenom de l'auteur du commentaire--></h4>
                        <p class="text-sm text-gray-800"><!--contenu du commentaire--></p>
                        <div class="flex items-center mt-1 text-xs text-gray-500">
                            <button class="font-semibold mr-2 hover:underline">J'aime</button>
                            <span class="ml-2">Il y a <!--date du commentaire--></span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</div>