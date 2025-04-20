import { A_Element } from "./A_Element.js";
import { HTMLElementTag } from "./constants.js";
 

export class InputElement extends A_Element<HTMLInputElement>
{
    constructor({elementId, leftInitialRelative, topInitialRelative, widthFraction, heightFraction, parentElement, type, required, classList}: 
    {    
        elementId: string, 
        leftInitialRelative: number, 
        topInitialRelative: number,
        widthFraction: number,
        heightFraction: number | null,
        parentElement: A_Element<HTMLElement> | null,
        type: string,
        required: boolean,
        classList: string[]
    })
    {
        classList.push
        (
            "rounded", 
            "bg-gray-700", 
            "text-white", 
            "border", 
            "border-gray-600", 
            "focus:outline-none", 
            "focus:ring-2", 
            "focus:ring-neon-green", 
            "text-lg"
        );

        super(
        {
            elementId: elementId, 
            tagName: HTMLElementTag.Input, 
            leftInitialRelative: leftInitialRelative, 
            topInitialRelative: topInitialRelative, 
            widthFraction: widthFraction, 
            heightFraction: heightFraction, 
            backgroundColor: null, 
            parentElement: parentElement, 
            classList: classList
        })

        this.element.type = type;
        this.element.name = elementId;
        this.element.required = required;
    }

    getTrimmedValue(): string | null
    {
        const value: string = this.element.value.trim();

        if (value == "")
            return (null);
        return (value);
    }
}