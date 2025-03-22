interface GameState
{
    page: string;
    playerLeft: string | null;
    playerRight: string | null;
    playerWins: string | null;
}

// Global object to track the state of the pages/game
let gameState: GameState = {
    page: "",
    playerLeft: null,
    playerRight: null,
    playerWins: null
};

function setGameState(page: string, pushHistory: boolean = false, playerLeft: string | null = null, playerRight: string | null = null, playerWins: string | null = null): void
{
    gameState.page = page;
    gameState.playerLeft = playerLeft;
    gameState.playerRight = playerRight;
    gameState.playerWins = playerWins;
    if (pushHistory == true)
    {
        pushStateToHistory();
    }
}

function pushStateToHistory(): void
{
    history.pushState(gameState, "", `#${gameState.page}`);
}







/* ************************************************************************** */
/* Navigate manually to a page and add to history                             */
/* ************************************************************************** */
function navigateTo(page: string, pushHistory: boolean = false, playerLeft: string | null = null, playerRight: string | null = null, playerWins: string | null = null): void
{
    setGameState(page, pushHistory, playerLeft, playerRight, playerWins);
    if (page === "welcome")
    {
        renderWelcomePage();
    }
    else if (page === "game")
    {
        renderGamePage(playerLeft, playerRight);
    }
    else if (page === "revanche")
    {
        renderRevanchePage(playerLeft, playerRight, playerWins);
    }
    else if (page === "createAccount")
    {
        renderCreateAccountPage();
    }
    else if (page === "login")
    {
        renderLoginPage();
    }
    else if (page === "profile")
    {
        renderProfilePage(playerLeft);
    }
    else
    {
        alert("function navigateTo: requested page (" + page + ") does not exist");
    }
}









/* ************************************************************************** */
/* Navigation through history                                                 */
/* ************************************************************************** */

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
function add_history_navigation_to_window()
{
    window.addEventListener("popstate", history_navigation);
}

function history_navigation(event: PopStateEvent)
{
    if (!event.state)
    {
        navigateTo("welcome", false);
    }
    else
    {
        navigateTo(event.state.page, false, event.state.playerLeft, event.state.playerRight, event.state.playerWins);
    }
}












/* ************************************************************************** */
/* Navigation for first load or refresh page                                  */
/* ************************************************************************** */
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
function render_page_on_load_or_refresh(): void
{
    if (location.hash === "#game" && history.state?.playerLeft && history.state?.playerRight)
    {
        navigateTo("game", false, history.state?.playerLeft, history.state?.playerRight);
    }
    else if (location.hash === "#revanche" && history.state?.playerLeft && history.state?.playerRight && history.state?.playerWins)
    {
        navigateTo("revanche", false, history.state?.playerLeft, history.state?.playerRight, history.state?.playerWins);
    }
    else if (location.hash === "#createAccount")
    {
        navigateTo("createAccount", false);
    }
    else if (location.hash === "#login")
    {
        navigateTo("login", false);
    }
    else if (location.hash === "#welcome")
    {
        navigateTo("welcome", false);
    }
    else if (location.hash === "#profile" && history.state?.playerLeft)
    {
        navigateTo("profile", false, history.state?.playerLeft);
    }
    else if (location.hash === "")
    {
        navigateTo("welcome", true);
    }
    else
    {
        navigateTo("welcome", true);
    }
}











/* ************************************************************************** */
/* Event listener to be executed when page is loaded                          */
/* ************************************************************************** */
function run_when_content_loaded(event: Event): void
{
    add_history_navigation_to_window();
    render_page_on_load_or_refresh();
}

/*
https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event
The DOMContentLoaded event fires when the HTML document has been completely 
parsed, and all deferred scripts (<script defer src="…"> and 
<script type="module">) have downloaded and executed.
*/
document.addEventListener("DOMContentLoaded", run_when_content_loaded);
