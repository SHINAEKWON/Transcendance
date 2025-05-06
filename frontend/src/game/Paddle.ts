import { A_MovingGameElement } from "./A_MovingGameElement.js";
import { A_GameElement } from "./A_GameElement.js";
import { Player } from "./Player.js";
import { Position } from "./constants.js";
import { Ball } from "./Ball.js";
import { Board } from "./Board.js";

export type GameMode = "remote" | "local";

export class Paddle extends A_MovingGameElement {
    private upKey: string;
    private downKey: string;
    private position: Position;
    private isAI: boolean;
    private isLocal?: boolean;
    private socket?: any;
    private mode?: GameMode;
    private player?: Player;

    constructor({
        position,
        player,
        upKey,
        downKey,
        parentElement,
        classList,
        isLocal,
        socket,
        mode,
        paddleSize,
        paddleSpeed
    }: {
        position: Position,
        player: Player,
        upKey: string,
        downKey: string,
        parentElement: A_GameElement,
        classList: string[],
        isLocal?: boolean,
        socket?: any,
        mode?: GameMode,
        paddleSize: number,
        paddleSpeed: number
    }) {
        const topInitialRelative = 42.5;
        const widthFraction = 0.3;
        const heightFraction = paddleSize;
        const leftInitialRelative = (position === Position.Left) ? 0 : 100;

        super({
            elementId: player.getName() + "_paddle_" + player.countPaddles(),
            leftNewRelative: leftInitialRelative,
            topNewRelative: topInitialRelative,
            widthFraction: widthFraction,
            heightFraction: heightFraction,
            backgroundColor: player.getColor(),
            speed: 1,
            parentElement: parentElement,
            classList: classList
        });

        this.isLocal = isLocal;
        this.socket = socket;
        this.upKey = upKey;
        this.downKey = downKey;
        this.position = position;
        this.mode = mode;
        this.player = player;

        this.isAI = player.isAI();

        if (this.mode === "local" || this.isLocal) {
            this.initializeEventListeners();
        }

        if (this.socket) {
            this.initializeSocketListeners();
        }
    }

    getPosition(): Position { return this.position; }

    initializeSpeed() {
        this.setSpeedComponents(0, 0);
    }

    moveAI(toHitBall: Ball, insideBoard: Board): void
    {
        if (this.isAI == true)
        {
            let hitPoint: [number, number] = toHitBall.getNextHitPoint();
            this.getAndSetCurrentGeometry();
            if (this.position == Position.Left || this.position == Position.Right)
            {
                // alert("HitpointY: " + hitPoint[1] + "\nPaddleY: " + this.getCurrentHeightCenter())
                if (this.getTopCurrentAbsolute() < hitPoint[1] && this.getBottomCurrentAbsolute() > hitPoint[1])
                {
                    // alert("HitpointX: " + hitPoint[0] + "\nHitpointY: " + hitPoint[1] + "\nPaddleTop: " + this.getTopCurrentAbsolute() + "\nPaddleBottom: " + this.getBottomCurrentAbsolute() + "\nPaddleLeft: " + this.getLeftCurrentAbsolute() + "\nPaddleRight: " + this.getRightCurrentAbsolute() + "\nBallTop: " + toHitBall.getTopCurrentAbsolute() + "\nBallBottom: " + toHitBall.getBottomCurrentAbsolute() + "\nBallLeft: " + toHitBall.getLeftCurrentAbsolute() + "\nBallRight: " + toHitBall.getRightCurrentAbsolute());

                    this.setSpeedComponents(0, 0);
                }
                else if (this.getCurrentHeightCenter() < hitPoint[1])
                {
                    // alert("Hitpoint bigger than center (should go downwards)");
                    this.setSpeedComponents(0, this.getInitialSpeed());
                    // alert("positive y speed (downwards)");
                }
                else if (this.getCurrentHeightCenter() > hitPoint[1])
                {
                    // alert("Hitpoint smaller than center (should go upwards)");
                    this.setSpeedComponents(0, -this.getInitialSpeed());
                    // alert("negative y speed (upwards)");
                }
                else
                {
                    this.setSpeedComponents(0, 0);
                    // alert("no y speed (stays)");
                }

            }
            else
            {
                // alert("HitpointY: " + hitPoint[1] + "\nPaddleY: " + this.getCurrentHeightCenter())
                if (this.getLeftCurrentAbsolute() < hitPoint[0] && this.getRightCurrentAbsolute() > hitPoint[0])
                {
                    // alert("HitpointX: " + hitPoint[0] + "\nHitpointY: " + hitPoint[1] + "\nPaddleTop: " + this.getTopCurrentAbsolute() + "\nPaddleBottom: " + this.getBottomCurrentAbsolute() + "\nPaddleLeft: " + this.getLeftCurrentAbsolute() + "\nPaddleRight: " + this.getRightCurrentAbsolute() + "\nBallTop: " + toHitBall.getTopCurrentAbsolute() + "\nBallBottom: " + toHitBall.getBottomCurrentAbsolute() + "\nBallLeft: " + toHitBall.getLeftCurrentAbsolute() + "\nBallRight: " + toHitBall.getRightCurrentAbsolute());
        
                    this.setSpeedComponents(0, 0);
                }
                else if (this.getCurrentWidthCenter() < hitPoint[0])
                {
                    this.setSpeedComponents(this.getInitialSpeed(), 0);
                }
                else if (this.getCurrentWidthCenter() > hitPoint[0])
                {
                    // alert("Hitpoint smaller than center (should go upwards)");
                    this.setSpeedComponents(-this.getInitialSpeed(), 0);
                    // alert("negative y speed (upwards)");
                }
                else
                {
                    this.setSpeedComponents(0, 0);
                    // alert("no y speed (stays)");
                }
            }
        }
    }

