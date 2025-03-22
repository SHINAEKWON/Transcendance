function renderCreateAccountPage()
{
    const app: HTMLElement | null = document.getElementById("app");
    
    if (app)
    {
    
        app.innerHTML = `
        <div class="flex items-center justify-center min-h-screen bg-gray-100">
            <form class="w-full max-w-lg" id="formCreateAccount">
                <div class="flex flex-wrap">
                
                
                    <div class="w-full px-3">
                        <label class="login_label" for="inputCreateAccountUsername">
                            First Name
                        </label>
                        <input class="login_textfield" id="inputCreateAccountUsername" type="text" placeholder="CrazyName" required>
                    </div>
                    
                    
                    
                    
                    <div class="w-full px-3">
                        <label class="login_label" for="inputCreateAccountPwd">
                            Email
                        </label>
                        <input class="login_textfield" id="inputCreateAccountPwd" type="email" placeholder="example@example.com" required>
                    </div>  
                    
                    
                    
                    
                    <div class="w-full px-3">
                        <label class="login_label" for="inputCreateAccountEmail">
                            Password
                        </label>
                        <input class="login_textfield" id="inputCreateAccountEmail" type="password" placeholder="******************" required>
                        <p class="text-gray-600 text-xs italic">Make it as long and as crazy as you'd like</p>
                    </div>
                    
                    
                    
                    <div class="w-full px-3 flex items-center justify-center">
                        <button class="login_button" id="btnSubmitCreateAccount" type="submit">
                            Create Account
                        </button>
                    </div>


                </div>
            </form>
        </div>
        `;
    
        const formCreateAccount: HTMLElement | null = document.getElementById("formCreateAccount");
        formCreateAccount?.addEventListener("submit", createAccount);
    }
}
    
function createAccount(event: Event)
{
    // when clicking on a "Submit" button, prevent it from submitting a form
    event.preventDefault();
    
    const inputCreateAccountUsername: HTMLInputElement | null = document.getElementById("inputCreateAccountUsername") as HTMLInputElement;
    const inputCreateAccountEmail: HTMLInputElement | null = document.getElementById("inputCreateAccountEmail") as HTMLInputElement;
    const inputCreateAccountPwd: HTMLInputElement | null = document.getElementById("inputCreateAccountPwd") as HTMLInputElement;

    const username: string = inputCreateAccountUsername?.value;
    const mail: string = inputCreateAccountEmail?.value;
    const pwd: string = inputCreateAccountPwd?.value;

    writeToFile("", username, mail, pwd);
    
    navigateTo("welcome", true);
}

function writeToFile(path: string, username: string, mail: string, pwd: string)
{
    alert("Account created");
}
