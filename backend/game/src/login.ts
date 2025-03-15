function renderLoginPage()
{
    const app: HTMLElement | null = document.getElementById("app");
    
    if (app)
    {
        app.innerHTML = `
            <div class="containerLoginTFs">
                <form id="formLogin" class="formLogin">
                    <input class="inputLogin inputLoginUsername" type="text" id="inputLoginUsername" placeholder="Username" required>
                    <input class="inputLogin inputLoginPwd" type="password" id="inputLoginPwd" placeholder="Password" required>
                    <button class="btnSubmitLogin" id="btnSubmitLogin" type="submit">Login</button>
                </form>
            </div>
        `;
    
        const formLogin: HTMLElement | null = document.getElementById("formLogin");
        formLogin?.addEventListener("submit", login);
    }
}
    
function login(event: Event)
{
    // when clicking on a "Submit" button, prevent it from submitting a form
    event.preventDefault();
    
    const inputLoginUsername: HTMLInputElement | null = document.getElementById("inputLoginUsername") as HTMLInputElement;
    const inputLoginPwd: HTMLInputElement | null = document.getElementById("inputLoginPwd") as HTMLInputElement;

    const pwd: string = inputLoginPwd?.value;
    const username: string = inputLoginUsername?.value;

    if (username == "alex" && pwd == "1234")
        navigateTo("profile", true, username);
    else
        alert("Password not correct");
}