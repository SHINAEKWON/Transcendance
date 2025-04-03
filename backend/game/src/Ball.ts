class Ball extends MovingGameElement
{
    constructor(ballId: string, parentElement: GameElement, classList: string[] = [])
    {
        super(ballId, 48.5, 48.5, 3, null, "white", 0.5, parentElement, classList);
    }

    initializeSpeed()
    {
        // initialize x-speed
        let speedX = (Math.random() * 2 - 1) * this.getInitialSpeed();
        if (Math.abs(speedX) < 0.3)
        {
            speedX = speedX < 0 ? -0.3 : 0.3;
        }
        
        // initialize y-speed
        const ballDirectionY = Math.random() > 0.5 ? 1 : -1;
        let speedY = Math.sqrt(this.getInitialSpeed() ** 2 - speedX ** 2) * ballDirectionY;
        
        this.setSpeedComponents(speedX, speedY);
    }

    hitsWall(board: Board): boolean
    {
        if (board.hasLeftWall == true && this.isInsideLeft(board) == false)
            return true
        if (board.hasTopWall == true && this.isInsideTop(board) == false)
            return true;
        if (board.hasRightWall == true && this.isInsideRight(board) == false)
            return true;
        if (board.hasBottomWall == true && this.isInsideBottom(board) == false)
            return true;
        return (false);
    }

    hitsPaddle(paddle: Paddle): boolean
    {
        return this.touches(paddle);
    }

    isLeftOut(board: Board): boolean
    {
        if (board.hasLeftWall == true || this.isInsideLeft(board))
            return (false);
        return (true);
    }
    
    isRightOut(board: Board): boolean
    {
        if (board.hasRightWall == true || this.isInsideRight(board))
            return (false);
        return (true);
    }
    
    isTopOut(board: Board): boolean
    {
        if (board.hasTopWall == true || this.isInsideTop(board))
            return (false);
        return (true);
    }
    
    isBottomOut(board: Board): boolean
    {
        if (board.hasBottomWall == true || this.isInsideBottom(board))
            return (false);
        return (true);
    }
    
    isOut(board: Board): boolean
    {
        if (this.isLeftOut(board) == true || this.isRightOut(board) == true
        || this.isTopOut(board) == true || this.isBottomOut(board) == true)
            return (true);
        return (false);
    }
}
