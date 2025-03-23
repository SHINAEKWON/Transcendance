/* ************************************************************************** */
/*                                                                            */
/* Declare constants                                                          */
/*                                                                            */
/* ************************************************************************** */

// Game status constants
const GAME_NEW: number = 0;
const GAME_STARTED: number = 1;
const GAME_PAUSED: number = 2;
const GAME_ENDED: number = 3;

// direction constants
const LEFT: number = 0;
const RIGHT: number = 1;
const UP: number = 0;
const DOWN: number = 1;

// score constants
const score_winning: number = 1;

// message constants
const MAINMESSAGE: number = 0;
const SIDEMESSAGE: number = 1;

/* ************************************************************************** */
/*                                                                            */
/* Render                                                                     */
/*                                                                            */
/* ************************************************************************** */
function renderGamePage(player1: string | null, player2: string | null)
{
    const app: HTMLElement | null = document.getElementById("app");
    
    if (app)
    {
        app.innerHTML = `
        <div class="relative w-full h-screen flex flex-col items-center justify-center bg-black">
            <div id="board" class="relative w-9/12 h-4/5 border-t border-b border-white">
                <div class="absolute left-1/2 w-px h-full bg-white"></div>
                <div class="absolute top-1/2 w-full h-px bg-white"></div>
                <div id="ball" class="absolute top-1/2 left-1/2 w-[3%] aspect-square bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                <div id="paddle_left" class="absolute top-1/2 left-0 w-[0.3%] h-[15%] bg-cyan-400 transform -translate-y-1/2"></div>
                <div id="paddle_right" class="absolute top-1/2 right-0 w-[0.3%] h-[15%] bg-yellow-400 transform -translate-y-1/2"></div>
                <div id="msg_start" class="absolute left-1/2 top-1/4 w-3/4 h-1/5 text-center text-red-500 text-4xl border-dotted border-2 border-red-500 flex items-center justify-center transform -translate-x-1/2">
                    NEW GAME
                </div>
                <div id="msg_pressSpace" class="absolute left-1/2 top-3/4 w-3/4 h-1/10 text-center text-red-500 text-2xl border-dotted border-2 border-red-500 flex items-center justify-center transform -translate-x-1/2">
                    Press SPACE to start...
                </div>
            </div>
    
            <div class="absolute top-[90%] left-1/2 w-9/12 h-[7%] text-4xl transform -translate-x-1/2 flex items-center justify-between">
                <div class="w-[47%] flex items-center">
                    <div id="score_left" class="text-cyan-400 w-1/5 text-left">0</div>
                    <div id="name_left" class="text-cyan-400 w-4/5 text-left">${player1}</div>
                </div>
                <div class="w-[6%] text-center">:</div>
                <div class="w-[47%] flex items-center justify-end">
                    <div id="name_right" class="text-yellow-400 w-4/5 text-right">${player2}</div>
                    <div id="score_right" class="text-yellow-400 w-1/5 text-right">0</div>
                </div>
            </div>
        </div>
        `;
    
        if (player1 && player2)
        {
            let game: Game = new Game(player1, player2);
            game.loop();
        }
    }
}

/* ************************************************************************** */
/*                                                                            */
/* Game Logic                                                                 */
/*                                                                            */
/* ************************************************************************** */

class Ball
{
    static readonly speed: number = 0.5;

    element: HTMLDivElement;

    x: number = 0;
    y: number = 0;
    speedX: number = 0;
    speedY: number = 0;

    left: number = 0;
    right: number = 0;
    top: number = 0;
    bottom: number = 0;

    constructor()
    {
        this.element = document.getElementById("ball") as HTMLDivElement;
        if (!this.element)
        {
            throw new Error('Ball not found');
        }
        this.initializePosition();
        this.initializeSpeed();
    }

    initializePosition(): void
    {
        this.x = 50;
        this.y = 50;
    }

    initializeSpeed(): void
    {
        // initialize x-speed
        this.speedX = (Math.random() * 2 - 1) * Ball.speed;
        if (Math.abs(this.speedX) < 0.3)
        {
            this.speedX = this.speedX < 0 ? -0.3 : 0.3;
        }
        
        // initialize y-speed
        const ballDirectionY = Math.random() > 0.5 ? 1 : -1;
        this.speedY = Math.sqrt(Ball.speed ** 2 - this.speedX ** 2) * ballDirectionY;
    }
    
    getCurrentGeometry()
    {
        this.left = this.element.getBoundingClientRect().left;
        this.right = this.element.getBoundingClientRect().right;
        this.top = this.element.getBoundingClientRect().top;
        this.bottom = this.element.getBoundingClientRect().bottom;
    }

    move(): void
    {
        this.x += this.speedX;
        this.y += this.speedY;
        this.draw();
    }
    
    draw(): void
    {        
        this.element.style.left = `${this.x}%`;
        this.element.style.top = `${this.y}%`;
    }

