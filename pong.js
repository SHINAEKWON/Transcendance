/*
TODO:
- Winner with 10
- Increase ball speed with round (?)
*/

/* ************************************************************************** */
/*                                                                            */
/* Get graphical elements                                                     */
/*                                                                            */
/* ************************************************************************** */
const board = document.getElementById("board");
const ball = document.getElementById("ball");

const paddle_left = document.getElementById("paddle_left");
const paddle_right = document.getElementById("paddle_right");

const msg_pressSpace = document.getElementById("msg_pressSpace");
const msg_start = document.getElementById("msg_start");

const score_left = document.getElementById("score_left");
const score_right = document.getElementById("score_right");

const name_left = document.getElementById("name_left");
const name_right = document.getElementById("name_right");

/*
const middleline = document.getElementById("middleline");
const scores = document.getElementById("scores");
const socre_name_left = document.getElementById("score_name_left");
const score_name_right = document.getElementById("score_name_right");
const score_separator = document.getElementById("score_separator");
*/

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
const paddleSpeed = 10;

let paddleLeftLeft;
let paddleLeftRight;
let paddleLeftTop;
let paddleLeftBottom;

let paddleRightLeft;
let paddleRightRight;
let paddleRightTop;
let paddleRightBottom;

// game properties
let game_status = GAME_NEW;

// score properties
let score_cnt_left = 0;
let score_cnt_right = 0;

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

document.addEventListener
(
    "keydown", (event) => 
    {
        switch (event.key)
        {
            case "ArrowUp":
                movePaddle(RIGHT, UP);
                break ;
            case "ArrowDown":
                movePaddle(RIGHT, DOWN);
                break ;
            case "w":
                movePaddle(LEFT, UP);
                break ;
            case "s":
                movePaddle(LEFT, DOWN);
                break ;
            case " ":
                pressSpace();
                break ;
            default:
        }
    }
);

/* ************************************************************************** */
/* space key -> game start and pause                                          */
/* ************************************************************************** */
function hideMessages()
{
    msg_pressSpace.style.visibility = 'hidden';
    msg_start.style.visibility = 'hidden';
}

function showMessages()
{
    msg_pressSpace.style.visibility = 'visible';
    msg_start.style.visibility = 'visible';
}

function changeStartMessageText(newText)
{
    msg_start.textContent = newText;
}

function changeStartMessageColor(newColor)
{
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
    score_left.textContent = score_cnt_left;
}

function changeRightScoreText()
{
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
}

function unpauseGame()
{
    changeGameStatus(GAME_STARTED);
    hideMessages();
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
    boardLeft = board.getBoundingClientRect().left;
    boardRight = board.getBoundingClientRect().right;
    boardTop = board.getBoundingClientRect().top;
    boardBottom = board.getBoundingClientRect().bottom;
}

function getBallGeometry()
{
    ballLeft = ball.getBoundingClientRect().left;
    ballRight = ball.getBoundingClientRect().right;
    ballTop = ball.getBoundingClientRect().top;
    ballBottom = ball.getBoundingClientRect().bottom;
}

function getLeftPaddleGeometry()
{
    paddleLeftLeft = paddle_left.getBoundingClientRect().left;
    paddleLeftRight = paddle_left.getBoundingClientRect().right;
    paddleLeftTop = paddle_left.getBoundingClientRect().top;
    paddleLeftBottom = paddle_left.getBoundingClientRect().bottom;
}

function getRightPaddleGeometry()
{
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
        return (true);
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
        score_cnt_left += 1;
        changeStartMessageText("Point for " + name_left.textContent);
        changeStartMessageColor("cyan");
    }
    else if (forPlayer == RIGHT)
    {
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
    ball.style.left = `${ballX}%`;
    ball.style.top = `${ballY}%`;
}

function update()
{
    paddleHeight = paddle_left.offsetHeight / board.offsetHeight * 100;
    
    if (game_status == GAME_STARTED)
    {
        moveBall();
        
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
    requestAnimationFrame(update);
}






/* ************************************************************************** */
/*                                                                            */
/* Get names                                                                  */
/*                                                                            */
/* ************************************************************************** */
function getAndCheckName(side)
{
   let name = "";
   let promptText = "\nEnter the " + side + " player's name: \n\n";
   
   promptText += "    Name can not be empty!\n";
   promptText += "    Name can have maximum 10 characters!\n";
   promptText += "    Name must start with letter or digit!\n";
   
   while (name == "")
   {
       name = prompt(promptText);
       if (name == null || name == "")
           name = "";
       else if (name.length > 10)
           name = "";
       else if (name.charAt(0) < '0' 
       || (name.charAt(0) > '9' && name.charAt(0) < 'A') 
       || (name.charAt(0) > 'Z' && name.charAt(0) < 'a')
       || name.charAt(0) > 'z')
           name = "";
       else
           return (name);
   }
}

function getNames()
{
    name_left.textContent = getAndCheckName("LEFT");
    name_right.textContent = getAndCheckName("RIGHT");
}

getNames();
update();
