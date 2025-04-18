import { A_Page } from "./A_Page.js";
import { RedirectButton } from "./RedirectButton.js";

export class PageWelcome extends A_Page
{
    signUpButton: RedirectButton | null = null;
    signInButton: RedirectButton | null = null;
    guestButton: RedirectButton | null = null;

    load_page(): void
    {
        this.signUpButton = new RedirectButton("signupbutton", 50, 30, 10, null, "from-purple-800", "via-pink-400", "to-yellow-400", "hover:ring-purple-400", "signup", "Sign Up", []);
        this.signInButton = new RedirectButton("signinbutton", 50, 50, 10, null, "from-blue-800", "via-blue-400", "to-yellow-400", "hover:ring-blue-400", "signin", "Sign In", []);
        this.guestButton = new RedirectButton("gamebutton", 50, 70, 10, null, "from-green-500", "via-green-300", "to-yellow-400", "hover:ring-green-400", "game", "Game", []);
    }

    leave(): void
    {

    }
}





/*
            <div class="flex items-center justify-center min-h-screen bg-dark-blue">
                <div class="bg-gray-800 bg-opacity-90 p-10 rounded-2xl shadow-lg text-center w-[90%] max-w-xl space-y-6 custom-position">
                    <h2 class="text-4xl font-gaming text-neon-blue animate-glow">${t("welcome")}</h2>
                    <p class="text-xl text-neon-orange font-semibold">${t("enjoy")}</p>

                    <div>
                        <h4 class="text-neon-green text-lg font-bold mb-2">${t("start")}</h4>
                        <p class="text-gray-300 text-sm">${t("pitch")}</p>
                    </div>

                    </div>
                </div>
            </div>
*/


// ORIGINAL ASMA
/*
            <div class="flex items-center justify-center min-h-screen bg-dark-blue">
                <div class="bg-gray-800 bg-opacity-90 p-10 rounded-2xl shadow-lg text-center w-[90%] max-w-xl space-y-6 custom-position">
                    <h2 class="text-4xl font-gaming text-neon-blue animate-glow">${t("welcome")}</h2>
                    <p class="text-xl text-neon-orange font-semibold">${t("enjoy")}</p>

                    <div>
                        <h4 class="text-neon-green text-lg font-bold mb-2">${t("start")}</h4>
                        <p class="text-gray-300 text-sm">${t("pitch")}</p>
                    </div>

                    <div class="flex justify-center gap-6 pt-6 flex-wrap">
                        <!-- Sign Up -->
                        <div class="redirect-btn w-24 h-24 rounded-full bg-gradient-to-br from-purple-800 via-pink-400 to-yellow-400 
                            shadow-lg hover:scale-110 hover:ring-4 hover:ring-neon-purple transition cursor-pointer 
                            flex items-center justify-center text-center font-bold text-white text-sm leading-tight" 
                            data-page="signup">
                            ${t("signup").replace(" ", "<br>")}
                        </div>

                        <!-- Sign In -->
                        <div class="redirect-btn w-24 h-24 rounded-full bg-gradient-to-br from-blue-800 via-blue-400 to-yellow-400 
                            shadow-lg hover:scale-110 hover:ring-4 hover:ring-neon-blue transition cursor-pointer 
                            flex items-center justify-center text-center font-bold text-white text-sm leading-tight" 
                            data-page="signin">
                            ${t("signin").replace(" ", "<br>")}
                        </div>

                        <!-- Play as Guest -->
                        <div class="redirect-btn w-24 h-24 rounded-full bg-gradient-to-br from-green-500 via-green-300 to-yellow-400
                            shadow-lg hover:scale-110 hover:ring-4 hover:ring-neon-green transition cursor-pointer 
                            flex items-center justify-center text-center font-bold text-white text-sm leading-tight" 
                            data-page="guest">
                            ${t("guest").replace(" ", "<br>")}
                        </div>
                    </div>
                </div>
            </div>
*/