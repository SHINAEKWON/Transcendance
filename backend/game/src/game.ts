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
    
        document.addEventListener("keydown", keyDownHandler);
        document.addEventListener("keyup", keyUpHandler);

        changeGameStatus(GAME_NEW);
        score_cnt_left = 0;
        score_cnt_right = 0;
        gameLoop();
    }
}





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

    constructor(leftOrRight: number)
    {
        if (leftOrRight == LEFT)
            this.element = document.getElementById("paddle_left") as HTMLDivElement;
        else if (leftOrRight == RIGHT)
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
    
    getLimitY(upOrDown: number): number
    {
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
    
    move(upOrDown: number)
    {
        const limit = this.getLimitY(upOrDown);
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

class board
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

/* ************************************************************************** */
/*                                                                            */
/* Declare variables and constants                                            */
/*                                                                            */
/* ************************************************************************** */

// Game status constants
const GAME_NEW: number = 0;
const GAME_STARTED: number = 1;
const GAME_PAUSED: number = 2;
const GAME_BALLOUT: number = 3;
const GAME_ENDED: number = 4;
const GAME_LOADED: number = 5;

// direction constants
const LEFT: number = 0;
const RIGHT: number = 1;
const UP: number = 0;
const DOWN: number = 1;

// key pressed
let upPressed: boolean = false;
let downPressed: boolean = false;
let wPressed: boolean = false;
let sPressed: boolean = false;

// game properties
let game_status: number = GAME_NEW;

// score properties
const score_winning: number = 1;
let score_cnt_left: number;
let score_cnt_right: number;

/* ************************************************************************** */
/*                                                                            */
/* Event listeners                                                            */
/*                                                                            */
/* ************************************************************************** */


function movePaddles(): void
{
    if (upPressed)
    {
        movePaddle(RIGHT, UP);
    }
    if (downPressed)
    {
        movePaddle(RIGHT, DOWN);
    }
    if (wPressed)
    {
        movePaddle(LEFT, UP);
    }
    if (sPressed)
    {
        movePaddle(LEFT, DOWN);
    }
}

function keyDownHandler(event: KeyboardEvent): void
{
    switch (event.key)
    {
        case "ArrowUp":
            upPressed = true;
            break ;
        case "ArrowDown":
            downPressed = true;
            break ;
        case "w":
            wPressed = true;
            break ;
        case "s":
            sPressed = true;
            break ;
        case " ":
            pressSpace();
            break ;
        default:
    }
}

function keyUpHandler(event: KeyboardEvent): void
{
    switch (event.key)
    {
        case "ArrowUp":
            upPressed = false;
            break ;
        case "ArrowDown":
            downPressed = false;
            break ;
        case "w":
            wPressed = false;
            break ;
        case "s":
            sPressed = false;
            break ;
        default:
    }
}

/* ************************************************************************** */
/* space key -> game start and pause                                          */
/* ************************************************************************** */
function hideMessages(): void
{
    const msg_pressSpace: HTMLElement | null = document.getElementById("msg_pressSpace");
    const msg_start: HTMLElement | null = document.getElementById("msg_start");
    
    if (msg_pressSpace)
    {
        msg_pressSpace.style.visibility = 'hidden';
    }
    if (msg_start)
        {
            msg_start.style.visibility = 'hidden';
        }
}

function showMessages()
{
    const msg_pressSpace: HTMLElement | null = document.getElementById("msg_pressSpace");
    const msg_start: HTMLElement | null = document.getElementById("msg_start");
    
    if (msg_pressSpace)
    {
        msg_pressSpace.style.visibility = 'visible';
    }

    if (msg_start)
    {
        msg_start.style.visibility = 'visible';
    }
}

function changeStartMessageText(newText: string): void
{
    const msg_start: HTMLElement | null = document.getElementById("msg_start");

    if (msg_start)
    {
        msg_start.textContent = newText;
    }
}

function changeStartMessageColor(newColor: string): void
{
    const msg_start: HTMLElement | null = document.getElementById("msg_start");
    
    if (msg_start)
    {
        msg_start.style.color = newColor;
    }
}

function changeGameStatus(newStatus: number): void
{
    game_status = newStatus;
}

function initializePaddles(): void
{
    upPressed = false;
    downPressed = false;
    wPressed = false;
    sPressed = false;
}

function changeLeftScoreText(): void
{
    const score_left: HTMLElement | null = document.getElementById("score_left");
    
    if (score_left)
    {
        score_left.textContent = String(score_cnt_left);
    }
}

function changeRightScoreText(): void
{
    const score_right: HTMLElement | null = document.getElementById("score_right");
    
    if (score_right)
    {
        score_right.textContent = String(score_cnt_right);
    }
}

function changeScoreTexts(): void
{
    changeLeftScoreText();
    changeRightScoreText();
}

function loadGame(): void
{
    showMessages();
    initializeBall();
    initializePaddles();
    changeGameStatus(GAME_LOADED);
}

function startGame(): void
{
    changeGameStatus(GAME_STARTED);
    hideMessages();
    changeScoreTexts();
}

function restartGame(): void
{
    startGame();
    drawPaddles();
}

function pauseGame(): void
{
    changeGameStatus(GAME_PAUSED);
    changeStartMessageText("PAUSE");
    changeStartMessageColor("red");
    showMessages();
}

function balloutGame(): void
{
    changeGameStatus(GAME_BALLOUT);
    showMessages();
    initializeBall();
    initializePaddles();
    if (score_cnt_left == score_winning || score_cnt_right == score_winning)
    {
        restartGame()
        endGame()
    }
}

function unpauseGame(): void
{
    changeGameStatus(GAME_STARTED);
    hideMessages();
}

function endGame(): void
{
    const name_left: HTMLElement | null = document.getElementById("name_left");
    const name_right: HTMLElement | null = document.getElementById("name_right");
    let won;
        
    changeGameStatus(GAME_ENDED);
    if (score_cnt_left > score_cnt_right)
    {
        won = "left";
    }
    else
    {
        won = "right";
    }
    if (name_left && name_right)
    {
        navigateTo("revanche", true, name_left.textContent, name_right.textContent, won);
    }
}

function pressSpace(): void
{
    if (game_status == GAME_BALLOUT)
        restartGame();
    else if (game_status == GAME_STARTED)
        pauseGame();
    else if (game_status == GAME_PAUSED)
        unpauseGame();
    else if (game_status == GAME_NEW || GAME_LOADED)
        startGame();
    else if (game_status == GAME_ENDED)
    {}
}

















function ballHitsWall(): boolean
{
    getBallGeometry();
    getBoardGeometry();
    
    if (ballTop > boardTop && ballBottom < boardBottom)
        return false;
    return true;
}

function ballHitsLeftPaddle(): boolean
{
    getBallGeometry();
    getLeftPaddleGeometry();

    if (ballLeft > paddleLeftRight
    || ballBottom < paddleLeftTop
    || ballTop > paddleLeftBottom)
        return (false);
    return (true);
}

function ballHitsRightPaddle(): boolean
{
    getBallGeometry();
    getRightPaddleGeometry();
        
    if (ballRight < paddleRightLeft
    || ballBottom < paddleRightTop
    || ballTop > paddleRightBottom)
        return (false);
    return (true);
}

function ballHitsPaddle(): boolean
{
    if (ballHitsLeftPaddle() == true || ballHitsRightPaddle() == true)
    {
        ballSpeedX *= 1.1;
        ballSpeedY *= 1.1;
        return (true);
    }
    return (false);
}

function ballIsLeftOut(): boolean
{
    getBallGeometry();
    getBoardGeometry();
    
    if (ballLeft < boardLeft)
        return (true);
    return (false);
}

function ballIsRightOut(): boolean
{
    getBallGeometry();
    getBoardGeometry();
    
    if (ballRight > boardRight)
        return (true);
    return (false);
}

function increaseScore(forPlayer: number): void
{
    if (forPlayer == LEFT)
    {
        const name_left: HTMLElement | null = document.getElementById("name_left");
        
        score_cnt_left += 1;
        if (name_left)
        {
            changeStartMessageText("Point for " + name_left.textContent);
            changeStartMessageColor("cyan");
        }
    }
    else if (forPlayer == RIGHT)
    {
        const name_right: HTMLElement | null = document.getElementById("name_right");
        
        score_cnt_right += 1;
        if (name_right)
        {
            changeStartMessageText("Point for " + name_right.textContent);
            changeStartMessageColor("yellow");
        }
    }
    else
        alert("Error: Wrong Player specified");
}

function ballIsOut(): boolean
{
    if (ballIsLeftOut() == true || ballIsRightOut() == true)
        return (true);
    return (false);
}

function update(): void
{

    const paddle_left: HTMLElement | null = document.getElementById("paddle_left");
    const board: HTMLElement | null = document.getElementById("board");

    if (paddle_left && board)
    {
        paddleHeight = paddle_left.offsetHeight / board.offsetHeight * 100;
    }
    
    if (game_status == GAME_STARTED)
    {
        moveBall();
        movePaddles();
        
        if (ballHitsWall() == true)
            ballSpeedY *= -1;
        
        else if (ballHitsPaddle() == true)
            ballSpeedX *= -1;
    
        else if (ballIsLeftOut() == true)
        {
            increaseScore(RIGHT);
            balloutGame();
        }
        else if (ballIsRightOut() == true)
        {
            increaseScore(LEFT);
            balloutGame();
        }
    }
    else if (game_status == GAME_NEW)
    {
        loadGame();
    }
    else if (game_status == GAME_PAUSED)
    {
    
    }
    else if (game_status == GAME_BALLOUT)
    {

    }
    else if (game_status == GAME_LOADED)
    {

    }
    else if (game_status == GAME_ENDED)
    {
        return ;
    }
}

function gameLoop(): void
{
    update();
    requestAnimationFrame(gameLoop);
}
