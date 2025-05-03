

export class ProfileGuestPage implements Page{
    render() {
        const guestLs = localStorage.getItem("transcendenceUser");
        if (!guestLs) {
            window.location.hash = "#welcome";
            return;
        }

 
    const guest = JSON.parse(guestLs);

        const html = `
            <div class="max-w-xl mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 rounded-2xl shadow-2xl mt-10 border border-blue-500 animate-fade-in">
                <div class="flex flex-col items-center space-y-6">
                <p class="text-neon-orange text-3xl"> << WELCOME!!>> </p>
                <img src="${guest.avatar}" alt="Guest Avatar" class="w-35 h-35 rounded-full border-4 border-blue-400 shadow-[0_0_15px_#3b82f6] hover:scale-105 transition-transform duration-300">
                <h3 class="text-2xl text-neon-green font-bold font-gaming tracking-wide drop-shadow">${guest.username}</h3>
                <p class="text-neon-purple italic text-sm">🕶️ Guest Player! 🕶️</p>
                
                <div class="text-4xl text-white animate-bounce">👻</div>
                    
                </div>
            </div>
        `;

        const app = document.getElementById('app');
        if(app){
            app.innerHTML = html;
        }

        // setTimeout(() => {
        //     this.attachMessageButtons();
        // }, 10);
    }

     // ✅ Fonction pour envoyer des messages depuis des boutons spécifiques
    //  private attachMessageButtons(): void {
    //     let button = document.getElementById("sendToAhmed");
    //     if (button != null) {
    //         button.addEventListener("click", () => {
    //             // Envoyer un message
    //             const socket = getSocket();
                
    //             if (socket) {
    //                 console.log("sendToAhmed");
    //                 socket.emit("chatMessage", {
    //                     content: "Minecraft Evolution!!!!",
    //                     receiverId: 24 // ou receiverId si DM
    //                 });
    //             }else {
    //                 console.log('soket null')
    //             }
    //         });
    //     }

    //     let buttonAsma = document.getElementById("sendToAsma");
    //     if (buttonAsma != null) {
    //         buttonAsma.addEventListener("click", () => {
    //             // Envoyer un message
    //             const socket = getSocket();
    //             if (socket) {
    //                 console.log("sendToAsma");
    //                 socket.emit("chatMessage", {
    //                     content: "CC Asma ca va !",
    //                     receiverId: 25 // ou receiverId si DM
    //                 });
    //             }
    //         });
    //     }
    // }

}

function getSocket(): any | undefined {
    return (window as any).socket;
} 
