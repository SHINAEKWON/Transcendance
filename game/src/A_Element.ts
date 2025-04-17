/*
    I assign position: absolute; to all elements.
    It means that position is indicated relative to parent element (or body if no parent).

    See here: https://www.geeksforgeeks.org/difference-between-relative-and-absolute-position-in-css/
*/

export abstract class A_Element
{
    /* ********************************************************************** */
    /* Attributes                                                             */
    /* ********************************************************************** */
    element: HTMLDivElement;

    // This stores the initial position relative to the parent
    protected readonly leftInitialRelative: number;
    protected readonly topInitialRelative: number;

    // This stores the current position in absolute pixels on the screen
    protected leftCurrentAbsolute: number = 0;
    protected rightCurrentAbsolute: number = 0;
    protected topCurrentAbsolute: number = 0;
    protected bottomCurrentAbsolute: number = 0;
    
    protected isactive: boolean = true;
    
    // Event listeners can be added (to the document) by a GameElement
    eventListeners: { [key: string]: EventListener } = {};

    constructor(
        elementId: string, 
        leftInitialRelative: number, 
        topInitialRelative: number,
        widthFraction: number,
        heightFraction: number | null,
        backgroundColor: string | null,
        parentElement: A_Element | null,
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