import { getTranslation } from "../../i18n/i18n.js";
import { editProfileTranslations } from "../../translations/editProfile.js";
import { RedirectEvents } from "../../utils/redirectEvents.js";
// import { } from "../../frontapp/profile/profilePhotoUpload.js";

export class EditProfilePage implements Page {
    render() {
        const t = (key: keyof typeof editProfileTranslations) => getTranslation("editProfile", key);

        const user = {
            username: "AsmaPro",
            email: "asma@gaming.com",
            avatar: "./public/images/profile.jpg",
            status: "in-game",
        };

        const avatars = [
            { src: "./public/images/profile.jpg", label: "default" , borderColor: "#39ff14", textColor: "#39ff14"},
            { src: "./public/images/avatar3.png", label: "Phantom" , borderColor: "#00f3ff", textColor: "#00f3ff"},
            { src: "./public/images/avatar2.png", label: "Chrome" , borderColor: "#FF6700", textColor: "#FF6700"},
            { src: "./public/images/profile_robo.jpg", label: "Shadow", borderColor: "#00f3ff", textColor: "#00f3ff" },
            { src: "./public/images/cyber_profile.png", label: "Agent" , borderColor: "#FF6700", textColor: "#FF6700"},
            { src: "./public/images/avatar1.png", label: "Pixie" , borderColor: "#ff00ff", textColor: "#ff00ff"},
            { src: "./public/images/avatar4.jpg", label: "Rebel" , borderColor: "#39ff14", textColor: "#39ff14"},
            { src: "", label: "Custom", isUpload: true, },
          ];
            
        // Shin Ae : Upload handler here ??

        const avatarOptions = avatars.map((avatar, i) => {
            if (avatar.isUpload) {
                return `
                <div class="flex flex-col items-center space-y-2">
                    <label for="customAvatarUpload" class="cursor-pointer">
                        <div class="w-30 h-30 bg-gray-700 rounded-full flex items-center justify-center border-2 border-dashed  #9ca3af hover:scale-105 transition">
                            <span class="text-gray-400 text-xl">+</span>
                        </div>
                    </label>
                    <label class="text-sm text-gray-300">${avatar.label}</label>
                    <input id="customAvatarUpload" type="file" accept="image/*" class="hidden">
                </div>`;
            }

            return `
            <div class="flex flex-col items-center space-y-2">
                <img src="${avatar.src}" style="border-color: ${avatar.borderColor}" class="w-30 h-30 rounded-full border-4 hover:scale-105 cursor-pointer transition">
                <p class="text-sm font-semibold" style="color: ${avatar.textColor}">${avatar.label}</p>
            </div>`;
        }).join("");

        const html = `
        <div class="max-w-3xl mx-auto bg-gray-800 p-8 rounded-2xl shadow-xl">
            <!-- Header -->
            <div class="mb-8 text-center">
                <h2 class="text-3xl font-bold text-neon-green">${t("editProfile")}</h2>
            </div>

            <!-- Avatar Options -->
            <div class="mb-10">
                <h4 class="text-center text-sm font-medium mb-8">
                <span class="inline-block text-2xl animate-float align-middle">🛸</span>
                <span class="inline-block text-neon-purple animate-float">${t("chooseAvatar") || "Choose an Avatar"}</span>
                <span class="inline-block text-2xl animate-float align-middle">🛸</span>
                </h4>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
                    ${avatarOptions}
                </div>
            </div>

            <!-- Username + Status on same line -->
            <div class="flex flex-col md:flex-row md:space-x-6 mb-6">
                <div class="flex-1 mb-4 md:mb-0">
                    <label class="block text-sm font-medium text-neon-blue mb-2">${t("displayName")}</label>
                    <input type="text" value="${user.username}" class="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-green" />
                </div>
                <div class="flex-1">
                    <label class="block text-sm font-medium text-neon-blue mb-2">Status</label>
                    <select class="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-green">
                        <option value="online" ${user.status === "online" ? "selected" : ""}>🟢 Online</option>
                        <option value="in-game" ${user.status === "in-game" ? "selected" : ""}>🟠 In Game</option>
                        <option value="offline" ${user.status === "offline" ? "selected" : ""}>⚫ Offline</option>

                    </select>
                </div>
            </div>

            <!-- Email -->
            <div class="mb-10">
                <label class="block text-sm font-medium text-neon-blue mb-2">${t("email")}</label>
                <input type="email" value="${user.email}" class="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-green" />
            </div>

            <!-- Buttons -->
            <div class="flex justify-between mt-10">
                <button data-redirect="/profile" class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-opacity-80 transition">${t("cancel")}</button>
                <button class="bg-neon-green text-black px-6 py-2 rounded-lg font-semibold hover:bg-opacity-80 transition">${t("saveChanges")}</button>
            </div>
        </div>
        `;

        const app = document.getElementById("app");
        if (app) {
            app.innerHTML = html;
            RedirectEvents.attachRedirectEvents();
        }
    }
}
