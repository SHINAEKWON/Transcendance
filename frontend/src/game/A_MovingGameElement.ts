import { A_GameElement } from "./A_GameElement.js";

export abstract class A_MovingGameElement extends A_GameElement
{

    /* ********************************************************************** */
    /* Attributes                                                             */
    /* ********************************************************************** */
    protected readonly parentElement: A_GameElement;
    
    private readonly initialSpeed: number;
    private speedX: number = 0;
    private speedY: number = 0;

    private leftNewRelative: number;
    private topNewRelative: number;

    private yIntercept: number = 0;
    private absoluteHitXTop: number = 0;
    private absoluteHitXBottom: number = 0;
    private absoluteHitYLeft: number = 0;
    private absoluteHitYRight: number = 0;
    private nextHitPoint: [number, number] = [0, 0];

    /* ********************************************************************** */
    /* Constructor                                                            */
    /* ********************************************************************** */
    constructor({elementId, leftNewRelative, topNewRelative, widthFraction, heightFraction, speed, parentElement, classList}:
    {
        elementId: string, 
        leftNewRelative: number, 
        topNewRelative: number, 
        widthFraction: number,
        heightFraction: number | null,
        speed: number, 
        parentElement: A_GameElement, 
        classList: string[]
    })
    {
        super(
        {
            elementId: elementId, 
            leftInitialRelative: leftNewRelative, 
            topInitialRelative: topNewRelative, 
            widthFraction: widthFraction, 
            heightFraction: heightFraction, 
            parentElement: parentElement, 
            classList: classList
        });

        this.initialSpeed = speed;
        this.leftNewRelative = this.getLeftInitialRelative();
        this.topNewRelative = this.getTopInitialRelative();
        this.parentElement = parentElement;
        this.initializeSpeed();
    }


    /* ********************************************************************** */
    /* Methods                                                                */
    /* ********************************************************************** */
    getInitialSpeed(): number { return this.initialSpeed; }
    getSpeedX(): number { return this.speedX; }
    getSpeedY(): number { return this.speedY; }
    getLeftNewRelative(): number { return this.leftNewRelative; }
    getTopNewRelative(): number { return this.topNewRelative; }
    getNextHitPoint(): [number, number] { return this.nextHitPoint; }

    changeDirectionY(): void
    {
        this.setSpeedComponents(this.getSpeedX(), this.getSpeedY() * -1);
    }
    
    changeDirectionX(): void
    {
        this.setSpeedComponents(this.getSpeedX() * -1, this.getSpeedY());
    }

    stop(): void
    {
        this.setSpeedComponents(0, 0);
    }

    getTotalSpeed(): number { return Math.pow(Math.pow(this.speedX, 2) + Math.pow(this.speedY, 2), 0.5)}

    /* ********************************************************************** */
    /* Calculate interceptions of movement                                    */
    /* Formula of movement (straight line) : y=dy/dx*x+t                      */
    /* ********************************************************************** */
    /* ********************************************************************** */
    /* Calculate interception with y axis : t=y-dy/dx*x                       */
    /* ********************************************************************** */
    private calculateYIntercept(): void
    {
        this.yIntercept = this.getCurrentHeightCenter() - (this.speedY / this.speedX * this.getCurrentWidthCenter());
    }

    /* ********************************************************************** */
    /* Calculate interception with top of other element (i.e. fix y as top)   */
    /* x=(y-t)*dx/dy                                                          */
    /* ********************************************************************** */
    private calculateAbsoluteHitXTop(withElement: A_GameElement): void
    {
        this.absoluteHitXTop = (withElement.getTopCurrentAbsolute() - this.yIntercept) * this.speedX / this.speedY;
    }

    /* ********************************************************************** */
    /* Calculate interception with botm of other element (i.e. fix y as botm) */
    /* x=(y-t)*dx/dy                                                          */
    /* ********************************************************************** */
    private calculateAbsoluteHitXBottom(withElement: A_GameElement): void
    {
        this.absoluteHitXBottom = (withElement.getBottomCurrentAbsolute() - this.yIntercept) * this.speedX / this.speedY;
    }
    
