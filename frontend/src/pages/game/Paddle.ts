import { A_MovingGameElement } from "./A_MovingGameElement.js";
import { A_GameElement } from "./A_GameElement.js";
import { Player } from "./Player.js";
import { Position } from "./constants.js";

export type GameMode = "remote" | "local";

export class Paddle extends A_MovingGameElement {
    private upKey: string;
    private downKey: string;
    private position: Position;
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
        mode
    }: {
        position: Position,
        player: Player,
        upKey: string,
        downKey: string,
        parentElement: A_GameElement,
        classList: string[],
        isLocal?: boolean,
        socket?: any,
        mode?: GameMode
    }) {
        const topInitialRelative = 42.5;
        const widthFraction = 0.3;
        const heightFraction = 15;
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

        if (this.mode === "local" || this.isLocal) {
            console.log("initializeEventListeners")
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

    keyDownHandler(event: KeyboardEvent): void {
        if(this.socket){
            console.log("socket ok");
        }else {
            console.log("socket KO");
        }
        let dx = 0;
        let dy = 0;

        if (event.key === this.upKey) {
            console.log("event.key === this.upKey");
            dy = -this.getInitialSpeed();
        } else if (event.key === this.downKey) {
            console.log("event.key === this.downKey");
            dy = this.getInitialSpeed();
        } else {
            console.log("else");
            return;
        }

        this.setSpeedComponents(dx, dy);
        console.log("this.mode"+this.mode);
        console.log("tthis.isLocal"+this.isLocal);
        if(this.socket){
            console.log("this.socket");
        }
        if (this.mode == "remote" && this.isLocal && this.socket) {
            console.log("emit message")
            this.socket.emit("paddleMove", {
                paddleId: this.getElementId(),
                to: ""+this.player?.getVs(),
                dx,
                dy
            });
        }
    }

    keyUpHandler(event: KeyboardEvent): void {
        if (event.key === this.upKey || event.key === this.downKey) {
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
            console.log("receive message")
            console.log(data)
            console.log("this.getElementId()")
            console.log(this.getElementId());
            console.log("this.isLocal")
            console.log(this.isLocal)
            if (this.mode === "remote" && !this.isLocal && data.paddleId == this.getElementId()) {
                console.log(" this.setSpeedComponents(data.dx, data.dy);")
                this.setSpeedComponents(data.dx, data.dy);
            }
        });
    }

    initializeEventListeners(): void {
        this.eventListeners["keydown"] = this.keyDownHandler.bind(this) as EventListener;
        this.eventListeners["keyup"] = this.keyUpHandler.bind(this) as EventListener;

        document.addEventListener("keydown", this.eventListeners["keydown"]);
        document.addEventListener("keyup", this.eventListeners["keyup"]);
    }
} 
