import { HTMLElementTag } from "./constants_graphic.js";

export abstract class A_Element<T extends HTMLElement>
{
    /* ********************************************************************** */
    /* Attributes                                                             */
    /* ********************************************************************** */
    protected element: T;

    // This stores the initial position relative to the parent
    protected readonly leftInitialRelative: number;
    protected readonly topInitialRelative: number;

    // This stores the current position in absolute pixels on the screen
    private leftCurrentAbsolute: number = 0;
    private rightCurrentAbsolute: number = 0;
    private topCurrentAbsolute: number = 0;
    private bottomCurrentAbsolute: number = 0;
    
    protected isactive: boolean = true;
    
    // Event listeners can be added (to the document) by an A_Element
    eventListeners: { [key: string]: EventListener } = {};

    constructor({elementId, tagName, leftInitialRelative, topInitialRelative, widthFraction, heightFraction, backgroundColor, parentElement, classList}:
    {
        elementId: string, 
        tagName: HTMLElementTag,
        leftInitialRelative: number, 
        topInitialRelative: number,
        widthFraction: number,
        heightFraction: number | null,
        backgroundColor: string | null,
        parentElement: A_Element<HTMLElement> | null,
        classList: string[]
    })
    {
        this.element = document.createElement(tagName) as T;
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

        /*
        I assign position: absolute; to all elements.
        It means that position is indicated relative to parent element (or body if no parent).

        See here: https://www.geeksforgeeks.org/difference-between-relative-and-absolute-position-in-css/
        */
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

    getBackgroundColor(): string { return (this.element.style.backgroundColor); }

    getElementId(): string { return (this.element.id); }

    getCurrentHeightCenter(): number
    {
        return ((this.bottomCurrentAbsolute + this.topCurrentAbsolute) / 2);
    }

    getCurrentWidthCenter(): number
    {
        return ((this.rightCurrentAbsolute + this.leftCurrentAbsolute) / 2);
    }

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