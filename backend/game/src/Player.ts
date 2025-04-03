type Players =
{
    left: Player | null;
    top: Player | null;
    right: Player | null;
    bottom: Player | null;
};

class Player
{
    score: number;
    name: string;

    position: string;

    paddles: Paddle[] = [];
    
    color: string;

    constructor(name: string, color: string, paddleKeys: [string, string][], parentElement: GameElement, position: string)
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
