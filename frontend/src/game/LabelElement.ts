import { A_Element } from "./A_Element.js";
import { HTMLElementTag } from "./constants.js";
import { InputElement } from "./InputElement.js";
 

export class LabelElement extends A_Element<HTMLLabelElement>
{
    constructor({elementId, leftInitialRelative, topInitialRelative, widthFraction, heightFraction, text, forInput, parentElement, classList}:
    {   
        elementId: string, 
        leftInitialRelative: number, 
        topInitialRelative: number,
        widthFraction: number,
        heightFraction: number | null,
        text: string,
        forInput: InputElement | null,
        parentElement: A_Element<HTMLElement> | null,
        classList: string[]
    })
    {
        classList.push
        (
            "block",  
            "mb-3", 
            "text-sm"
        );

        super(
        {
            elementId: elementId, 
            tagName: HTMLElementTag.Label, 
            leftInitialRelative: leftInitialRelative, 
            topInitialRelative: topInitialRelative, 
            widthFraction: widthFraction, 
            heightFraction: heightFraction, 
            backgroundColor: null, 
            parentElement: parentElement, 
            classList: classList
        })
        this.changeText(text);

        if (forInput != null)
            this.element.htmlFor = forInput.getElementId();

    }

   
}