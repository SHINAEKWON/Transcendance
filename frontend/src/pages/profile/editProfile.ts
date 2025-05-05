import { getTranslation } from "../../i18n/i18n.js";
import { getLang } from "../../i18n/language.js";
import { editProfileTranslations } from "../../translations/editProfile.js";
import { RedirectEvents } from "../../utils/redirectEvents.js";
import { avatarUploadHandler } from "../../frontapp/profile/profilePhotoUpload.js";
import { env } from "../../env/env.js";

export class EditProfilePage implements Page {
    render() {
       
        const t = (key: keyof typeof editProfileTranslations) => getTranslation("editProfile", key);
    
        const savedUser = localStorage.getItem("transcendenceUser");
        let user;
        if(savedUser){
            user = JSON.parse(savedUser);
        } 
    
        const tAvatar = (key: keyof typeof editProfileTranslations.avatars) => {
            const lang = getLang() as "en" | "fr" | "de" | "ar" | "ko";
            const avatarEntry = editProfileTranslations.avatars[key];
            return avatarEntry[lang] || avatarEntry["en"];
        };
    
        const avatars = [
            { src: "./public/images/profile.jpg", label: tAvatar("default"), borderColor: "#39ff14", textColor: "#39ff14" , isSelected: true},
            { src: "./public/images/avatar3.png", label: tAvatar("phantom"), borderColor: "#00f3ff", textColor: "#00f3ff" },
            { src: "./public/images/avatar2.png", label: tAvatar("chrome"), borderColor: "#FF6700", textColor: "#FF6700" },
            { src: "./public/images/profile_robo.jpg", label: tAvatar("shadow"), borderColor: "#00f3ff", textColor: "#00f3ff" },
            { src: "./public/images/cyber_profile.png", label: tAvatar("agent"), borderColor: "#FF6700", textColor: "#FF6700" },
            { src: "./public/images/avatar1.png", label: tAvatar("pixie"), borderColor: "#ff00ff", textColor: "#ff00ff" },
            { src: "./public/images/avatar4.jpg", label: tAvatar("rebel"), borderColor: "#39ff14", textColor: "#39ff14" },
            { src: "", label: tAvatar("custom"), isUpload: true }
        ];
        const normalAvatars = avatars.filter(a => !a.isUpload);
        const uploadAvatar = avatars.find(a => a.isUpload);

        const avatarOptions = normalAvatars.map((avatar) => `
            <div class="flex flex-col items-center space-y-2">
                <img src="${avatar.src}" style="border-color: ${avatar.borderColor}" 
                class="${avatar.isSelected ? 'avatar-option w-30 h-30 rounded-full border-4 hover:scale-105 cursor-pointer transition selected-avatar scale-110 border-yellow-400 ring-4 ring-yellow-300 shadow-xl' : 'avatar-option w-30 h-30 rounded-full border-4 hover:scale-105 cursor-pointer transition'}">
                <p class="text-sm font-semibold" style="color: ${avatar.textColor}">${avatar.label}</p>
            </div>
        `).join("");

        // Ajouter le bouton custom à la fin
        const uploadOption = `
            <div class="flex flex-col items-center space-y-2">
                <label for="customAvatarUpload" class="cursor-pointer">
                    <div class="w-30 h-30 bg-gray-700 rounded-full flex items-center justify-center border-4 border-dashed border-gray-500 hover:scale-110 transition">
                        <span class="text-gray-400 text-4xl font-bold">+</span>
                    </div>
                </label>
                <label class="text-sm text-gray-300">${uploadAvatar ? uploadAvatar.label : "Custom"}</label>
                <input id="customAvatarUpload" type="file" accept="image/*" class="hidden">
            </div>
        `;

        const avatarHTML = avatarOptions + uploadOption;

    
        const html = `
        <div class="max-w-3xl mx-auto bg-gray-800 p-8 ounded-2xl shadow-xl">
            <!-- Header -->
            <div class="mb-8 text-center">
                <h2 class="text-3xl font-bold text-neon-green">${t("editProfile")}</h2>
            </div>
    
            <!-- Avatar Options -->
            <div class="mb-10 max-h-100 overflow-auto">
                <h4 class="text-center text-sm font-medium mb-8">
                <span class="inline-block text-2xl animate-float align-middle">🛸</span>
                <span class="inline-block text-neon-purple animate-float">${t("chooseAvatar") || "Choose an Avatar"}</span>
                <span class="inline-block text-2xl animate-float align-middle">🛸</span>
                </h4>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
                    ${avatarHTML}
                </div>
            </div>
    
            <!-- First line: Firstname + Lastname -->
            <div class="flex flex-col md:flex-row md:space-x-6 mb-6">
                <div class="flex-1 mb-4 md:mb-0">
                    <label class="block text-sm font-medium text-neon-blue mb-2">${t("firstname") || "First Name"}</label>
                    <input type="text" value="${user.firstname}" class="firstname w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-green" />
                </div>
                <div class="flex-1">
                    <label class="block text-sm font-medium text-neon-blue mb-2">${t("lastname") || "Last Name"}</label>
                    <input type="text" value="${user.lastname}" class="lastname w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-green" />
                </div>
            </div>
    
            <!-- Second line: Telephone + Status -->
            <div class="flex flex-col md:flex-row md:space-x-6 mb-6">
                <div class="flex-1 mb-4 md:mb-0">
                    <label class="block text-sm font-medium text-neon-blue mb-2">${t("telephone") || "Telephone"}</label>
                    <input type="tel" value="${user.telephone}" class="telephone w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-green" />
                </div>
                <div class="flex-1">
                    <label class="block text-sm font-medium text-neon-blue mb-2">${t("status")}</label>
                    <select class="status w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-green">
                        <option value="online" ${user.status === "online" ? "selected" : ""}>🟢 Online</option>
                        <option value="in-game" ${user.status === "in-game" ? "selected" : ""}>🟠 In Game</option>
                        <option value="offline" ${user.status === "offline" ? "selected" : ""}>⚫ Offline</option>
                    </select>
                </div>
            </div>
    
            <!-- Third line: Address -->
            <div class="mb-6">
                <label class="block text-sm font-medium text-neon-blue mb-2">${t("address") || "Address"}</label>
                <input type="text" value="${user.address}" class="address w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-green" />
            </div>
    
            <!-- Buttons -->
            <div class="flex justify-between mt-10">
                <a href="#profile" class="bg-neon-purple text-gray-900 px-6 py-3 rounded-lg text-lg font-bold hover:bg-purple-400 transition animate-float">
                    ${t("cancel")}
                </a>
                <button id="save" class="bg-neon-green text-black px-6 py-2 rounded-lg font-semibold hover:bg-opacity-80 transition">${t("saveChanges")}</button>
            </div>
        </div>
        `;
    
        const app = document.getElementById("app");
        if (app) {
            app.innerHTML = html;
            RedirectEvents.attachRedirectEvents();
            
            this.avatarSelectionHandler();
            this.avatarChangeHandler();
            this.attachEvent();
            

        }
    }
    attachEvent(){
        const btn = document.getElementById('save');
        if(btn){
            btn.addEventListener('click', async () => {
                let json = this.collectFormData();
                console.log('json :', json);
    
                // On récupère le user ID depuis le localStorage
                const savedUser = localStorage.getItem("transcendenceUser");
                if (!savedUser) {
                    alert("Utilisateur non connecté.");
                    return;
                }
                const user = JSON.parse(savedUser);
                const userId = user.id;
    
                // Envoi de la requête PUT vers le backend
                try {
                    const response = await fetch(`${env.backUser}/users/${userId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(json)
                    });
    
                    if (!response.ok) {
                        const error = await response.json();
                        console.error('Erreur backend :', error);
                        alert("Erreur lors de la mise à jour du profil.");
                        return;
                    }
    
                    const result = await response.json();
                    console.log('Profil mis à jour avec succès:', result);
    
                    // Mettre à jour le localStorage avec les nouvelles infos
                    const updatedUser = {
                        ...user,
                        firstname: json.firstname,
                        lastname: json.lastname,
                        telephone: json.telephone,
                        address: json.address,
                        status: json.status,
                        avatar: json.avatar
                    };
                    localStorage.setItem("transcendenceUser", JSON.stringify(updatedUser));
    
                    // Rediriger vers le profil
                    window.location.hash = "#profile";
                    window.location.reload();
    
                } catch (err) {
                    console.error('Erreur fetch:', err);
                    alert("Erreur de connexion au serveur.");
                }
            });
        }
    }
    

    private avatarChangeHandler() {
        const fileInput = document.getElementById("customAvatarUpload") as HTMLInputElement;
        if (fileInput) {
            fileInput.addEventListener("change", (event) => {
                const file = fileInput.files ? fileInput.files[0] : null;
                if (!file) return;
                    // Limiter la taille à 1 Mo
                if (file.size > 1024 * 1024) {  // 1 Mo
                    alert("Le fichier est trop grand. Taille maximale : 1 Mo.");
                    return;
                }
                const reader = new FileReader();
                reader.onload = () => {
                    const base64 = reader.result as string;
    
                    // Créer un nouvel avatar
                    const container = document.createElement("div");
                    container.className = "flex flex-col items-center space-y-2";
    
                    const img = document.createElement("img");
                    img.src = base64;
                    img.style.borderColor = "#FFD700";
                    img.className = "selected-avatar avatar-option w-30 h-30 rounded-full border-4 hover:scale-105 cursor-pointer transition";
    
                    const label = document.createElement("p");
                    label.textContent = "Upload";
                    label.className = "text-sm font-semibold text-yellow-400";
    
                    container.appendChild(img);
                    container.appendChild(label);
    
                    const grid = document.querySelector(".grid.grid-cols-2.md\\:grid-cols-3.lg\\:grid-cols-4");
                    const uploadButton = grid?.lastElementChild;
    
                    // Insérer avant le bouton "+"
                    if (grid && uploadButton) {
                        grid.insertBefore(container, uploadButton);
                    }
    
                    // Désélectionner les autres avatars
                    document.querySelectorAll(".avatar-option").forEach(i => {
                        i.classList.remove("scale-110", "border-yellow-400", "ring-4", "ring-yellow-300", "shadow-xl", "selected-avatar");
                    });
    
                    // Sélectionner le nouvel avatar
                    img.classList.add("scale-110", "border-yellow-400", "ring-4", "ring-yellow-300", "shadow-xl", "selected-avatar");
    
                    // Ajouter click handler pour le nouvel avatar
                    this.avatarSelectionHandler();
                };
                reader.readAsDataURL(file);
            });
        }
    }
    
    

    collectFormData() {
        const firstname = (document.querySelector('.firstname') as HTMLInputElement)?.value || "";
        const lastname = (document.querySelector('.lastname') as HTMLInputElement)?.value || "";
        const telephone = (document.querySelector('.telephone') as HTMLInputElement)?.value || "";
        const address = (document.querySelector('.address') as HTMLInputElement)?.value || "";
        const status = (document.querySelector('.status') as HTMLSelectElement)?.value || "";
    
        // Trouver l'avatar sélectionné
        const selectedAvatar = document.querySelector('.selected-avatar') as HTMLImageElement;
        const avatarSrc = selectedAvatar ? selectedAvatar.getAttribute("src") || "" : "";

    
        const jsonData = {
            firstname,
            lastname,
            telephone,
            address,
            status,
            avatar: avatarSrc
        };
    
        return jsonData;
    }
    
    
    
    private avatarSelectionHandler() {
        const avatarImages = document.querySelectorAll(".avatar-option");
    
        avatarImages.forEach(img => {
            img.addEventListener("click", () => {
                avatarImages.forEach(i => {
                    i.classList.remove("selected-avatar", "scale-110", "border-yellow-400", "ring-4", "ring-yellow-300", "shadow-xl");
                });
    
                img.classList.add("selected-avatar", "scale-110", "border-yellow-400", "ring-4", "ring-yellow-300", "shadow-xl"); 
            });
        });
    }
    
    
    
}
