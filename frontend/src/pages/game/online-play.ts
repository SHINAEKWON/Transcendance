export class OnlinePlayPage implements Page{
    render() {
        const html = `
            <h1 class="text-3xl text-neon-blue text-center">Online Multiplayer Mode</h1>
            <p class="text-center text-gray-400">Find a friend and start a match!</p>
            <a href="#game" class="text-neon-purple">Back to Game Modes</a>
        `;

        const app = document.getElementById('app');
        if(app){
            app.innerHTML = html;
        }
        
    }
}
