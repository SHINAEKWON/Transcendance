export class GamePage {
    render(): string {
        return `
            <div class="max-w-5xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
                <h2 class="text-3xl font-gaming text-neon-blue mb-6 animate-glow text-center">Games</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    <!-- Jouer contre une IA -->
                    <div class="game-mode-btn bg-gray-900 p-6 rounded-lg hover:ring-2 hover:ring-neon-purple cursor-pointer flex flex-col items-center" data-page="aiPlay">
                        <img src="/public/images/p_Robo.jpg" class="w-full h-48 object-cover rounded-sm mb-4">
                        <h3 class="text-xl text-neon-green mb-2 text-center">🤖 Play against a Robo</h3>
                        <p class="text-gray-400 text-sm text-center">Face the ultimate AI challenge. Can you defeat the machine?</p>
                    </div>

                    <!-- Jouer en local -->
                    <div class="game-mode-btn bg-gray-900 p-6 rounded-lg hover:ring-2 hover:ring-neon-purple cursor-pointer flex flex-col items-center" data-page="localPlay">
                        <img src="/public/images/p_Locally.jpg" class="w-full h-48 object-cover rounded-sm mb-4">
                        <h3 class="text-xl text-neon-green mb-2 text-center">🎮 Play against a Friend Locally</h3>
                        <p class="text-gray-400 text-sm text-center">Two controllers, one screen. Who will take the crown?</p>
                    </div>

                    <!-- Jouer en ligne -->
                    <div class="game-mode-btn bg-gray-900 p-6 rounded-lg hover:ring-2 hover:ring-neon-purple cursor-pointer flex flex-col items-center" data-page="onlinePlay">
                        <img src="/public/images/p_Online.jpg" class="w-full h-48 object-cover rounded-sm mb-4">
                        <h3 class="text-xl text-neon-green mb-2 text-center">🌐 Play against a Friend Online</h3>
                        <p class="text-gray-400 text-sm text-center">Distance is nothing—battle your friend anywhere, anytime!</p>
                    </div>

                </div>
            </div>
            <script>
                document.addEventListener("DOMContentLoaded", function () {
                    console.log("✅ DOM chargé - Ajout des écouteurs d'événements");
                    
                    document.querySelectorAll(".game-mode-btn").forEach(button => {
                        console.log("🔍 Bouton détecté :", button);

                        button.addEventListener("click", function () {
                            const page = this.getAttribute("data-page");
                            console.log("📌 Clic détecté sur :", page);
                            window.location.hash = page;
                        });
                    });
                });
            </script>
        `;
    }
}
