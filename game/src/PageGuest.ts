import { A_Page } from "./A_Page.js";
import { InputElement } from "./InputElement.js";
import { LabelElement } from "./LabelElement.js";
import { RedirectButton } from "./RedirectButton.js";

export class PageGuest extends A_Page
{
    labelNameLeft: LabelElement | null = null;
    inputNameLeft: InputElement | null = null;

    labelNameTop: LabelElement | null = null;
    inputNameTop: InputElement | null = null;

    labelNameRight: LabelElement | null = null;
    inputNameRight: InputElement | null = null;

    labelNameBottom: LabelElement | null = null;
    inputNameBottom: InputElement | null = null;

    playGuestButton: RedirectButton | null = null;
    
    protected load_page(): void
    {
        this.inputNameLeft = new InputElement({
            elementId: "inputNameLeft", 
            leftInitialRelative: 30, 
            topInitialRelative: 60, 
            widthFraction: 10, 
            heightFraction: 5, 
            parentElement: null, 
            type: "text", 
            required: true, 
            classList: []
        });
        this.labelNameLeft = new LabelElement({
            elementId: "labelNameLeft", 
            leftInitialRelative: 30, 
            topInitialRelative: 40, 
            widthFraction: 10, 
            heightFraction: 5, 
            text: "Enter left player nickname:", 
            forInput: this.inputNameLeft, 
            parentElement: null, 
            classList: []
        });

        this.inputNameTop = new InputElement({
            elementId: "inputNameTop", 
            leftInitialRelative: 50, 
            topInitialRelative: 30, 
            widthFraction: 10, 
            heightFraction: 5, 
            parentElement: null, 
            type: "text", 
            required: true, 
            classList: []
        });
        this.labelNameTop = new LabelElement({
            elementId: "labelNameTop", 
            leftInitialRelative: 50, 
            topInitialRelative: 20, 
            widthFraction: 10, 
            heightFraction: 5, 
            text: "Enter top player nickname:", 
            forInput: this.inputNameTop, 
            parentElement: null, 
            classList: []
        });

        this.inputNameRight = new InputElement({
            elementId: "inputNameRight", 
            leftInitialRelative: 70, 
            topInitialRelative: 60, 
            widthFraction: 10, 
            heightFraction: 5, 
            parentElement: null, 
            type: "text", 
            required: true, 
            classList: []
        });
        this.labelNameRight = new LabelElement({
            elementId: "labelNameRight", 
            leftInitialRelative: 70, 
            topInitialRelative: 40, 
            widthFraction: 10, 
            heightFraction: 5, 
            text: "Enter right player nickname:", 
            forInput: this.inputNameRight, 
            parentElement: null, 
            classList: []
        });

        this.inputNameBottom = new InputElement({
            elementId: "inputNameBottom", 
            leftInitialRelative: 50, 
            topInitialRelative: 80, 
            widthFraction: 10, 
            heightFraction: 5, 
            parentElement: null, 
            type: "text", 
            required: true, 
            classList: []
        });
        this.labelNameBottom = new LabelElement({
            elementId: "labelNameBottom", 
            leftInitialRelative: 50, 
            topInitialRelative: 70, 
            widthFraction: 10, 
            heightFraction: 5, 
            text: "Enter bottom player nickname:", 
            forInput: this.inputNameBottom, 
            parentElement: null, 
            classList: ["block", "text-red-400", "mb-3", "text-lg"]
        });
    
        this.playGuestButton = new RedirectButton({
            elementId: "playGuestButton", 
            leftInitialRelative: 50, 
            topInitialRelative: 90, 
            widthFraction: 10, 
            heightFraction: null, 
            fromColor: "from-purple-800", 
            viaColor: "via-pink-400", 
            toColor: "to-yellow-400", 
            hoverColor: "hover:ring-purple-400", 
            targetPage: "game", 
            text: "Play as guest",
            checkFunction: this.checkInput.bind(this),
            classList: []
        });
    }

    leave(): void
    {
        
    }

    private inputtedLeftName(): boolean
    {
        if (this.inputNameLeft == null || this.inputNameLeft.getTrimmedValue() == null)
            return (false);
        return (true);
    }

    private inputtedTopName(): boolean
    {
        if (this.inputNameTop == null || this.inputNameTop.getTrimmedValue() == null)
            return (false);
        return (true);
    }

    private inputtedRightName(): boolean
    {
        if (this.inputNameRight == null || this.inputNameRight.getTrimmedValue() == null)
            return (false);
        return (true);
    }

    private inputtedBottomName(): boolean
    {
        if (this.inputNameBottom == null || this.inputNameBottom.getTrimmedValue() == null)
            return (false);
        return (true);
    }

    private checkInput(): boolean
    {
        if (this.inputtedLeftName() == true 
        || this.inputtedTopName() == true
        || this.inputtedRightName() == true
        || this.inputtedBottomName() == true)
            return (true);
        alert("Input at least one name");
        return (false);
    }
}