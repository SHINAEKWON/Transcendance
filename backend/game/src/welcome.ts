function renderWelcomePage()
{
    const app: HTMLElement | null = document.getElementById("app");
    
    if (app)
    {
        app.innerHTML = `
        <div class="flex items-center justify-center min-h-screen bg-gray-100">
                
            <div class="w-full px-3 flex items-center justify-center">
                <button class="login_button" id="btnCreateAccount" type="submit">
                    Create Account
                </button>
                        
                <button class="login_button" id="btnLogin" type="submit">
                    Login
                </button>
            </div>

            <form class="w-full max-w-lg" id="formNames">
                <div class="flex flex-wrap">

                    <div class="w-full px-3">
                        <label class="login_label" for="inputNameLeft">
                            or enter names for quick game
                        </label>
                    </div>                
                
                
                    <div class="w-full px-3">
                        <label class="login_label" for="inputNameLeft">
                            Left Player
                        </label>
                        <input class="login_textfield" id="inputNameLeft" type="text" placeholder="CrazyName" required>
                    </div>
                    
                    <div class="w-full px-3">
                        <label class="login_label" for="inputNameRight">
                            Right Player
                        </label>
                        <input class="login_textfield" id="inputNameRight" type="text" placeholder="StunningName" required>
                    </div>
                
                    <div class="w-full px-3">
                        <button class="login_button" id="btnSubmitName" type="submit">
                            Start Game
                        </button>
                    </div>


                </div>
            </form>
        </div>
        `;
        
        const formNames: HTMLElement | null = document.getElementById("formNames");
        formNames?.addEventListener("submit", submitNames);

        const btnCreateAccount: HTMLElement | null = document.getElementById("btnCreateAccount");
        btnCreateAccount?.addEventListener("click", clickCreateAccount);

        const btnLogin: HTMLElement | null = document.getElementById("btnLogin");
        btnLogin?.addEventListener("click", clickLogin);
    }
}
    
function submitNames(event: Event)
{
    // when clicking on a "Submit" button, prevent it from submitting a form
    event.preventDefault();
    
    const inputNameLeft: HTMLInputElement | null = document.getElementById("inputNameLeft") as HTMLInputElement;
    const inputNameRight: HTMLInputElement | null = document.getElementById("inputNameRight") as HTMLInputElement;

    const nameLeft = inputNameLeft?.value;
    const nameRight = inputNameRight?.value;

    navigateTo("game", true, nameLeft, nameRight);
}

function clickCreateAccount(event: Event)
{
    navigateTo("createAccount", true);
}

function clickLogin(event: Event)
{
    navigateTo("login", true);
}
