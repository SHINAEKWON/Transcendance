import { jwtDecode } from "jwt-decode";
import { env } from "../../env/env";
import { getUserInfo } from "../../services/userService";
import { getTranslation } from "../../i18n/i18n.js";
import { authTranslations } from "../../translations/auth.js";

interface JwtPayload {
  id: number;
  email: string;
  iat: number;
  exp: number;
}

export class GuestPage implements Page {
    render() {
        const t = (key: keyof typeof authTranslations) => getTranslation("auth", key);

        const html = `
        <div class="flex items-center justify-center bg-dark-blue">
          <div class="bg-gray-800 bg-opacity-90 p-8 rounded-2xl shadow-lg w-full max-w-3xl text-center space-y-8">
            <h2 class="text-4xl font-gaming text-neon-blue animate-glow">${t('playAsGuest')}</h2>
            <p class="text-neon-purple text-xl">${t('enterLogin')}</p>
  
            <!-- Pseudo Input -->
            <div>
              <label for="login" class="block text-neon-green mb-3 text-lg">${t('enterLogin')}</label>
              <input type="text" id="login" name="login" required
                class="w-full px-5 py-3 rounded bg-gray-700 text-white border border-gray-600" />
            </div>
  
            <!-- Avatar Selection -->
            <div class="space-y-4">
              <p class="text-neon-orange text-xl">${t('chooseAvatar')}</p>
              <div class="flex justify-center gap-10 flex-wrap">
                ${this.getAvatarOptions()}
              </div>
            </div>
  
            <button id="guest-play-btn"
              class="mt-6 w-full py-4 bg-neon-purple hover:bg-neon-green text-white font-bold rounded-lg shadow text-lg">
              ${t('continueGuest')}
            </button>
          </div>

          <div id="signup-popup" class="hidden fixed top-6 left-1/2 transform -translate-x-1/2 bg-neon-purple text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-md w-full">
              <div class="flex justify-between items-start">
                  <div id="signup-popup-message" class="text-sm"></div>
                  <button id="signup-popup-close" class="ml-4 text-white hover:text-gray-200 text-xl">&times;</button>
              </div>
          </div>
        </div>
      `;

      const app = document.getElementById('app');
      if (app) {
          app.innerHTML = html;
      }

      this.setup();
      document.getElementById('signup-popup-close')?.addEventListener('click', () => {
        document.getElementById('signup-popup')?.classList.add('hidden');
      });
    }

    private getAvatarOptions(): string {
        const avatars = ['avatar1', 'avatar2', 'avatar3'];
        return avatars.map((avatar, idx) => `
            <label class="cursor-pointer transform hover:scale-110 transition">
              <input type="radio" name="avatar" value="${avatar}" class="hidden" />
              <img src="./public/images/guestAvatar${idx + 1}.png" alt="Avatar ${idx + 1}"
                class="w-35 h-35 rounded-full border-4 border-transparent hover:border-neon-purple" />
            </label>
        `).join('');
    }

    private setup(): void {
        const button = document.getElementById('guest-play-btn') as HTMLButtonElement;
        const avatarInputs = document.querySelectorAll('input[name="avatar"]');

        avatarInputs.forEach((input) => {
            input.addEventListener('change', () => {
                avatarInputs.forEach((inp) => {
                    inp.closest('label')?.classList.remove('avatar-selected');
                });
                input.closest('label')?.classList.add('avatar-selected');
            });
        });

        button?.addEventListener('click', async () => {
            const t = (key: keyof typeof authTranslations) => getTranslation("auth", key);
            const loginElement = document.getElementById('login') as HTMLInputElement;
            const login = loginElement?.value.trim();
            const selectedAvatar = Array.from(document.querySelectorAll('input[name="avatar"]'))
                .find((input) => (input as HTMLInputElement).checked) as HTMLInputElement | undefined;

            if (!login) {
                alert("⚠️ " + t('enterLogin'));
                return;
            }

            if (!selectedAvatar) {
                alert("⚠️ " + t('mustChooseAvatar'));
                return;
            }

            const avatar = selectedAvatar.value;
            const avatarUrl = this.getAvatarUrl(avatar);

            try {
                const timestamp = Date.now();
                const generatedsuffix = `_g${timestamp}`;
                const randomPart = Math.random().toString(36).slice(2, 8);
                const generatedpassword = `Gp${timestamp}${randomPart}!`;

                const res = await fetch(`${env.backAuth}/signup`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        firstname: login,
                        lastname: login,
                        username: login,
                        avatar: avatarUrl,
                        email: `${login}${generatedsuffix}@guest.42.fr`,
                        password: generatedpassword,
                        address: "",
                        status: 'Online',
                        type: "guest"
                    })
                });

                if (!res.ok) throw new Error(await res.text());

                const data = await res.json();
                localStorage.setItem("authToken", data.token);
                const decoded = jwtDecode<JwtPayload>(data.token);
                const userInfo: any = await getUserInfo(decoded.id);
                localStorage.setItem("transcendenceUser", JSON.stringify(userInfo));

                alert(`${t('welcomeGuest')} ${userInfo.username} 🕹️`);
                window.location.href = "#profileGuest";
                window.location.reload();

            } catch (err: any) {
                console.error("Erreur d'inscription : ", err);
                this.showPopup('Échec de la création du compte.');
            }
        });
    }

    private getAvatarUrl(avatarValue: string): string {
        const avatars: Record<string, string> = {
            avatar1: './public/images/guestAvatar1.png',
            avatar2: './public/images/guestAvatar2.png',
            avatar3: './public/images/guestAvatar3.png'
        };
        return avatars[avatarValue] ?? './public/images/guestAvatar1.png';
    }

    private showPopup(message: string) {
        const popup = document.getElementById('signup-popup');
        const popupMessage = document.getElementById('signup-popup-message');
        if (!popup || !popupMessage) return;

        popupMessage.innerHTML = `<p>${message}</p>`;
        popup.classList.remove('hidden');
    }
}
