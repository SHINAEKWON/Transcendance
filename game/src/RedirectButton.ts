import { A_Element } from "./A_Element.js"

export class RedirectButton extends A_Element<HTMLDivElement>
{
    private targetPage: string;
    private checkFunction: null | (() => boolean);
    private getQueryFunction: () => string;

    constructor({elementId, leftInitialRelative, topInitialRelative, widthFraction, heightFraction, fromColor, viaColor, toColor, hoverColor, targetPage, text, checkFunction, getQueryFunction, classList}: 
    {
        elementId: string, 
        leftInitialRelative: number, 
        topInitialRelative: number, 
        widthFraction: number, 
        heightFraction: number | null,
        fromColor: string,
        viaColor: string,
        toColor: string,
        hoverColor: string,
        targetPage: string,
        text: string,
        checkFunction: null | (() => boolean),
        getQueryFunction: () => string,
        classList: string[]
    })
    {
        classList.push
        (
            "rounded-full", 
            "bg-gradient-to-br",
            "shadow-lg",
            "hover:scale-110",
            "hover:ring-4",
            "transition",
            "cursor-pointer",
            "flex",
            "items-center",
            "justify-center",
            "text-center",
            "font-bold",
            "text-white",
            "text-sm",
            "leading-tight",
            "aspect-square",
            fromColor,
            viaColor,
            toColor,
            hoverColor
        );

        super({elementId: elementId, tagName: "div", leftInitialRelative: leftInitialRelative, topInitialRelative: topInitialRelative, widthFraction: widthFraction, heightFraction: heightFraction, backgroundColor: null, parentElement: null, classList: classList});

        this.targetPage = targetPage;
        this.changeText(text);
        this.initializeEventListeners();

        this.checkFunction = checkFunction;
        this.getQueryFunction = getQueryFunction;

    }

    initializeEventListeners(): void
    {
        this.eventListeners["click"] = this.redirect.bind(this) as EventListener;
        
        this.element.addEventListener("click", this.eventListeners["click"]);
    }

    redirect(): void
    {
        if (this.checkFunction == null 
        || (this.checkFunction != null && this.checkFunction() == true))
        {
            const query: string = this.getQueryFunction();
            if (query != "")
                window.location.hash = `${this.targetPage}?${query}`;
            else
                window.location.hash = `${this.targetPage}`;
        }
    }
}