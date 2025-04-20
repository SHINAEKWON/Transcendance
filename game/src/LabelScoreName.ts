import { A_Element } from "./A_Element.js";
import { LabelElement } from "./LabelElement.js";
import { HTMLElementTag, Position } from "./constants.js";

export class LabelScoreName extends A_Element<HTMLDivElement>
{
    private nameLabel: LabelElement;
    private scoreLabel: LabelElement;
    private score: number;

    constructor({elementId, leftInitialRelative, topInitialRelative, widthFraction, heightFraction, position, name, score, parentElement, classList}:
    {   
        elementId: string, 
        leftInitialRelative: number, 
        topInitialRelative: number,
        widthFraction: number,
        heightFraction: number | null,
        position: Position,
        name: string,
        score: number,
        parentElement: A_Element<HTMLElement> | null,
        classList: string[]
    })
    {
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
        });

        this.score = score;

        this.scoreLabel = new LabelElement(
        {
            elementId: this.element.id + "_score",
            leftInitialRelative: 0,
            topInitialRelative: 0,
            widthFraction: 100,
            heightFraction: 50,
            text: score.toString(),
            forInput: null,
            parentElement: this,
            classList: []
        });

        this.nameLabel = new LabelElement(
        {
            elementId: this.element.id + "_name",
            leftInitialRelative: 0,
            topInitialRelative: 50,
            widthFraction: 100,
            heightFraction: 50,
            text: name,
            forInput: null,
            parentElement: this,
            classList: []
        });
    }

    increaseScore(): void
    {
        this.score += 1;
        this.scoreLabel.changeText(this.score.toString());
    }
}