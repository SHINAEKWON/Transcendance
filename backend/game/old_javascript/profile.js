function renderProfilePage(profilename)
{
    const app = document.getElementById("app");

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
    
    const btnStartGame = document.getElementById("btnStartGame");
    btnStartGame.addEventListener("click", startNewGame);
}

function startNewGame()
{
    const profileNameDiv = document.getElementById("divProfileName");
    const profileName = profileNameDiv.textContent;

    navigateTo("game", true, playerLeft = profileName, playerRight = "Anonymous");
}