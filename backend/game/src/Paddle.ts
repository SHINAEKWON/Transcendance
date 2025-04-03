
class Paddle extends MovingGameElement
{
    upKey: string;
    downKey: string;
    
    player: Player;
    position: string;

    constructor(position: string, player: Player, upKey: string, downKey: string, parentElement: GameElement, classList: string[] = [])
    {
        let leftInitialRelative: number;
        let topInitialRelative: number;
        let widthFraction: number;
        let heightFraction: number;

        if (position === "left")
        {
            leftInitialRelative = 0;
            topInitialRelative = 42.5;
            widthFraction = 0.3;
            heightFraction = 15;
        }
        else if (position === "top")
        {
            leftInitialRelative = 50;
            topInitialRelative = 0;
            widthFraction = 15;
            heightFraction = 0.3;
        }
        else if (position === "right")
        {
            leftInitialRelative = 100;
            topInitialRelative = 42.5;
            widthFraction = 0.3;
            heightFraction = 15;
        }
        else
        {
            leftInitialRelative = 50;
            topInitialRelative = 100;
            widthFraction = 15;
            heightFraction = 0.3;
        }

        super(player.getName() + "_paddle_" + player.countPaddles(), leftInitialRelative, topInitialRelative, widthFraction, heightFraction, player.getColor(), 1, parentElement, classList);
        
        this.player = player;
        this.upKey = upKey;
        this.downKey = downKey;
        this.position = position;
        
        this.initializeEventListeners();
    }

    initializeSpeed()
    {
        this.setSpeedComponents(0, 0);
    }
    
    keyDownHandler(event: KeyboardEvent): void
    {
        if (this.position == "left" || this.position == "right")
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
