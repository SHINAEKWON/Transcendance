function renderProfilePage(profilename: string | null)
{
    const app: HTMLElement | null = document.getElementById("app");
    
    if (app)
    {
        app.innerHTML = `
            <div class="containerProfile">
                <div id="divWelcomeMessage" class="divWelcomeMessage">
                    Welcome to Pong !
                </div>
                <div id="divProfileName" class="divProfileName">
                    ${profilename}
                </div>
                <button class="btnStartGame" id="btnStartGame" type="submit">Start a Game</button>
            </div>
        `;
    
        const btnStartGame: HTMLElement | null = document.getElementById("btnStartGame");
        btnStartGame?.addEventListener("click", startNewGame);
    }
}

function startNewGame(event: Event)
{
    const profileNameDiv: HTMLElement | null = document.getElementById("divProfileName");
    if (profileNameDiv)
    {
        const profileName: string | null = profileNameDiv.textContent;
        navigateTo("game", true, profileName, "Anonymous");
    }

}