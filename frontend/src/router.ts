import { Socket } from 'socket.io-client';
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
        console.log(`🔄 Tentative de chargement de la page: ${page}`);
        let [pageName, queryString] = page.split("?");
        let rpage:Page = this.routes[pageName];
        if(rpage){
            rpage.render();
        } else {
            console.error(`❌ Erreur: Impossible de charger la page \"${pageName}\".`);
        }

        
    }

}