    /* ********************************************************************** */
    /* Calculate interception with left of other element (i.e. fix x as left) */
    /* y=dy/dx*x+t                                                            */
    /* ********************************************************************** */
    private calculateAbsoluteHitYLeft(withElement: A_GameElement): void
    {
        this.absoluteHitYLeft = this.speedY / this.speedX * withElement.getLeftCurrentAbsolute() + this.yIntercept;
    }

    /* ********************************************************************** */
    /* Calculate interception with righ of other element (i.e. fix x as righ) */
    /* y=dy/dx*x+t                                                            */
    /* ********************************************************************** */
    private calculateAbsoluteHitYRight(withElement: A_GameElement): void
    {
        this.absoluteHitYRight = this.speedY / this.speedX * withElement.getRightCurrentAbsolute() + this.yIntercept;
    }

    private setAbsoluteHitPoint(withElement: A_GameElement)
    {
        this.getAndSetCurrentGeometry();
        withElement.getAndSetCurrentGeometry();

        this.calculateYIntercept();
        this.calculateAbsoluteHitXBottom(withElement);
        this.calculateAbsoluteHitXTop(withElement);
        this.calculateAbsoluteHitYLeft(withElement);
        this.calculateAbsoluteHitYRight(withElement);

        if (this.speedY < 0)
        {
            if (this.absoluteHitXTop < withElement.getRightCurrentAbsolute() && this.absoluteHitXTop > withElement.getLeftCurrentAbsolute())
            {
                this.nextHitPoint = [this.absoluteHitXTop, withElement.getTopCurrentAbsolute()];
                return ;
            }
        }
        else if (this.speedY > 0)
        {
            if (this.absoluteHitXBottom < withElement.getRightCurrentAbsolute() && this.absoluteHitXBottom > withElement.getLeftCurrentAbsolute())
            {
                this.nextHitPoint = [this.absoluteHitXBottom, withElement.getBottomCurrentAbsolute()];
                return ;
            }
        }
        if (this.speedX < 0)
        {
            if (this.absoluteHitYLeft < withElement.getBottomCurrentAbsolute() && this.absoluteHitYLeft > withElement.getTopCurrentAbsolute())
            {
                this.nextHitPoint = [withElement.getLeftCurrentAbsolute(), this.absoluteHitYLeft];
                return ;
            }
        }
        else if (this.speedX > 0)
        {
            if (this.absoluteHitYRight < withElement.getBottomCurrentAbsolute() && this.absoluteHitYRight > withElement.getTopCurrentAbsolute())
            {
                this.nextHitPoint = [withElement.getRightCurrentAbsolute(), this.absoluteHitYRight];
                return ;
            }
        }
    }

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
        this.draw();
    }
    
    setSpeedComponents(speedX: number, speedY: number): void
    {
        this.speedX = speedX;
        this.speedY = speedY;
    }
 
    increaseSpeed(dSpeed: number, maxSpeed: number): void
    {
        const newSpeedX: number = this.speedX * (1 + dSpeed);
        const newSpeedY: number = this.speedY * (1 + dSpeed);

        if (Math.pow(Math.pow(newSpeedX, 2) + Math.pow(newSpeedY, 2), 0.5) <= maxSpeed)
            this.setSpeedComponents(newSpeedX, newSpeedY);
    }
    
    move(): void
    {
        if (this.isActive() == true)
        {
            this.setNewPosition(this.leftNewRelative + this.speedX, this.topNewRelative + this.speedY);
        
            if (this.speedY < 0 && !this.isInsideTop(this.parentElement)
            ||  this.speedY > 0 && !this.isInsideBottom(this.parentElement)
            ||  this.speedX < 0 && !this.isInsideLeft(this.parentElement)
            ||  this.speedX > 0 && !this.isInsideRight(this.parentElement))
            { 
                this.setNewPosition(this.leftNewRelative - this.speedX, this.topNewRelative - this.speedY);
            }
            this.draw();

            this.setAbsoluteHitPoint(this.parentElement);
        }
    }

    private draw(): void
    {
        this.element.style.left = `${this.leftNewRelative}%`;
        this.element.style.top = `${this.topNewRelative}%`;
    }
    
    abstract initializeSpeed(): void;
}
