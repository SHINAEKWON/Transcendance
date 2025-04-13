import { Paddle } from "./Paddle.js";
import { A_GameElement } from "./A_GameElement.js";
import { Ball } from "./Ball.js";
import { Board } from "./Board.js";
import { Position } from "./Game.js";

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

    private score: number;

    constructor(name: string, color: string, paddleKeys: [string, string][], parentElement: A_GameElement, position: Position)
    {
        this.score = 0;
        this.name = name;
        this.position = position;
        
        this.color = color;

        for (let i = 0; i < paddleKeys.length; ++i)
        {
            this.paddles.push(new Paddle(position, this, paddleKeys[i][0], paddleKeys[i][1], parentElement));
        }
    }
    
    getColor(): string { return this.color; }
    getName(): string { return this.name; }
    getPosition(): Position { return this.position; }
    getScore(): number { return this.score; }

    countPaddles(): number
    {
        return this.paddles.length;
    }

    increaseScore(): void
    {
        this.score += 1;
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
