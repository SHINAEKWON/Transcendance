import { jwtDecode } from "jwt-decode";
import { env } from "../../env/env";
import { getUserInfo } from "../../services/userService";
interface JwtPayload {
  id: number;
  email: string;
  iat: number;
  exp: number;
}
export class GuestPage implements Page{
    render() {
      const html = `
        <div class="flex items-center justify-center bg-dark-blue">
          <div class="bg-gray-800 bg-opacity-90 p-8 rounded-2xl shadow-lg w-full max-w-3xl text-center space-y-8">
            <h2 class="text-4xl font-gaming text-neon-blue animate-glow">Play as Guest</h2>
            <p class="text-neon-purple text-xl">Choose a login and your fighter style</p>
  
            <!-- Pseudo Input -->
            <div>
              <label for="login" class="block text-neon-green mb-3 text-lg">Enter your login:</label>
              <input type="text" id="login" name="login" required
                class="w-full px-5 py-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-neon-green text-lg" />
            </div>
  
            <!-- Avatar Selection -->
            <div class="space-y-4">
              <p class="text-neon-orange text-xl">Choose your avatar:</p>
              <div class="flex justify-center gap-10 flex-wrap">
                <label class="cursor-pointer transform hover:scale-110 transition">
                  <input type="radio" name="avatar" value="avatar1" class="hidden" />
                  <img src="./public/images/guestAvatar1.png" alt="Avatar 1"
                    class="w-35 h-35 rounded-full border-4 border-transparent hover:border-neon-purple transition" />
                </label>
                <label class="cursor-pointer transform hover:scale-110 transition">
                  <input type="radio" name="avatar" value="avatar2" class="hidden" />
                  <img src="./public/images/guestAvatar2.png" alt="Avatar 2"
                    class="w-35 h-35 rounded-full border-4 border-transparent hover:border-neon-orange transition" />
                </label>
                <label class="cursor-pointer transform hover:scale-110 transition">
                  <input type="radio" name="avatar" value="avatar3" class="hidden" />
                  <img src="./public/images/guestAvatar3.png" alt="Avatar 3"
                    class="w-35 h-35 rounded-full border-4 border-transparent hover:border-neon-green transition" />
                </label>
              </div>
            </div>
  
            <!-- Play Button -->
            <button id="guest-play-btn"
              class="mt-6 w-full py-4 bg-neon-purple hover:bg-neon-green transition text-white font-bold rounded-lg shadow text-lg tracking-wide">
              Continue as Guest!
            </button>
          </div>

          <!-- Popup d'erreur -->
                <div id="signup-popup" class="hidden fixed top-6 left-1/2 transform -translate-x-1/2 bg-neon-purple text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-md w-full">
                    <div class="flex justify-between items-start">
                        <div id="signup-popup-message" class="text-sm"></div>
                        <button id="signup-popup-close" class="ml-4 text-white hover:text-gray-200 text-xl leading-none">&times;</button>
                    </div>
                </div>
        </div>
        <script>
    function checkSelection() {
    const selected = document.querySelector('input[name="avatar"]:checked');
    if (!selected) {
        alert("You have to choose an option");
        return false;
    }
    return true; 
    }
    </script>

      `;

      const app = document.getElementById('app');
      if(app){
          app.innerHTML = html;
      }
      this.setup();
      document.getElementById('signup-popup-close')?.addEventListener('click', () => {
        document.getElementById('signup-popup')?.classList.add('hidden');
    });
      
    }
    
//    cette methode permet de selectionner les avatars et d'envoyer les donnes
    setup(): void {
      const button = document.getElementById('guest-play-btn') as HTMLButtonElement;
      const avatarInputs = document.querySelectorAll('input[name="avatar"]');

    //   ici si on clique sur un avatar, on retire la class "avatar-selected" de tous les autres et 
    // on l'ajoute sur le label d bouton selectionne, il y a meme un effet visuel 
      avatarInputs.forEach((input) => {
        input.addEventListener('change', () => {
          avatarInputs.forEach((inp) => {
            inp.closest('label')?.classList.remove('avatar-selected');
          });
          input.closest('label')?.classList.add('avatar-selected');
        });
      });

      

    //   ici si on clique sur Continue as guest, on lit le usrname et on recupere l'avatar et on les envoie au backend via fetch
        button?.addEventListener('click', async () => {
        const loginElement = document.getElementById('login') as HTMLInputElement;
        const login = loginElement?.value.trim();
        const selectedAvatar = Array.from(document.querySelectorAll('input[name="avatar"]'))
        .find((input) => (input as HTMLInputElement).checked) as HTMLInputElement | undefined;

        // const avatar = (document.querySelector('input[name="avatar"]') as HTMLInputElement)?.value;
        // const avatarUrl = this.getAvatarUrl(avatar);
  
        if (!login) {
          alert("⚠️ Please enter your login!");
          return;
        }

        if (!selectedAvatar) {
            alert("⚠️ Please choose your avatar!");
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
            body: JSON.stringify({ firstname: login, lastname: login, username: login, avatar: avatarUrl, email: `${login}${generatedsuffix}@guest.42.fr`,password: `${generatedpassword}`, address: "", status: 'Online'})
          });

          if (!res.ok) {
            const msg = await res.text();
            throw new Error(`(${res.status}) ${msg}`);
          }
  
          
          const data = await res.json();
               
        localStorage.setItem("authToken", data.token); // <--- sauvegarde du token
        const decoded = jwtDecode<JwtPayload>(data.token);
        console.log('decode ', decoded);
        const userInfo: any = await getUserInfo(decoded.id);
        userInfo['type'] = 'guest'
        localStorage.setItem("transcendenceUser", JSON.stringify(userInfo));
                console.log("✅ User created:", userInfo);
               alert(`Welcome ${userInfo.username} 🕹️`);
               window.location.href = "#profileGuest";
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

    getAvatarUrl(avatarValue: string): string {
        const avatars: Record<string, string> = {
          avatar1: './public/images/guestAvatar1.png',
          avatar2: './public/images/guestAvatar2.png',
          avatar3: './public/images/guestAvatar3.png'
        };
        return avatars[avatarValue] ?? './public/images/guestAvatar1.png';
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
  