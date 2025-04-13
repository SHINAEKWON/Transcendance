export class Sidebar {
    render(): string {
        return `
        <div class="flex flex-col h-full">
            <!-- Liste d’amis scrollable -->
            <div class="flex-1 pr-1" style="overflow: auto; max-height: 500px">
                <ul class="space-y-4" id="friends-list">
                    ${this.renderFriend("Ahlem", "./public/images/avatar11.png")}
                    ${this.renderFriend("ShinAe", "./public/images/avatar11.png")}
                    ${this.renderFriend("Alex", "./public/images/avatar10.png")}
                    ${this.renderFriend("Bob", "./public/images/avatar10.png")}
                    ${this.renderFriend("Maya", "./public/images/avatar11.png")}
                    ${this.renderFriend("jacque", "./public/images/avatar10.png")}
                    ${this.renderFriend("zed", "./public/images/avatar11.png")}
                </ul>
            </div>

            <!-- Fenêtre de chat stylée neon -->
            <div id="chat-window" class="mt-4 flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-lg shadow-lg overflow-hidden border border-blue-500 h-[300px]">
                <!-- Header -->
                <div class="flex justify-between items-center px-4 py-2 border-b border-blue-700">
                    <h3 id="chat-title" class="text-white text-lg">Chat</h3>
                    <button id="chat-close" class="text-white text-xl hover:text-red-500">×</button>
                </div>

                <!-- Messages -->
                <div id="chat-messages" class="flex-1 overflow-y-auto p-4 space-y-2 flex flex-col">
                    <!-- Messages ici -->
                </div>

                <!-- Barre d'envoi -->
                <div class="border-t border-blue-700 px-3 py-1 bg-gray-900 flex items-center">
                    <input 
                        type="text" 
                        id="chat-input"
                        placeholder="Type a message..."
                        class="flex-1 bg-gray-700 text-white px-3 py-1.5 text-sm rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-[0_0_10px_#3b82f6] transition duration-150"
                    />
                    <button 
                        id="chat-send-btn"
                        class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-sm rounded-r-full shadow-md hover:shadow-blue-500/70 transition duration-200"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
        `;
    }

    renderFriend(name: string, avatarUrl: string): string {
        return `
        <li class="flex items-center bg-gray-700 p-3 rounded-lg justify-between">
            <div class="flex items-center">
                <img src="${avatarUrl}" class="w-12 h-12 rounded-full border border-blue-400 shadow-[0_0_10px_#3b82f6]">
                <p class="ml-4 text-white font-semibold">${name}</p>
            </div>
            <button 
                class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded open-chat shadow-md hover:shadow-blue-400"
                data-user="${name}"
            >
                💬
            </button>
        </li>`;
    }
}