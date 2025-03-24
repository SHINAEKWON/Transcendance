export class ProfilePage {
    render(): string {
        return `
            <div class="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
                <h2 class="text-3xl font-gaming text-neon-blue mb-6 animate-glow">Profile</h2>
                <div class="space-y-4">
                    <div class="flex items-center space-x-4">
                        <img src="./public/images/profile.jpg" alt="Avatar" class="w-40 h-40 rounded-lg">
                        <div>
                            <h3 class="text-xl text-neon-purple">GamerPro123</h3>
                            <p class="text-gray-400">Level 42</p>
                        </div>
                    </div>
                    <div class="mt-6">
                        <h4 class="text-neon-green mb-2">Stats</h4>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="bg-gray-700 p-4 rounded-sm">
                                <p class="text-sm">Wins</p>
                                <p class="text-2xl text-neon-blue">156</p>
                            </div>
                            <div class="bg-gray-700 p-4 rounded-sm">
                                <p class="text-sm">Tournaments</p>
                                <p class="text-2xl text-neon-purple">23</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
