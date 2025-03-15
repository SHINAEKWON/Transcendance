function renderWelcomePage()
{
    const app: HTMLElement | null = document.getElementById("app");
    
    if (app)
    {
        app.innerHTML = `
            <div class="containerAccountButtons">
                <button class="btnCreateAccount btnAccount" id="btnCreateAccount">Create Account</button>
                <button class="btnLogin btnAccount" id="btnLogin">Login</button>
            </div>
            <div class="containerNameInput">
                <h1 class="inputNameHeading">or enter names for quick game</h1>
                <form id="formNames" class="formNames">
                    <input class="inputName inputNameLeft" type="text" id="inputNameLeft" placeholder="Left player" required>
                    <input class="inputName inputNameRight" type="text" id="inputNameRight" placeholder="Right player" required>
                    <button class="btnSubmitName" id="btnSubmitName" type="submit">Start Game</button>
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