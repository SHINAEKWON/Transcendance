import { Paddle } from "./Paddle.js";
import { Ball } from "./Ball.js";
import { Board } from "./Board.js";
import { Position } from "./constants_game.js";
import { playerDictionary } from "./constants_game.js";
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
    private position: Position;
    private paddles: Paddle[] = [];
    private label: LabelScoreName;
    private score: number;
    private isAi: boolean;

    constructor({name, paddleKeys, onBoard, position, isAI}:
    {
        name: string, 
        paddleKeys: [string, string][], 
        onBoard: Board, 
        position: Position,
        isAI: boolean
    })
    {
        this.score = 0;
        this.name = name;
        this.position = position;
        
        this.isAi = isAI;

        for (let i = 0; i < paddleKeys.length; ++i)
        {
            this.paddles.push(new Paddle({position: position, player: this, upKey: paddleKeys[i][0], downKey: paddleKeys[i][1], onBoard: onBoard, classList: [playerDictionary[this.position].bgColor]}));
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
    
    getName(): string { return this.name; }
    getPosition(): Position { return this.position; }
    getScore(): number { return this.score; }
    isAI(): boolean { return this.isAi; }

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

    movePaddles(): void
    {
        for (let i = 0; i < this.paddles.length; ++i)
        {
            if (this.isAi == true)
                this.paddles[i].moveAI();
            this.paddles[i].move();
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
