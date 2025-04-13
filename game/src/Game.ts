import { Board } from "./Board.js";
import { Player } from "./Player.js";

// Game status constants
const GAME_NEW: number = 0;
const GAME_STARTED: number = 1;
const GAME_PAUSED: number = 2;
const GAME_ENDED: number = 3;

// direction constants
enum Direction
{
    Left,
    Up,
    Right,
    Down
}

// position constants
export enum Position
{
    Left,
    Top,
    Right,
    Bottom,
    None
}

export class Game
{
    private readonly score_winning: number = 1;

    private board: Board;
    private state: number;
    private animationFrameID: number | null = null;
    private eventListeners: { [key: string]: EventListener } = {};

    constructor()
    {
        this.board = new Board("board", 10, 10, 80, 80, "black", null, ["border-white"], 10, 
        "left", "yellow", [["w", "s"]], 
        "top", "red", [["ArrowLeft", "ArrowRight"]], 
        "right", "cyan", [["ArrowUp", "ArrowDown"]], 
        "bottom", "blue", [["a", "d"]]);
        //null, null, null,
        //null, null, null,
        //null, null, null);

        this.state = GAME_NEW;
        this.initializeEventListeners();
    }

    private initializeEventListeners(): void
    {
        this.eventListeners["keydown"] = this.keyDownHandler.bind(this) as EventListener;
        
        document.addEventListener("keydown", this.eventListeners["keydown"]);
    }

    private changeState(newState: number): void
    {
        this.state = newState;
    }

    private pressSpace(): void
    {
        if (this.state == GAME_NEW || this.state == GAME_PAUSED)
            this.start();
        else if (this.state == GAME_STARTED)
            this.pause();
        else if (this.state == GAME_ENDED)
        {
            //window.location.hash = "no page";
        }
    }
    
    private keyDownHandler(event: KeyboardEvent): void
    {
        switch (event.key)
        {
            case " ":
                this.pressSpace();
                break ;
            default:
        }
    }

    private start(): void
    {
        this.changeState(GAME_STARTED);
    }

    private pause(): void
    {
        this.changeState(GAME_PAUSED);
    }

    private checkGameEnded(): boolean
    {
        const leadingPlayer: Player | null = this.board.getLoosingPlayer();
        if (leadingPlayer !== null)
        {
            if (leadingPlayer.getScore() >= this.score_winning)
                return true;
        }
        return false;
    }

    private ballout(): void
    {
        if (this.board.countActiveBalls() == 0)
        {
            this.changeState(GAME_PAUSED);
            this.board.reinitializeBalls()
            this.board.reinitializePlayers();

            if (this.checkGameEnded() == true)
            {
                this.end();
            }
        }
    }

    private end(): void
    {
        this.changeState(GAME_ENDED);

        const loosingPlayer: Player | null = this.board.getLoosingPlayer();
    }

    private update(): void
    {
        if (this.state == GAME_STARTED)
        {
            this.board.moveBalls();
            this.board.movePaddles(this.board);
            
            if (this.board.checkBalls() == true)
                this.ballout();
        }
    }

    loop(): void
    {
        this.update();
        this.animationFrameID = requestAnimationFrame(()=>this.loop());
    }
    
    private stopLoop(): void
    {
        if (this.animationFrameID !== null)
        {
            cancelAnimationFrame(this.animationFrameID);
            this.animationFrameID = null;
        }
    }

    private removeEventListeners(): void
    {
        for (const event in this.eventListeners)
        {
            if (this.eventListeners.hasOwnProperty(event))
            {
                document.removeEventListener(event, this.eventListeners[event]);
                console.log(`Event listener for ${event} removed.`);
            }
        }
        this.eventListeners = {};

        this.board.removeEventListeners();
    }
    
    destroy(): void
    {
        this.stopLoop();
        this.removeEventListeners();
    }
}
