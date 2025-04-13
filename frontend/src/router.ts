import { Socket } from 'socket.io-client';
import { setLang, getLang } from './i18n/language.js'; // 💬 Langue

interface Page {
    render(...args: any[]): string; // ✅ Permettre `render()` d'accepter des arguments
}

interface Routes {
    [key: string]: Page;
}

export class Router {
    private routes: Routes;
    private currentPage: string = 'welcome';
    private appElement: HTMLElement | null;

    constructor(routes: Routes) {
        this.routes = routes;
        this.appElement = document.getElementById('app');
    }

    init(): void {
        window.addEventListener('popstate', () => {
            const page = window.location.hash.slice(1) || 'welcome';
            this.updatePage(page, false);
        });

        const initialPage = window.location.hash.slice(1) || 'welcome';
        this.updatePage(initialPage, false);
    }

    private updatePage(page: string, addToHistory: boolean): void {
        console.log(`🔄 Tentative de chargement de la page: ${page}`);

        let [pageName, queryString] = page.split("?");
        queryString = queryString || "";
        const params = new URLSearchParams(queryString);

        if (!this.routes[pageName]) {
            console.warn(`⚠️ Page inconnue: ${pageName}, redirection vers \"welcome\"`);
            pageName = "welcome";
        }

        this.currentPage = pageName;

        if (addToHistory) {
            window.history.pushState(null, '', `#${pageName}${queryString ? "?" + queryString : ""}`);
        }

        if (this.appElement && this.routes[pageName]) {
            console.log(`✅ Chargement de la page: ${pageName}`);

            if (pageName === "localPlay") {
                const page: any = this.routes[pageName];
                this.appElement.innerHTML = page.render();
                if (typeof page.attachEvents === "function") {
                    page.attachEvents();
                }
            } else if (pageName === "gameboard") {
                const player1 = params.get("player1") || "Player 1";
                const player2 = params.get("player2") || "Player 2";

                console.log(`🎮 Lancement du jeu avec: ${player1} vs ${player2}`);

                this.appElement.innerHTML = this.routes[pageName].render(player1, player2);
                const page: any = this.routes[pageName];
                if (typeof page.init === "function") {
                    page.init();
                }
            } else if (pageName === "guest") {
                const page: any = this.routes[pageName];
                this.appElement.innerHTML = page.render();

                if (typeof page.setup === "function") {
                    page.setup();
                }
            } else {
                this.appElement.innerHTML = this.routes[pageName].render();
            }

            setTimeout(() => {
                this.attachGameModeEvents();
                this.attachLangEvent();
                this.attachMessageButtons(); // ✅ Ajout des listeners de messagerie
            }, 10);
        } else {
            console.error(`❌ Erreur: Impossible de charger la page \"${pageName}\".`);
        }
    }

    // ✅ Fonction pour attacher les événements de navigation pour les modes de jeu
    private attachGameModeEvents(): void {
        console.log("✅ Attachement des événements de navigation pour les modes de jeu");

        document.querySelectorAll(".game-mode-btn").forEach(button => {
            button.addEventListener("click", () => {
                const targetPage = (button as HTMLElement).getAttribute("data-page");
                if (targetPage) {
                    console.log("📌 Clic détecté sur :", targetPage);
                    window.location.hash = targetPage;
                } else {
                    console.error("❌ Erreur: `data-page` non défini sur le bouton.");
                }
            });
        });
    }

    // ✅ Fonction pour envoyer des messages depuis des boutons spécifiques
    private attachMessageButtons(): void {
        let button = document.getElementById("sendToAhmed");
        if (button != null) {
            button.addEventListener("click", () => {
                // Envoyer un message
                const socket = getSocket();
                if (socket) {
                    console.log("sendToAhmed");
                    socket.emit("chatMessage", {
                        content: "Salut Ahmed !",
                        receiverId: 19 // ou receiverId si DM
                    });
                }
            });
        }

        let buttonAsma = document.getElementById("sendToAsma");
        if (buttonAsma != null) {
            buttonAsma.addEventListener("click", () => {
                // Envoyer un message
                const socket = getSocket();
                if (socket) {
                    console.log("sendToAsma");
                    socket.emit("chatMessage", {
                        content: "Salut Asma !",
                        receiverId: 18 // ou receiverId si DM
                    });
                }
            });
        }
    }

    private attachLangEvent(): void {
        // ✅ Charger la langue déjà choisie et la mettre dans le <select>
        const lang = getLang();
        const select = document.getElementById("language-select") as HTMLSelectElement;
        if (select) {
            select.value = lang;
            // ✅ Lorsqu'on change la langue dans le sélecteur
            select.addEventListener("change", (e) => {
                const target = e.target as HTMLElement;
                if (target.id === "language-select") {
                    const value = (target as HTMLSelectElement).value;
                    setLang(value);
                    location.reload(); // Recharge pour appliquer la nouvelle langue
                }
            });
        }
    }
}

function getSocket(): Socket | undefined {
    return (window as any).socket;
}