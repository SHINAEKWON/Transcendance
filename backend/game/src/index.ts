document.addEventListener("DOMContentLoaded", function() {
    sayGreeting();
});

const sayGreeting = (): void => {
    setTimeout(function() {
        let greeting: HTMLElement = document.createElement("p");
        greeting.innerText = "I'm using TypeScript!";
        document.getElementById('app')?.appendChild(greeting);
    }, 3000)
}
