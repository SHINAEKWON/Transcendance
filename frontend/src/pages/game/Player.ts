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
    top: Player | null;
    right: Player | null;
    bottom: Player | null;
};

export class Player
{
    private name: string;
    private color: string;
    private position: Position;
    private paddles: Paddle[] = [];
    private label: LabelScoreName;
    private score: number;
    private vs: number;

    constructor({name, color, paddleKeys, parentElement, position, socket, mode, vs}:
    {
        name: string, 
        color: string, 
        paddleKeys: [string, string][], 
        parentElement: A_GameElement, 
        position: Position,
        socket: any,
        mode: GameMode,
        vs: number
    })
    {
        this.score = 0;
        this.name = name;
        this.position = position;
        
        this.color = color;
        this.vs = vs;

        const storedUser = localStorage.getItem("transcendenceUser");
        let isLocal = true;
        if(storedUser){
            isLocal = JSON.parse(storedUser).username == this.getName();
            console.log("connected user name = "+JSON.parse(storedUser).username);
        }
        console.log("player name = "+this.getName());
        console.log("is local = "+isLocal)
       
       

        for (let i = 0; i < paddleKeys.length; ++i)
        {
            this.paddles.push(new Paddle({position: position, player: this, upKey: paddleKeys[i][0], downKey: paddleKeys[i][1], parentElement: parentElement, classList: [], isLocal, socket, mode}));
        }

        this.label = new LabelScoreName(
        {
            elementId: "label" + this.name, 
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
    getPosition(): Position { return this.position; }
    getScore(): number { return this.score; }
    getVs(): number { return this.vs; }

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
