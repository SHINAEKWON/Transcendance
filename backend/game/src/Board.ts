class Board extends GameElement
{
    balls: Ball[] = [];
    players: Players;
    
    constructor(
        elementId: string, 
        leftInitialRelative: number, 
        topInitialRelative: number,
        widthFraction: number,
        heightFraction: number | null,
        backgroundColor: string | null,
        parentElement: GameElement | null,
        classList: string[],
        count_balls: number,
        name_left: string | null,
        color_left: string | null,
        keys_left: [string, string][] | null,
        name_top: string | null,
        color_top: string | null,
        keys_top: [string, string][] | null,
        name_right: string | null,
        color_right: string | null,
        keys_right: [string, string][] | null,
        name_bottom: string | null,
        color_bottom: string | null,
        keys_bottom: [string, string][] | null
    )
    {
        if (name_left === null || color_left === null || keys_left === null)
        {
            classList.push("border-l");
        }
        if (name_top === null || color_top === null || keys_top === null)
        {
            classList.push("border-t");
        }
        if (name_right === null || color_right === null || keys_right === null)
        {
            classList.push("border-r");
        }
        if (name_bottom === null || color_bottom === null || keys_bottom === null)
        {
            classList.push("border-b");
        }
            
        super(elementId, leftInitialRelative, topInitialRelative, widthFraction, heightFraction, backgroundColor, parentElement, classList);

        let playerLeft: Player | null = null;
        let playerTop: Player | null = null;
        let playerRight: Player | null = null;
        let playerBottom: Player | null = null;

        if (name_left !== null && color_left !== null && keys_left !== null)
        {
            playerLeft = new Player(name_left, color_left, keys_left, this, "left");
            this.hasLeftWall = false;
        }
        if (name_top !== null && color_top !== null && keys_top !== null)
        {
            playerTop = new Player(name_top, color_top, keys_top, this, "top");
            this.hasTopWall = false;
        }
        if (name_right !== null && color_right !== null && keys_right !== null)
        {
            playerRight = new Player(name_right, color_right, keys_right, this, "right");
            this.hasRightWall = false;
        }
        if (name_bottom !== null && color_bottom !== null && keys_bottom !== null)
        {
            playerBottom = new Player(name_bottom, color_bottom, keys_bottom, this, "bottom");
            this.hasBottomWall = false;
        }

        this.players = 
        {
            left: playerLeft,
            top: playerTop,
            right: playerRight,
            bottom: playerBottom,
        };

        for (let i=0; i < count_balls; ++i)
        {
            this.balls.push(new Ball("ball" + i, this, ["aspect-square", "rounded-full"]));
            this.balls[i].changeText(String(i));
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


    reinitializePlayers(): void
    {
        for (const direction in this.players) {
            const player = this.players[direction as keyof Players];
            if (player !== null)
                player.reinitializePaddles();
        }
    }

    ballHitsPaddle(ball: Ball): Paddle | null
    {
        for (const direction in this.players) {
            const player = this.players[direction as keyof Players];
            if (player !== null)
            {
                let paddle: Paddle | null = player.ballHitsPaddles(ball);
                if (paddle !== null)
                    return paddle;
            }
        } 
        return null;
    }

    movePaddles(board: Board): void
    {
        for (const direction in this.players) {
            const player = this.players[direction as keyof Players];
            if (player !== null)
                player.movePaddles(board);
        } 
    }

    //TODO: check if two players have same score
    getLeadingPlayer(): Player | null
    {
        let leadingPlayer: Player | null = null;
        for (const direction in this.players)
        {
            const player = this.players[direction as keyof Players];
            if (player !== null)
            {
                if (leadingPlayer !== null)
                {
                    if (player.score > leadingPlayer.score)
                        leadingPlayer = player;
                }
                else
                {
                    leadingPlayer = player;
                }
            }
        
        }
        return leadingPlayer;
    }

    checkBalls(): boolean
    {
        for (let i=0; i < this.balls.length; ++i)
        {
            if (this.balls[i].isActive() == true && this.balls[i].hitsWall(this) == true)
                this.balls[i].setSpeedComponents(this.balls[i].getSpeedX(), this.balls[i].getSpeedY() * -1);
        
            else if (this.balls[i].isActive() == true && this.ballHitsPaddle(this.balls[i]) !== null)
            {
                let paddle: Paddle | null = this.ballHitsPaddle(this.balls[i]);
                if (paddle != null)
                {
                    if (paddle.position === "left" || paddle.position === "right")
                        this.balls[i].setSpeedComponents(this.balls[i].getSpeedX() * -1, this.balls[i].getSpeedY());
                    else
                        this.balls[i].setSpeedComponents(this.balls[i].getSpeedX(), this.balls[i].getSpeedY() * -1);
                    this.balls[i].increaseSpeed(0.1);
                }
            }

            else if (this.balls[i].isActive() == true && this.balls[i].isLeftOut(this) == true)
            {
                this.balls[i].desactivate();
                
                if (this.players.left !== null)
                    this.players.left.increaseScore();
                //this.msgMain.changeText("Point for " + this.playerRight.name);
                //this.msgMain.changeTextColor("yellow");

                return true;
            }
            
            else if (this.balls[i].isActive() == true && this.balls[i].isRightOut(this) == true)
            {
                this.balls[i].desactivate();

                if (this.players.right !== null)
                    this.players.right.increaseScore();
                //this.msgMain.changeText("Point for " + this.playerLeft.name);
                //this.msgMain.changeTextColor("cyan");
                
                return true;
            }
            
            else if (this.balls[i].isActive() == true && this.balls[i].isTopOut(this) == true)
            {
                this.balls[i].desactivate();

                if (this.players.top !== null)
                    this.players.top.increaseScore();
                //this.msgMain.changeText("Point for " + this.playerLeft.name);
                //this.msgMain.changeTextColor("cyan");
                
                return true;
            }
            
            else if (this.balls[i].isActive() == true && this.balls[i].isBottomOut(this) == true)
            {
                this.balls[i].desactivate();

                if (this.players.bottom !== null)
                    this.players.bottom.increaseScore();
                //this.msgMain.changeText("Point for " + this.playerLeft.name);
                //this.msgMain.changeTextColor("cyan");
                
                return true;
            }
        }
        return false;
    }
}
