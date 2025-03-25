export class WelcomePage {
    render(): string {
        return `
            <div class="flex items-center justify-center min-h-screen bg-dark-blue">
                <div class="bg-gray-800 bg-opacity-90 p-8 rounded-2xl shadow-lg text-center w-[90%] max-w-xl space-y-6 custom-position">
                    <h2 class="text-4xl font-gaming text-neon-blue animate-glow">Welcome to Transcendence!</h2>
                    <p class="text-xl text-neon-pink font-semibold">Enjoy the game and have fun!</p>

                    <div>
                        <h4 class="text-neon-green text-lg font-bold mb-2">Get Started</h4>
                        <p class="text-gray-300 text-sm">Play Ping-pong, challenge friends, and become a champion!</p>
                    </div>

                    <div class="flex justify-center gap-6 pt-6 flex-wrap">
                        <!-- Sign Up -->
                        <div class="game-mode-btn w-24 h-24 rounded-full bg-gradient-to-br from-green-300 via-pink-400 to-purple-500 
                            shadow-lg hover:scale-110 hover:ring-4 hover:ring-neon-green transition cursor-pointer 
                            flex items-center justify-center text-center font-bold text-white text-sm" 
                            data-page="signup">
                            Sign Up
                        </div>

                        <!-- Sign In -->
                        <div class="game-mode-btn w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 via-purple-400 to-pink-300 
                            shadow-lg hover:scale-110 hover:ring-4 hover:ring-neon-blue transition cursor-pointer 
                            flex items-center justify-center text-center font-bold text-white text-sm" 
                            data-page="signin">
                            Sign In
                        </div>

                        <!-- Play as Guest -->
                        <div class="game-mode-btn w-24 h-24 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 
                            shadow-lg hover:scale-110 hover:ring-4 hover:ring-white transition cursor-pointer 
                            flex items-center justify-center text-center font-bold text-white text-sm leading-tight" 
                            data-page="guest">
                            Play<br>as Guest
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
