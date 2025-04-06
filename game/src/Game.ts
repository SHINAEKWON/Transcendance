import { Board } from "./Board.js";
import { Ball } from "./Ball.js";
import { Player } from "./Player.js";
import { navigateTo } from "./page_navigation.js";
import { nullifyGame } from "./page_game.js";


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

    board: Board;
    state: number;
    animationFrameID: number | null = null;
        eventListeners: { [key: string]: EventListener } = {};

    constructor()
    {
        this.board = new Board("board", 10, 10, 75, 80, null, null, ["border-white"], 1, 
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

    initializeEventListeners(): void
    {
        this.eventListeners["keydown"] = this.keyDownHandler.bind(this) as EventListener;
        
        document.addEventListener("keydown", this.eventListeners["keydown"]);
    }

    changeState(newState: number): void
    {
        this.state = newState;
    }

    pressSpace(): void
    {
        if (this.state == GAME_NEW || this.state == GAME_PAUSED)
            this.start();
        else if (this.state == GAME_STARTED)
            this.pause();
        else if (this.state == GAME_ENDED)
        {
            this.state = GAME_NEW;
            nullifyGame();
            navigateTo("game", true);
        }
    }
    
    keyDownHandler(event: KeyboardEvent): void
    {
        switch (event.key)
        {
            case " ":
                this.pressSpace();
                break ;
            default:
        }
    }

    start(): void
    {
        this.changeState(GAME_STARTED);
    }

    pause(): void
    {
        this.changeState(GAME_PAUSED);
    }

    checkGameEnded(): boolean
    {
        const leadingPlayer: Player | null = this.board.getLoosingPlayer();
        if (leadingPlayer !== null)
        {
            if (leadingPlayer.getScore() >= this.score_winning)
                return true;
        }
        return false;
    }

    ballout(): void
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

    end(): void
    {
        this.changeState(GAME_ENDED);

        const loosingPlayer: Player | null = this.board.getLoosingPlayer();
    }

    update(): void
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
    
    stopLoop(): void
    {
        if (this.animationFrameID !== null)
        {
            cancelAnimationFrame(this.animationFrameID);
            this.animationFrameID = null;
        }
    }

    removeEventListeners(): void
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
    }
    
    destroy(): void
    {
        this.stopLoop();
        this.removeEventListeners();
    }
}
