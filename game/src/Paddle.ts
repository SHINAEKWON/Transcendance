import { A_MovingGameElement } from "./A_MovingGameElement.js";
import { A_GameElement } from "./A_GameElement.js";
import { Player } from "./Player.js";
import { Position } from "./Game.js";

export class Paddle extends A_MovingGameElement
{
    private upKey: string;
    private downKey: string;
    private position: Position;

    constructor({position, player, upKey, downKey, parentElement, classList}:
    {
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
        
        this.initializeEventListeners();
    }

    getPosition(): Position { return this.position; }

    initializeSpeed()
    {
        this.setSpeedComponents(0, 0);
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
