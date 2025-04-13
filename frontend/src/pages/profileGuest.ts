export class ProfileGuestPage {
    render(): string {
        const guest = {
            username: "GuestPlayer",
            avatar: "./public/images/guest_avatar.png"
        };

        return `
            <div class="max-w-xl mx-auto bg-gray-800 p-6 rounded-2xl shadow-lg mt-10">
                <div class="flex flex-col items-center space-y-4">
                    <img src="${guest.avatar}" alt="Guest Avatar" class="w-28 h-28 rounded-full border-4 border-blue-400 shadow-md">
                    <h3 class="text-xl text-white font-bold">${guest.username}</h3>
                    <p class="text-gray-400 italic text-sm">Utilisateur invité</p>

                    <!-- Boutons d'envoi de message -->
                    <div class="flex space-x-4 mt-4">
                        <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition">
                            💬 Send to Asma
                        </button>
                        <button class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md transition">
                            💬 Send to Zed
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}
