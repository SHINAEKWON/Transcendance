class Player
{
    leftOrRight: number;

    score: number;
    name: string;

    elementScore: HTMLDivElement;
    elementName: HTMLDivElement;

    paddle: Paddle;

    constructor(leftOrRight: number, name: string, parentElement: GameElement)
    {
        this.score = 0;
        this.leftOrRight = leftOrRight;
        this.name = name;

        // get score element
        if (this.leftOrRight == LEFT)
        {
            this.paddle = new Paddle(0, leftOrRight, "w", "s", parentElement);
            this.elementScore = document.getElementById("score_left") as HTMLDivElement;
        }
        else if (this.leftOrRight == RIGHT)
        {
            this.paddle = new Paddle(100, leftOrRight, "ArrowUp", "ArrowDown", parentElement);
            this.elementScore = document.getElementById("score_right") as HTMLDivElement;
        }
        else
            throw new Error('Score not found');
        if (!this.elementScore)
        {
            throw new Error('Score not found');
        }

        // get name element
        if (this.leftOrRight == LEFT)
            this.elementName = document.getElementById("name_left") as HTMLDivElement;
        else if (this.leftOrRight == RIGHT)
            this.elementName = document.getElementById("name_right") as HTMLDivElement;
        else
            throw new Error('Name not found');
        if (!this.elementName)
        {
            throw new Error('Name not found');
        }
    }

    changeScoreText(): void
    {
        this.elementScore.textContent = String(this.score);
    }
    
    increaseScore(): void
    {
        this.score += 1;
    }
}