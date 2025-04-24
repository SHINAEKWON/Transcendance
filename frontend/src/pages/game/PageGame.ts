
import { A_Page } from "./A_Page.js";
import { Game } from "./Game.js";

export class PageGame extends A_Page implements Page
{
    game: Game | null = null;
    socket: any | null = null;


    render(){
        this.clear();
        
        this.socket = getSocket()!;
        if(this.socket){
            console.log("socket OKKKKKKKKKKKKKKK");
        }else{
            console.log("KOOOOOOOOOOOOOOOOOOOOOOOOOO")
        }
        this.load_page();
        
    }

    load_page(): void
    {
        
            console.log('game not null 00')
            this.game = new Game("asma101010", null, "zedzoud", null, null, this.socket!, "remote", 34, 38);
            this.game.loop();
        
    }

    leave(): string
    {
        this.game?.destroy();
        this.nullifyGame();
        return "";
    }

    private nullifyGame(): void
    {
        if (this.game != null)
            this.game = null;
    }
}

    // ici c'est une fonction utilitaire pour acceder à l’objet socket.io
    function getSocket(): any | undefined {
        return (window as any).socket;
    }