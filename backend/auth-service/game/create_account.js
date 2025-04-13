function renderCreateAccountPage()
{
    const app = document.getElementById("app");

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
    
    const formCreateAccount = document.getElementById("formCreateAccount");
    formCreateAccount.addEventListener("submit", createAccount);
}
    
function createAccount(event)
{
    // when clicking on a "Submit" button, prevent it from submitting a form
    event.preventDefault();
    
    const inputCreateAccountName = document.getElementById("inputCreateAccountName");
    const inputCreateAccountUsername = document.getElementById("inputCreateAccountUsername");
    const inputCreateAccountEmail = document.getElementById("inputCreateAccountEmail");
    const inputCreateAccountCredit = document.getElementById("inputCreateAccountCredit");
    const inputCreateAccountPwd = document.getElementById("inputCreateAccountPwd");

    const name = inputCreateAccountName.value;
    const username = inputCreateAccountUsername.value;
    const mail = inputCreateAccountEmail.value;
    const credit = inputCreateAccountCredit.value;
    const pwd = inputCreateAccountPwd.value;

    writeToFile("", name, username, mail, credit, pwd);
    
    navigateTo("welcome", true);
}

function writeToFile(path, name, username, mail, credit, pwd)
{
    alert("Account created");
}
