export class LanguagePage {
    render(): string {
        return `
            <div class="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
                <h2 class="text-3xl font-gaming text-neon-blue mb-6 animate-glow">Language Settings</h2>
                <p class="text-lg text-neon-purple">Select your preferred language for the game.</p>
                <div class="mt-6">
                    <h4 class="text-neon-green mb-2">Choose Language</h4>
                    <select id="language-select" class="bg-gray-700 text-white p-2 rounded-sm">
                        <option value="en">English</option>
                        <option value="fr">Français</option>
                        <option value="es">Español</option>
                        <option value="de">Deutsch</option>
                    </select>
                </div>
            </div>
        `;
    }
}
