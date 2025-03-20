export class WelcomePage {
    render(): string {
        return `
            <div class="flex items-start justify-center min-h-screen pt-20">
                <div class="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg text-center">
                    <h2 class="text-3xl font-gaming text-neon-blue mb-6 animate-glow">Welcome to Transcendence!</h2>
                    <p class="text-lg text-neon-purple">Enjoy the game and have fun!</p>
                    <div class="mt-6">
                        <h4 class="text-neon-green mb-2">Get Started</h4>
                        <p class="text-gray-400">Play Ping-pong, challenge friends, and become a champion!</p>
                    </div>
                </div>
            </div>
        `;
    }
}
