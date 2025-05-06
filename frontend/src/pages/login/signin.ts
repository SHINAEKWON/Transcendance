import { env } from "../../env/env";
import { jwtDecode } from "jwt-decode";
import { getUserInfo } from "../../services/userService";
import { getTranslation } from "../../i18n/i18n.js";
import { authTranslations } from "../../translations/auth.js";

interface JwtPayload {
  user_id: number;
  email: string;
  iat: number;
  exp: number;
}

export class SigninPage implements Page {
  render() {
    const t = (key: keyof typeof authTranslations) => getTranslation("auth", key);

    setTimeout(this.loginButtonHandler.bind(this), 50);
    const googleClientId = document
      .getElementById("googleClientId")
      ?.getAttribute("data-google-client-id");

    const html = `
      <div class="max-w-md mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 class="text-3xl font-gaming text-neon-blue mb-6 animate-glow text-center">${t('signinTitle')}</h2>

        <form id="signin-form" class="space-y-6">
          <div>
            <label class="block text-neon-purple mb-1" for="username">${t('username')}</label>
            <input type="text" id="username" name="username" required
              class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600" />
          </div>
          <div>
            <label class="block text-neon-purple mb-1" for="password">${t('password')}</label>
            <input type="password" id="password" name="password" required
              class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600" />
          </div>
          <button type="submit"
            class="w-full mt-4 py-2 bg-neon-purple hover:bg-neon-green transition text-white font-semibold rounded-lg shadow">
            ${t('signinBtn')}
          </button>
        </form>

        <div class="text-center my-4 text-gray-400">${t('or')}</div>

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
            data-text="sign_in_with">
          </div>
        </div>
      </div>
    `;

    const app = document.getElementById('app');
    if (app) app.innerHTML = html;

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

    (window as any).handleCredentialResponse = async (response: any) => {
      const idToken = response.credential;
      try {
        const res = await fetch(`${env.backAuth}/google-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ credential: idToken }),
        });

        if (!res.ok) throw new Error(await res.text());

        const data = await res.json();
        alert(t('googleSigninSuccess'));
        localStorage.setItem("authToken", data.token);
        const decoded = jwtDecode<JwtPayload>(data.token);
        const userInfo = await getUserInfo(decoded.user_id);
        localStorage.setItem("transcendenceUser", JSON.stringify(userInfo));
        window.location.hash = "#profile";
        window.location.reload();
      } catch (err) {
        alert("Google Sign-In failed.");
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
        const res = await fetch(`${env.backAuth}/signin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error(await res.text());

        const data = await res.json();
        localStorage.setItem("authToken", data.token);
        const decoded = jwtDecode<JwtPayload>(data.token);
        const userInfo = await getUserInfo(decoded.user_id);
        localStorage.setItem("transcendenceUser", JSON.stringify(userInfo));
        alert("Login successful!");
        window.location.hash = "#profile";
        window.location.reload();
      } catch (err) {
        alert("Login failed.");
      }
    });
  }

  private renderGoogleButton() {
    const google = (window as any).google;
    if (google?.accounts?.id) {
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
