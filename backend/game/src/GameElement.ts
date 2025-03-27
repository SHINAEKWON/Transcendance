abstract class GameElement
{
    element: HTMLDivElement;
    
    leftInitialRelative: number;
    topInitialRelative: number;
    
    leftNewRelative: number;
    topNewRelative: number;

    leftCurrentAbsolute: number = 0;
    rightCurrentAbsolute: number = 0;
    topCurrentAbsolute: number = 0;
    bottomCurrentAbsolute: number = 0;
    
    eventListeners: { [key: string]: EventListener } = {};
    
    constructor(
        elementId: string, 
        leftInitialRelative: number, 
        topInitialRelative: number,
        parentElement: GameElement | null = null,
        classList: string[] = []
    )
    {
        this.element = document.createElement('div');
        this.element.id = elementId;

        if (classList)
            this.element.classList.add(...classList);

        if (parentElement)
        {
            parentElement.element.appendChild(this.element);
        }
        else
        {
            const app: HTMLElement | null = document.getElementById("app");
            if (app)
            {
                app.appendChild(this.element);
            }
            else
            {
                throw new Error('No app div');
            }
        }

        this.leftInitialRelative = leftInitialRelative;
        this.topInitialRelative = topInitialRelative;
        
        this.leftNewRelative = this.leftInitialRelative;
        this.topNewRelative = this.topInitialRelative;
        
        this.getCurrentGeometry();
    }
    
    setPosition(leftNewRelative: number | null, topNewRelative: number | null): void
    {
        if (leftNewRelative !== null)
            this.leftNewRelative = leftNewRelative;
        if (topNewRelative !== null)
            this.topNewRelative = topNewRelative;
    }
    
    setLeft(leftNewRelative: number): void
    {
        this.setPosition(leftNewRelative, null);
    }
    
    setTop(topNewRelative: number): void
    {
        this.setPosition(null, topNewRelative);
    }
    
    getCurrentGeometry()
    {
        this.leftCurrentAbsolute = this.element.getBoundingClientRect().left;
        this.rightCurrentAbsolute = this.element.getBoundingClientRect().right;
        this.topCurrentAbsolute = this.element.getBoundingClientRect().top;
        this.bottomCurrentAbsolute = this.element.getBoundingClientRect().bottom;
    }
    
    initializePosition(): void
    {
        this.setPosition(this.leftInitialRelative, this.topInitialRelative);
    }

    draw(): void
    {
        this.element.style.left = `${this.leftNewRelative}%`;
        this.element.style.top = `${this.topNewRelative}%`;
    }
    
    isInsideTop(ofElement: GameElement): boolean
    {
        this.getCurrentGeometry();
        ofElement.getCurrentGeometry();
        
        if (this.topCurrentAbsolute > ofElement.topCurrentAbsolute)
            return true;
        return false; 
    }
    
    isInsideBottom(ofElement: GameElement): boolean
    {
        this.getCurrentGeometry();
        ofElement.getCurrentGeometry();
        
        if (this.bottomCurrentAbsolute < ofElement.bottomCurrentAbsolute)
            return true;
        return false; 
    }
    
    isInsideLeft(ofElement: GameElement): boolean
    {
        this.getCurrentGeometry();
        ofElement.getCurrentGeometry();
        
        if (this.leftCurrentAbsolute > ofElement.leftCurrentAbsolute)
            return true;
        return false;
    }
    
    isInsideRight(ofElement: GameElement): boolean
    {
        this.getCurrentGeometry();
        ofElement.getCurrentGeometry();
        
        if (this.rightCurrentAbsolute < ofElement.rightCurrentAbsolute)
            return true;
        return false;
    }
    
    rightTouchesLeft(ofElement: GameElement): boolean
    {
        this.getCurrentGeometry();
        ofElement.getCurrentGeometry();
        
        if (this.rightCurrentAbsolute < ofElement.leftCurrentAbsolute
        || this.leftCurrentAbsolute > ofElement.rightCurrentAbsolute
        || this.bottomCurrentAbsolute < ofElement.topCurrentAbsolute
        || this.topCurrentAbsolute > ofElement.bottomCurrentAbsolute)
            return false;
        return true;
    }
    
    leftTouchesRight(ofElement: GameElement): boolean
    {
        this.getCurrentGeometry();
        ofElement.getCurrentGeometry();
        
        if (this.leftCurrentAbsolute > ofElement.rightCurrentAbsolute
        || this.rightCurrentAbsolute < ofElement.leftCurrentAbsolute
        || this.bottomCurrentAbsolute < ofElement.topCurrentAbsolute
        || this.topCurrentAbsolute > ofElement.bottomCurrentAbsolute)
            return false;
        return true;
    }

    touchesLeftOrRight(ofElement: GameElement): boolean
    {
        return (this.rightTouchesLeft(ofElement) || this.leftTouchesRight(ofElement));
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