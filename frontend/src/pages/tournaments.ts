export class TournamentsPage {
    render(): string {
        return `
            <div class="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 class="text-3xl font-gaming text-neon-blue mb-6 animate-glow">Tournaments</h2>
                <div class="space-y-6">
                    <div class="bg-gray-900 p-6 rounded-lg border border-neon-purple flex items-center">
                        <img src="./public/images/local_tournament.jpg" class="w-32 h-32 object-cover rounded-lg mr-4">
                        <div>
                            <h3 class="text-xl text-neon-green mb-2">🏆 Local Tournament</h3>
                            <p class="text-gray-400">Face off with friends, prove your skills, and claim the ultimate bragging rights!</p>
                            <p class="text-sm text-neon-blue mt-2">Starting in 2 days</p>
                        </div>
                        <button class="bg-neon-purple text-white px-6 py-2 rounded-lg hover:bg-opacity-80 ml-auto">
                            Join
                        </button>
                    </div>
                    <div class="bg-gray-900 p-6 rounded-lg border border-neon-purple flex items-center">
                        <img src="./public/images/online_tournament.jpg" class="w-32 h-32 object-cover rounded-lg mr-4">
                        <div>
                            <h3 class="text-xl text-neon-green mb-2">🌍 Online Tournament</h3>
                            <p class="text-gray-400">Compete with the best from around the world—rise to the challenge and make your mark!</p>
                            <p class="text-sm text-neon-blue mt-2">Starting in 5 days</p>
                        </div>
                        <button class="bg-neon-purple text-white px-6 py-2 rounded-lg hover:bg-opacity-80 ml-auto">
                            Join
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}