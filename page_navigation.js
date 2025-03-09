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
    });
    
    if (location.hash === "#game" && history.state?.player1 && history.state?.player2)
    {
        renderGamePage(history.state.player1 ,history.state.player2);
    }
    else
    {
        renderLoginPage();
    }
});
