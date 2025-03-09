function renderGamePage(player1, player2)
{
    const app = document.getElementById("app");

    app.innerHTML = `
        <div id="containerGame" class="containerGame">
            <div id="board" class="board">
                <div id="middleline" class="middleline">
                </div>
                <div id="hor_line" class="hor_line">
                </div>
                <div id="ball" class="ball">
                </div>
                <div id="paddle_left" class="paddle paddle_left">
                </div>
                <div id="paddle_right" class="paddle paddle_right">
                </div>
                <div id="msg_start" class="msg_start msg">
                    NEW GAME
                </div>
                <div id="msg_pressSpace" class="msg_pressSpace msg">
                    Press SPACE to start...
                </div>
            </div>
            <div id="scores" class="scores">
                <div id="score_name_left" class="score_name score_name_left">
                    <div id="score_left" class="score score_left">
                        0
                    </div>
                    <div id="name_left" class="name name_left">
                        ${player1}
                    </div>
                </div>
            
                <div id="score_separator" class="score_separator">
                    :
                </div>
            
                <div id="score_name_right" class="score_name score_name_right">
                    <div id="score_right" class="score score_right">
                        0
                    </div>
                    <div id="name_right" class="name name_right">
                        ${player2}
                    </div>
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

/* ************************************************************************** */
/*                                                                            */
/* Declare variables and constants                                            */
/*                                                                            */
/* ************************************************************************** */

// Game status constants
const GAME_NEW = 0;
const GAME_STARTED = 1;
const GAME_PAUSED = 2;
const GAME_BALLOUT = 3;
const GAME_ENDED = 4;

// direction constants
const LEFT = 0;
const RIGHT = 1;
const UP = 0;
const DOWN = 1;

// board properties
let boardLeft;
let boardRight;
let boardTop;
let boardBottom;

// ball properties
const ballSpeed = 0.5;
let ballX;
let ballY;
let ballSpeedX;
let ballSpeedY;

let ballLeft;
let ballRight;
let ballTop;
let ballBottom;

// paddle properties
let paddleHeight;
let paddleLeftY;
let paddleRightY;
const paddleSpeed = 1;

let paddleLeftLeft;
let paddleLeftRight;
let paddleLeftTop;
let paddleLeftBottom;

let paddleRightLeft;
let paddleRightRight;
let paddleRightTop;
let paddleRightBottom;

// key pressed
let upPressed = false;
let downPressed = false;
let wPressed = false;
let sPressed = false;

// game properties
let game_status = GAME_NEW;

// score properties
const score_winning = 1;
let score_cnt_left;
let score_cnt_right;

/* ************************************************************************** */
/*                                                                            */
/* Event listeners                                                            */
/*                                                                            */
/* ************************************************************************** */
function getPaddlePositionY(leftOrRightPaddle)
{
    if (leftOrRightPaddle == LEFT)
        return (paddleLeftY);
    else if (leftOrRightPaddle == RIGHT)
        return (paddleRightY);
    else
        alert("Error: Wrong Paddle specified");
}

function setPaddlePositionY(leftOrRightPaddle, newPaddleY)
{
    if (leftOrRightPaddle == LEFT)
        paddleLeftY = newPaddleY;
    else if (leftOrRightPaddle == RIGHT)
        paddleRightY = newPaddleY;
    else
        alert("Error: Wrong Paddle specified");
}

function getPaddleLimit(upOrDown)
{
    if (upOrDown == UP)
        return (0 + paddleHeight / 2);
    else if (upOrDown == DOWN)
        return (100 - paddleHeight / 2);
    else
        alert("Error: Wrong Direction specified");
}

function drawPaddles()
{

    const paddle_left = document.getElementById("paddle_left");
    const paddle_right = document.getElementById("paddle_right");

    paddle_left.style.top = `${paddleLeftY}%`;
    paddle_right.style.top = `${paddleRightY}%`;
}

function movePaddle(leftOrRightPaddle, upOrDown)
{
    if (game_status == GAME_STARTED)
    {
        const limit = getPaddleLimit(upOrDown);
        const sign = upOrDown == UP ? 1 : -1;

        let paddleY = getPaddlePositionY(leftOrRightPaddle);

        if (sign * paddleY > sign * limit)
        {
            paddleY = paddleY - (sign * paddleSpeed);
            if (sign * paddleY < sign * limit)
                paddleY = limit;
                
            setPaddlePositionY(leftOrRightPaddle, paddleY);
            drawPaddles();
        }
    }
}

function movePaddles()
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

function keyDownHandler(event)
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

function keyUpHandler(event)
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
function hideMessages()
{
    const msg_pressSpace = document.getElementById("msg_pressSpace");
    const msg_start = document.getElementById("msg_start");
    
    msg_pressSpace.style.visibility = 'hidden';
    msg_start.style.visibility = 'hidden';
}

function showMessages()
{
    const msg_pressSpace = document.getElementById("msg_pressSpace");
    const msg_start = document.getElementById("msg_start");
    
    msg_pressSpace.style.visibility = 'visible';
    msg_start.style.visibility = 'visible';
}

function changeStartMessageText(newText)
{
    msg_start.textContent = newText;
}

function changePressSpaceText(newText)
{
    const msg_pressSpace = document.getElementById("msg_pressSpace");
    
    msg_pressSpace.textContent = newText;
}

function changeStartMessageColor(newColor)
{
    const msg_start = document.getElementById("msg_start");
    
    msg_start.style.color = newColor;
}

function changeGameStatus(newStatus)
{
    game_status = newStatus;
}

function initializeBall()
{
    ballX = 50;
    ballY = 50;
    ballSpeedX = (Math.random() * 2 - 1) * ballSpeed;

    if (Math.abs(ballSpeedX) < 0.3)
    {
        if (ballSpeedX < 0)
            ballSpeedX = -0.3;
        else
            ballSpeedX = 0.3;
    }
    
    const ballDirectionY = Math.random() > 0.5 ? 1 : -1;
    ballSpeedY = Math.sqrt(ballSpeed ** 2 - ballSpeedX ** 2) * ballDirectionY;
}

function initializePaddles()
{
    paddleLeftY = 50;
    paddleRightY = 50;
}

function changeLeftScoreText()
{
    const score_left = document.getElementById("score_left");
    
    score_left.textContent = score_cnt_left;
}

function changeRightScoreText()
{
    const score_right = document.getElementById("score_right");
    
    score_right.textContent = score_cnt_right;
}

function changeScoreTexts()
{
    changeLeftScoreText();
    changeRightScoreText();
}

function loadGame()
{
    changeGameStatus(GAME_NEW);
    showMessages();
    initializeBall();
    initializePaddles();
}

function startGame()
{
    changeGameStatus(GAME_STARTED);
    hideMessages();
    changeScoreTexts();
}

function restartGame()
{
    startGame();
    drawPaddles();
}

function pauseGame()
{
    changeGameStatus(GAME_PAUSED);
    changeStartMessageText("PAUSE");
    changeStartMessageColor("red");
    showMessages();
}

function balloutGame()
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

function unpauseGame()
{
    changeGameStatus(GAME_STARTED);
    hideMessages();
}

function endGame()
{
    const name_left = document.getElementById("name_left");
    const name_right = document.getElementById("name_right");
    let won;
        
    changeGameStatus(GAME_ENDED);
    if (score_cnt_left > score_cnt_right)
    {
        won = 1;
    }
    else
    {
        won = 2;
    }
    navigateTo("revanche", { player1: name_left.textContent, player2: name_right.textContent, won: won });
}

function pressSpace()
{
    if (game_status == GAME_BALLOUT)
        restartGame();
    else if (game_status == GAME_STARTED)
        pauseGame();
    else if (game_status == GAME_PAUSED)
        unpauseGame();
    else if (game_status == GAME_NEW)
        startGame();
    else if (game_status == GAME_ENDED)
    {}
}

















function ballHitsWall()
{
    getBallGeometry();
    getBoardGeometry();
    
    if (ballTop > boardTop && ballBottom < boardBottom)
        return false;
    return true;
}

function getBoardGeometry()
{
    const board = document.getElementById("board");

    boardLeft = board.getBoundingClientRect().left;
    boardRight = board.getBoundingClientRect().right;
    boardTop = board.getBoundingClientRect().top;
    boardBottom = board.getBoundingClientRect().bottom;
}

function getBallGeometry()
{
    const ball = document.getElementById("ball");
    
    ballLeft = ball.getBoundingClientRect().left;
    ballRight = ball.getBoundingClientRect().right;
    ballTop = ball.getBoundingClientRect().top;
    ballBottom = ball.getBoundingClientRect().bottom;
}

function getLeftPaddleGeometry()
{

    const paddle_left = document.getElementById("paddle_left");
    
    paddleLeftLeft = paddle_left.getBoundingClientRect().left;
    paddleLeftRight = paddle_left.getBoundingClientRect().right;
    paddleLeftTop = paddle_left.getBoundingClientRect().top;
    paddleLeftBottom = paddle_left.getBoundingClientRect().bottom;
}

function getRightPaddleGeometry()
{
    const paddle_right = document.getElementById("paddle_right");
    
    paddleRightLeft = paddle_right.getBoundingClientRect().left;
    paddleRightRight = paddle_right.getBoundingClientRect().right;
    paddleRightTop = paddle_right.getBoundingClientRect().top;
    paddleRightBottom = paddle_right.getBoundingClientRect().bottom;
}

function ballHitsLeftPaddle()
{
    getBallGeometry();
    getLeftPaddleGeometry();

    if (ballLeft > paddleLeftRight
    || ballBottom < paddleLeftTop
    || ballTop > paddleLeftBottom)
        return (false);
    return (true);
}

function ballHitsRightPaddle()
{
    getBallGeometry();
    getRightPaddleGeometry();
        
    if (ballRight < paddleRightLeft
    || ballBottom < paddleRightTop
    || ballTop > paddleRightBottom)
        return (false);
    return (true);
}

function ballHitsPaddle()
{
    if (ballHitsLeftPaddle() == true || ballHitsRightPaddle() == true)
    {
        ballSpeedX *= 1.1;
        ballSpeedY *= 1.1;
        return (true);
    }
    return (false);
}

function ballIsLeftOut()
{
    getBallGeometry();
    getBoardGeometry();
    
    if (ballLeft < boardLeft)
        return (true);
    return (false);
}

function ballIsRightOut()
{
    getBallGeometry();
    getBoardGeometry();
    
    if (ballRight > boardRight)
        return (true);
    return (false);
}

function increaseScore(forPlayer)
{
    if (forPlayer == LEFT)
    {
        const name_left = document.getElementById("name_left");
        
        score_cnt_left += 1;
        changeStartMessageText("Point for " + name_left.textContent);
        changeStartMessageColor("cyan");
    }
    else if (forPlayer == RIGHT)
    {
        const name_right = document.getElementById("name_right");
        
        score_cnt_right += 1;
        changeStartMessageText("Point for " + name_right.textContent);
        changeStartMessageColor("yellow");
    }
    else
        alert("Error: Wrong Player specified");
}

function ballIsOut()
{
    if (ballIsLeftOut() == true || ballIsRightOut() == true)
        return (true);
    return (false);
}

function moveBall()
{
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    drawBall();
}

function drawBall()
{
    const ball = document.getElementById("ball");
    
    ball.style.left = `${ballX}%`;
    ball.style.top = `${ballY}%`;
}

function update()
{

    const paddle_left = document.getElementById("paddle_left");
    paddleHeight = paddle_left.offsetHeight / board.offsetHeight * 100;
    
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
    else if (game_status == GAME_ENDED)
    {
        return ;
    }
}

function gameLoop()
{
    update();
    requestAnimationFrame(gameLoop);
}
