function navigateTo(page, state = {})
{
    if (page === "login")
    {
        renderLoginPage();
        history.pushState({ page: "login" }, "", "#login");
    }
    else if (page === "game")
    {
        renderGamePage(state.player1, state.player2);
        history.pushState({ page: "game", player1: state.player1, player2: state.player2 }, "", "#game");
    }
    else if (page === "revanche")
    {
        renderRevanchePage(state.player1, state.player2, state.won);
        history.pushState({ page: "revanche", player1: state.player1, player2: state.player2, won: state.won }, "", "#revanche");
    }
    else
    {

    }
}

document.addEventListener("DOMContentLoaded", () => 
{
    const app = document.getElementById("app");
    
    window.addEventListener("popstate", (event) => 
    {
        if (!event.state || event.state.page === "login")
        {
            renderLoginPage();
        }
        else if (event.state.page === "game")
        {
            renderGamePage(event.state.player1, event.state.player2);
        }
        else if (event.state.page === "revanche")
        {
            renderRevanchePage(event.state.player1, event.state.player2, event.state.won);
        }
    });
    
    if (location.hash === "#game" && history.state?.player1 && history.state?.player2)
    {
        renderGamePage(history.state.player1 ,history.state.player2);
    }
    else if (location.hash === "#revanche" && history.state?.player1 && history.state?.player2 && history.state.won)
    {
        renderRevanchePage(history.state.player1, history.state.player2, history.state.won);
    }
    else
    {
        renderLoginPage();
    }
});
