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

    labelCountBalls: LabelElement | null = null;
    inputCountBalls: InputElement | null = null;

    playGuestButton: RedirectButton | null = null;
    
    protected load_page(params: URLSearchParams): void
    {
        this.labelNameLeft = new LabelElement({
            elementId: "labelNameLeft", 
            leftInitialRelative: 5, 
            topInitialRelative: 40, 
            widthFraction: 30, 
            heightFraction: 5, 
            text: "Enter left player nickname:", 
            forInput: this.inputNameLeft, 
            parentElement: null, 
            classList: ["text-yellow-400"]
        });
        this.inputNameLeft = new InputElement({
            elementId: "inputNameLeft", 
            leftInitialRelative: 5, 
            topInitialRelative: 45, 
            widthFraction: 30, 
            heightFraction: 5, 
            parentElement: null, 
            type: "text", 
            required: true, 
            classList: []
        });

        this.labelNameTop = new LabelElement({
            elementId: "labelNameTop", 
            leftInitialRelative: 35, 
            topInitialRelative: 20, 
            widthFraction: 30, 
            heightFraction: 5, 
            text: "Enter top player nickname:", 
            forInput: this.inputNameTop, 
            parentElement: null, 
            classList: ["text-red-400"]
        });
        this.inputNameTop = new InputElement({
            elementId: "inputNameTop", 
            leftInitialRelative: 35, 
            topInitialRelative: 25, 
            widthFraction: 30, 
            heightFraction: 5, 
            parentElement: null, 
            type: "text", 
            required: true, 
            classList: []
        });

        this.labelNameRight = new LabelElement({
            elementId: "labelNameRight", 
            leftInitialRelative: 65, 
            topInitialRelative: 40, 
            widthFraction: 30, 
            heightFraction: 5, 
            text: "Enter right player nickname:", 
            forInput: this.inputNameRight, 
            parentElement: null, 
            classList: ["text-cyan-400"]
        });
        this.inputNameRight = new InputElement({
            elementId: "inputNameRight", 
            leftInitialRelative: 65, 
            topInitialRelative: 45, 
            widthFraction: 30, 
            heightFraction: 5, 
            parentElement: null, 
            type: "text", 
            required: true, 
            classList: []
        });

        this.labelNameBottom = new LabelElement({
            elementId: "labelNameBottom", 
            leftInitialRelative: 35, 
            topInitialRelative: 60, 
            widthFraction: 30, 
            heightFraction: 5, 
            text: "Enter bottom player nickname:", 
            forInput: this.inputNameBottom, 
            parentElement: null, 
            classList: ["text-blue-400"]
        });
        this.inputNameBottom = new InputElement({
            elementId: "inputNameBottom", 
            leftInitialRelative: 35, 
            topInitialRelative: 65, 
            widthFraction: 30, 
            heightFraction: 5, 
            parentElement: null, 
            type: "text", 
            required: true, 
            classList: []
        });

        this.labelCountBalls = new LabelElement({
            elementId: "labelCountBalls",
            leftInitialRelative: 80,
            topInitialRelative: 75,
            widthFraction: 10,
            heightFraction: 5,
            text: "Enter number of balls",
            forInput: this.inputCountBalls,
            parentElement: null,
            classList: ["text-white"]
        });
        this.inputCountBalls = new InputElement({
            elementId: "inputCountBalls",
            leftInitialRelative: 80,
            topInitialRelative: 80,
            widthFraction: 10,
            heightFraction: 5,
            parentElement: null,
            type: "number",
            required: true,
            classList: []
        });

        this.playGuestButton = new RedirectButton(
        {
            elementId: "playGuestButton", 
            leftInitialRelative: 45, 
            topInitialRelative: 80, 
            widthFraction: 10, 
            heightFraction: 10, 
            fromColor: "from-purple-800", 
            viaColor: "via-pink-400", 
            toColor: "to-yellow-400", 
            hoverColor: "hover:ring-purple-400", 
            targetPage: "game", 
            text: "Play as guest",
            checkFunction: this.checkInput.bind(this),
            getQueryFunction: this.getNameQuery.bind(this),
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

    private getNameQuery(): string
    {
        let playerQuery: string = "";
        let name: string | null = this.inputNameLeft != null ? this.inputNameLeft.getTrimmedValue() : null;

        if (name != null)
            playerQuery += `playerLeft=${encodeURIComponent(name)}`;
        name = this.inputNameTop != null ? this.inputNameTop.getTrimmedValue() : null;
        if (name != null)
        {
            if (playerQuery != "")
                playerQuery += "&";
            playerQuery += `playerTop=${encodeURIComponent(name)}`;
        }
        name = this.inputNameRight != null ? this.inputNameRight.getTrimmedValue() : null;
        if (name != null)
        {
            if (playerQuery != "")
                playerQuery += "&";
            playerQuery += `playerRight=${encodeURIComponent(name)}`;
        }
        name = this.inputNameBottom != null ? this.inputNameBottom.getTrimmedValue() : null;
        if (name != null)
        {
            if (playerQuery != "")
                playerQuery += "&";
            playerQuery += `playerBottom=${encodeURIComponent(name)}`;
        }
        name = this.inputCountBalls != null ? this.inputCountBalls.getTrimmedValue() : null;
        let cntBalls: number = Number(name) || 1;
        if (cntBalls > 100)
            cntBalls = 100;
        else if (cntBalls < 1)
            cntBalls = 1;
        cntBalls = Math.floor(cntBalls);
        playerQuery += `&cntBalls=${cntBalls}`;

        return playerQuery;
    }
}