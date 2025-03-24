export class LocalPlayPage {
    render(): string {
        return `
            <div class="max-w-5xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg text-center">
                <h1 class="text-3xl text-neon-blue text-center mb-6">Local Duel Mode</h1>
                <p class="text-gray-400 text-center mb-4">Enter player names and get ready to play!</p>
                
                <div class="flex justify-between items-center max-w-3xl mx-auto mb-6">
                    <!-- Joueur 1 -->
                    <div class="w-1/3 text-center">
                        <img src="/public/images/player1_avatar.png" alt="Player 1 Avatar" class="w-32 h-32 mx-auto rounded-full border-4 border-neon-green">
                        <label class="block text-neon-green mt-2 mb-2" for="player1">Player 1</label>
                        <input id="player1" type="text" placeholder="Enter name..." class="w-full p-2 rounded-sm bg-gray-700 text-white text-center">
                    </div>

                    <span class="text-gray-400 text-xl font-bold">VS</span>

                    <!-- Joueur 2 -->
                    <div class="w-1/3 text-center">
                        <img src="/public/images/player2_avatar.png" alt="Player 2 Avatar" class="w-32 h-32 mx-auto rounded-full border-4 border-neon-purple">
                        <label class="block text-neon-purple mt-2 mb-2" for="player2">Player 2</label>
                        <input id="player2" type="text" placeholder="Enter name..." class="w-full p-2 rounded-sm bg-gray-700 text-white text-center">
                    </div>
                </div>

                <!-- Boutons -->
                <div class="flex justify-center gap-6">
                    <button id="start-game" class="bg-neon-green text-gray-900 px-6 py-3 rounded-lg text-lg font-bold hover:bg-green-400 transition">
                        🎮 Play
                    </button>
                    <a href="#game" class="bg-neon-purple text-gray-900 px-6 py-3 rounded-lg text-lg font-bold hover:bg-purple-400 transition">
                        ⬅ Back
                    </a>
                </div>
            </div>
        `;
    }

    attachEvents(): void {
        setTimeout(() => {
            const playButton = document.getElementById("start-game");

            if (playButton) {
                console.log("✅ Bouton Play détecté !");
                
                playButton.addEventListener("click", () => {
                    console.log("🎮 Bouton Play cliqué !");
                    
                    const player1 = (document.getElementById("player1") as HTMLInputElement).value || "Player 1";
                    const player2 = (document.getElementById("player2") as HTMLInputElement).value || "Player 2";

                    console.log(`🚀 Redirection vers #game avec: ${player1} vs ${player2}`);

                    // ✅ Mettre à jour l'URL pour router.ts
                    window.location.hash = `#gameboard?player1=${encodeURIComponent(player1)}&player2=${encodeURIComponent(player2)}`;
                });
            } else {
                console.error("❌ Erreur: Bouton Play non trouvé !");
            }
        }, 100);
    }
}

