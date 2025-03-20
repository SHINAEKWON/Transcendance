export class Sidebar {
    render(): string {
        return `
        
        <ul class="space-y-4">
            <li class="flex items-center bg-gray-700 p-3 rounded-lg">
                <img src="./public/images/avatar10.png" class="w-12 h-12 rounded-full">
                <div class="ml-4">
                    <p class="text-white">Player 1</p>
                    <p class="text-sm text-gray-400">30 wins - 2 losses</p>
                </div>
                <img src="./public/images/coupe.png" class="w-10 h-10 ml-auto">
            </li>
            <li class="flex items-center bg-gray-700 p-3 rounded-lg">
                <img src="./public/images/avatar11.png" class="w-12 h-12 rounded-full">
                <div class="ml-4">
                    <p class="text-white">Player 2</p>
                    <p class="text-sm text-gray-400">20 wins - 3 losses</p>
                </div>
                <img src="./public/images/medaille_bronze.png" class="w-10 h-10 ml-auto">
            </li>
            <!-- Répéter ce modèle pour les autres joueurs -->
        </ul>
    
        `;
    }
}