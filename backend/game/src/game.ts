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
const UP: number = 2;
const DOWN: number = 3;

// score constants
const score_winning: number = 5;

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
        `;
    
        if (player1 && player2)
        {
            if (!game)
            {
                game = new Game(player1, player2);
                game.loop();
            }
        }
    }
}

/* ************************************************************************** */
/*                                                                            */
/* Game Logic                                                                 */
/*                                                                            */
/* ************************************************************************** */

abstract class GameElement
{
    element: HTMLDivElement;
    
    initialLeft: number;
    initialTop: number;
    
    newLeft: number;
    newTop: number;

    currentLeft: number = 0;
    currentRight: number = 0;
    currentTop: number = 0;
    currentBottom: number = 0;
    
    eventListeners: { [key: string]: EventListener } = {};
    
    constructor(
        elementId: string, 
        initialLeft: number, 
        initialTop: number,
        parentElement: GameElement | null = null,
        classList: string[] = []
    )
    {
        alert("creating " + elementId);
        this.element = document.createElement('div');
        alert("a " + elementId);

        this.element.id = elementId;
        alert("b " + elementId);

        if (classList)
            this.element.classList.add(...classList);
        alert("c " + elementId);


        if (parentElement)
        {
            parentElement.element.appendChild(this.element);
            alert("appended " + this.element.id + " to " + parentElement.element.id);
        }
        else
        {
            alert("no parent");
            const app: HTMLElement | null = document.getElementById("app");
            if (app)
            {
                app.appendChild(this.element);
                alert("appended " + this.element.id + " to " + app.id);
            }
            else
            {
                throw new Error('No app div');
            }
        }

        this.initialLeft = initialLeft;
        this.initialTop = initialTop;
        
        this.newLeft = this.initialLeft;
        this.newTop = this.initialTop;
        
        this.getCurrentGeometry();
    }
    
    setPosition(newLeft: number | null, newTop: number | null): void
    {
        if (newLeft !== null)
            this.newLeft = newLeft;
        if (newTop !== null)
            this.newTop = newTop;
    }
    
    setLeft(newLeft: number): void
    {
        this.setPosition(newLeft, null);
    }
    
    setTop(newTop: number): void
    {
        this.setPosition(null, newTop);
    }
    
    getCurrentGeometry()
    {
        this.currentLeft = this.element.getBoundingClientRect().left;
        this.currentRight = this.element.getBoundingClientRect().right;
        this.currentTop = this.element.getBoundingClientRect().top;
        this.currentBottom = this.element.getBoundingClientRect().bottom;
    }
    
    initializePosition(): void
    {
        this.setPosition(this.initialLeft, this.initialTop);
    }

    draw(): void
    {
        this.element.style.left = `${this.newLeft}%`;
        this.element.style.top = `${this.newTop}%`;
    }
    
    isInsideTop(ofElement: GameElement): boolean
    {
        this.getCurrentGeometry();
        ofElement.getCurrentGeometry();
        
        if (this.currentTop > ofElement.currentTop)
            return true;
        return false; 
    }
    
    isInsideBottom(ofElement: GameElement): boolean
    {
        this.getCurrentGeometry();
        ofElement.getCurrentGeometry();
        
        if (this.currentBottom < ofElement.currentBottom)
            return true;
        return false; 
    }
    
    isInsideLeft(ofElement: GameElement): boolean
    {
        this.getCurrentGeometry();
        ofElement.getCurrentGeometry();
        
        if (this.currentLeft > ofElement.currentLeft)
            return true;
        return false;
    }
    
    isInsideRight(ofElement: GameElement): boolean
    {
        this.getCurrentGeometry();
        ofElement.getCurrentGeometry();
        
        if (this.currentRight < ofElement.currentRight)
            return true;
        return false;
    }
    
    rightTouchesLeft(ofElement: GameElement): boolean
    {
        this.getCurrentGeometry();
        ofElement.getCurrentGeometry();
        
        if (this.currentRight < ofElement.currentLeft
        || this.currentLeft > ofElement.currentRight
        || this.currentBottom < ofElement.currentTop
        || this.currentTop > ofElement.currentBottom)
            return false;
        return true;
    }
    
    leftTouchesRight(ofElement: GameElement): boolean
    {
        this.getCurrentGeometry();
        ofElement.getCurrentGeometry();
        
        if (this.currentLeft > ofElement.currentRight
        || this.currentRight < ofElement.currentLeft
        || this.currentBottom < ofElement.currentTop
        || this.currentTop > ofElement.currentBottom)
            return false;
        return true;
    }

    touchesLeftOrRight(ofElement: GameElement): boolean
    {
        return (this.rightTouchesLeft(ofElement) || this.leftTouchesRight(ofElement));
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

    changeTextColor(newColor: string): void
    {
        this.element.style.color = newColor;
    }
    
    changeBackgroundColor(newColor: string): void
    {
        this.element.style.backgroundColor = newColor;
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
}

abstract class MovingGameElement extends GameElement
{
    speed: number;
    speedX: number = 0;
    speedY: number = 0;
    
    constructor(elementId: string, newLeft: number, newTop: number, speed: number, parentElement: GameElement, classList: string[] = [])
    {
        super(elementId, newLeft, newTop, parentElement, classList);
        this.speed = speed;
        this.initializeSpeed();
    }
    
    setSpeedComponents(speedX: number, speedY: number): void
    {
        this.speedX = speedX;
        this.speedY = speedY;
    }
    
    move(insideElement: GameElement | null = null): void
    {
        this.newLeft += this.speedX;
        this.newTop += this.speedY;
        
        if (insideElement !== null
        && (this.speedY < 0 && !this.isInsideTop(insideElement)
        ||  this.speedY > 0 && !this.isInsideBottom(insideElement)))
        { 
            this.newLeft -= this.speedX;
            this.newTop -= this.speedY;
            return ;
        }
        this.draw();
    }
    
    increaseSpeed(dSpeed: number): void
    {
        this.speedX *= (1 + dSpeed);
        this.speedY *= (1 + dSpeed);
    }
    
    abstract initializeSpeed(): void;
}

class Ball extends MovingGameElement
{
    constructor(parentElement: GameElement, classList: string[] = [])
    {
        alert("initializing ball to " + parentElement.element.id);
        super("ball", 50, 50, 0.5, parentElement, classList);
    }

    initializeSpeed()
    {
        // initialize x-speed
        let speedX = (Math.random() * 2 - 1) * this.speed;
        if (Math.abs(speedX) < 0.3)
        {
            speedX = speedX < 0 ? -0.3 : 0.3;
        }
        
        // initialize y-speed
        const ballDirectionY = Math.random() > 0.5 ? 1 : -1;
        let speedY = Math.sqrt(this.speed ** 2 - speedX ** 2) * ballDirectionY;
        
        this.setSpeedComponents(speedX, speedY);
    }

    hitsWall(board: Board): boolean
    {
        if (this.isInsideTop(board) && this.isInsideBottom(board))
            return false;
        return (true);
    }

    hitsPaddle(paddle: Paddle): boolean
    {
        return this.touchesLeftOrRight(paddle);
    }

    isLeftOut(board: Board): boolean
    {
        if (this.isInsideLeft(board))
            return (false);
        return (true);
    }
    
    isRightOut(board: Board): boolean
    {
        if (this.isInsideRight(board))
            return (false);
        return (true);
    }
    
    isOut(board: Board): boolean
    {
        if (this.isLeftOut(board) == true || this.isRightOut(board) == true)
            return (true);
        return (false);
    }
}

class Board extends GameElement
{
    constructor(classList: string[] = [])
    {
        super("board", 0, 0, null, classList);
    }
}

class Message extends GameElement
{
    constructor(text: string, mainOrSideMessage: number, parentElement: GameElement, classList: string[] = [])
    {
        if (mainOrSideMessage == MAINMESSAGE)
        {
            super("msg_start", 0, 0, parentElement, classList);
            this.changeText(text);
        }
        else if (mainOrSideMessage == SIDEMESSAGE)
        {
            super("msg_pressSpace", 0, 0, parentElement, classList);
            this.changeText(text);
        }
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

    constructor(leftOrRight: number, name: string, parentElement: GameElement)
    {
        this.score = 0;
        this.leftOrRight = leftOrRight;
        this.name = name;

        // get score element
        if (this.leftOrRight == LEFT)
        {
            this.paddle = new Paddle(0, leftOrRight, "w", "s", parentElement, ["absolute" ,"top-1/2" ,"left-0" ,"w-[0.3%]" ,"h-[15%]" ,"bg-cyan-400" ,"transform", "-translate-y-1/2"]);
            this.elementScore = document.getElementById("score_left") as HTMLDivElement;
        }
        else if (this.leftOrRight == RIGHT)
        {
            this.paddle = new Paddle(100, leftOrRight, "ArrowUp", "ArrowDown", parentElement, ["absolute" ,"top-1/2" ,"right-0" ,"w-[0.3%]" ,"h-[15%]" ,"bg-yellow-400" ,"transform", "-translate-y-1/2"]);
            this.elementScore = document.getElementById("score_right") as HTMLDivElement;
        }
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

class Paddle extends MovingGameElement
{
    leftOrRight: number;
    
    upKey: string;
    downKey: string;

    constructor(initialLeft: number, leftOrRight: number, upKey: string, downKey: string, parentElement: GameElement, classList: string[] = [])
    {
        if (leftOrRight == LEFT)
            super("paddle_left", initialLeft, 50, 1, parentElement, classList);
        else if (leftOrRight == RIGHT)
            super("paddle_right", initialLeft, 50, 1, parentElement, classList);
        else
            throw new Error('Paddle not found');
            
        this.leftOrRight = leftOrRight;
        this.upKey = upKey;
        this.downKey = downKey;
        
        this.initializeEventListeners();
    }

    initializeSpeed()
    {
        this.setSpeedComponents(0, 0);
    }
    
    keyDownHandler(event: KeyboardEvent): void
    {
        switch (event.key)
        {
            case this.upKey:
                this.setSpeedComponents(0, -this.speed);
                break ;
            case this.downKey:
                this.setSpeedComponents(0, this.speed);
                break ;
            default:
        }
    }
    
    keyUpHandler(event: KeyboardEvent): void
    {
        switch (event.key)
        {
            case this.upKey:
                this.setSpeedComponents(0, 0);
                break ;
            case this.downKey:
                this.setSpeedComponents(0, 0);
                break ;
            default:
        }
    }
    
    initializeEventListeners(): void
    {
        this.eventListeners["keydown"] = this.keyDownHandler.bind(this) as EventListener;
        this.eventListeners["keyup"] = this.keyUpHandler.bind(this) as EventListener;
        
        document.addEventListener("keydown", this.eventListeners["keydown"]);
        document.addEventListener("keyup", this.eventListeners["keyup"]);
    }
}

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
