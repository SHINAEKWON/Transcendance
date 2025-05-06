import { getTranslation } from "../../i18n/i18n.js";
import { customizationTranslations } from "../../translations/customization.js";

export class CustomizationPage implements Page {
    render() {
        const t = (key: keyof typeof customizationTranslations) => getTranslation("customization", key);

        let html = `
            <div class="max-w-5xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
                <h2 class="text-3xl font-gaming text-neon-blue mb-8 animate-glow text-center">${t("title")}</h2>
                
                <div class="flex justify-center gap-8 mb-10">
                    <label class="custom-radio">
                        <input type="radio" name="mode" value="default" checked id="default-radio">
                        <span class="radio-btn"></span>
                        ${t("defaultGame")}
                    </label>
                    <label class="custom-radio">
                        <input type="radio" name="mode" value="custom" id="custom-radio">
                        <span class="radio-btn"></span>
                        ${t("customGame")}
                    </label>
                </div>

                <div id="custom-options" class="space-y-4 opacity-50 pointer-events-none transition duration-300">

                    ${this.selectColors({
                        boardColor: t("boardColor"),
                        ballColor: t("ballColor"),
                        paddleColor: t("paddleColor")
                    })}

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${this.rangeOption("ballSpeed", t("ballSpeed"), 1, 10)}
                        ${this.rangeOption("paddleSpeed", t("paddleSpeed"), 1, 10)}
                        ${this.rangeOption("ballSize", t("ballSize"), 5, 20)}
                        ${this.rangeOption("paddleSize", t("paddleSize"), 20, 100)}
                    </div>

                    <h3 class="text-2xl font-bold text-neon-green mt-6">${t("themesTitle")}</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        ${this.themeCard("neon-night", t("theme1"))}
                        ${this.themeCard("cyber-grid", t("theme2"))}
                        ${this.themeCard("dark-future", t("theme3"))}
                    </div>
                </div>

                <div class="mt-10 text-center space-x-4">
                    <button id="apply-btn" class="px-6 py-3 bg-neon-green text-black rounded-lg font-bold text-lg">${t("applyBtn")}</button>
                    <a href="#ai-play" id="back-btn" class="px-6 py-3 bg-neon-purple text-white rounded-lg font-bold text-lg hover:bg-purple-400 transition">
                        ${t("backBtn")}
                    </a>
                </div>
            </div>

            <style>
            .custom-radio {
                display: flex;
                align-items: center;
                gap: 10px;
                font-weight: bold;
                color: white;
                cursor: pointer;
                position: relative;
                font-size: 1.2rem;
            }
            .custom-radio input[type="radio"] {
                display: none;
            }
            .radio-btn {
                width: 20px;
                height: 20px;
                border: 2px solid #00ffff;
                border-radius: 50%;
                position: relative;
                transition: 0.3s;
            }
            .custom-radio input[type="radio"]:checked + .radio-btn {
                box-shadow: 0 0 10px #00ffff;
                background-color: #00ffff;
            }
            input[type="range"] {
                width: 100%;
                height: 8px;
                border-radius: 5px;
                background: linear-gradient(90deg, #9333ea, #3b82f6);
                cursor: pointer;
            }

            .custom-color-circle {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                border: 2px solid white;
                box-shadow: 0 0 5px rgba(255,255,255,0.3);
                cursor: pointer;
                transition: 0.3s;
            }

            .custom-color-circle:hover {
                box-shadow: 0 0 12px #00ffff;
            }

            /* Styles pour thèmes */
            .theme-card img {
                width: 100%;
                height: 160px;
                object-cover: cover;
                border-radius: 8px;
                box-shadow: 0 0 10px #333;
            }
            .hidden-color-input {
                display: none;
            }
            </style>
        `;

        const app = document.getElementById("app");
        if (app) app.innerHTML = html;

        this.setupEvents();
    }

    selectColors(labels: { boardColor: string, ballColor: string, paddleColor: string }) {
        return `
            <div class="flex items-center gap-8 justify-center mb-4">
                ${this.colorSelector("boardColor", labels.boardColor)}
                ${this.colorSelector("ballColor", labels.ballColor)}
                ${this.colorSelector("paddleColor", labels.paddleColor)}
            </div>
        `;
    }

    colorSelector(id: string, label: string) {
        return `
            <div class="flex flex-col items-center gap-2">
                <span class="text-gray-300 text-sm">${label}</span>
                <div class="custom-color-circle bg-white" id="${id}-circle"></div>
                <input type="color" id="${id}" class="hidden-color-input">
            </div>
        `;
    }