    hitsWall(board: Board): boolean
    {
        this.getCurrentGeometry();
        board.getCurrentGeometry();
        
        if (this.top > board.top && this.bottom < board.bottom)
            return false;
        return true;
    }
    
    hitsPaddle(paddle: Paddle): boolean
    {
        this.getCurrentGeometry();
        paddle.getCurrentGeometry();

        let ballSide: number = 0;
        let paddleSide: number = 0;

        if (paddle.leftOrRight == LEFT)
        {
            ballSide = this.left;
            paddleSide = paddle.right;
        }
        else if (paddle.leftOrRight == RIGHT)
        {
            ballSide = -1 * this.right;
            paddleSide = -1 * paddle.left;
        }

        if (ballSide > paddleSide     
        || this.bottom < paddle.top
        || this.top > paddle.bottom)
            return (false);
        return (true);
    }

    increaseSpeed(dSpeed: number): void
    {
        this.speedX *= (1 + dSpeed);
        this.speedY *= (1 + dSpeed);
    }
    
    isLeftOut(board: Board): boolean
    {
        this.getCurrentGeometry();
        board.getCurrentGeometry();
        
        if (this.left < board.left)
            return (true);
        return (false);
    }
    
    isRightOut(board: Board): boolean
    {
        this.getCurrentGeometry();
        board.getCurrentGeometry();
        
        if (this.right > board.right)
            return (true);
        return (false);
    }
    
    isOut(board: Board): boolean
    {
        if (this.isLeftOut(board) == true || this.isRightOut(board) == true)
            return (true);
        return (false);
    }
}

class Paddle
{
    static readonly speed: number = 1;

    element: HTMLDivElement;

    y: number = 0;

    height: number = 0;

    left: number = 0;
    right: number = 0;
    top: number = 0;
    bottom: number = 0;

    leftOrRight: number;

    constructor(leftOrRight: number)
    {
        this.leftOrRight = leftOrRight;

        if (this.leftOrRight == LEFT)
            this.element = document.getElementById("paddle_left") as HTMLDivElement;
        else if (this.leftOrRight == RIGHT)
            this.element = document.getElementById("paddle_right") as HTMLDivElement;
        else
            throw new Error('Paddle not found');
        if (!this.element)
        {
            throw new Error('Paddle not found');
        }
        this.initializePosition();
    }

    initializePosition(): void
    {
        this.y = 50;
    }

    getY(): number
    {
        return this.y;
    }
    
    setY(newY: number): void
    {
        this.y = newY;
    }
    
    getLimitY(upOrDown: number, board: Board): number
    {
        this.height = this.element.offsetHeight / board.element.offsetHeight * 100;
        if (upOrDown == DOWN)
            return (100 - this.height / 2);
        else if (upOrDown == UP)
            return (0 + this.height / 2);
        return 0;
    }

    draw(): void
    {
        this.element.style.top = `${this.y}%`;
    }
    
    move(upOrDown: number, board: Board)
    {
        const limit = this.getLimitY(upOrDown, board);
        const sign = upOrDown == UP ? 1 : -1;
    
        let newY = this.getY();
    
        if (sign * newY > sign * limit)
        {
            newY = newY - (sign * Paddle.speed);
            if (sign * newY < sign * limit)
                newY = limit;
                   
            this.setY(newY);
            this.draw();
        }
    }

    getCurrentGeometry(): void
    {
        this.left = this.element.getBoundingClientRect().left;
        this.right = this.element.getBoundingClientRect().right;
        this.top = this.element.getBoundingClientRect().top;
        this.bottom = this.element.getBoundingClientRect().bottom;
    }
}

class Board
{
    element: HTMLDivElement;

    left: number = 0;
    right: number = 0;
    top: number = 0;
    bottom: number = 0;

    constructor()
    {
        this.element = document.getElementById("board") as HTMLDivElement;
        if (!this.element)
        {
            throw new Error('Board not found');
        }
    }

    getCurrentGeometry(): void
    {
        this.left = this.element.getBoundingClientRect().left;
        this.right = this.element.getBoundingClientRect().right;
        this.top = this.element.getBoundingClientRect().top;
        this.bottom = this.element.getBoundingClientRect().bottom;
    }
}

class Message
{
    element: HTMLDivElement;

    constructor(mainOrSideMessage: number)
    {
        if (mainOrSideMessage == MAINMESSAGE)
            this.element = document.getElementById("msg_start") as HTMLDivElement;
        else if (mainOrSideMessage == SIDEMESSAGE)
            this.element = document.getElementById("msg_pressSpace") as HTMLDivElement;
        else
            throw new Error('Message not found');
        if (!this.element)
        {
            throw new Error('Message not found');
        }
    }

    hide(): void
    {        
        this.element.style.visibility = 'hidden';
    }

