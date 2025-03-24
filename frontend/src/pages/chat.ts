export class ChatPage {
    render(): string {
        return `
            <div class="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 class="text-3xl font-gaming text-neon-blue mb-6 animate-glow">Chat</h2>
                <div class="bg-gray-900 p-4 rounded-lg h-96 overflow-y-auto mb-4">
                    <div class="space-y-4">
                        <div class="flex items-start space-x-3">
                            <img src="https://api.dicebear.com/7.x/pixel-art/svg?seed=player1" class="w-8 h-8 rounded-sm">
                            <div class="bg-gray-800 p-3 rounded-lg">
                                <p class="text-sm text-neon-purple">Player1</p>
                                <p>Hey everyone! Ready for the tournament?</p>
                            </div>
                        </div>
                        <div class="flex items-start space-x-3">
                            <img src="https://api.dicebear.com/7.x/pixel-art/svg?seed=player2" class="w-8 h-8 rounded-sm">
                            <div class="bg-gray-800 p-3 rounded-lg">
                                <p class="text-sm text-neon-green">Player2</p>
                                <p>Let's go! 🎮</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex space-x-2">
                    <input type="text" class="flex-1 bg-gray-700 text-white p-2 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-neon-blue" placeholder="Type your message...">
                    <button class="bg-neon-blue text-gray-900 px-4 py-2 rounded-lg hover:bg-opacity-80">Send</button>
                </div>
            </div>
        `;
    }
}