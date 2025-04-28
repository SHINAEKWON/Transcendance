import { env } from "../../env/env";

export class GuestPage implements Page{
    render() {
      const html = `
        <div class="flex items-center justify-center bg-dark-blue">
          <div class="bg-gray-800 bg-opacity-90 p-8 rounded-2xl shadow-lg w-full max-w-3xl text-center space-y-8">
            <h2 class="text-4xl font-gaming text-neon-blue animate-glow">Play as Guest</h2>
            <p class="text-neon-purple text-xl">Choose a nickname and your fighter style</p>
  
            <!-- Pseudo Input -->
            <div>
              <label for="guestName" class="block text-neon-green mb-3 text-lg">Enter your nickname:</label>
              <input type="text" id="guestName" name="guestName" required
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
        const nicknameInput = document.getElementById('guestName') as HTMLInputElement;
        const nickname = nicknameInput?.value.trim();
        const selectedAvatar = Array.from(document.querySelectorAll('input[name="avatar"]'))
        .find((input) => (input as HTMLInputElement).checked) as HTMLInputElement | undefined;

        // const avatar = (document.querySelector('input[name="avatar"]') as HTMLInputElement)?.value;
        // const avatarUrl = this.getAvatarUrl(avatar);
  
        if (!nickname) {
          alert("⚠️ Please enter your nickname!");
          return;
        }

        if (!selectedAvatar) {
            alert("⚠️ Please choose your avatar!");
            return;
          }
          const avatar = selectedAvatar.value;
          const avatarUrl = this.getAvatarUrl(avatar);
        
        try {
          const res = await fetch(`${env.backUser}/user/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firstname: nickname, lastname: nickname, username: nickname,nickname: nickname, avatar: avatarUrl, email: `${nickname}@guest.42.fr`, address: "", telephone: `${nickname}_telephone`})
          });

          if (!res.ok) {
            // Gestion des erreurs HTTP (ex: 400, 404, 500...)
            const errorText = await res.text();
            throw new Error(`Erreur serveur: ${res.status} ${res.statusText} - ${errorText}`);
          }
  
          const userResponse = await res.json();
          const user = {
            id : userResponse.user_id,
            avatar: avatarUrl,
            username: nickname,
            type: "guest"
          }
          console.log("✅ User created:", user);
          alert(`Welcome ${user.username} 🕹️`);

           // Sauvegarde du user dans localStorage
           localStorage.setItem("transcendenceUser", JSON.stringify(user));
 
           // Redirection vers la page de profil
           window.location.hash = "#profileGuest";

        } catch (err) {
          console.error("❌ Failed to create user:", err);
          alert("Something went wrong...");
        }
      });
    }
  
    // getAvatarUrl(avatarValue: string): string {
    //   switch (avatarValue) {
    //     case 'avatar1': return './public/images/avatar1.png';
    //     case 'avatar2': return './public/images/avatar2.png';
    //     case 'avatar3': return './public/images/avatar3.png';
    //     default: return './public/images/avatar1.png';
    //   }
    // }

    getAvatarUrl(avatarValue: string): string {
        const avatars: Record<string, string> = {
          avatar1: './public/images/guestAvatar1.png',
          avatar2: './public/images/guestAvatar2.png',
          avatar3: './public/images/guestAvatar3.png'
        };
        return avatars[avatarValue] ?? './public/images/guestAvatar1.png';
      }
      
  }
  