    keyDownHandler(event: KeyboardEvent): void {
        let dx = 0;
        let dy = 0;

        if (event.key.toUpperCase() === this.upKey.toUpperCase()) {
            dy = -this.getInitialSpeed();
        } else if (event.key.toUpperCase() === this.downKey.toUpperCase()) {
            dy = this.getInitialSpeed();
        } else {
            return;
        }

        this.setSpeedComponents(dx, dy);
        if (this.mode == "remote" && this.isLocal && this.socket) {
            this.socket.emit("paddleMove", {
                paddleId: this.getElementId(),
                to: ""+this.player?.getVs(),
                dx,
                dy
            });
        }
    }

    keyUpHandler(event: KeyboardEvent): void {
        if (event.key.toUpperCase() === this.upKey.toUpperCase() || event.key.toUpperCase() === this.downKey.toUpperCase()) {
            const dx = 0;
            const dy = 0;
            this.setSpeedComponents(dx, dy);

            if (this.mode === "remote" && this.isLocal && this.socket) {
                this.socket.emit("paddleMove", {
                    paddleId: this.getElementId(),
                    to: ""+this.player?.getVs(),
                    dx,
                    dy
                });
            }
        }
    }

    initializeSocketListeners(): void {
        if (!this.socket) return;

        this.socket.on("paddleMove", (data: any) => {
            
            if (this.mode === "remote" && !this.isLocal && data.paddleId == this.getElementId()) {
                this.setSpeedComponents(data.dx, data.dy);
            }
        });

        this.socket.on("paddleRelativeMove", (data: any) => {
            
            if (this.mode === "remote" && !this.isLocal && data.paddleId == this.getElementId()) {
                this.leftNewRelative = data.left;
                this.topNewRelative = data.top;
            }
        });
    }

    initializeEventListeners(): void {
        this.eventListeners["keydown"] = this.keyDownHandler.bind(this) as EventListener;
        this.eventListeners["keyup"] = this.keyUpHandler.bind(this) as EventListener;

        document.addEventListener("keydown", this.eventListeners["keydown"]);
        document.addEventListener("keyup", this.eventListeners["keyup"]);
    }

    protected setNewPosition(leftNewRelative: number | null, topNewRelative: number | null): void
    {
        if (leftNewRelative !== null)
            this.leftNewRelative = leftNewRelative;
        if (topNewRelative !== null)
            this.topNewRelative = topNewRelative;
            if (this.mode === "remote" && this.isLocal && this.socket) {
                this.socket.emit("paddleRelativeMove", {
                    paddleId: this.getElementId(),
                    to: ""+this.player?.getVs(),
                    top: this.topNewRelative,
                    left: this.leftNewRelative
                });
            }
    }

    protected draw(): void
    {
        
        this.element.style.left = `${this.leftNewRelative}%`;
        this.element.style.top = `${this.topNewRelative}%`;
    }
} 
