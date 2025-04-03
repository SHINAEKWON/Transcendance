
class Paddle extends MovingGameElement
{
    upKey: string;
    downKey: string;
    
    player: Player;

    constructor(leftInitialRelative: number, player: Player, upKey: string, downKey: string, parentElement: GameElement, classList: string[] = [])
    {
        
        super(player.getName() + "_paddle", leftInitialRelative, 42.5, 0.3, 15, player.getColor(), 1, parentElement, classList);
        
        this.player = player; 
        this.upKey = upKey;
        this.downKey = downKey;
        
        this.initializeEventListeners();
    }

    initializeSpeed()
    {
        this.setSpeedComponents(0, 0);
    }
    
    keyDownHandler(event: KeyboardEvent): void
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