    rangeOption(id: string, label: string, min: number, max: number) {
        return `
            <div>
                <label for="${id}" class="block mb-1 text-gray-300">${label}</label>
                <input type="range" id="${id}" min="${min}" max="${max}">
            </div>
        `;
    }

    themeCard(themeId: string, themeName: string) {
        let imageSrc = "";
        let borderColor = "";
        let titleColor = "";

        if (themeId === "neon-night") {
            imageSrc = "./public/images/Neon_Night.png";
            borderColor = "border-neon-purple";
            titleColor = "text-neon-purple";
        }
        if (themeId === "cyber-grid") {
            imageSrc = "./public/images/Cyber_Grid.png";
            borderColor = "border-neon-blue";
            titleColor = "text-neon-blue";
        }
        if (themeId === "dark-future") {
            imageSrc = "./public/images/Dark_Future.png";
            borderColor = "border-neon-orange";
            titleColor = "text-neon-orange";
        }

        return `
            <div class="theme-card bg-gray-900 p-4 rounded-lg shadow-md border-2 ${borderColor} hover:ring-2 cursor-pointer text-center space-y-2 transition duration-300" data-theme="${themeId}">
                <img src="${imageSrc}" alt="${themeName}">
                <h4 class="text-lg font-bold ${titleColor}">${themeName}</h4>
            </div>
        `;
    }

    setupEvents() {
        const defaultRadio = document.getElementById("default-radio") as HTMLInputElement;
        const customRadio = document.getElementById("custom-radio") as HTMLInputElement;
        const customOptions = document.getElementById("custom-options")!;
        const applyBtn = document.getElementById("apply-btn")!;

        const updateOptionsState = () => {
            if (defaultRadio.checked) {
                customOptions.classList.add("opacity-50", "pointer-events-none");
            } else {
                customOptions.classList.remove("opacity-50", "pointer-events-none");
            }
        };

        defaultRadio.addEventListener("change", updateOptionsState);
        customRadio.addEventListener("change", updateOptionsState);
        updateOptionsState();

        // 🟢 Gestion des couleurs
        ["boardColor", "ballColor", "paddleColor"].forEach(id => {
            const input = document.getElementById(id) as HTMLInputElement;
            const circle = document.getElementById(`${id}-circle`) as HTMLElement;

            input.value = "#ffffff";
            circle.style.backgroundColor = input.value;

            circle.addEventListener("click", () => {
                input.click();
            });

            input.addEventListener("input", () => {
                circle.style.backgroundColor = input.value;
            });
        });

        // 🟢 Gestion sélection du thème
        const themeCards = document.querySelectorAll(".theme-card");
        let selectedTheme: string | null = null;

        themeCards.forEach(card => {
            card.addEventListener("click", () => {
                themeCards.forEach(c => c.classList.remove("ring-4", "ring-neon-purple", "ring-neon-blue", "ring-neon-orange"));

                const themeId = card.getAttribute("data-theme");
                if (themeId === "neon-night") card.classList.add("ring-4", "ring-neon-purple");
                if (themeId === "cyber-grid") card.classList.add("ring-4", "ring-neon-blue");
                if (themeId === "dark-future") card.classList.add("ring-4", "ring-neon-orange");

                selectedTheme = themeId!;
                console.log("🎨 Thème sélectionné :", selectedTheme);
            });
        });

        // 🟢 Bouton Apply
        applyBtn.addEventListener("click", () => {
            if (customRadio.checked) {
                const settings = {
                    boardColor: (document.getElementById("boardColor") as HTMLInputElement).value,
                    ballColor: (document.getElementById("ballColor") as HTMLInputElement).value,
                    paddleColor: (document.getElementById("paddleColor") as HTMLInputElement).value,
                    ballSpeed: (document.getElementById("ballSpeed") as HTMLInputElement).value,
                    paddleSpeed: (document.getElementById("paddleSpeed") as HTMLInputElement).value,
                    ballSize: (document.getElementById("ballSize") as HTMLInputElement).value,
                    paddleSize: (document.getElementById("paddleSize") as HTMLInputElement).value,
                    theme: selectedTheme
                };
                console.log("🎯 Paramètres appliqués :", settings);

                // Si tu veux sauvegarder dans localStorage :
                localStorage.setItem("customGameSettings", JSON.stringify(settings));

            } else {
                console.log("🔧 Mode par défaut sélectionné.");
            }
        });
    }
}
