function renderCreateAccountPage()
{
    const app: HTMLElement | null = document.getElementById("app");
    
    if (app)
    {
        app.innerHTML = `
            <div class="containerCreateAccountTFs">
            <form id="formCreateAccount" class="formCreateAccount">
                    <input class="inputCreateAccount inputCreateAccountName" type="text" id="inputCreateAccountName" placeholder="Full name" required>
                    <input class="inputCreateAccount inputCreateAccountUsername" type="text" id="inputCreateAccountUsername" placeholder="Username" required>
                    <input class="inputCreateAccount inputCreateAccountPwd" type="password" id="inputCreateAccountPwd" placeholder="Password" required>
                    <input class="inputCreateAccount inputCreateAccountEmail" type="email" id="inputCreateAccountEmail" placeholder="Mail" required>
                    <input class="inputCreateAccount inputCreateAccountCredit" type="text" id="inputCreateAccountCredit" placeholder="Credit Card Number">
                    <button class="btnSubmitCreateAccount" id="btnSubmitCreateAccount" type="submit">Create Account</button>
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
    
    const inputCreateAccountName: HTMLInputElement | null = document.getElementById("inputCreateAccountName") as HTMLInputElement;
    const inputCreateAccountUsername: HTMLInputElement | null = document.getElementById("inputCreateAccountUsername") as HTMLInputElement;
    const inputCreateAccountEmail: HTMLInputElement | null = document.getElementById("inputCreateAccountEmail") as HTMLInputElement;
    const inputCreateAccountCredit: HTMLInputElement | null = document.getElementById("inputCreateAccountCredit") as HTMLInputElement;
    const inputCreateAccountPwd: HTMLInputElement | null = document.getElementById("inputCreateAccountPwd") as HTMLInputElement;

    const name: string = inputCreateAccountName?.value;
    const username: string = inputCreateAccountUsername?.value;
    const mail: string = inputCreateAccountEmail?.value;
    const credit: string = inputCreateAccountCredit?.value;
    const pwd: string = inputCreateAccountPwd?.value;

    writeToFile("", name, username, mail, credit, pwd);
    
    navigateTo("welcome", true);
}

function writeToFile(path: string, name: string, username: string, mail: string, credit: string, pwd: string)
{
    alert("Account created");
}
