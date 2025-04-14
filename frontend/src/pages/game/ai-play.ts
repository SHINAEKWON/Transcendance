export class AIPlayPage implements Page{
    render() {
        let html = `
            <h1 class="text-3xl text-neon-blue text-center">AI Challenge Mode</h1>
            <p class="text-center text-gray-400">Face the ultimate AI. Are you ready?</p>
            <a href="#game" class="text-neon-purple">Back to Game Modes</a>
        `;

        const app = document.getElementById('app');
        if(app){
            app.innerHTML = html;
        }
    }
}
