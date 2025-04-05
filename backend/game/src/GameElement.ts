/*
    I assign position: absolute; to all elements.
    It means that position is indicated relative to parent element (or body if no parent).

    See here: https://www.geeksforgeeks.org/difference-between-relative-and-absolute-position-in-css/
*/

abstract class GameElement
{
    /* ********************************************************************** */
    /* Attributes                                                             */
    /* ********************************************************************** */
    element: HTMLDivElement;
    
    // This stores the initial position relative to the parent
    private readonly leftInitialRelative: number;
    private readonly topInitialRelative: number;

    // This stores the current position in absolute pixels on the screen
    private leftCurrentAbsolute: number = 0;
    private rightCurrentAbsolute: number = 0;
    private topCurrentAbsolute: number = 0;
    private bottomCurrentAbsolute: number = 0;
    
    private isactive: boolean = true;
    
    // Event listeners can be added (to the document) by a GameElement
    eventListeners: { [key: string]: EventListener } = {};
    
    protected leftWall: boolean = true;
    protected topWall: boolean = true;
    protected rightWall: boolean = true;
    protected bottomWall: boolean = true;

    



    /* ********************************************************************** */
    /* Constructor                                                            */
    /* ********************************************************************** */
    constructor(
        elementId: string, 
        leftInitialRelative: number, 
        topInitialRelative: number,
        widthFraction: number,
        heightFraction: number | null,
        backgroundColor: string | null,
        parentElement: GameElement | null,
        classList: string[]
    )
    {
        this.element = document.createElement('div');
        this.element.id = elementId;

        if (parentElement)
        {
            parentElement.element.appendChild(this.element);
        }
        else
        {
            const app: HTMLElement | null = document.getElementById("app");
            if (app) { app.appendChild(this.element); }
            else { throw new Error('No app div'); }
        }

        this.leftInitialRelative = leftInitialRelative;
        this.topInitialRelative = topInitialRelative;

        this.element.classList.add("absolute");
        if (backgroundColor !== null)
            this.changeBackgroundColor(backgroundColor);

        if (classList)
            this.element.classList.add(...classList);
        
        this.element.style.left = `${this.leftInitialRelative}%`;
        this.element.style.top = `${this.topInitialRelative}%`;
        this.element.style.width = `${widthFraction}%`;
        if (heightFraction !== null)
            this.element.style.height = `${heightFraction}%`;

        this.getAndSetCurrentGeometry();
    }




    /* ********************************************************************** */
    /* Methods                                                                */
    /* ********************************************************************** */
    getLeftInitialRelative(): number { return (this.leftInitialRelative); }
    getTopInitialRelative(): number { return (this.topInitialRelative); }
    isActive(): boolean { return this.isactive; }
    
    getLeftCurrentAbsolute(): number { return (this.leftCurrentAbsolute); }
    getRightCurrentAbsolute(): number { return (this.rightCurrentAbsolute); }
    getTopCurrentAbsolute(): number { return (this.topCurrentAbsolute); }
    getBottomCurrentAbsolute(): number { return (this.bottomCurrentAbsolute); }

    hasLeftWall(): boolean { return this.leftWall; }
    hasTopWall(): boolean { return this.topWall; }
    hasRightWall(): boolean { return this.rightWall; }
    hasBottomWall(): boolean { return this.bottomWall; }

    activate(): void
    {
        this.isactive = true;
    }
    
    desactivate(): void
    {
        this.isactive = false;
    }

    getAndSetCurrentGeometry()
    {
        this.leftCurrentAbsolute = this.element.getBoundingClientRect().left;
        this.rightCurrentAbsolute = this.element.getBoundingClientRect().right;
        this.topCurrentAbsolute = this.element.getBoundingClientRect().top;
        this.bottomCurrentAbsolute = this.element.getBoundingClientRect().bottom;
    }

    isInsideTop(ofElement: GameElement): boolean
    {
        if (this.isactive == true && ofElement.isactive == true)
        {
            this.getAndSetCurrentGeometry();
            ofElement.getAndSetCurrentGeometry();
        
            if (this.topCurrentAbsolute > ofElement.topCurrentAbsolute)
                return true;
        }
        return false; 
    }
    
    isInsideBottom(ofElement: GameElement): boolean
    {
        if (this.isactive == true && ofElement.isactive == true)
        {
            this.getAndSetCurrentGeometry();
            ofElement.getAndSetCurrentGeometry();
        
            if (this.bottomCurrentAbsolute < ofElement.bottomCurrentAbsolute)
                return true;
        }
        return false; 
    }
    
    isInsideLeft(ofElement: GameElement): boolean
    {
        if (this.isactive == true && ofElement.isactive == true)
        {
            this.getAndSetCurrentGeometry();
            ofElement.getAndSetCurrentGeometry();
        
            if (this.leftCurrentAbsolute > ofElement.leftCurrentAbsolute)
                return true;
        }
        return false;
    }
    
    isInsideRight(ofElement: GameElement): boolean
    {
        if (this.isactive == true && ofElement.isactive == true)
        {
            this.getAndSetCurrentGeometry();
            ofElement.getAndSetCurrentGeometry();
        
            if (this.rightCurrentAbsolute < ofElement.rightCurrentAbsolute)
                return true;
        }
        return false;
    }
    
    touches(element: GameElement): boolean
    {
        if (this.isactive == true && element.isactive == true)
            {
                this.getAndSetCurrentGeometry();
                element.getAndSetCurrentGeometry();
            
                if (this.rightCurrentAbsolute < element.leftCurrentAbsolute
                || this.leftCurrentAbsolute > element.rightCurrentAbsolute
                || this.bottomCurrentAbsolute < element.topCurrentAbsolute
                || this.topCurrentAbsolute > element.bottomCurrentAbsolute)
                    return false;
                return true;
            }
            return false;
    }
    
    hide(): void
    {        
        this.element.style.visibility = 'hidden';
    }

    show(): void
    {
        this.element.style.visibility = 'visible';
    }

    changeText(newText: string): void
    {
        this.element.textContent = newText;
    }

    changeTextColor(newColor: string): void
    {
        this.element.style.color = newColor;
    }
    
    changeBackgroundColor(newColor: string): void
    {
        this.element.style.backgroundColor = newColor;
    }
    
    removeEventListeners(): void
    {
        for (const event in this.eventListeners)
        {
            if (this.eventListeners.hasOwnProperty(event))
            {
                document.removeEventListener(event, this.eventListeners[event]);
                console.log(`Event listener for ${event} removed.`);
            }
        }
        this.eventListeners = {};
    }
}
