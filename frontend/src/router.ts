
import { setLang, getLang } from './i18n/language.js'; // 💬 Langue



interface Routes {
    [key: string]: Page;
}

export class Router {
    private routes: Routes;

    constructor(routes: Routes) {
        this.routes = routes;
    }

    init(): void {
        window.addEventListener('popstate', () => {
            const page = window.location.hash.slice(1) || 'welcome';
            this.updatePage(page);
        });

        const initialPage = window.location.hash.slice(1) || 'welcome';
        this.updatePage(initialPage);
    }

    private updatePage(page: string): void {
        const socket = getSocket();
        if (socket) {
            socket.off("readyYes");
            socket.off("ready");
            socket.off("ballMove");
            socket.off("pressSpace");
            socket.off("paddleMove");
            socket.off("paddleRelativeMove");

        }
        console.log(`🔄 Tentative de chargement de la page: ${page}`);
        const userLs = localStorage.getItem("transcendenceUser");
        if (userLs) {
            if (page == 'welcome') {
                page = 'welcomeConnected'
            }
            const currentUser = JSON.parse(userLs);
            if (currentUser.type == 'guest' && page == 'profile') {
                page = "profileGuest";
            }
            if (currentUser.type !== 'guest' && page == 'profileGuest') {
                page = "profile";
            }

        } else if (page != 'welcome' && page != 'guest' && page != 'signup' && page != 'signin') {
            page = 'welcome'
        }
        let [pageName, queryString] = page.split("?");
        let rpage: Page = this.routes[pageName];
        if (rpage) {
            rpage.render();
        } else {
            console.error(`❌ Erreur: Impossible de charger la page \"${pageName}\".`);
        }


    }

}

function getSocket(): any | undefined {
    return (window as any).socket;
}