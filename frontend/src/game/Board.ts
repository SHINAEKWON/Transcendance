import { Ball } from "./Ball.js";
import { A_GameElement } from "./A_GameElement.js";
import { Players, Player } from "./Player.js";
import { GameMode, Paddle } from "./Paddle.js";
import { Position } from "./constants.js";

export class Board extends A_GameElement
{
    balls: Ball[] = [];
    players: Players;
    isLeft: boolean;
    socket: any;
    idPlayerLeft: number;
    idPlayerRight: number;
    isMaster: boolean;
    constructor({elementId, leftInitialRelative, topInitialRelative, widthFraction, heightFraction, backgroundColor, parentElement, classList, count_balls, name_left, color_left, keys_left, isAI_left, avatarPlayerLeft, name_right, color_right, keys_right, isAI_right,avatarPlayerRight,  socket, mode, idPlayerLeft, idPlayerRight, isLeft, isMaster}:
    {
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
        isAI_left: boolean,
        avatarPlayerLeft: string | null,
        name_right: string | null,
        color_right: string | null,
        keys_right: [string, string][] | null,
        isAI_right: boolean,
        avatarPlayerRight: string | null,
        socket: any,
        mode: GameMode,
        idPlayerLeft: number,
        idPlayerRight: number,
        isLeft: boolean,
        isMaster: boolean
        
    })
    {
       
        if (name_left === null || color_left === null || keys_left === null)
        {
            classList.push("border-l");
        }
        if (name_right === null || color_right === null || keys_right === null)
        {
            classList.push("border-r");
        }   
        super(
        {
            elementId: elementId,
            leftInitialRelative: leftInitialRelative,
            topInitialRelative: topInitialRelative, 
            widthFraction: widthFraction, 
            heightFraction: heightFraction, 
            backgroundColor: backgroundColor, 
            parentElement: parentElement, 
            classList: classList
        });
        this.isLeft = isLeft;
        this.socket = socket;
        this.isMaster = isMaster;
        this.idPlayerLeft = idPlayerLeft;
        this.idPlayerRight = idPlayerRight;
        let playerLeft: Player | null = null;
        let playerRight: Player | null = null;

        if (name_left !== null && color_left !== null && keys_left !== null && avatarPlayerLeft != null)
        {
            playerLeft = new Player({id: idPlayerLeft, name: name_left, avatar: avatarPlayerLeft ,color: color_left, paddleKeys: keys_left, parentElement: this, position: Position.Left, isAI: isAI_left, socket, mode, vs: idPlayerRight});
            this.leftWall = false;
        }
       
        if (name_right !== null && color_right !== null && keys_right !== null && avatarPlayerRight != null)
        {
            playerRight = new Player({id: idPlayerRight, name: name_right, avatar: avatarPlayerRight, color: color_right, paddleKeys: keys_right, parentElement: this, position: Position.Right, isAI: isAI_right, socket, mode, vs: idPlayerLeft});
            this.rightWall = false;
        }
        

        this.players = 
        {
            left: playerLeft,
            right: playerRight
        };

        for (let i=0; i < count_balls; ++i)
        {
            this.balls.push(new Ball({ballId: "ball" + i, onBoard: this, classList: ["aspect-square", "rounded-full"]}));
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

    moveBallsRemote(isRemote : boolean, isMasterBall: boolean, socket : any, idPlayer: number): void
    {
        for (let i=0; i < this.balls.length; ++i)
        {
            this.balls[i].moveBall(null, isRemote, isMasterBall,socket, idPlayer);
        }
    }

    moveBalls(): void
    {
        for (let i=0; i < this.balls.length; ++i)
        {
            this.balls[i].move();
        }
    }


    setPositionBallAndDraw(pX: number, pY: number): void
    {
        for (let i=0; i < this.balls.length; ++i)
        {
            this.balls[i].setPositionBallAndDraw(pX, pY);
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

    movePaddles(): void
    {
        for (const direction in this.players) {
            const player = this.players[direction as keyof Players];
            if (player !== null)
                player.movePaddles(this);
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
                this.balls[i].increaseSpeed(0.1, this.balls[i].getInitialSpeed() * 3);
            }

            else if (this.balls[i].isActive() == true && (outPosition = this.balls[i].isOut(this)) !== Position.None)
            {
                this.balls[i].desactivate();
                
                if (outPosition == Position.Left && this.players.right !== null)
                    this.players.right.increaseScore();
                if (outPosition == Position.Right && this.players.left !== null)
                    this.players.left.increaseScore();
                return true;
            }
        }
        return false;
    }

    checkBallsRemte(): boolean
    {
        let outPosition: Position;

        for (let i=0; i < this.balls.length; ++i)
        {
            if (this.balls[i].isActive() == true && this.balls[i].hitsWall(this) == true)
            {
                
            }
        
            else if (this.balls[i].isActive() == true)
            {
                let hitPaddle = this.ballHitsPaddle(this.balls[i]);
                if(hitPaddle != null && (hitPaddle.getPosition() == Position.Right && this.isLeft || hitPaddle.getPosition() == Position.Left && !this.isLeft) ){
                    return false;
                }else {
                    let dSpeed = 0.1;
                    let maxSpeed =  this.balls[i].getInitialSpeed() * 3;
                    this.balls[i].increaseSpeed(dSpeed, maxSpeed);
                    this.socket.emit("increaseSpeed", {
                        to: ""+(this.isLeft ? this.idPlayerRight : this.idPlayerLeft),
                        action: "increaseSpeed",
                        dSpeed,
                        maxSpeed


                    });

                }
               
            }

            else if (this.balls[i].isActive() == true)
            {
               let outPosition = this.balls[i].isOut(this);
               if(outPosition !== Position.None && this.isMaster){

                this.balls[i].desactivate();
                this.socket.emit("desactivateBall", {
                    to: ""+(this.isLeft ? this.idPlayerRight : this.idPlayerLeft),
                    action: "desactivateBall"
                });
                
                if (outPosition == Position.Left && this.players.right !== null)
                {
                    this.players.right.increaseScore();
                    this.socket.emit("increaseRightScore", {
                        to: ""+(this.isLeft ? this.idPlayerRight : this.idPlayerLeft),
                        action: "increaseRightScore"
                    });

                }
                    
                if (outPosition == Position.Right && this.players.left !== null) {
                    this.players.left.increaseScore();
                    this.socket.emit("increaseLeftScore", {
                        to: ""+(this.isLeft ? this.idPlayerRight : this.idPlayerLeft),
                        action: "increaseLeftScore"
                    });
                }
                this.socket.emit("ballOut", {
                    to: ""+(this.isLeft ? this.idPlayerRight : this.idPlayerLeft),
                    action: "ballOut"
                });
                return true;
               }

            }
        }
        return false;
    }

    removeEventListeners(): void
    {
        for (let i = 0; i < this.balls.length; ++i)
        {
            this.balls[i].removeEventListeners();
        }
        this.players.left?.removeEventListeners();
        this.players.right?.removeEventListeners();

        super.removeEventListeners();
    }

    setIsMaster(isMaster: boolean){
        this.isMaster = isMaster;
    }

    getPlayers(): Players{
        return this.players;
    }

}
