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
                        ballColor: t("ballColor")
                    })}

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${this.rangeOption("ballSpeed", t("ballSpeed"), 0, 3)}
                        ${this.rangeOption("ballSize", t("ballSize"), 0.5, 10)}
                        ${this.rangeOption("paddleSize", t("paddleSize"), 10, 20)}
                    </div>

                    <h3 class="text-2xl font-bold text-neon-green mt-6 text-center">${t("themesTitle")}</h3>
                    <div class="flex justify-center gap-4 flex-wrap">
                        ${this.themeCard("neon-night", t("theme1"))}
                        ${this.themeCard("cyber-grid", t("theme2"))}
                        ${this.themeCard("dark-future", t("theme3"))}
                    </div>
                </div>

                <div class="mt-10 text-center space-x-4">
                    <button id="apply-btn" class="px-6 py-3 bg-neon-green text-black rounded-lg font-bold text-lg">${t("applyBtn")}</button>
                    <button onclick="history.back()" id="apply-btn" class="px-6 py-3 bg-neon-purple text-white rounded-lg font-bold text-lg hover:bg-purple-400 transition">${t("backBtn")}</button>
                   
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
            }

            .custom-color-circle {
                width: 64px;
                height: 64px;
                border-radius: 50%;
                border: 2px solid white;
                box-shadow: 0 0 5px rgba(255,255,255,0.3);
                cursor: pointer;
            }

            .hidden-color-input {
                position: absolute;
                top: 0;
                left: 0;
                opacity: 0;
                width: 100%;
                height: 100%;
            }

            .theme-card {
                padding: 8px;
                border-radius: 12px;
                height: 260px;
                width: 300px;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
                transition: 0.3s;
            }
            .theme-card img {
                width: 100%;
                height: 90%;
                object-fit: contain;
                border-radius: 0;
            }
            .theme-card h4 {
                margin-top: 4px;
                font-size: 1.2rem;
                white-space: nowrap;
                overflow: hidden;
            }
            </style>
        `;

        const app = document.getElementById("app");
        if (app) app.innerHTML = html;

        this.setupEvents();
    }

    selectColors(labels: { boardColor: string, ballColor: string }) {
        return `
            <div class="flex items-center gap-10 justify-center mb-4">
                ${this.colorSelector("boardColor", labels.boardColor)}
                ${this.colorSelector("ballColor", labels.ballColor)}
            </div>
        `;
    }

    colorSelector(id: string, label: string) {
        return `
            <div class="flex flex-col items-center gap-2 relative">
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
            <div class="theme-card bg-gray-900 rounded-xl border-2 ${borderColor} hover:ring-2 cursor-pointer text-center" data-theme="${themeId}">
                <img src="${imageSrc}" alt="${themeName}">
                <h4 class="font-bold ${titleColor}">${themeName}</h4>
            </div>
        `;
    }

    setupEvents() {
        const defaultRadio = document.getElementById("default-radio") as HTMLInputElement;
        const customRadio = document.getElementById("custom-radio") as HTMLInputElement;
        const customOptions = document.getElementById("custom-options")!;
        const applyBtn = document.getElementById("apply-btn")!;

        const themeCards = document.querySelectorAll(".theme-card");
        let selectedTheme: string | null = null;

        const themePresets: Record<string, {
            boardColor: string,
            ballColor: string,
            image: string,
            ballSpeed: string,
            ballSize: string,
            paddleSize: string
        }> = {
            "neon-night": {
                boardColor: "#0a0a0a",
                ballColor: "#ff00ff",
                image: "./public/images/Neon_Night.png",
                ballSpeed: "0.5",
                ballSize: "8",
                paddleSize: "18"
            },
            "cyber-grid": {
                boardColor: "#001f3f",
                ballColor: "#7fdbff",
                image: "./public/images/Cyber_Grid.png",
                ballSpeed: "1.2",
                ballSize: "2",
                paddleSize: "12"
            },
            "dark-future": {
                boardColor: "#111111",
                ballColor: "#ff851b",
                image: "./public/images/Dark_Future.png",
                ballSpeed: "2.5",
                ballSize: "1",
                paddleSize: "15"
            }
        };

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

        // 🎯 Initialiser les couleurs
        ["boardColor", "ballColor"].forEach(id => {
            const input = document.getElementById(id) as HTMLInputElement;
            const circle = document.getElementById(`${id}-circle`) as HTMLElement;

            input.value = "#ffffff";
            circle.style.backgroundColor = input.value;

            input.addEventListener("input", () => {
                circle.style.backgroundColor = input.value;
            });
        });

        // 🎯 Sélection des thèmes
        themeCards.forEach(card => {
            card.addEventListener("click", () => {
                themeCards.forEach(c => c.classList.remove("ring-4", "ring-neon-purple", "ring-neon-blue", "ring-neon-orange"));

                const themeId = card.getAttribute("data-theme")!;
                selectedTheme = themeId;

                if (themeId === "neon-night") card.classList.add("ring-4", "ring-neon-purple");
                if (themeId === "cyber-grid") card.classList.add("ring-4", "ring-neon-blue");
                if (themeId === "dark-future") card.classList.add("ring-4", "ring-neon-orange");

                const preset = themePresets[themeId];
                if (preset) {
                    // Couleurs
                    (document.getElementById("boardColor") as HTMLInputElement).value = preset.boardColor;
                    (document.getElementById("ballColor") as HTMLInputElement).value = preset.ballColor;
                    (document.getElementById("boardColor-circle") as HTMLElement).style.backgroundColor = preset.boardColor;
                    (document.getElementById("ballColor-circle") as HTMLElement).style.backgroundColor = preset.ballColor;
                    // Valeurs gameplay
                    (document.getElementById("ballSpeed") as HTMLInputElement).value = preset.ballSpeed;
                    (document.getElementById("ballSize") as HTMLInputElement).value = preset.ballSize;
                    (document.getElementById("paddleSize") as HTMLInputElement).value = preset.paddleSize;
                }
            });
        });

        // 🎯 Apply
        applyBtn.addEventListener("click", () => {
            if (customRadio.checked) {
                const presetImage = selectedTheme ? themePresets[selectedTheme]?.image : null;

                const settings = {
                    boardColor: (document.getElementById("boardColor") as HTMLInputElement).value,
                    ballColor: (document.getElementById("ballColor") as HTMLInputElement).value,
                    ballSpeed: (document.getElementById("ballSpeed") as HTMLInputElement).value,
                    ballSize: (document.getElementById("ballSize") as HTMLInputElement).value,
                    paddleSize: (document.getElementById("paddleSize") as HTMLInputElement).value,
                    theme: selectedTheme,
                    themeImage: presetImage
                };
                localStorage.setItem("customGameSettings", JSON.stringify(settings));
                window.history.back();
            }else {
                localStorage.removeItem("customGameSettings");
                window.history.back();
            }
        });

        // 🎯 Charger settings du localStorage si présents
        const savedSettings = localStorage.getItem("customGameSettings");
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);

            customRadio.checked = true;
            updateOptionsState();

            // Couleurs
            (document.getElementById("boardColor") as HTMLInputElement).value = settings.boardColor || "#ffffff";
            (document.getElementById("ballColor") as HTMLInputElement).value = settings.ballColor || "#ffffff";
            (document.getElementById("boardColor-circle") as HTMLElement).style.backgroundColor = settings.boardColor || "#ffffff";
            (document.getElementById("ballColor-circle") as HTMLElement).style.backgroundColor = settings.ballColor || "#ffffff";

            // Valeurs gameplay
            (document.getElementById("ballSpeed") as HTMLInputElement).value = settings.ballSpeed || "1";
            (document.getElementById("ballSize") as HTMLInputElement).value = settings.ballSize || "2";
            (document.getElementById("paddleSize") as HTMLInputElement).value = settings.paddleSize || "50";

            // Appliquer le bon thème visuellement
            selectedTheme = settings.theme;
            themeCards.forEach(c => {
                c.classList.remove("ring-4", "ring-neon-purple", "ring-neon-blue", "ring-neon-orange");
                const themeId = c.getAttribute("data-theme");
                if (themeId === selectedTheme) {
                    if (themeId === "neon-night") c.classList.add("ring-4", "ring-neon-purple");
                    if (themeId === "cyber-grid") c.classList.add("ring-4", "ring-neon-blue");
                    if (themeId === "dark-future") c.classList.add("ring-4", "ring-neon-orange");
                }
            });
        }
    }
}
