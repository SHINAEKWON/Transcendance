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
const count_balls: number = 2;
let active_balls: number = count_balls;

class Game
{
    board: Board = new Board(["border-t", "border-b", "border-white"]);
    balls: Ball[] = [];

    msgMain: Message = new Message("NEW GAME", MAINMESSAGE, this.board, ["text-center", "text-red-500", "text-4xl", "border-dotted", "border-2", "border-red-500"]);
    msgSide: Message = new Message("Press SPACE to start...", SIDEMESSAGE, this.board, ["text-center", "text-red-500", "text-2xl", "border-dotted", "border-2", "border-red-500"]);

    state: number;

    players: Player[] = [];

    animationFrameID: number | null = null;
    
    eventListeners: { [key: string]: EventListener } = {};

    constructor(nameLeft: string, nameRight: string)
    {
        this.state = GAME_NEW;

        this.players.push(new Player(nameLeft, "cyan", [["w", "s"], ["e", "d"], ["r", "f"]], 0, this.board));
        this.players.push(new Player(nameRight, "yellow", [["ArrowUp", "ArrowDown"]], 100, this.board));

        this.players.push(new Player("hello", "red", [["c", "v"]], 70, this.board));


        for (let i=0; i < count_balls; ++i)
        {
            this.balls.push(new Ball("ball" + i, this.board, ["aspect-square", "rounded-full"]));
            this.balls[i].changeText(String(i));
        }

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
            navigateTo("revanche", true, this.players[0].name, this.players[1].name);
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

    reinitializeBalls(): void
    {
        for (let i=0; i < this.balls.length; ++i)
        {
            this.balls[i].activate();
            this.balls[i].reinitializePosition();
            this.balls[i].initializeSpeed();
        }
    }

    moveBalls(): void
    {
        for (let i=0; i < this.balls.length; ++i)
        {
            this.balls[i].move();
        }
    }
    
    countActiveBalls(): number
    {
        let countActiveBalls: number = 0;
        for (let i=0; i < this.balls.length; ++i)
        {
            if (this.balls[i].isActive() == true)
                ++countActiveBalls;
        } 
        return countActiveBalls;
    }

    reinitializePlayers(): void
    {
        for (let i = 0; i < this.players.length; ++i)
        {
            this.players[i].reinitializePaddles();
        }
    }

    checkGameEnded(): boolean
    {
        for (let i = 0; i < this.players.length; ++i)
        {
            if (this.players[i].score >= score_winning * count_balls)
                return true;
        } 
        return false;
    }

    //TODO: check if two players have same score
    getLeadingPlayer(): Player
    {
        let leadingPlayer: Player = this.players[0];
        for (let i = 0; i < this.players.length; ++i)
        {
            if (this.players[i].score > leadingPlayer.score)
                leadingPlayer = this.players[i];
        } 
        return leadingPlayer;
    }

    ballout(): void
    {
        if (this.countActiveBalls() == 0)
        {
            this.changeState(GAME_PAUSED);
            this.showMessages();
            this.reinitializeBalls()
            this.reinitializePlayers();

            if (this.checkGameEnded() == true)
            {
                this.end();
            }
        }
    }

    end(): void
    {
        this.changeState(GAME_ENDED);

        const winningPlayer = this.getLeadingPlayer();

        this.msgMain.changeText("Player " + winningPlayer.name + " wins!");
        this.msgMain.changeTextColor(winningPlayer.color);

        this.showMessages();
    }

    ballHitsPaddles(ball: Ball): boolean
    {
        for (let i = 0; i < this.players.length; ++i)
        {
            if (this.players[i].ballHitsPaddles(ball) == true)
                return true;
        } 
        return false;
    }

    movePaddles(board: Board): void
    {
        for (let i = 0; i < this.players.length; ++i)
        {
            this.players[i].movePaddles(board);
        } 
    }

    checkBalls(): void
    {
        for (let i=0; i < this.balls.length; ++i)
        {
            if (this.balls[i].isActive() == true && this.balls[i].hitsWall(this.board) == true)
                this.balls[i].setSpeedComponents(this.balls[i].getSpeedX(), this.balls[i].getSpeedY() * -1);
        
            else if (this.balls[i].isActive() == true && this.ballHitsPaddles(this.balls[i]) == true)
            {
                this.balls[i].setSpeedComponents(this.balls[i].getSpeedX() * -1, this.balls[i].getSpeedY());
                this.balls[i].increaseSpeed(0.1);
            }

            else if (this.balls[i].isActive() == true && this.balls[i].isLeftOut(this.board) == true)
            {
                this.balls[i].desactivate();
                this.players[1].increaseScore();
                //this.msgMain.changeText("Point for " + this.playerRight.name);
                //this.msgMain.changeTextColor("yellow");

                this.ballout();
            }
            
            else if (this.balls[i].isActive() == true && this.balls[i].isRightOut(this.board) == true)
            {
                this.balls[i].desactivate();
                this.players[0].increaseScore();
                //this.msgMain.changeText("Point for " + this.playerLeft.name);
                //this.msgMain.changeTextColor("cyan");
                
                this.ballout();
            }
        }
    }

    update(): void
    {
        if (this.state == GAME_STARTED)
        {
            this.moveBalls();
            this.movePaddles(this.board);
            
            this.checkBalls();
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
