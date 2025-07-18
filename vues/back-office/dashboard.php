<div id="dashboard-main-container" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ">
    <div class="bg-white rounded-lg shadow mb-6 p-4">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Tableau de bord d'administration</h2>
        <div id="admin-content" class="slide-in">
            <div id="admin-dashboard-section" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-blue-600 font-medium">Utilisateurs</p>
                                <h3 id="nb-users-total" class="text-2xl font-bold text-gray-800 mt-1"></h3>
                            </div>
                            <div class="bg-blue-100 p-3 rounded-full">
                                <i class="fas fa-users text-blue-600"></i>
                            </div>
                        </div>
                        <p class="text-sm text-green-600 mt-2">
                            <i class="fas fa-arrow-up mr-1"></i>
                            <span id="nb-users-week"></span> cette semaine
                            <span id="nb-users-pourcent" class="font-semibold"></span>
                        </p>
                    </div>
                    <div class="bg-green-50 p-4 rounded-lg border border-green-100">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-green-600 font-medium">Publications</p>
                                <h3 id="nb-publications-total" class="text-2xl font-bold text-gray-800 mt-1"></h3>
                            </div>
                            <div class="bg-green-100 p-3 rounded-full">
                                <i class="fas fa-file-alt text-green-600"></i>
                            </div>
                        </div>
                        <p class="text-sm text-green-600 mt-2">
                            <i class="fas fa-arrow-up mr-1"></i>
                            <span id="nb-publications-week"></span> cette semaine
                            <span id="nb-publications-pourcent" class="font-semibold"></span>
                        </p>
                    </div>
                    <div class="bg-purple-50 p-4 rounded-lg border border-purple-100">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm text-purple-600 font-medium">Commentaires</p>
                                <h3 id="nb-commentaires-total" class="text-2xl font-bold text-gray-800 mt-1"></h3>
                            </div>
                            <div class="bg-purple-100 p-3 rounded-full">
                                <i class="fas fa-comments text-purple-600"></i>
                            </div>
                        </div>
                        <p class="text-sm text-green-600 mt-2">
                            <i class="fas fa-arrow-up mr-1"></i>
                            <span id="nb-commentaires-week"></span> cette semaine
                        </p>
                    </div>
                    </div>
            </div>

            <div id="admin-users-section" class="hidden">
                <h3 class="text-lg font-semibold mb-4">Gestion des utilisateurs</h3>
                <p class="text-center text-gray-500">Chargement des utilisateurs...</p>
            </div>

            <div id="admin-posts-section" class="hidden">
                <h3 class="text-lg font-semibold mb-4">Gestion des publications</h3>
                <p class="text-center text-gray-500">Chargement des publications...</p>
            </div>
        </div>
    </div>
</div>