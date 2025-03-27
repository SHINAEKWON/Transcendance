abstract class GameElement
{
    element: HTMLDivElement;
    
    initialLeft: number;
    initialTop: number;
    
    newLeft: number;
    newTop: number;

    currentLeft: number = 0;
    currentRight: number = 0;
    currentTop: number = 0;
    currentBottom: number = 0;
    
    eventListeners: { [key: string]: EventListener } = {};
    
    constructor(
        elementId: string, 
        initialLeft: number, 
        initialTop: number,
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

        this.initialLeft = initialLeft;
        this.initialTop = initialTop;
        
        this.newLeft = this.initialLeft;
        this.newTop = this.initialTop;
        
        this.getCurrentGeometry();
    }
    
    setPosition(newLeft: number | null, newTop: number | null): void
    {
        if (newLeft !== null)
            this.newLeft = newLeft;
        if (newTop !== null)
            this.newTop = newTop;
    }
    
    setLeft(newLeft: number): void
    {
        this.setPosition(newLeft, null);
    }
    
    setTop(newTop: number): void
    {
        this.setPosition(null, newTop);
    }
    
    getCurrentGeometry()
    {
        this.currentLeft = this.element.getBoundingClientRect().left;
        this.currentRight = this.element.getBoundingClientRect().right;
        this.currentTop = this.element.getBoundingClientRect().top;
        this.currentBottom = this.element.getBoundingClientRect().bottom;
    }
    
    initializePosition(): void
    {
        this.setPosition(this.initialLeft, this.initialTop);
    }

    draw(): void
    {
        this.element.style.left = `${this.newLeft}%`;
        this.element.style.top = `${this.newTop}%`;
    }
    
    isInsideTop(ofElement: GameElement): boolean
    {
        this.getCurrentGeometry();
        ofElement.getCurrentGeometry();
        
        if (this.currentTop > ofElement.currentTop)
            return true;
        return false; 
    }
    
    isInsideBottom(ofElement: GameElement): boolean
    {
        this.getCurrentGeometry();
        ofElement.getCurrentGeometry();
        
        if (this.currentBottom < ofElement.currentBottom)
            return true;
        return false; 
    }
    
    isInsideLeft(ofElement: GameElement): boolean
    {
        this.getCurrentGeometry();
        ofElement.getCurrentGeometry();
        
        if (this.currentLeft > ofElement.currentLeft)
            return true;
        return false;
    }
    
    isInsideRight(ofElement: GameElement): boolean
    {
        this.getCurrentGeometry();
        ofElement.getCurrentGeometry();
        
        if (this.currentRight < ofElement.currentRight)
            return true;
        return false;
    }
    
    rightTouchesLeft(ofElement: GameElement): boolean
    {
        this.getCurrentGeometry();
        ofElement.getCurrentGeometry();
        
        if (this.currentRight < ofElement.currentLeft
        || this.currentLeft > ofElement.currentRight
        || this.currentBottom < ofElement.currentTop
        || this.currentTop > ofElement.currentBottom)
            return false;
        return true;
    }
    
    leftTouchesRight(ofElement: GameElement): boolean
    {
        this.getCurrentGeometry();
        ofElement.getCurrentGeometry();
        
        if (this.currentLeft > ofElement.currentRight
        || this.currentRight < ofElement.currentLeft
        || this.currentBottom < ofElement.currentTop
        || this.currentTop > ofElement.currentBottom)
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