import { A_Page } from "../pages/A_Page";

export class Router
{
    pages: Map<string, A_Page>;
    currentPage: A_Page | null = null;

    constructor(pages: Map<string, A_Page> | null = null)
    {
        if (pages != null)
            this.pages = pages;
        else
            this.pages = new Map();
    }

    init(): void
    {
        this.initHistoryNavigation();
        this.initPageOnLoadOrRefresh();
    }

    addPage(name: string, page: A_Page)
    {
        this.pages.set(name, page);
    }

    private splitPageString(page: string): [pageName: string, queryString: string]
    {
        let splitPage: string[] = page.split("?");
        let pageName: string = splitPage[0];
        let queryString: string;

        if (splitPage.length > 1)
            queryString = splitPage[1];
        else
            queryString = "";
        return [pageName, queryString];
    }

    private addToBrowserHistory(addToHistory: boolean, pageName: string, queryString: string): void
    {         
        if (addToHistory == true)
        {
            window.history.pushState(null, '', `#${pageName}${queryString != "" ? "?" + queryString : ""}`);
        }
    }

    /*
    https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event
    The popstate event of the Window interface is fired when the active history 
    entry changes while the user navigates the session history. It changes the 
    current history entry to that of the last page the user visited or, if 
    history.pushState() has been used to add a history entry to the history stack, 
    that history entry is used instead.

    A PopStateEvent inherits from Event. PopStateEvent.state returns a copy of the 
    information that was provided to pushState() or replaceState().
    */
    private initHistoryNavigation(): void
    {
        window.addEventListener('popstate', () =>
        {
            const page: string = window.location.hash.slice(1) || 'welcome';
            this.updatePage(page, false);
        });
    }

    /*
    https://developer.mozilla.org/en-US/docs/Web/API/Location
    The Location interface represents the location (URL) of the object it is linked 
    to. Both the Document and Window interface have such a linked Location, 
    accessible via Document.location and Window.location respectively.
    Location.hash is string containing a '#' followed by the fragment identifier of 
    the URL.

    https://developer.mozilla.org/en-US/docs/Web/API/History
    The History interface of the History API allows manipulation of the browser 
    session history, that is the pages visited in the tab or frame that the 
    current page is loaded in.
    There is only one instance of history (It is a singleton.) accessible via the 
    global object history.
    state returns any value representing the state at the top of the history stack. 
    This is a way to look at the state without having to wait for a popstate event.

    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
    The optional chaining (?.) operator accesses an object's property or calls a 
    function. If the object accessed or function called using this operator is 
    undefined or null, the expression short circuits and evaluates to undefined 
    instead of throwing an error.
    */
    private initPageOnLoadOrRefresh(): void
    {
        const initialPage = window.location.hash.slice(1) || 'welcome';
        this.updatePage(initialPage, false);
    }

    private updatePage(page: string, addToHistory: boolean): void
    {
        let [pageName, queryString]: [string, string] = this.splitPageString(page);
        let pageToLoad: A_Page | undefined = this.pages.get(pageName);

        const params: URLSearchParams = new URLSearchParams(queryString);
    
        if (pageToLoad == undefined)
        {
            console.warn(`Page unknown: ${pageName}, redirection to "welcome"`);
            pageName = "welcome";
            pageToLoad = this.pages.get(pageName);
        }

        this.addToBrowserHistory(addToHistory, pageName, queryString);
    
        if (pageToLoad != undefined)
        {
            console.log(`Load page: ${pageName}`);
            this.currentPage?.leave();
            this.currentPage = pageToLoad;
            pageToLoad.load(params);
        }
        else
        {
            console.error(`Error: Impossible to load page "${pageName}"`);
        }
    }
}