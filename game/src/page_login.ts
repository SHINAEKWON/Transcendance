import { navigateTo } from "./page_navigation";

export function renderLoginPage()
{
    const app: HTMLElement | null = document.getElementById("app");
    
    if (app)
    {
    
        app.innerHTML = `
        <div class="flex items-center justify-center min-h-screen bg-gray-100">
            <form class="w-full max-w-lg" id="formLogin">
                <div class="flex flex-wrap">
                
                
                    <div class="w-full px-3">
                        <label class="login_label" for="inputLoginUsername">
                            Username
                        </label>
                        <input class="login_textfield" id="inputLoginUsername" type="text" placeholder="CrazyName" required>
                    </div>
                    
                    
                    
                    
                    <div class="w-full px-3">
                        <label class="login_label" for="inputLoginPwd">
                            Password
                        </label>
                        <input class="login_textfield" id="inputLoginPwd" type="password" placeholder="******************" required>
                    </div>
                    
                    
                    
                    <div class="w-full px-3 flex items-center justify-center">
                        <button class="login_button" id="btnSubmitLogin" type="submit">
                            Login
                        </button>
                    </div>


                </div>
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
