import { getTranslation } from "../../i18n/i18n.js";
import { aiPlayTranslations } from "../../translations/game.js";
import { RedirectEvents } from "../../utils/redirectEvents.js";

export class AIPlayPage implements Page {
    render() {
        const t = (key: keyof typeof aiPlayTranslations) => getTranslation("aiPlay", key);

        let html = `
            <div class="max-w-5xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
                <h2 class="text-3xl font-gaming text-neon-blue mb-8 animate-glow text-center">${t("chooseRobotTitle")}</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6" id="bot-selection">

                    ${this.botCard("roboZ", "/public/images/bot_1.jpg", t("bot1Name"), t("bot1Desc"), "neon-green")}
                    ${this.botCard("mechaX", "/public/images/bot_2.jpg", t("bot2Name"), t("bot2Desc"), "neon-orange")}
                    ${this.botCard("cyberNova", "/public/images/bot_3.jpg", t("bot3Name"), t("bot3Desc"), "neon-purple")}

                </div>

                <div class="mt-10 text-center">
                    <button id="start-ai-game" disabled class="px-6 py-3 bg-neon-green text-black rounded-lg font-bold text-lg hover:bg-green-400 transition disabled:opacity-30 disabled:cursor-not-allowed">
                        ${t("playBtn")}
                    </button>
                    <div class="mt-6">
                        <a href="#duel" class="text-neon-blue underline hover:text-blue-300">${t("backToGame")}</a>
                    </div>
                </div>
            </div>
        `;

        const app = document.getElementById("app");
        if (app) app.innerHTML = html;

        this.setupBotSelection();
    }

    botCard(botId: string, imgSrc: string, name: string, desc: string, ringColor: string) {
        return `
            <div class="bot-card bg-gray-900 p-6 rounded-xl hover:ring-2 hover:ring-${ringColor} flex flex-col items-center shadow-md transition-all duration-200 cursor-pointer" 
                 data-bot-id="${botId}" data-bot-img="${imgSrc}" data-bot-name="${name}" data-ring="${ringColor}">
                <img src="${imgSrc}" class="w-full h-60 object-contain rounded-md mb-4 shadow-lg pointer-events-none">
                <h3 class="text-xl text-${ringColor} mb-2 font-bold text-center pointer-events-none">${name}</h3>
                <p class="text-gray-400 text-sm text-center mb-4 pointer-events-none">${desc}</p>
            </div>
        `;
    }

    setupBotSelection() {
        let selectedBotInfo: { id: string, img: string, name: string } | null = null;

        const cards = document.querySelectorAll(".bot-card");
        const playButton = document.getElementById("start-ai-game") as HTMLButtonElement;

        cards.forEach(card => {
            card.addEventListener("click", () => {
                // Retirer toutes les classes de sélection
                cards.forEach(c => c.classList.remove("ring-4", "ring-neon-green", "ring-neon-orange", "ring-neon-purple"));

                const ringColor = card.getAttribute("data-ring")!;
                card.classList.add("ring-4", `ring-${ringColor}`);

                selectedBotInfo = {
                    id: card.getAttribute("data-bot-id")!,
                    img: card.getAttribute("data-bot-img")!,
                    name: card.getAttribute("data-bot-name")!,
                };

                playButton.disabled = false;
            });
        });

        playButton.addEventListener("click", () => {
            if (selectedBotInfo) {
                console.log(`🎮 Preparing duel vs ${selectedBotInfo.name}`);

                // Récupérer le joueur connecté
                const currentUserString = localStorage.getItem("transcendenceUser");
                if (!currentUserString) {
                    console.error("Utilisateur non connecté !");
                    return;
                }
                const currentUser = JSON.parse(currentUserString);

                // Créer un nouvel ID unique
                const duelId = Date.now().toString();

                // Créer les données du duel
                const duelData = {
                    player1: {
                        id: selectedBotInfo.id,
                        username: selectedBotInfo.name,
                        avatar: selectedBotInfo.img,
                        isIa: true
                    },
                    player2: {
                        id: currentUser.id,
                        username: currentUser.username,
                        avatar: currentUser.avatar,
                        isIa: false
                    },
                    mode: "IA" // mode contre IA
                };
                const params = new URLSearchParams();
                params.set('id', duelId);
                params.set('duel', encodeURIComponent(JSON.stringify(duelData)));
                window.location.href = `/#duelGameBoard?${params.toString()}`;

                // Sauvegarder dans localStorage
                // localStorage.setItem(`duel_${duelId}`, JSON.stringify(duelData));
                // window.location.href = `/#duelGameBoard?id=${duelId}`;




            }
        });
    }
}
