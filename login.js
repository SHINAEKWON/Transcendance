function renderLoginPage()
{
    const app = document.getElementById("app");
    
    app.innerHTML = `
        <div class="containerNameInput">
            <h1 class="inputNameHeading">Enter names</h1>
            <form id="formNames" class="formNames">
                <input class="inputName inputNameLeft" type="text" id="inputNameLeft" placeholder="Left player" required>
                <input class="inputName inputNameRight" type="text" id="inputNameRight" placeholder="Right player" required>
                <button class="btnSubmitName" id="btnSubmitName" type="submit">Start Game</button>
            </form>
        </div>
    `;
    
    const formNames = document.getElementById("formNames");
    formNames.addEventListener("submit", submitNames);
}
    
function submitNames(event)
{
    // when clicking on a "Submit" button, prevent it from submitting a form
    event.preventDefault();
    
    const inputNameLeft = document.getElementById("inputNameLeft");
    const inputNameRight = document.getElementById("inputNameRight");

    const nameLeft = inputNameLeft.value;
    const nameRight = inputNameRight.value;

    navigateTo("game", true, nameLeft, nameRight);
}