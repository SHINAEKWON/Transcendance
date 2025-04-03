class Player
{
    score: number;
    name: string;

    paddles: Paddle[] = [];
    
    color: string;

    constructor(name: string, color: string, paddleKeys: [string, string][], paddleLeftInitialRelative: number, parentElement: GameElement)
    {
        this.score = 0;
        this.name = name;
        
        this.color = color;

        for (let i = 0; i < paddleKeys.length; ++i)
        {
            this.paddles.push(new Paddle(paddleLeftInitialRelative + 10 * i, this, paddleKeys[i][0], paddleKeys[i][1], parentElement));
        }
    }
    
    getColor(): string { return this.color; }
    getName(): string { return this.name; }

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

    ballHitsPaddles(ball: Ball): boolean
    {
        for (let i = 0; i < this.paddles.length; ++i)
        {
            if (ball.hitsPaddle(this.paddles[i]))
                return true;
        }
        return false;
    }
}