    show(): void
    {
        this.element.style.visibility = 'visible';
    }

    changeText(newText: string): void
    {
        this.element.textContent = newText;
    }

    changeColor(newColor: string): void
    {
        this.element.style.color = newColor;
    }
}

class Player
{
    leftOrRight: number;

    score: number;
    name: string;

    elementScore: HTMLDivElement;
    elementName: HTMLDivElement;

    paddle: Paddle;

    constructor(leftOrRight: number, name: string)
    {
        this.score = 0;
        this.leftOrRight = leftOrRight;
        this.name = name;
        this.paddle = new Paddle(leftOrRight);

        // get score element
        if (this.leftOrRight == LEFT)
            this.elementScore = document.getElementById("score_left") as HTMLDivElement;
        else if (this.leftOrRight == RIGHT)
            this.elementScore = document.getElementById("score_right") as HTMLDivElement;
        else
            throw new Error('Score not found');
        if (!this.elementScore)
        {
            throw new Error('Score not found');
        }

        // get name element
        if (this.leftOrRight == LEFT)
            this.elementName = document.getElementById("name_left") as HTMLDivElement;
        else if (this.leftOrRight == RIGHT)
            this.elementName = document.getElementById("name_right") as HTMLDivElement;
        else
            throw new Error('Name not found');
        if (!this.elementName)
        {
            throw new Error('Name not found');
        }
    }

    changeScoreText(): void
    {
        this.elementScore.textContent = String(this.score);
    }
    
    increaseScore(): void
    {
        this.score += 1;
    }
}



class Game
{
    board: Board = new Board();
    ball: Ball = new Ball();

    msgMain: Message = new Message(MAINMESSAGE);
    msgSide: Message = new Message(SIDEMESSAGE);

    state: number;

    upPressed: boolean = false;
    downPressed: boolean = false;
    wPressed: boolean = false;
    sPressed: boolean = false;

    playerLeft: Player;
    playerRight: Player;

    animationFrameID: number | null = null;

    constructor(nameLeft: string, nameRight: string)
    {
        this.playerLeft = new Player(LEFT, nameLeft);
        this.playerRight = new Player(RIGHT, nameRight); 

        this.state = GAME_NEW;

        document.addEventListener("keydown", this.keyDownHandler.bind(this));
        document.addEventListener("keyup", this.keyUpHandler.bind(this));
    }

    changeState(newState: number): void
    {
        this.state = newState;
    }

    keyDownHandler(event: KeyboardEvent): void
    {
        switch (event.key)
        {
            case "ArrowUp":
                this.upPressed = true;
                break ;
            case "ArrowDown":
                this.downPressed = true;
                break ;
            case "w":
                this.wPressed = true;
                break ;
            case "s":
                this.sPressed = true;
                break ;
            case " ":
                this.pressSpace();
                break ;
            default:
        }
    }
    
    keyUpHandler(event: KeyboardEvent): void
    {
        switch (event.key)
        {
            case "ArrowUp":
                this.upPressed = false;
                break ;
            case "ArrowDown":
                this.downPressed = false;
                break ;
            case "w":
                this.wPressed = false;
                break ;
            case "s":
                this.sPressed = false;
                break ;
            default:
        }
    }

    movePaddles(): void
    {
        if (this.upPressed)
        {
            this.playerRight.paddle.move(UP, this.board);
        }
        if (this.downPressed)
        {
            this.playerRight.paddle.move(DOWN, this.board);
        }
        if (this.wPressed)
        {
            this.playerLeft.paddle.move(UP, this.board);
        }
        if (this.sPressed)
        {
            this.playerLeft.paddle.move(DOWN, this.board);
        }
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
        this.msgMain.changeColor("red");
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
        if (this.animationFrameID !== null)
        {
            cancelAnimationFrame(this.animationFrameID);
            this.animationFrameID = null;
        }
        if (won == LEFT)
        {
            this.msgMain.changeText("Player " + this.playerLeft.name + " wins!");
            this.msgMain.changeColor("cyan");
        }
        else if (won == RIGHT)
        {
            this.msgMain.changeText("Player " + this.playerRight.name + " wins!");
            this.msgMain.changeColor("yellow");
        }

        this.showMessages();
    }

    update(): void
    {
        if (this.state == GAME_STARTED)
        {
            this.ball.move();
            this.movePaddles();
            
            
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
                this.msgMain.changeColor("yellow");

                this.ballout();
            }
            else if (this.ball.isRightOut(this.board) == true)
            {
                this.playerLeft.increaseScore();
                this.playerLeft.changeScoreText();
                this.msgMain.changeText("Point for " + this.playerLeft.name);
                this.msgMain.changeColor("cyan");

                this.ballout();
            }
        }
    }

    loop(): void
    {
        this.update();
        this.animationFrameID = requestAnimationFrame(()=>this.loop());
    }
}