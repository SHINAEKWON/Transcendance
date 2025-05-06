import { env } from "../../env/env.js";
import * as CustomValidityReport from "../../frontapp/signup_policy/CustomValidityReport.js";
import { jwtDecode } from "jwt-decode";
import { getUserInfo } from "../../services/userService.js";
import { getTranslation } from "../../i18n/i18n.js";
import { authTranslations } from "../../translations/auth.js";

interface JwtPayload {
    id: number;
    email: string;
    iat: number;
    exp: number;
}

export class SignupPage implements Page {
    render() {
        const t = (key: keyof typeof authTranslations) => getTranslation("auth", key);

        setTimeout(() => {
            this.submitButtonHandler();
            CustomValidityReport.firstnameChecker();
            CustomValidityReport.lastnameChecker();
            CustomValidityReport.usernameChecker();
            CustomValidityReport.passwordChecker();
            document.getElementById('signup-popup-close')?.addEventListener('click', () => {
                document.getElementById('signup-popup')?.classList.add('hidden');
            });
        }, 50);

        const html = `
            <div class="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
                <h2 class="text-3xl font-gaming text-neon-blue mb-6 animate-glow">${t('signupTitle')}</h2>
                <form id="signup-form" class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-neon-purple mb-1" for="firstname">${t('firstname')}</label>
                            <input type="text" id="firstname" name="firstname" required
                                class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600" />
                        </div>
                        <div>
                            <label class="block text-neon-purple mb-1" for="lastname">${t('lastname')}</label>
                            <input type="text" id="lastname" name="lastname" required
                                class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600" />
                        </div>
                        <div>
                            <label class="block text-neon-purple mb-1" for="username">${t('username')}</label>
                            <input type="text" id="username" name="username" required
                                class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600" />
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-neon-purple mb-1" for="email">${t('email')}</label>
                            <input type="email" id="email" name="email" required
                                class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600" />
                        </div>
                        <div class="md:col-span-2 password-container">
                            <label class="flex text-neon-purple mb-1" for="password">${t('password')}
                            <img src="/public/elements/Blue_question_mark_icon.png" width="30px" /></label>
                            <input type="password" id="password" name="password" required
                                class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600" 
                                maxlength='30' />
                            <ul id="password-requirements" class="text-sm mt-2 text-red-500">
                                <li id="length">❌ ${t('pwLength')}</li>
                                <li id="uppercase">❌ ${t('pwUppercase')}</li>
                                <li id="lowercase">❌ ${t('pwLowercase')}</li>
                                <li id="number">❌ ${t('pwNumber')}</li>
                                <li id="special">❌ ${t('pwSpecial')}</li>
                                <li id="repeat">❌ ${t('pwRepeat')}</li>
                            </ul>
                        </div>
                        <div class="md:col-span-2">
                        <label class="block text-neon-green mb-1" for="postalAddress">${t('postalAddress')}</label>
                            <input type="text" id="postalAddress" name="postalAddress"
                                class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600" />
                        </div>
                        <div class="md:col-span-2">
                        <label class="block text-neon-green mb-1" for="phoneNumber">${t('phoneNumber')}</label>
                            <input type="tel" id="phoneNumber" name="phoneNumber"
                                class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600" />
                        </div>
                    </div>
                    <button type="submit"
                        class="w-full mt-4 py-2 bg-neon-purple hover:bg-neon-green text-white font-semibold rounded-lg shadow">
                        ${t('createAccount')}
                    </button>
                </form>

                <div id="signup-popup" class="hidden fixed top-6 left-1/2 transform -translate-x-1/2 bg-neon-purple text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-md w-full">
                    <div class="flex justify-between items-start">
                        <div id="signup-popup-message" class="text-sm"></div>
                        <button id="signup-popup-close" class="ml-4 text-white text-xl">&times;</button>
                    </div>
                </div>
            </div>
        `;

        const app = document.getElementById('app');
        if (app) app.innerHTML = html;
    }

    private submitButtonHandler() {
        const form = document.getElementById('signup-form') as HTMLFormElement;

        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = {
                username: (document.getElementById('username') as HTMLInputElement).value,
                firstname: (document.getElementById('firstname') as HTMLInputElement).value,
                lastname: (document.getElementById('lastname') as HTMLInputElement).value,
                email: (document.getElementById('email') as HTMLInputElement).value,
                password: (document.getElementById('password') as HTMLInputElement).value,
                address: (document.getElementById('postalAddress') as HTMLInputElement).value,
                telephone: (document.getElementById('phoneNumber') as HTMLInputElement).value,
                avatar: "./public/images/profile.jpg",
                type: "user"
            };

            try {
                const response = await fetch(`${env.backAuth}/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(formData),
                });

                if (!response.ok) throw new Error(await response.text());

                const data = await response.json();
                localStorage.setItem("authToken", data.token);
                const decoded = jwtDecode<JwtPayload>(data.token);
                const userInfo = await getUserInfo(decoded.id);
                localStorage.setItem("transcendenceUser", JSON.stringify(userInfo));
                alert(getTranslation("auth", 'accountSuccess'));
                window.location.href = "#profile";
                window.location.reload();
            } catch (err: any) {
                this.showPopup('Échec de la création du compte.', {});
            }
        });
    }

    private showPopup(message: string, fields?: Record<string, string>) {
        const popup = document.getElementById('signup-popup');
        const popupMessage = document.getElementById('signup-popup-message');

        if (!popup || !popupMessage) return;

        let html = `<p class="font-semibold mb-2">${message}</p>`;
        if (fields) {
            html += '<ul class="list-disc list-inside text-sm">';
            for (const [field, msg] of Object.entries(fields)) {
                html += `<li><strong>${field}:</strong> ${msg}</li>`;
            }
            html += '</ul>';
        }

        popupMessage.innerHTML = html;
        popup.classList.remove('hidden');
    }
}
