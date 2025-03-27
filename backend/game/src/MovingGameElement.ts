abstract class MovingGameElement extends GameElement
{
    speed: number;
    speedX: number = 0;
    speedY: number = 0;
    
    constructor(elementId: string, newLeft: number, newTop: number, speed: number, parentElement: GameElement, classList: string[] = [])
    {
        super(elementId, newLeft, newTop, parentElement, classList);
        this.speed = speed;
        this.initializeSpeed();
    }
    
    setSpeedComponents(speedX: number, speedY: number): void
    {
        this.speedX = speedX;
        this.speedY = speedY;
    }
    
    move(insideElement: GameElement | null = null): void
    {
        this.newLeft += this.speedX;
        this.newTop += this.speedY;
        
        if (insideElement !== null
        && (this.speedY < 0 && !this.isInsideTop(insideElement)
        ||  this.speedY > 0 && !this.isInsideBottom(insideElement)))
        { 
            this.newLeft -= this.speedX;
            this.newTop -= this.speedY;
            return ;
        }
        this.draw();
    }
    
    increaseSpeed(dSpeed: number): void
    {
        this.speedX *= (1 + dSpeed);
        this.speedY *= (1 + dSpeed);
    }
    
    abstract initializeSpeed(): void;
}
