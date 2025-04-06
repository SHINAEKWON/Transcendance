import { navigateTo } from "./page_navigation.js";

export function renderProfilePage(profilename: string | null)
{
    const app: HTMLElement | null = document.getElementById("app");
    
    if (app)
    {
        app.innerHTML = `
        <div class="flex items-center justify-center min-h-screen bg-gray-100">
                <div class="flex flex-wrap">
                
                
                    <div class="w-full px-3">
                        <label class="login_label">
                            Welcome to Pong!
                        </label>
                    </div>

                    <div class="w-full px-3">
                        <label class="login_label" id="divProfileName">
                            ${profilename}
                        </label>
                    </div>                    
                    
                    <div class="w-full px-3 flex items-center justify-center">
                        <button class="login_button" id="btnStartGame">
                            Start a Game
                        </button>
                    </div>


                </div>
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
