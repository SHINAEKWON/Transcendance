import { env } from "../../env/env.js";
import * as CustomValidityReport from "../../frontapp/signup_policy/CustomValidityReport.js";
import { jwtDecode } from "jwt-decode";
import { getUserInfo } from "../../services/userService.js";
interface JwtPayload {
    id: number;
    email: string;
    iat: number;
    exp: number;
  }
export class SignupPage implements Page{
    render() {
        // Shin Ae : Event Handler, attach this render to Submit Button Handler
        // SetTimeOut allows to wait the loading of render part.
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
                <h2 class="text-3xl font-gaming text-neon-blue mb-6 animate-glow">Sign Up</h2>
                <form id="signup-form" class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-neon-purple mb-1" for="firstname">First Name</label>
                            <input type="text" id="firstname" name="firstname" required
                                class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-neon-blue" />
                        </div>
                        <div>
                            <label class="block text-neon-purple mb-1" for="lastname">Last Name</label>
                            <input type="text" id="lastname" name="lastname" required
                                class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-neon-blue" />
                        </div>
                        <div>
                            <label class="block text-neon-purple mb-1" for="username">Login</label>
                            <input type="text" id="username" name="username" required
                                class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-neon-blue" />
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-neon-purple mb-1" for="email">Email Address</label>
                            <input type="email" id="email" name="email" required
                                class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-neon-blue" />
                        </div>
                        <div class="md:col-span-2 password-container">
                            <label class="flex text-neon-purple mb-1" for="password">Password&nbsp;
                            <img src="/public/elements/Blue_question_mark_icon.png" width="30px" /></label>
                            <input type="password" id="password" name="password" required
                                class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-neon-blue" 
                                maxlength='30' />
                            <ul id="password-requirements" class="text-sm mt-2 text-red-500">
                            <li id="length">❌ Between 8 and 30 characters</li>
                            <li id="uppercase">❌ Include a uppercase letter</li>
                            <li id="lowercase">❌ Include a lowercase letter</li>
                            <li id="number">❌ Include a number</li>
                            <li id="special">❌ Include a special character</li>
                            <li id="repeat">❌ Avoid 3 consecutive identical characters</li>
                            </ul>
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-neon-green mb-1" for="postalAddress">Postal Address <span class="text-gray-400 text-sm">(optional)</span></label>
                            <input type="text" id="postalAddress" name="postalAddress"
                                class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-neon-blue" />
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-neon-green mb-1" for="phoneNumber">Phone Number <span class="text-gray-400 text-sm">(optional)</span></label>
                            <input type="tel" id="phoneNumber" name="phoneNumber"
                                class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-neon-blue" />
                        </div>
                    </div>
                    <button type="submit"
                        class="w-full mt-4 py-2 bg-neon-purple hover:bg-neon-green transition text-white font-semibold rounded-lg shadow">
                        Create Account
                    </button>
                    
                </form>

                <!-- Popup d'erreur -->
                <div id="signup-popup" class="hidden fixed top-6 left-1/2 transform -translate-x-1/2 bg-neon-purple text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-md w-full">
                    <div class="flex justify-between items-start">
                        <div id="signup-popup-message" class="text-sm"></div>
                        <button id="signup-popup-close" class="ml-4 text-white hover:text-gray-200 text-xl leading-none">&times;</button>
                    </div>
                </div>

            </div>
        `;

        const app = document.getElementById('app');
        if(app){
            app.innerHTML = html;
        }
    }

    private submitButtonHandler() {
        const form = document.getElementById('signup-form') as HTMLFormElement;

        // If form == NULL
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
                avatar : "./public/images/profile.jpg",
                type: "user"

            };

            try {
                console.log('Signup.ts du frontend traite...');
                console.log('formData : ', formData);
                
                const response = await fetch(`${env.backAuth}/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(formData),
                });
                
                if (!response.ok) {
                    const msg = await response.text();
                    throw new Error(`(${response.status}) ${msg}`);
                  }
                  
                const data = await response.json();
               
        localStorage.setItem("authToken", data.token); // <--- sauvegarde du token
        const decoded = jwtDecode<JwtPayload>(data.token);
        console.log('decode ', decoded);
        const userInfo = await getUserInfo(decoded.id);
        localStorage.setItem("transcendenceUser", JSON.stringify(userInfo));
                alert('Account successfully created!');
                window.location.href = "#profile";
                window.location.reload();
            } catch (err: any) {
                console.error("Erreur d'inscription : ", err);
            
                let message = 'Échec de la création du compte.';
                let fields = {};
            
                try {
                    const errorJson = JSON.parse(err.message?.split(') ')[1]);
                    message = errorJson.message || message;
                    fields = errorJson.fields || {};
                } catch (parseErr) {
                    console.warn("Impossible d'analyser le message d'erreur JSON :", parseErr);
                }
            
                this.showPopup(message, fields);
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