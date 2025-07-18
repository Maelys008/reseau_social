<div id="message-interface" class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ">
    <div class="bg-white rounded-lg shadow h-[calc(100vh-180px)] flex">
        <div class="w-1/3 border-r border-gray-200 flex flex-col">
            <div class="p-4 border-b border-gray-200">
                <h2 class="text-xl font-semibold text-gray-800">Messages</h2>
                <div class="mt-2 relative">
                    <input type="text" id="contact-search-input"
                        class="w-full border border-gray-300 rounded-md px-4 py-2 pl-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Rechercher...">
                    <div
                        class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <i class="fas fa-search"></i>
                    </div>
                </div>
            </div>
            <div class="overflow-y-auto flex-1" id="contact-list">
                <p class="text-center text-gray-500 p-4">Chargement des contacts...</p>
                </div>
        </div>

        <div class="w-2/3 flex flex-col">
            <div class="p-4 border-b border-gray-200 flex items-center justify-between" id="chat-header">
                <div class="flex items-center space-x-3">
                    <img src="" alt="Profile"
                        class="h-10 w-10 rounded-full profile-pic" id="current-chat-profile-pic">
                    <div>
                        <h3 class="font-medium text-gray-800" id="current-chat-name">Sélectionnez un contact</h3>
                    </div>
                </div>
            </div>
            <div class="flex-1 p-4 overflow-y-auto flex flex-col space-y-3" id="chat-messages">
                <p class="text-center text-gray-500">Aucun message pour le moment. Sélectionnez un contact pour commencer à chatter.</p>
                </div>
            <div class="p-4 border-t border-gray-200">
                <div class="flex items-center">
                    <button class="text-gray-500 hover:text-gray-700 p-2"
                        title="Ajouter un fichier">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="text-gray-500 hover:text-gray-700 p-2" id="open-emoji-picker-btn"
                        title="Insérer un emoji">
                        <i class="fas fa-smile"></i>
                    </button>
                    <div class="flex-1 relative">
                        <input type="text" id="message-input"
                            class="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Écrivez un message...">
                        
                        <div id="emoji-picker-container" class="absolute bottom-12 left-0 bg-white p-3 rounded-lg shadow-lg hidden">
                            <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😊</span><span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😀</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😃</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😄</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😁</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😆</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🥹</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😅</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😂</span>
                            <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🤣</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🥲</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">☺</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😊</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😇</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🙂</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🙃</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😉</span>
                            <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😌</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😍</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🥰</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😘</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😗</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😙</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😚</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😋</span>
                            <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😛</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😝</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😜</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🤪</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🤨</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🧐</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🤓</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😎</span>
                            <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🥸</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🤩</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🥳</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🙂‍↕</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😏</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😒</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🙂‍↔</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😞</span>
                            <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😔</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😟</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😕</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🙁</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">☹</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😣</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😖</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😫</span>
                            <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😩</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🥺</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😢</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😭</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😤</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😠</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😡</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🤬</span>
                            <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🤯</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😳</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🥵</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🥶</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😶‍🌫</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😱</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😨</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😰</span>
                            <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😥</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😓</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🤗</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🤔</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🫣</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🤭</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🫢</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🫡</span>
                            <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🤫</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🫠</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🤥</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😶</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🫥</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😐</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🫤</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😑</span>
                            <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🫨</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😬</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🙄</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😯</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😦</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😧</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😮</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😲</span>
                            <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🥱</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🫩</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😴</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🤤</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😪</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😮‍💨</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😵</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😵‍💫</span>
                            <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🤐</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🥴</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🤢</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🤮</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🤧</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😷</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🤒</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🤕</span>
                            <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🤑</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">🤠</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">😈</span> <span class="emoji cursor-pointer hover:bg-gray-100 p-1 rounded">👿</span>
                        </div>
                    </div>
                    <button class="text-gray-500 hover:text-gray-700 p-2"
                        title="Joindre une image">
                        <i class="fas fa-image"></i>
                    </button>
                    <button id="send-message" class="text-blue-500 hover:text-blue-700 p-2"
                        title="Envoyer le message">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>