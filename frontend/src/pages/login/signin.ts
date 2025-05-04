import { env } from "../../env/env";
import { jwtDecode } from "jwt-decode";
import { getUserInfo } from "../../services/userService";


interface JwtPayload {
  user_id: number;
  email: string;
  iat: number;
  exp: number;
}
export class SigninPage implements Page {
  render() {
    setTimeout(this.loginButtonHandler.bind(this), 50);
    const googleClientId = document
    .getElementById("googleClientId")
    ?.getAttribute("data-google-client-id");
    const html = `
      <div class="max-w-md mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 class="text-3xl font-gaming text-neon-blue mb-6 animate-glow text-center">Sign In</h2>

        <form id="signin-form" class="space-y-6">
          <div>
            <label class="block text-neon-purple mb-1" for="username">Login</label>
            <input type="text" id="username" name="username" required
              class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-neon-blue" />
          </div>
          <div>
            <label class="block text-neon-purple mb-1" for="password">Password</label>
            <input type="password" id="password" name="password" required
              class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-neon-blue" />
          </div>
          <button type="submit"
            class="w-full mt-4 py-2 bg-neon-purple hover:bg-neon-green transition text-white font-semibold rounded-lg shadow">
            signin
          </button>
        </form>

        <div class="text-center my-4 text-gray-400">OR</div>

        <!-- Google Sign-In -->
        <div class="text-center">
          <div id="g_id_onload"
            data-client_id="${googleClientId}"
            data-callback="handleCredentialResponse"
            data-auto_prompt="false">
          </div>
          <div class="g_id_signin"
            data-type="standard"
            data-size="large"
            data-theme="outline"
            data-text="sign_in_with"
            data-shape="rectangular"
            data-width="300">
          </div>
        </div>
      </div>
    `;

    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = html;
    }

    // Charge Google script si non déjà présent
    if (!document.getElementById("google-gsi-script")) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.id = "google-gsi-script";
      script.onload = () => this.renderGoogleButton();
      document.head.appendChild(script);
    } else {
      this.renderGoogleButton();
    }

    this.loginButtonHandler();

    // Fonction appelée par Google Sign-In
    (window as any).handleCredentialResponse = async (response: any) => {
      const idToken = response.credential;

      try {
        const res = await fetch(`${env.backAuth}/google-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ credential: idToken }),
        });

        if (!res.ok) {
          const msg = await res.text();
          throw new Error(`(${res.status}) ${msg}`);
        }

        const data = await res.json();
        alert("Connexion Google réussie !");
        console.log("Réponse backend :", data);
        localStorage.setItem("authToken", data.token); // <--- sauvegarde du token
        const decoded = jwtDecode<JwtPayload>(data.token);
        const userId = decoded.user_id ?? (decoded as any).id;
        console.log('decode ', decoded);
        const userInfo = await getUserInfo(userId);
        localStorage.setItem("transcendenceUser", JSON.stringify(userInfo));   
        window.location.hash = "#profile";
        window.location.reload();

        // Tu peux rediriger ici
        // window.location.href = "/home";

      } catch (err: any) {
        console.error("Erreur Google Sign-In :", err);
        alert("Erreur lors de la connexion avec Google.");
      }
    };
  }

  private loginButtonHandler() {
    const form = document.getElementById("signin-form") as HTMLFormElement;

    form?.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = {
        username: (document.getElementById("username") as HTMLInputElement).value,
        password: (document.getElementById("password") as HTMLInputElement).value,
      };

      try {
        const response = await fetch(`${env.backAuth}/signin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const msg = await response.text();
          throw new Error(`(${response.status}) ${msg}`);
        }
        const data = await response.json(); // <--- extraction de la réponse JSON
        localStorage.setItem("authToken", data.token); // <--- sauvegarde du token
        const decoded = jwtDecode<JwtPayload>(data.token);
        console.log('decode ', decoded);
        const userInfo = await getUserInfo(decoded.user_id);
        localStorage.setItem("transcendenceUser", JSON.stringify(userInfo));
        alert("Connexion réussie !");
        console.log("Login envoyé au backend :", formData.username);
        window.location.hash = "#profile";
        window.location.reload();

      } catch (err: any) {
        alert("Connexion échouée.");
        console.log(formData.username, " échec :", err.message);
      }
    });
  }

  private renderGoogleButton() {
    const google = (window as any).google;
    if (google && google.accounts && google.accounts.id) {
      const googleClientId = document
      .getElementById("googleClientId")
      ?.getAttribute("data-google-client-id");
      google.accounts.id.initialize({
        client_id: googleClientId,
        callback: (window as any).handleCredentialResponse,
      });
      google.accounts.id.renderButton(
        document.querySelector(".g_id_signin"),
        { theme: "outline", size: "large" }
      );
    }
  }
}

