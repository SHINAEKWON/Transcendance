// Game status constants
const GAME_NEW: number = 0;
const GAME_STARTED: number = 1;
const GAME_PAUSED: number = 2;
const GAME_ENDED: number = 3;

// direction constants
const LEFT: number = 0;
const RIGHT: number = 1;
const UP: number = 2;
const DOWN: number = 3;

// score constants
const score_winning: number = 1;

class Game
{
    board: Board;
    
    msgMain: Message; 
    msgSide: Message;

    state: number;

    animationFrameID: number | null = null;
    
    eventListeners: { [key: string]: EventListener } = {};

    constructor(nameLeft: string, nameRight: string)
    {
        this.board = new Board("board", 10, 10, 75, 80, null, null, ["border-t", "border-b", "border-white"], 2, nameLeft, "yellow", [["w", "s"]], "alex", "red", [["r", "t"]], nameRight, "cyan", [["ArrowUp", "ArrowDown"]], null, null, null);

        this.msgMain = new Message("NEW GAME", MAINMESSAGE, this.board, ["text-center", "text-red-500", "text-4xl", "border-dotted", "border-2", "border-red-500"]);
        this.msgSide = new Message("Press SPACE to start...", SIDEMESSAGE, this.board, ["text-center", "text-red-500", "text-2xl", "border-dotted", "border-2", "border-red-500"]);

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
            navigateTo("revanche", true, "hello", "ciao");
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

    hideMessages(): void
    {
        this.msgMain.hide();
        this.msgSide.hide();
    }

    showMessages(): void
    {
        this.msgMain.show();
        this.msgSide.show();
    }

    start(): void
    {
        this.changeState(GAME_STARTED);
        this.hideMessages();
    }

    pause(): void
    {
        this.changeState(GAME_PAUSED);
        this.msgMain.changeText("PAUSE");
        this.msgMain.changeTextColor("red");
        this.showMessages();
    }

    checkGameEnded(): boolean
    {
        const leadingPlayer: Player | null = this.board.getLeadingPlayer();
        if (leadingPlayer !== null)
        {
            if (leadingPlayer.score >= score_winning)
                return true;
        }
        return false;
    }

    ballout(): void
    {
        if (this.board.countActiveBalls() == 0)
        {
            this.changeState(GAME_PAUSED);
            this.showMessages();
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

        const winningPlayer: Player | null = this.board.getLeadingPlayer();

        if (winningPlayer !== null)
        {
            this.msgMain.changeText("Player " + winningPlayer.name + " wins!");
            this.msgMain.changeTextColor(winningPlayer.color);
        }
        this.showMessages();
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
