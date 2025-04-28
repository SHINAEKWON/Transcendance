import { getTranslation } from "../../i18n/i18n.js";
import { localPlayTranslations } from "../../translations/game.js";
import { getUsersList } from "../../services/userService.js";
export class OnlinePlayPage implements Page {
    private selectedPlayer: any = null;

    async render() {
        const t = (key: keyof typeof localPlayTranslations) => getTranslation("localPlay", key);

        const users = await getUsersList();
        const currentUserString = localStorage.getItem("transcendenceUser");
        if (!currentUserString) {
            console.error("Utilisateur non connecté !");
            return;
        }
        const currentUser = JSON.parse(currentUserString);

        let html = `
            <div class="max-w-5xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg text-center">
                <h1 class="text-3xl font-gaming text-neon-blue mb-6 animate-glow">${t("title")}</h1>
                <p class="text-gray-400 mb-8">${t("description")}</p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    ${users
                        .filter(user => user.id !== currentUser.id) // exclure l'utilisateur connecté
                        .map(user => `
                        <div class="flex items-center bg-gray-900 p-4 rounded-lg hover:ring-2 hover:ring-neon-green transition cursor-pointer user-card" 
                             data-user-id="${user.id}" data-username="${user.username}" data-avatar="${user.avatar}">
                            <img src="${user.avatar}" class="w-12 h-12 rounded-full mr-4 border border-gray-500">
                            <span class="text-white font-semibold">${user.username}</span>
                        </div>
                    `).join("")}
                </div>

                <div class="flex justify-center gap-6">
                    <button id="start-local-game" disabled class="bg-neon-green text-gray-900 px-6 py-3 rounded-lg text-lg font-bold hover:bg-green-400 transition disabled:opacity-50 disabled:cursor-not-allowed">
                        ${t("play")}
                    </button>
                    <a href="#duel" class="bg-neon-purple text-gray-900 px-6 py-3 rounded-lg text-lg font-bold hover:bg-purple-400 transition">
                        ${t("back")}
                    </a>
                </div>
            </div>
        `;

        const app = document.getElementById('app');
        if (app) {
            app.innerHTML = html;
            this.attachEvents(currentUser);
        }
    }

    attachEvents(currentUser: any) {
        const userCards = document.querySelectorAll(".user-card");
        const playButton = document.getElementById("start-local-game") as HTMLButtonElement;

        userCards.forEach(card => {
            card.addEventListener("click", () => {
                // Retirer la sélection précédente
                userCards.forEach(c => c.classList.remove("ring-4", "ring-neon-green"));

                // Ajouter un style au joueur sélectionné
                card.classList.add("ring-4", "ring-neon-green");

                // Récupérer les données du joueur sélectionné
                this.selectedPlayer = {
                    id: card.getAttribute("data-user-id"),
                    username: card.getAttribute("data-username"),
                    avatar: card.getAttribute("data-avatar"),
                    isIa: false
                };

                playButton.disabled = false;
            });
        });

        playButton.addEventListener("click", () => {
            if (this.selectedPlayer) {
                const duelId = Date.now().toString();

                const duelData = {
                    player1: {
                        id: currentUser.id,
                        username: currentUser.username,
                        avatar: currentUser.avatar,
                        isIa: false
                    },
                    player2: this.selectedPlayer,
                    mode: "remote"
                };

                const params = new URLSearchParams();
                params.set('id', duelId);
                params.set('duel', encodeURIComponent(JSON.stringify(duelData)));
                window.location.href = `/#duelGameBoard?${params.toString()}`;
                
            }
        });
    }
}

