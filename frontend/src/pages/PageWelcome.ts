import { A_Page } from "./A_Page.js";
import { RedirectButton } from "../graphicElements/RedirectButton.js";

export class PageWelcome extends A_Page
{
    signUpButton: RedirectButton | null = null;
    signInButton: RedirectButton | null = null;
    guestButton: RedirectButton | null = null;

    load_page(params: URLSearchParams): void
    {
        this.signUpButton = new RedirectButton({
            elementId: "signupbutton", 
            leftInitialRelative: 50, 
            topInitialRelative: 30, 
            widthFraction: 10, 
            heightFraction: null, 
            fromColor: "from-purple-800", 
            viaColor: "via-pink-400", 
            toColor: "to-yellow-400", 
            hoverColor: "hover:ring-purple-400", 
            targetPage: "signup", 
            text: "Sign Up", 
            checkFunction: null, 
            getQueryFunction: () => "",
            classList: []
        });
        this.signInButton = new RedirectButton({
            elementId: "signinbutton", 
            leftInitialRelative: 50, 
            topInitialRelative: 50, 
            widthFraction: 10, 
            heightFraction: null, 
            fromColor: "from-blue-800", 
            viaColor: "via-blue-400", 
            toColor: "to-yellow-400", 
            hoverColor: "hover:ring-blue-400", 
            targetPage: "signin", 
            text: "Sign In", 
            checkFunction: null, 
            getQueryFunction: () => "",
            classList: []
        });
        this.guestButton = new RedirectButton({
            elementId: "guestbutton", 
            leftInitialRelative: 50, 
            topInitialRelative: 70, 
            widthFraction: 10, 
            heightFraction: null, 
            fromColor: "from-green-500", 
            viaColor: "via-green-300", 
            toColor: "to-yellow-400", 
            hoverColor: "hover:ring-green-400", 
            targetPage: "guest", 
            text: "Guest", 
            checkFunction: null, 
            getQueryFunction: () => "",
            classList: []
        });
    }

    leave(): string
    {
        return "";
    }
}