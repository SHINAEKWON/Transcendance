import { Ball } from "./Ball.js";
import { A_GameElement } from "./A_GameElement.js";
import { Players, Player } from "./Player.js";
import { GameMode, Paddle } from "./Paddle.js";
import { Position } from "./constants.js";

export class Board extends A_GameElement {
    balls: Ball[] = [];
    players: Players;
    isMasterBall: boolean;
    socket: any;
    idPlayer: number;

    constructor({ elementId, leftInitialRelative, topInitialRelative, widthFraction, heightFraction, backgroundColor, parentElement, classList, count_balls, name_left, color_left, keys_left, isAI_left, avatarPlayerLeft, name_right, color_right, keys_right, isAI_right, avatarPlayerRight, socket, mode, idPlayerLeft, idPlayerRight, isMasterBall, idPlayer }:
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
            isMasterBall: boolean,
            idPlayer: number

        }) {
        if (name_left === null || color_left === null || keys_left === null) {
            classList.push("border-l");
        }
        if (name_right === null || color_right === null || keys_right === null) {
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
        this.isMasterBall = isMasterBall;
        this.socket = socket;
        this.idPlayer = idPlayer;
        let playerLeft: Player | null = null;
        let playerRight: Player | null = null;

        if (name_left !== null && color_left !== null && keys_left !== null && avatarPlayerLeft != null) {
            playerLeft = new Player({ id: idPlayerLeft, name: name_left, avatar: avatarPlayerLeft, color: color_left, paddleKeys: keys_left, parentElement: this, position: Position.Left, isAI: isAI_left, socket, mode, vs: idPlayerRight });
            this.leftWall = false;
        }

        if (name_right !== null && color_right !== null && keys_right !== null && avatarPlayerRight != null) {
            playerRight = new Player({ id: idPlayerRight, name: name_right, avatar: avatarPlayerRight, color: color_right, paddleKeys: keys_right, parentElement: this, position: Position.Right, isAI: isAI_right, socket, mode, vs: idPlayerLeft });
            this.rightWall = false;
        }


        this.players =
        {
            left: playerLeft,
            right: playerRight
        };
        let ballSize = 1.5;
        let ballBackgroundColor = "white";
        let speed = 0.8;
        let custmeGS = localStorage.getItem('customGameSettings');
        if (custmeGS) {
            const custmeJson = JSON.parse(custmeGS);
            const ballColor = custmeJson['ballColor'];
            const ballSizeC = custmeJson['ballSize'];
            const ballSpeed = custmeJson['ballSpeed'];
            if (ballColor) {
                ballBackgroundColor = ballColor;
            }
            if (ballSizeC) {
                ballSize = ballSizeC;
            }
            if (ballSpeed) {
                speed = ballSpeed;
            }
            
        }

        for (let i = 0; i < count_balls; ++i) {
            this.balls.push(new Ball({ ballId: "ball" + i, onBoard: this, classList: ["aspect-square", "rounded-full"], ballColor: ballBackgroundColor, ballSize, speed }));
            //this.balls[i].changeText(String(i));
        }
    }

    protected changeBackgroundColor(newColor: string): void {
        let custmeGS = localStorage.getItem('customGameSettings');
        if (custmeGS) {
            const custmeJson = JSON.parse(custmeGS);
            const themeImage = custmeJson['themeImage'];
            if (themeImage) {
                this.element.style.backgroundImage = `url('${themeImage}')`;
            }else{
                const bgc = custmeJson['boardColor'];
                if (bgc) {
                    this.element.style.backgroundColor = bgc;
                }
            }
            
            this.element.style.backgroundSize = "cover";
            this.element.style.backgroundPosition = "center";
            this.element.style.backgroundRepeat = "no-repeat";
        } else {
            super.changeBackgroundColor(newColor);
        }


    }


    countActiveBalls(): number {
        let countActiveBalls: number = 0;

        for (let i = 0; i < this.balls.length; ++i) {
            if (this.balls[i].isActive() == true)
                ++countActiveBalls;
        }
        return countActiveBalls;
    }


    getServiceDirection(scoreLeft: number, scoreRight: number): number {
        const totalPoints = scoreLeft + scoreRight;

        const isDeuce = scoreLeft >= 10 && scoreRight >= 10;

        const alternateEvery = isDeuce ? 1 : 2;

        const serviceTurn = Math.floor(totalPoints / alternateEvery);

        // Pair: left sert → direction = 1
        // Impair: right sert → direction = -1
        return serviceTurn % 2 === 0 ? 1 : -1;
    }

    reinitializeBalls(): void {
        console.log('reinitializeBalls')
        let scoreLeft = 0;
        let scoreRight = 0;
        if (this.players && this.players.left) {
            scoreLeft = this.players.left.getScore();
        }
        if (this.players && this.players.right) {
            scoreRight = this.players.right.getScore();
        }
        const direction = this.getServiceDirection(scoreLeft, scoreRight);
        const leftDiv = document.getElementById("labelleft");
        const rightDiv = document.getElementById("labelright");
        if (leftDiv && rightDiv) {
            if (direction == 1) {
                leftDiv.classList.add("active-player-left");
                rightDiv.classList.remove("active-player-right");
            } else {
                rightDiv.classList.add("active-player-right");
                leftDiv.classList.remove("active-player-left");
            }
        }
        for (let i = 0; i < this.balls.length; ++i) {
            this.balls[i].reinitialize(direction);
        }
    }

    moveBalls(): void {
        for (let i = 0; i < this.balls.length; ++i) {
            this.balls[i].move();
        }
    }

    moveRemoteBalls(): void {
        if (this.isMasterBall) {
            console.log('is master')
            for (let i = 0; i < this.balls.length; ++i) {
                this.balls[i].move();
                if (this.socket) {
                    this.socket.emit("ballMove", {
                        to: "" + this.idPlayer,
                        dx: this.balls[i].getLeftNewRelative(),
                        dy: this.balls[i].getTopNewRelative()
                    })
                }
            }
        }

    }

    setPositionBallAndDraw(pX: number, pY: number) {
        for (let i = 0; i < this.balls.length; ++i) {
            this.balls[i].setPositionBallAndDraw(pX, pY);

        }
    }
    reinitializePlayers(): void {
        for (const direction in this.players) {
            const player = this.players[direction as keyof Players];
            if (player !== null)
                player.reinitializePaddles();
        }
    }

    ballHitsPaddle(ball: Ball): Paddle | null {
        for (const direction in this.players) {
            const player = this.players[direction as keyof Players];
            if (player !== null) {
                let paddle: Paddle | null = player.ballHitsPaddles(ball);
                if (paddle !== null)
                    return paddle;
            }
        }
        return null;
    }

    movePaddles(): void {
        for (const direction in this.players) {
            const player = this.players[direction as keyof Players];
            if (player !== null)
                player.movePaddles(this);
        }
    }

    getLoosingPlayer(): Player | null {
        let loosingPlayer: Player | null = null;
        let secondPlayer: Player | null = null

        for (const direction in this.players) {
            const player = this.players[direction as keyof Players];
            if (player !== null) {
                if (loosingPlayer !== null) {
                    if (player.getScore() > loosingPlayer.getScore()) {
                        secondPlayer = loosingPlayer;
                        loosingPlayer = player;
                    }
                }
                else {
                    loosingPlayer = player;
                }
            }

        }
        if (secondPlayer !== null) {
            if (loosingPlayer !== null) {
                if (loosingPlayer.getScore() == secondPlayer.getScore())
                    return null;
            }
        }
        return loosingPlayer;
    }

    checkBalls(): boolean {
        let outPosition: Position;

        for (let i = 0; i < this.balls.length; ++i) {
            if (this.balls[i].isActive() == true && this.balls[i].hitsWall(this) == true) {

            }

            else if (this.balls[i].isActive() == true && this.ballHitsPaddle(this.balls[i]) !== null) {
                this.balls[i].increaseSpeed(0.1, this.balls[i].getMaxSpeed());
            }

            else if (this.balls[i].isActive() == true && (outPosition = this.balls[i].isOut(this)) !== Position.None) {
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

    removeEventListeners(): void {
        for (let i = 0; i < this.balls.length; ++i) {
            this.balls[i].removeEventListeners();
        }
        this.players.left?.removeEventListeners();
        this.players.right?.removeEventListeners();

        super.removeEventListeners();
    }

    setIsMasterBall(ismaster: boolean) {
        this.isMasterBall = ismaster;
    }

}
