import { A_Element } from "./A_Element.js"

export class RedirectButton extends A_Element
{
    dataPage: string;

    constructor(
        elementId: string, 
        leftInitialRelative: number, 
        topInitialRelative: number, 
        widthFraction: number, 
        heightFraction: number | null,
        fromColor: string,
        viaColor: string,
        toColor: string,
        hoverColor: string,
        dataPage: string,
        text: string,
        classList: string[]
    )
    {
        classList.push("rounded-full");
        classList.push("bg-gradient-to-br");
        classList.push("shadow-lg");
        classList.push("hover:scale-110");
        classList.push("hover:ring-4");
        classList.push("transition");
        classList.push("cursor-pointer");
        classList.push("flex");
        classList.push("items-center");
        classList.push("justify-center");
        classList.push("text-center");
        classList.push("font-bold");
        classList.push("text-white");
        classList.push("text-sm");
        classList.push("leading-tight");
        classList.push("aspect-square");
        classList.push(fromColor);
        classList.push(viaColor);
        classList.push(toColor);
        classList.push(hoverColor);
        super(elementId, leftInitialRelative, topInitialRelative, widthFraction, heightFraction, null, null, classList);
        this.dataPage = dataPage;
        this.changeText(text);
    }
}