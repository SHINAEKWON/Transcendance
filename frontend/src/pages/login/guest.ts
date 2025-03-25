export class GuestPage {
    render(): string {
        return `
            <div class="flex items-center justify-center min-h-screen bg-dark-blue">
                <div class="bg-gray-800 bg-opacity-90 p-10 rounded-2xl shadow-lg w-full max-w-3xl text-center space-y-8">
                    <h2 class="text-4xl font-gaming text-neon-blue animate-glow">Play as Guest</h2>
                    <p class="text-neon-purple text-xl">Choose a nickname and your fighter style</p>

                    <!-- Pseudo Input -->
                    <div>
                        <label for="guestName" class="block text-neon-green mb-3 text-lg">Enter your nickname:</label>
                        <input type="text" id="guestName" name="guestName" required
                            class="w-full px-5 py-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-neon-green text-lg" />
                    </div>

                    <!-- Avatar Selection -->
                    <div class="space-y-4">
                        <p class="text-neon-blue text-xl">Choose your avatar:</p>
                        <div class="flex justify-center gap-10 flex-wrap">
                            <label class="cursor-pointer transform hover:scale-110 transition">
                                <input type="radio" name="avatar" value="avatar1" class="hidden" checked />
                                <img src="./public/images/avatar1.png" alt="Avatar 1" class="w-32 h-32 rounded-full border-4 border-transparent hover:border-neon-green transition" />
                            </label>
                            <label class="cursor-pointer transform hover:scale-110 transition">
                                <input type="radio" name="avatar" value="avatar2" class="hidden" />
                                <img src="./public/images/avatar2.png" alt="Avatar 2" class="w-32 h-32 rounded-full border-4 border-transparent hover:border-neon-blue transition" />
                            </label>
                            <label class="cursor-pointer transform hover:scale-110 transition">
                                <input type="radio" name="avatar" value="avatar3" class="hidden" />
                                <img src="./public/images/avatar3.png" alt="Avatar 3" class="w-32 h-32 rounded-full border-4 border-transparent hover:border-neon-purple transition" />
                            </label>
                        </div>
                    </div>

                    <!-- Play Button -->
                    <button id="guest-play-btn"
                        class="mt-6 w-full py-4 bg-neon-purple hover:bg-neon-green transition text-white font-bold rounded-lg shadow text-lg tracking-wide">
                        Let's Play!
                    </button>
                </div>
            </div>
        `;
    }
}
