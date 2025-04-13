function renderLoginPage()
{
    const app = document.getElementById("app");

    app.innerHTML = `
        <div class="containerLoginTFs">
            <form id="formLogin" class="formLogin">
                <input class="inputLogin inputLoginUsername" type="text" id="inputLoginUsername" placeholder="Username" required>
                <input class="inputLogin inputLoginPwd" type="password" id="inputLoginPwd" placeholder="Password" required>
                <button class="btnSubmitLogin" id="btnSubmitLogin" type="submit">Login</button>
            </form>
        </div>
    `;
    
    const formLogin = document.getElementById("formLogin");
    formLogin.addEventListener("submit", login);
}
    
function login(event)
{
    // when clicking on a "Submit" button, prevent it from submitting a form
    event.preventDefault();
    
    const inputLoginUsername = document.getElementById("inputLoginUsername");
    const inputLoginPwd = document.getElementById("inputLoginPwd");

    const pwd = inputLoginPwd.value;
    const username = inputLoginUsername.value;

    if (username == "alex" && pwd == "1234")
        navigateTo("profile", true, playerLeft = username);
    else
        alert("Password not correct");
}