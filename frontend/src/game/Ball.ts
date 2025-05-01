import { Board } from "./Board.js";
import { A_MovingGameElement } from "./A_MovingGameElement.js";
import { A_GameElement } from "./A_GameElement.js";
import { Paddle } from "./Paddle.js";
import { Position } from "./constants.js";

export class Ball extends A_MovingGameElement
{

    private readonly maxSpeed = 2.1;
    constructor({ballId, onBoard, classList}:
    {
        ballId: string, 
        onBoard: A_GameElement, 
        classList: string[]
    })
    {
        super(
        {
            elementId: ballId, 
            leftNewRelative: 48.5, 
            topNewRelative: 48.5, 
            widthFraction: 1.5, 
            heightFraction: null, 
            backgroundColor: "white", 
            speed: 1, 
            parentElement: onBoard, 
            classList: classList
        });
    }

    initializeSpeed(): void
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

    reinitialize(): void
    {
        this.activate();
        this.reinitializePosition();
        this.initializeSpeed();
    }

    changeDirectionY(): void
    {
        this.setSpeedComponents(this.getSpeedX(), this.getSpeedY() * -1);
    }

    changeDirectionX(): void
    {
        this.setSpeedComponents(this.getSpeedX() * -1, this.getSpeedY());
    }

    hitsWall(board: Board): boolean
    {
        if (board.hasLeftWall() == true && this.isInsideLeft(board) == false)
        {
            this.changeDirectionX();
            return true
        }
        else if (board.hasTopWall() == true && this.isInsideTop(board) == false)
        {
            this.changeDirectionY();
            return true;
        }
        else if (board.hasRightWall() == true && this.isInsideRight(board) == false)
        {
            this.changeDirectionX();
            return true
        }
        else if (board.hasBottomWall() == true && this.isInsideBottom(board) == false)
        {
            this.changeDirectionY();
            return true;
        }
        return (false);
    }

    hitsPaddle(paddle: Paddle): boolean
    {
        if (this.touches(paddle) == true)
        {
            const maxBounceAngle: number = (75 * Math.PI) / 180;

            if (paddle.getPosition() == Position.Left || paddle.getPosition() == Position.Right)
            {
                const relIntersectY: number = this.getCurrentHeightCenter() - paddle.getCurrentHeightCenter();
                const normIntersectY: number = Math.max(-1, Math.min(1, relIntersectY / ((paddle.getHeightCurrentAbsolute()) / 2)));
                const bounceAngle: number = normIntersectY * maxBounceAngle;

                this.setSpeedComponents(this.getTotalSpeed() * Math.cos(bounceAngle), this.getTotalSpeed() * Math.sin(bounceAngle));
                if (paddle.getPosition() == Position.Right)
                    this.changeDirectionX();
            }
            else if (paddle.getPosition() == Position.Top || paddle.getPosition() == Position.Bottom)
            {
                const relIntersectX: number = this.getCurrentWidthCenter() - paddle.getCurrentWidthCenter();
                const normIntersectX: number = Math.max(-1, Math.min(1, relIntersectX / ((paddle.getWidthCurrentAbsolute()) / 2)));
                const bounceAngle: number = normIntersectX * maxBounceAngle;

                this.setSpeedComponents(this.getTotalSpeed() * Math.sin(bounceAngle), this.getTotalSpeed() * Math.cos(bounceAngle))
                if (paddle.getPosition() == Position.Bottom)
                    this.changeDirectionY();
            }
            this.changeBackgroundColor(paddle.getBackgroundColor());
            return true;
        }
        return false;
    }

    isLeftOut(board: Board): boolean
    {
        if (board.hasLeftWall() == true || this.isInsideLeft(board))
            return (false);
        return (true);
    }
    
    isRightOut(board: Board): boolean
    {
        if (board.hasRightWall() == true || this.isInsideRight(board))
            return (false);
        return (true);
    }
    
    isTopOut(board: Board): boolean
    {
        if (board.hasTopWall() == true || this.isInsideTop(board))
            return (false);
        return (true);
    }
    
    isBottomOut(board: Board): boolean
    {
        if (board.hasBottomWall() == true || this.isInsideBottom(board))
            return (false);
        return (true);
    }
    
    isOut(board: Board): Position
    {
        if (this.isLeftOut(board) == true)
            return Position.Left;
        else if(this.isRightOut(board) == true)
            return Position.Right;
        else if (this.isTopOut(board) == true)
            return Position.Top;
        else if (this.isBottomOut(board) == true)
            return Position.Bottom;
        return Position.None;
    }

    getMaxSpeed(){
        return this.maxSpeed;
    }
}
