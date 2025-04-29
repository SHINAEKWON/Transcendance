import { A_GameElement } from "./A_GameElement.js";

export abstract class A_MovingGameElement extends A_GameElement
{

    /* ********************************************************************** */
    /* Attributes                                                             */
    /* ********************************************************************** */
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

    protected insideElement: A_GameElement;

    /* ********************************************************************** */
    /* Constructor                                                            */
    /* ********************************************************************** */
    constructor({elementId, leftNewRelative, topNewRelative, widthFraction, heightFraction, backgroundColor, speed, parentElement, classList}:
    {
        elementId: string, 
        leftNewRelative: number, 
        topNewRelative: number, 
        widthFraction: number,
        heightFraction: number | null,
        backgroundColor: string, 
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
            backgroundColor: backgroundColor, 
            parentElement: parentElement, 
            classList: classList
        });

        this.initialSpeed = speed;
        this.leftNewRelative = this.getLeftInitialRelative();
        this.topNewRelative = this.getTopInitialRelative();
        this.insideElement = parentElement;
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

        // if (this instanceof Ball)
            // alert("Ball Intercept: " + this.yIntercept);
        //    alert("y: " + this.getCurrentHeightCenter() + "\ndy: " + this.speedY + "\ndx: " + this.speedX + "\nx: " + this.getCurrentWidthCenter() + "\nt: " + yIntercept);
    }

    /* ********************************************************************** */
    /* Calculate interception with top of other element (i.e. fix y as top)   */
    /* x=(y-t)*dx/dy                                                          */
    /* ********************************************************************** */
    private calculateAbsoluteHitXTop(withElement: A_GameElement): void
    {
        this.absoluteHitXTop = (withElement.getTopCurrentAbsolute() - this.yIntercept) * this.speedX / this.speedY;

        // if (this instanceof Ball)
            // alert("Board top: " + withElement.getTopCurrentAbsolute() + "\nBall hit x top: " + this.absoluteHitXTop);
    }

    /* ********************************************************************** */
    /* Calculate interception with botm of other element (i.e. fix y as botm) */
    /* x=(y-t)*dx/dy                                                          */
    /* ********************************************************************** */
    private calculateAbsoluteHitXBottom(withElement: A_GameElement): void
    {
        this.absoluteHitXBottom = (withElement.getBottomCurrentAbsolute() - this.yIntercept) * this.speedX / this.speedY;

        // if (this instanceof Ball)
            // alert("Board bottom: " + withElement.getBottomCurrentAbsolute() + "\nBall hit x bottom: " + this.absoluteHitXBottom);
    }
    
    /* ********************************************************************** */
    /* Calculate interception with left of other element (i.e. fix x as left) */
    /* y=dy/dx*x+t                                                            */
    /* ********************************************************************** */
    private calculateAbsoluteHitYLeft(withElement: A_GameElement): void
    {
        this.absoluteHitYLeft = this.speedY / this.speedX * withElement.getLeftCurrentAbsolute() + this.yIntercept;

        // if (this instanceof Ball)
            // alert("Board left: " + withElement.getLeftCurrentAbsolute() + "\nBall hit y left: " + this.absoluteHitYLeft);
    }

    /* ********************************************************************** */
    /* Calculate interception with righ of other element (i.e. fix x as righ) */
    /* y=dy/dx*x+t                                                            */
    /* ********************************************************************** */
    private calculateAbsoluteHitYRight(withElement: A_GameElement): void
    {
        this.absoluteHitYRight = this.speedY / this.speedX * withElement.getRightCurrentAbsolute() + this.yIntercept;

        // if (this instanceof Ball)
            // alert("Board right: " + withElement.getRightCurrentAbsolute() + "\nBall hit y right: " + this.absoluteHitYRight);
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
                // if (this instanceof Ball)
                    // alert("New hitpoint: [" + this.nextHitPoint[0] + ", " + this.nextHitPoint[1] + "]");
                return ;
            }
        }
        else if (this.speedY > 0)
        {
            if (this.absoluteHitXBottom < withElement.getRightCurrentAbsolute() && this.absoluteHitXBottom > withElement.getLeftCurrentAbsolute())
            {
                this.nextHitPoint = [this.absoluteHitXBottom, withElement.getBottomCurrentAbsolute()];
                // if (this instanceof Ball)
                    // alert("New hitpoint: [" + this.nextHitPoint[0] + ", " + this.nextHitPoint[1] + "]");
                return ;
            }
        }
        if (this.speedX < 0)
        {
            if (this.absoluteHitYLeft < withElement.getBottomCurrentAbsolute() && this.absoluteHitYLeft > withElement.getTopCurrentAbsolute())
            {
                this.nextHitPoint = [withElement.getLeftCurrentAbsolute(), this.absoluteHitYLeft];
                // if (this instanceof Ball)
                //     alert("New hitpoint: [" + this.nextHitPoint[0] + ", " + this.nextHitPoint[1] + "]");
                return ;
            }
        }
        else if (this.speedX > 0)
        {
            if (this.absoluteHitYRight < withElement.getBottomCurrentAbsolute() && this.absoluteHitYRight > withElement.getTopCurrentAbsolute())
            {
                this.nextHitPoint = [withElement.getRightCurrentAbsolute(), this.absoluteHitYRight];
                // if (this instanceof Ball)
                //     alert("New hitpoint: [" + this.nextHitPoint[0] + ", " + this.nextHitPoint[1] + "]");
                return ;
            }
        }
        // if (this instanceof Ball)
        //     alert("No new hitpoint found");
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
    moveBall(insideElement: A_GameElement | null = null, isRemote: boolean, isMasterBall: boolean, socket: any, idPlayer: number): void
    {
        if (this.isActive() == true)
        {
            if(!isRemote || (isRemote && isMasterBall && socket) ){
                let dx = this.leftNewRelative + this.speedX;
                let dy = this.topNewRelative + this.speedY;
                this.setNewPosition(dx, dy);
        
                if (insideElement !== null
                && (this.speedY < 0 && !this.isInsideTop(insideElement)
                ||  this.speedY > 0 && !this.isInsideBottom(insideElement)
                ||  this.speedX < 0 && !this.isInsideLeft(insideElement)
                ||  this.speedX > 0 && !this.isInsideRight(insideElement)))
                { 
                 dx = this.leftNewRelative - this.speedX;
                 dy = this.topNewRelative - this.speedY;
                    this.setNewPosition(dx, dy);
                }

                socket.emit("ballMove", {
                    to: ""+idPlayer,
                    dx,
                    dy
                });
            }
            
            
            this.draw();

            if (this.insideElement != null)
                this.setAbsoluteHitPoint(this.insideElement);
        }
    }

    setPositionBallAndDraw(pX: number, pY: number): void
    {
        if (this.isActive() == true)
        {
            this.setNewPosition(pX, pY);
            this.draw();
            if (this.insideElement != null)
                this.setAbsoluteHitPoint(this.insideElement);
        }
    }

    move(insideElement: A_GameElement | null = null): void
    {
        if (this.isActive() == true)
        {
            this.setNewPosition(this.leftNewRelative + this.speedX, this.topNewRelative + this.speedY);
        
            if (insideElement !== null
            && (this.speedY < 0 && !this.isInsideTop(insideElement)
            ||  this.speedY > 0 && !this.isInsideBottom(insideElement)
            ||  this.speedX < 0 && !this.isInsideLeft(insideElement)
            ||  this.speedX > 0 && !this.isInsideRight(insideElement)))
            { 
                this.setNewPosition(this.leftNewRelative - this.speedX, this.topNewRelative - this.speedY);
            }
            this.draw();

            if (this.insideElement != null)
                this.setAbsoluteHitPoint(this.insideElement);
        }
    }

    private draw(): void
    {
        this.element.style.left = `${this.leftNewRelative}%`;
        this.element.style.top = `${this.topNewRelative}%`;
    }
    
    abstract initializeSpeed(): void;
}
