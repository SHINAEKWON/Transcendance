import { Ball } from "./Ball.js";
import { A_GameElement } from "./A_GameElement.js";
import { Players, Player } from "./Player.js";
import { Paddle } from "./Paddle.js";
import { Position } from "./Game.js";

export class Board extends A_GameElement
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
        parentElement: A_GameElement | null,
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
            playerLeft = new Player(name_left, color_left, keys_left, this, Position.Left);
            this.leftWall = false;
        }
        if (name_top !== null && color_top !== null && keys_top !== null)
        {
            playerTop = new Player(name_top, color_top, keys_top, this, Position.Top);
            this.topWall = false;
        }
        if (name_right !== null && color_right !== null && keys_right !== null)
        {
            playerRight = new Player(name_right, color_right, keys_right, this, Position.Right);
            this.rightWall = false;
        }
        if (name_bottom !== null && color_bottom !== null && keys_bottom !== null)
        {
            playerBottom = new Player(name_bottom, color_bottom, keys_bottom, this, Position.Bottom);
            this.bottomWall = false;
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
            //this.balls[i].changeText(String(i));
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
            this.balls[i].reinitialize();
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

    getLoosingPlayer(): Player | null
    {
        let loosingPlayer: Player | null = null;
        let secondPlayer: Player | null = null

        for (const direction in this.players)
        {
            const player = this.players[direction as keyof Players];
            if (player !== null)
            {
                if (loosingPlayer !== null)
                {
                    if (player.getScore() > loosingPlayer.getScore())
                    {
                        secondPlayer = loosingPlayer;
                        loosingPlayer = player;
                    }
                }
                else
                {
                    loosingPlayer = player;
                }
            }
        
        }
        if (secondPlayer !== null)
        {
            if (loosingPlayer !== null)
            {
                if (loosingPlayer.getScore() == secondPlayer.getScore())
                    return null;
            }
        }
        return loosingPlayer;
    }

    checkBalls(): boolean
    {
        let outPosition: Position;

        for (let i=0; i < this.balls.length; ++i)
        {
            if (this.balls[i].isActive() == true && this.balls[i].hitsWall(this) == true)
            {
                
            }
        
            else if (this.balls[i].isActive() == true && this.ballHitsPaddle(this.balls[i]) !== null)
            {
                this.balls[i].increaseSpeed(0.1);
            }

            else if (this.balls[i].isActive() == true && (outPosition = this.balls[i].isOut(this)) !== Position.None)
            {
                this.balls[i].desactivate();
                
                if (outPosition == Position.Left && this.players.left !== null)
                    this.players.left.increaseScore();
                if (outPosition == Position.Right && this.players.right !== null)
                    this.players.right.increaseScore();
                if (outPosition == Position.Top && this.players.top !== null)
                    this.players.top.increaseScore();
                if (outPosition == Position.Bottom && this.players.bottom !== null)
                    this.players.bottom.increaseScore();
                return true;
            }
        }
        return false;
    }
}
