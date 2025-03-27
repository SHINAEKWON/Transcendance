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
const score_winning: number = 5;

class Game
{
    board: Board = new Board(["relative", "w-9/12", "h-4/5", "border-t", "border-b", "border-white"]);
    ball: Ball = new Ball(this.board, ["absolute", "top-1/2", "left-1/2", "w-[3%]", "aspect-square", "bg-white", "rounded-full", "transform", "-translate-x-1/2", "-translate-y-1/2"]);

    msgMain: Message = new Message("NEW GAME", MAINMESSAGE, this.board, ["absolute", "left-1/2", "top-1/4", "w-3/4", "h-1/5", "text-center", "text-red-500", "text-4xl", "border-dotted", "border-2", "border-red-500", "flex", "items-center", "justify-center", "transform", "-translate-x-1/2"]);
    msgSide: Message = new Message("Press SPACE to start...", SIDEMESSAGE, this.board, ["absolute", "left-1/2", "top-3/4", "w-3/4", "h-1/10", "text-center", "text-red-500", "text-2xl", "border-dotted", "border-2", "border-red-500", "flex", "items-center", "justify-center", "transform", "-translate-x-1/2"]);

    state: number;

    playerLeft: Player;
    playerRight: Player;

    animationFrameID: number | null = null;
    
    eventListeners: { [key: string]: EventListener } = {};

    constructor(nameLeft: string, nameRight: string)
    {
        this.playerLeft = new Player(LEFT, nameLeft, this.board);
        this.playerRight = new Player(RIGHT, nameRight, this.board); 

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
            navigateTo("revanche", true, this.playerLeft.name, this.playerRight.name);
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
        this.playerLeft.paddle.draw();
        this.playerRight.paddle.draw();
    }

    pause(): void
    {
        this.changeState(GAME_PAUSED);
        this.msgMain.changeText("PAUSE");
        this.msgMain.changeTextColor("red");
        this.showMessages();
    }

    ballout(): void
    {
        this.changeState(GAME_PAUSED);
        this.showMessages();
        this.ball.initializePosition();
        this.ball.initializeSpeed();
        this.playerLeft.paddle.initializePosition();
        this.playerRight.paddle.initializePosition();

        if (this.playerLeft.score == score_winning)
        {
            this.end(LEFT);
        }
        else if (this.playerRight.score == score_winning)
        {
            this.end(RIGHT);
        }
    }

    end(won: number): void
    {
        this.changeState(GAME_ENDED);
        if (won == LEFT)
        {
            this.msgMain.changeText("Player " + this.playerLeft.name + " wins!");
            this.msgMain.changeTextColor("cyan");
        }
        else if (won == RIGHT)
        {
            this.msgMain.changeText("Player " + this.playerRight.name + " wins!");
            this.msgMain.changeTextColor("yellow");
        }

        this.showMessages();
    }

    update(): void
    {
        if (this.state == GAME_STARTED)
        {
            this.ball.move();
            this.playerLeft.paddle.move(this.board);
            this.playerRight.paddle.move(this.board);
            
            if (this.ball.hitsWall(this.board) == true)
                this.ball.speedY *= -1;
        
            else if (this.ball.hitsPaddle(this.playerLeft.paddle) == true
            || this.ball.hitsPaddle(this.playerRight.paddle) == true)
            {
                this.ball.speedX *= -1;
                this.ball.increaseSpeed(0.1);
            }

            else if (this.ball.isLeftOut(this.board) == true)
            {
                this.playerRight.increaseScore();
                this.playerRight.changeScoreText();
                this.msgMain.changeText("Point for " + this.playerRight.name);
                this.msgMain.changeTextColor("yellow");

                this.ballout();
            }
            
            else if (this.ball.isRightOut(this.board) == true)
            {
                this.playerLeft.increaseScore();
                this.playerLeft.changeScoreText();
                this.msgMain.changeText("Point for " + this.playerLeft.name);
                this.msgMain.changeTextColor("cyan");

                this.ballout();
            }
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