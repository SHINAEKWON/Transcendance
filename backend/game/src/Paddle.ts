
class Paddle extends MovingGameElement
{
    leftOrRight: number;
    
    upKey: string;
    downKey: string;

    constructor(initialLeft: number, leftOrRight: number, upKey: string, downKey: string, parentElement: GameElement, classList: string[] = [])
    {
        if (leftOrRight == LEFT)
            super("paddle_left", initialLeft, 50, 1, parentElement, classList);
        else if (leftOrRight == RIGHT)
            super("paddle_right", initialLeft, 50, 1, parentElement, classList);
        else
            throw new Error('Paddle not found');
            
        this.leftOrRight = leftOrRight;
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
                this.setSpeedComponents(0, -this.speed);
                break ;
            case this.downKey:
                this.setSpeedComponents(0, this.speed);
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