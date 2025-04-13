export class ProfileGuestPage {
    render(): string {
        const guestData = localStorage.getItem("transcendenceUser");
        const guest = guestData ? JSON.parse(guestData) : {
            username: "GuestPlayer",
            avatar: "./public/images/guest_avatar.png"
        };

        return `
            <div class="max-w-xl mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 rounded-2xl shadow-2xl mt-10 border border-blue-500 animate-fade-in">
                <div class="flex flex-col items-center space-y-6">
                <img src="${guest.avatar}" alt="Guest Avatar" class="w-32 h-32 rounded-full border-4 border-blue-400 shadow-[0_0_15px_#3b82f6] hover:scale-105 transition-transform duration-300">
                <h3 class="text-2xl text-neon-green font-bold font-gaming tracking-wide drop-shadow">${guest.username}</h3>
                <p class="text-neon-purple italic text-sm">🕶️ Guest Player! 🕶️</p>
                
                <div class="text-4xl text-white animate-bounce">👻</div>
                    <!-- Boutons d'envoi de message -->
                    <div class="flex space-x-4 mt-6">
                       <button id="sendToAsma" class="bg-neon-green text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-opacity-80 transition">
                         Send to Asma
                     </button>
 
                     <button id="sendToAhmed" class="bg-neon-green text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-opacity-80 transition">
                     Send to Ahmed
                 </button>
                    </div>
                </div>
            </div>
        `;
    }
}
