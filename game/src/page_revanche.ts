import { navigateTo } from "./page_navigation";

export function renderRevanchePage(player1: string | null, player2: string | null)
{
    const app: HTMLElement | null = document.getElementById("app");
    
    if (app)
    {
        app.innerHTML = `
        <div class="flex items-center justify-center min-h-screen bg-gray-100">
            <div class="w-full px-3 flex items-center justify-center">
            
                <button class="login_button" id="btnRevanche">
                    Revanche
                </button>
                        
                <button class="login_button" id="btnEnd" type="submit">
                    Back to welcome
                </button>
            </div>
        </div>
        `;
    
        const btnRevanche: HTMLButtonElement | null = document.getElementById("btnRevanche") as HTMLButtonElement;
        btnRevanche?.addEventListener("click", () => {
            startRevanche(player1, player2);
        });

        const btnEnd: HTMLButtonElement | null = document.getElementById("btnEnd") as HTMLButtonElement;
        btnEnd?.addEventListener("click", clickedEnd);
    }
}

function startRevanche(playerLeft: string | null, playerRight: string | null): void
{
    navigateTo("game", true, playerLeft, playerRight);
}

function clickedEnd(event: Event): void
{
    navigateTo("welcome", true);
}
