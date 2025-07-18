<!-- Users Page (Admin) -->
<div id="users-page" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div class="bg-white rounded-lg shadow mb-6 p-4">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Utilisateur</h2>

        <div class="mb-4 flex justify-end">
            <button id="Nusers" class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 flex items-center">
                <i class="fas fa-plus mr-2"></i> Nouveau utilisateur
            </button>
        </div>

        <div class="mb-4">
            <div class="relative">
                <input type="text" id="search-user"
                    class="w-full border border-gray-300 rounded-md px-4 py-2 pl-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Rechercher des utilisateurs...">
                <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <i class="fas fa-search"></i>
                </div>
            </div>
        </div>

        <div class="space-y-4" id="user-list">
            <!-- Liste des utilisateurs générée dynamiquement -->
        </div>
    </div>
</div>

