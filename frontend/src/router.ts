interface Page {
    render(): string;
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
        if (!this.routes[page]) {
            page = 'welcome';
        }

        this.currentPage = page;
        
        if (addToHistory) {
            window.history.pushState(null, '', `#${page}`);
        }

        if (this.appElement && this.routes[page]) {
            this.appElement.innerHTML = this.routes[page].render();
        }

       
    }
}