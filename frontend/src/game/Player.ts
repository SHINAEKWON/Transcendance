import { GameMode, Paddle } from "./Paddle.js";
import { A_GameElement } from "./A_GameElement.js";
import { Ball } from "./Ball.js";
import { Board } from "./Board.js";
import { Position } from "./constants.js";
import { playerDictionary } from "./constants.js";
import { LabelScoreName } from "./LabelScoreName.js";


export type Players =
{
    left: Player | null;
    right: Player | null;
};

export class Player
{
    private id: number;
    private name: string;
    private avatar: string;
    private color: string;
    private position: Position;
    private paddles: Paddle[] = [];
    private label: LabelScoreName;
    private score: number;
    private isAi: boolean;
    private vs: number;
    private mode: GameMode;

    constructor({id, name, avatar, color, paddleKeys, parentElement, position, isAI, socket, mode, vs}:
    {
        id: number,
        name: string, 
        avatar: string,
        color: string, 
        paddleKeys: [string, string][], 
        parentElement: A_GameElement, 
        position: Position,
        isAI: boolean,
        socket: any,
        mode: GameMode,
        vs: number
    })
    {
        this.id = id;
        this.score = 0;
        this.name = name;
        this.avatar = avatar;
        this.position = position;
        
        this.color = color;

        this.isAi = isAI;
        this.vs = vs;
        this.mode = mode;

        const storedUser = localStorage.getItem("transcendenceUser");
        let isLocal = true;
        if(this.mode == "remote" && storedUser){
            isLocal = JSON.parse(storedUser).username == this.getName();
        }
       
        let paddleSize = 15;
        let paddleSpeed = 1;
        let custmeGS = localStorage.getItem('customGameSettings');
        if (custmeGS) {
            const custmeJson = JSON.parse(custmeGS);
            const paddleSizeC = custmeJson['paddleSize'];
            const paddleSpeedC = custmeJson['paddleSpeed'];
            if(paddleSizeC){
                paddleSize = paddleSizeC;
                paddleSpeed = paddleSpeedC;
            }
        }

       

        for (let i = 0; i < paddleKeys.length; ++i)
        {
            this.paddles.push(new Paddle({position: position, player: this, upKey: paddleKeys[i][0], downKey: paddleKeys[i][1], parentElement: parentElement, classList: [], isLocal, socket, mode, paddleSize, paddleSpeed}));
        }
        let suff = this.position == Position.Left ? "left" : "right";

        this.label = new LabelScoreName(
        {
            
            elementId: "label" + suff, 
            leftInitialRelative: playerDictionary[this.position].positionLabel.left, 
            topInitialRelative: playerDictionary[this.position].positionLabel.top, 
            widthFraction: 8, 
            heightFraction: 5, 
            position: this.position,
            name: this.name, 
            score: this.score, 
            parentElement: null, 
            classList: [playerDictionary[this.position].textColor]
        });
    }
    
    getColor(): string { return this.color; }
    getName(): string { return this.name; }
    getAvatar(): string { return this.avatar; }
    getPosition(): Position { return this.position; }
    getScore(): number { return this.score; }
    isAI(): boolean { return this.isAi; }
    getVs(): number { return this.vs; }
    getId(): number { return this.id; }

    countPaddles(): number
    {
        return this.paddles.length;
    }

    increaseScore(): void
    {
        this.score += 1;
        this.label.increaseScore();
    }

    reinitializePaddles(): void
    {
        for (let i = 0; i < this.paddles.length; ++i)
        {
            this.paddles[i].reinitializePosition();
        }
    }

    movePaddles(board: Board): void
    {
        for (let i = 0; i < this.paddles.length; ++i)
        {
            if (this.isAi == true)
                this.paddles[i].moveAI(board.balls[0], board);
            this.paddles[i].move(board);
        }
    }

    ballHitsPaddles(ball: Ball): Paddle | null
    {
        for (let i = 0; i < this.paddles.length; ++i)
        {
            if (ball.hitsPaddle(this.paddles[i]))
                return this.paddles[i];
        }
        return null;
    }

    removeEventListeners(): void
    {
        for (let i = 0; i < this.paddles.length; ++i)
        {
            this.paddles[i].removeEventListeners();
        }
    }
}
