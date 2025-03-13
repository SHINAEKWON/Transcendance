function renderAccountPage()
{
    const app = document.getElementById("app");
    
    app.innerHTML = `
        <div class="containerAccountTFs">
            <form id="formAccount" class="formAccount">
                <input class="inputAccount inputAccountName" type="text" id="inputAccountName" placeholder="Full name" required>
                <input class="inputAccount inputAccountUsername" type="text" id="inputAccountUsername" placeholder="Username" required>
                <input class="inputAccount inputAccountEmail" type="email" id="inputAccountEmail" placeholder="Mail" required>
                <input class="inputAccount inputAccountCredit" type="email" id="inputAccountCredit" placeholder="Credit Card Number">
                <button class="btnSubmitAccount" id="btnSubmitAccount" type="submit">Create Account</button>
            </form>
        </div>
    `;
    
    const formAccount = document.getElementById("formAccount");
    formAccount.addEventListener("submit", createAccount);
}
    
function createAccount(event)
{
    // when clicking on a "Submit" button, prevent it from submitting a form
    event.preventDefault();
    
    const inputAccountName = document.getElementById("inputAccountName");
    const inputAccountUsername = document.getElementById("inputAccountUsername");
    const inputAccountEmail = document.getElementById("inputAccountEmail");
    const inputAccountCredit = document.getElementById("inputAccountCredit");

    const name = inputAccountName.value;
    const username = inputAccountUsername.value;
    const mail = inputAccountEmail.value;
    const credit = inputAccountCredit.value;

    writeToFile("", name, username, mail, credit);
    
    navigateTo("login", true);
}

function writeToFile(path, name, username, mail, credit)
{

}
