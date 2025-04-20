import { A_Page } from "./A_Page.js";
import { InputElement } from "./InputElement.js";
import { LabelElement } from "./LabelElement.js";
import { RedirectButton } from "./RedirectButton.js";

export class PageSignup extends A_Page
{
    labelNickname: LabelElement | null = null;
    inputNickname: InputElement | null = null;

    labelEmail: LabelElement | null = null;
    inputEmail: InputElement | null = null;

    labelPassword: LabelElement | null = null;
    inputPassword: InputElement | null = null;

    signupButton: RedirectButton | null = null;

    load_page(): void
    {
        this.labelNickname = new LabelElement(
        {
            elementId: "labelNickname",
            leftInitialRelative: 45,
            topInitialRelative: 30,
            widthFraction: 10,
            heightFraction: 10,
            text: "Nickname",
            forInput: this.inputNickname,
            parentElement: null,
            classList: ["text-red-800"]
        });

        this.inputNickname = new InputElement(
        {
            elementId: "inputNickname",
            leftInitialRelative: 45,
            topInitialRelative: 40,
            widthFraction: 10,
            heightFraction: 10,
            type: "text",
            required: true,
            parentElement: null,
            classList: ["border-white"]
        });

        this.labelEmail = new LabelElement(
        {
            elementId: "labelEmail",
            leftInitialRelative: 45,
            topInitialRelative: 50,
            widthFraction: 10,
            heightFraction: 10,
            text: "Email Addres",
            forInput: this.inputEmail,
            parentElement: null,
            classList: ["text-red-800"]
        });
    
        this.inputEmail = new InputElement(
        {
            elementId: "inputEmail",
            leftInitialRelative: 45,
            topInitialRelative: 60,
            widthFraction: 10,
            heightFraction: 10,
            type: "email",
            required: true,
            parentElement: null,
            classList: ["border-white"]
        });

        this.labelPassword = new LabelElement(
        {
            elementId: "labelPassword",
            leftInitialRelative: 45,
            topInitialRelative: 70,
            widthFraction: 10,
            heightFraction: 10,
            text: "Password",
            forInput: this.inputPassword,
            parentElement: null,
            classList: ["text-red-800"]
        });
        
        this.inputPassword = new InputElement(
        {
            elementId: "inputPassword",
            leftInitialRelative: 45,
            topInitialRelative: 80,
            widthFraction: 10,
            heightFraction: 10,
            type: "password",
            required: true,
            parentElement: null,
            classList: ["border-white"]
        });

        this.signupButton = new RedirectButton(
        {
            elementId: "signupButton", 
            leftInitialRelative: 45, 
            topInitialRelative: 90, 
            widthFraction: 10, 
            heightFraction: 10, 
            fromColor: "from-purple-800", 
            viaColor: "via-pink-400", 
            toColor: "to-yellow-400", 
            hoverColor: "hover:ring-purple-400", 
            targetPage: "welcome", 
            text: "Create Account",
            checkFunction: this.checkInput.bind(this),
            getQueryFunction: () => "",
            classList: []
        });
    }

    private inputtedNickname(): boolean
    {
        if (this.inputNickname == null || this.inputNickname.getTrimmedValue() == null)
            return (false);
        return (true);
    }

    private inputtedEmail(): boolean
    {
        if (this.inputEmail == null || this.inputEmail.getTrimmedValue() == null)
            return (false);
        return (true);
    }

    private inputtedPassword(): boolean
    {
        if (this.inputPassword == null || this.inputPassword.getTrimmedValue() == null)
            return (false);
        return (true);
    }

    private checkInput(): boolean
    {
        if (this.inputtedNickname() == true 
        && this.inputtedEmail() == true
        && this.inputtedPassword() == true)
            return (true);
        alert("Input nickname, email and password");
        return (false);
    }

    leave(): void
    {

    }
}