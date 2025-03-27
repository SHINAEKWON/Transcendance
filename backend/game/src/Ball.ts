class Ball extends MovingGameElement
{
    constructor(parentElement: GameElement, classList: string[] = [])
    {
        super("ball", 50, 50, 0.5, parentElement, classList);
    }

    initializeSpeed()
    {
        // initialize x-speed
        let speedX = (Math.random() * 2 - 1) * this.speed;
        if (Math.abs(speedX) < 0.3)
        {
            speedX = speedX < 0 ? -0.3 : 0.3;
        }
        
        // initialize y-speed
        const ballDirectionY = Math.random() > 0.5 ? 1 : -1;
        let speedY = Math.sqrt(this.speed ** 2 - speedX ** 2) * ballDirectionY;
        
        this.setSpeedComponents(speedX, speedY);
    }

    hitsWall(board: Board): boolean
    {
        if (this.isInsideTop(board) && this.isInsideBottom(board))
            return false;
        return (true);
    }

    hitsPaddle(paddle: Paddle): boolean
    {
        return this.touchesLeftOrRight(paddle);
    }

    isLeftOut(board: Board): boolean
    {
        if (this.isInsideLeft(board))
            return (false);
        return (true);
    }
    
    isRightOut(board: Board): boolean
    {
        if (this.isInsideRight(board))
            return (false);
        return (true);
    }
    
    isOut(board: Board): boolean
    {
        if (this.isLeftOut(board) == true || this.isRightOut(board) == true)
            return (true);
        return (false);
    }
}