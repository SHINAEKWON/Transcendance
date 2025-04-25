import { A_MovingGameElement } from "./A_MovingGameElement.js";
import { A_GameElement } from "./A_GameElement.js";
import { Player } from "./Player.js";
import { Position } from "./constants_game.js";
import { Ball } from "./Ball.js";
import { Board } from "./Board.js";

export class Paddle extends A_MovingGameElement
{
    private upKey: string;
    private downKey: string;
    private position: Position;
    private isAI: boolean;

    constructor({
        position, 
        player, 
        upKey, 
        downKey, 
        parentElement, 
        classList
    }: {
        position: Position, 
        player: Player, 
        upKey: string, 
        downKey: string, 
        parentElement: A_GameElement, 
        classList: string[]
    })
    {
        let leftInitialRelative: number = 0;
        let topInitialRelative: number = 0;
        let widthFraction: number = 0;
        let heightFraction: number = 0;

        if (position === Position.Left || position === Position.Right)
        {
            topInitialRelative = 42.5;
            widthFraction = 0.3;
            heightFraction = 15;

            if (position === Position.Left)
                leftInitialRelative = 0;
            else if (position === Position.Right)
                leftInitialRelative = 100;
        }
        else if (position === Position.Top || position === Position.Bottom)
        {
            leftInitialRelative = 42.5;
            widthFraction = 15;
            heightFraction = 0.3;

            if (position === Position.Top)
                topInitialRelative = 0;
            else if (position === Position.Bottom)
                topInitialRelative = 100;
        }

        super(
        {
            elementId: player.getName() + "_paddle_" + player.countPaddles(), 
            leftNewRelative: leftInitialRelative, topNewRelative: topInitialRelative,
            widthFraction: widthFraction, 
            heightFraction: heightFraction, 
            backgroundColor: player.getColor(), 
            speed: 1, 
            parentElement: parentElement, 
            classList: classList
        });

        this.upKey = upKey;
        this.downKey = downKey;
        this.position = position;
        
        this.isAI = player.isAI();

        this.initializeEventListeners();
    }

    getPosition(): Position { return this.position; }

    initializeSpeed()
    {
        this.setSpeedComponents(0, 0);
    }

    moveAI(toHitBall: Ball, insideBoard: Board): void
    {
        if (this.isAI == true)
        {
            let hitPoint: [number, number] = toHitBall.getNextHitPoint();
            this.getAndSetCurrentGeometry();
            if (this.position == Position.Left || this.position == Position.Right)
            {
                // alert("HitpointY: " + hitPoint[1] + "\nPaddleY: " + this.getCurrentHeightCenter())
                if (this.getTopCurrentAbsolute() < hitPoint[1] && this.getBottomCurrentAbsolute() > hitPoint[1])
                {
                    // alert("HitpointX: " + hitPoint[0] + "\nHitpointY: " + hitPoint[1] + "\nPaddleTop: " + this.getTopCurrentAbsolute() + "\nPaddleBottom: " + this.getBottomCurrentAbsolute() + "\nPaddleLeft: " + this.getLeftCurrentAbsolute() + "\nPaddleRight: " + this.getRightCurrentAbsolute() + "\nBallTop: " + toHitBall.getTopCurrentAbsolute() + "\nBallBottom: " + toHitBall.getBottomCurrentAbsolute() + "\nBallLeft: " + toHitBall.getLeftCurrentAbsolute() + "\nBallRight: " + toHitBall.getRightCurrentAbsolute());

                    this.setSpeedComponents(0, 0);
                }
                else if (this.getCurrentHeightCenter() < hitPoint[1])
                {
                    // alert("Hitpoint bigger than center (should go downwards)");
                    this.setSpeedComponents(0, this.getInitialSpeed());
                    // alert("positive y speed (downwards)");
                }
                else if (this.getCurrentHeightCenter() > hitPoint[1])
                {
                    // alert("Hitpoint smaller than center (should go upwards)");
                    this.setSpeedComponents(0, -this.getInitialSpeed());
                    // alert("negative y speed (upwards)");
                }
                else
                {
                    this.setSpeedComponents(0, 0);
                    // alert("no y speed (stays)");
                }

            }
            else
            {
                // alert("HitpointY: " + hitPoint[1] + "\nPaddleY: " + this.getCurrentHeightCenter())
                if (this.getLeftCurrentAbsolute() < hitPoint[0] && this.getRightCurrentAbsolute() > hitPoint[0])
                {
                    // alert("HitpointX: " + hitPoint[0] + "\nHitpointY: " + hitPoint[1] + "\nPaddleTop: " + this.getTopCurrentAbsolute() + "\nPaddleBottom: " + this.getBottomCurrentAbsolute() + "\nPaddleLeft: " + this.getLeftCurrentAbsolute() + "\nPaddleRight: " + this.getRightCurrentAbsolute() + "\nBallTop: " + toHitBall.getTopCurrentAbsolute() + "\nBallBottom: " + toHitBall.getBottomCurrentAbsolute() + "\nBallLeft: " + toHitBall.getLeftCurrentAbsolute() + "\nBallRight: " + toHitBall.getRightCurrentAbsolute());
        
                    this.setSpeedComponents(0, 0);
                }
                else if (this.getCurrentWidthCenter() < hitPoint[0])
                {
                    this.setSpeedComponents(this.getInitialSpeed(), 0);
                }
                else if (this.getCurrentWidthCenter() > hitPoint[0])
                {
                    // alert("Hitpoint smaller than center (should go upwards)");
                    this.setSpeedComponents(-this.getInitialSpeed(), 0);
                    // alert("negative y speed (upwards)");
                }
                else
                {
                    this.setSpeedComponents(0, 0);
                    // alert("no y speed (stays)");
                }
            }
        }
    }
  
    keyDownHandler(event: KeyboardEvent): void
    {
        if (this.position == Position.Left || this.position == Position.Right)
        {
            switch (event.key)
            {
                case this.upKey:
                    this.setSpeedComponents(0, -this.getInitialSpeed());
                    break ;
                case this.downKey:
                    this.setSpeedComponents(0, this.getInitialSpeed());
                    break ;
                default:
            }
        }
        else
        {
            switch (event.key)
            {
                case this.upKey:
                    this.setSpeedComponents(-this.getInitialSpeed(), 0);
                    break ;
                case this.downKey:
                    this.setSpeedComponents(this.getInitialSpeed(), 0);
                    break ;
                default:
            } 
        }
    }
    
    keyUpHandler(event: KeyboardEvent): void
    {
        switch (event.key)
        {
            case this.upKey:
                this.setSpeedComponents(0, 0);
                break ;
            case this.downKey:
                this.setSpeedComponents(0, 0);
                break ;
            default:
        }
    }
    
    initializeEventListeners(): void
    {
        this.eventListeners["keydown"] = this.keyDownHandler.bind(this) as EventListener;
        this.eventListeners["keyup"] = this.keyUpHandler.bind(this) as EventListener;
        
        document.addEventListener("keydown", this.eventListeners["keydown"]);
        document.addEventListener("keyup", this.eventListeners["keyup"]);
    }
}
