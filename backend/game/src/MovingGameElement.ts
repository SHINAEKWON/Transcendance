abstract class MovingGameElement extends GameElement
{

    /* ********************************************************************** */
    /* Attributes                                                             */
    /* ********************************************************************** */
    private readonly initialSpeed: number;
    private speedX: number = 0;
    private speedY: number = 0;

    private leftNewRelative: number;
    private topNewRelative: number;

    /* ********************************************************************** */
    /* Constructor                                                            */
    /* ********************************************************************** */
    constructor(
        elementId: string, 
        leftNewRelative: number, 
        topNewRelative: number, 
        widthFraction: number,
        heightFraction: number | null,
        backgroundColor: string, 
        speed: number, 
        parentElement: GameElement, 
        classList: string[] = [])
    {
        super(elementId, leftNewRelative, topNewRelative, widthFraction, heightFraction, backgroundColor, parentElement, classList);
        this.initialSpeed = speed;
        this.leftNewRelative = this.getLeftInitialRelative();
        this.topNewRelative = this.getTopInitialRelative();
        this.initializeSpeed();
    }


    /* ********************************************************************** */
    /* Methods                                                                */
    /* ********************************************************************** */
    getInitialSpeed(): number { return this.initialSpeed; }
    getSpeedX(): number { return this.speedX; }
    getSpeedY(): number { return this.speedY; }

    private setNewPosition(leftNewRelative: number | null, topNewRelative: number | null): void
    {
        if (leftNewRelative !== null)
            this.leftNewRelative = leftNewRelative;
        if (topNewRelative !== null)
            this.topNewRelative = topNewRelative;
    }

    reinitializePosition(): void
    {
        this.setNewPosition(this.getLeftInitialRelative(), this.getTopInitialRelative());
    }
    
    setSpeedComponents(speedX: number, speedY: number): void
    {
        this.speedX = speedX;
        this.speedY = speedY;
    }
 
    increaseSpeed(dSpeed: number): void
    {
        this.setSpeedComponents(this.speedX * (1 + dSpeed), this.speedY * (1 + dSpeed));
    }
    
    move(insideElement: GameElement | null = null): void
    {
        this.setNewPosition(this.leftNewRelative + this.speedX, this.topNewRelative + this.speedY);
        
        if (insideElement !== null
        && (this.speedY < 0 && !this.isInsideTop(insideElement)
        ||  this.speedY > 0 && !this.isInsideBottom(insideElement)))
        { 
            this.setNewPosition(this.leftNewRelative - this.speedX, this.topNewRelative - this.speedY);
            return ;
        }
        this.draw();
    }

    private draw(): void
    {
        this.element.style.left = `${this.leftNewRelative}%`;
        this.element.style.top = `${this.topNewRelative}%`;
    }
    
    abstract initializeSpeed(): void;
}
