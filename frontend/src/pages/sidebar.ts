import { getUsersList } from '../services/userService.js';
import { User } from "../models/user";
import { Socket } from 'socket.io-client';
export class Sidebar {
    render() {
        const html = `
        <div class="flex flex-col h-full">
            <!-- Liste d’amis scrollable -->
            <div class="flex-1 pr-1" style="overflow: auto; max-height: 500px">
                <ul id="list-user" class="space-y-4"> 
                    
                </ul>
            </div>

            <!-- Fenêtre de chat stylée neon -->
            <div id="chat-window" class="mt-4 flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-lg shadow-lg overflow-hidden border border-blue-500 h-[300px]">
                <!-- Header -->
                <div class="flex justify-between items-center px-4 py-2 border-b border-blue-700">
                    <h3 id="chat-title" class="text-white text-lg">Chat</h3>
                    <button id="chat-close" class="text-white text-xl hover:text-red-500">×</button>
                </div>

                <!-- Messages -->
                <div id="chat-messages" class="flex-1 overflow-y-auto p-4 space-y-2 flex flex-col">
                    <!-- Messages ici -->
                </div>

                <!-- Barre d'envoi -->
                <div class="border-t border-blue-700 px-3 py-1 bg-gray-900 flex items-center">
                    <input 
                        type="text" 
                        id="chat-input"
                        placeholder="Type a message..."
                        class="flex-1 bg-gray-700 text-white px-3 py-1.5 text-sm rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-[0_0_10px_#3b82f6] transition duration-150"
                    />
                    <button 
                        id="chat-send-btn"
                        class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-sm rounded-r-full shadow-md hover:shadow-blue-500/70 transition duration-200"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
        `;
        const app = document.getElementById('sidebar');
        if (app) {
            app.innerHTML = html;
        }
        this.renderFriend().then(() => {

            this.chatEvents();


        });



    }



    async renderFriend() {

        await getUsersList().then((users: User[]) => {
            const usersHtml = document.getElementById("list-user");
            let result: string = '';
            if (users && users.length > 0) {
                users.forEach((user: User) => {
                    result += `
                    <li class="flex items-center bg-gray-700 p-3 rounded-lg justify-between">
                        <div class="flex items-center">
                            <img src="${user.avatar}" class="w-12 h-12 rounded-full border border-blue-400 shadow-[0_0_10px_#3b82f6]">
                            <p class="ml-4 text-white font-semibold">${user.username}</p>
                        </div>
                        <button 
                            class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded open-chat shadow-md hover:shadow-blue-400"
                            data-nbmessage="0" data-id="${user.id}" data-user="${user.username}" data-avatar="${user.avatar}"
                        >
                            💬
                        </button>
                    </li>`;
                })
                if (usersHtml) {
                    usersHtml.innerHTML = result;

                }




            }

        });


    }

    chatEvents() {
        const socket = getSocket()!;
        socket.on("newMessage", (msg) => {
            const chatMessages = document.getElementById("chat-messages")!;
            console.log("💬 Nouveau message reçu :", msg);
            // 💬 Simuler une réponse (violet neon)
            setTimeout(() => {
                const chatWindow = document.getElementById("chat-window");
                if (chatWindow) {
                    let chatUserId = chatWindow.getAttribute("data-id");
                    if (chatUserId && msg.senderId == chatUserId) {
                        const response = document.createElement("div");
                        response.className = "bg-purple-600 text-white px-4 py-2 rounded-lg self-start max-w-[75%] shadow-[0_0_10px_#a855f7]";
                        response.textContent = msg.content;
                        chatMessages.appendChild(response);
                        chatMessages.scrollTo(0, chatMessages.scrollHeight);
                    } else {
                        // 🚨 Chat fermé avec cet utilisateur → trouver le bouton et le notifier
                        const buttons = document.getElementsByClassName("open-chat");
                        for (let i = 0; i < buttons.length; i++) {
                            const btn = buttons[i] as HTMLElement;
                            if (btn.getAttribute("data-id") === msg.senderId) {
                                // 🔢 Incrémenter le compteur
                                let nb = parseInt(btn.getAttribute("data-nbmessage") || "0");
                                nb++;
                                btn.setAttribute("data-nbmessage", nb.toString());
                                btn.textContent = `💬 (${nb})`;

                                // 🔁 Ajoute l'animation une seule fois
                                btn.classList.add("pulse");
                                break;
                            }
                        }

                    }
                }

            }, 100);
        });

        const chatButtons = document.getElementsByClassName("open-chat");

        for (let i = 0; i < chatButtons.length; i++) {
            const btn = chatButtons[i] as HTMLElement;

            btn.addEventListener("click", () => {

                const user = btn.getAttribute("data-user");
                const userId = btn.getAttribute("data-id");
                const username = btn.getAttribute("data-user");
                const avatar = btn.getAttribute("data-avatar");

                const chatWindow = document.getElementById("chat-window")!;
                const chatTitle = document.getElementById("chat-title")!;
                const chatMessages = document.getElementById("chat-messages")!;

                // 🔧 Ajouter les attributs dynamiques
                chatWindow.setAttribute("data-id", userId || "");
                chatWindow.setAttribute("data-user", username || "");
                chatWindow.setAttribute("data-avatar", avatar || "");

                chatTitle.textContent = `💬 Chat with ${user}`;
                chatMessages.innerHTML = "";
                chatWindow.classList.remove("hidden");
                btn.textContent = "💬";
                btn.classList.remove("pulse");

            });
        }

        const closeBtn = document.getElementById("chat-close");
        closeBtn?.addEventListener("click", () => {
            document.getElementById("chat-window")?.classList.add("hidden");
        });



        const chatSendBtn = document.getElementById("chat-send-btn");
        chatSendBtn?.addEventListener("click", () => {
            const chatInput = document.getElementById("chat-input") as HTMLInputElement;


            const messageText = chatInput.value.trim();
            if (messageText !== "") {
                // 👤 Ton message (bleu)
                const userMessage = document.createElement("div");
                userMessage.className = "bg-blue-600 text-white px-4 py-2 rounded-lg self-end max-w-[75%] shadow-[0_0_10px_#3b82f6]";
                userMessage.textContent = messageText;
                // Envoyer un message
                const chatMessages = document.getElementById("chat-messages")!;
                if (socket) {
                    const chatWindow = document.getElementById("chat-window")!;
                    const userId = chatWindow.getAttribute("data-id");
                    socket.emit("chatMessage", {
                        content: messageText,
                        receiverId: userId
                    });
                }
                chatMessages.appendChild(userMessage);
                chatMessages.scrollTo(0, chatMessages.scrollHeight);
                chatInput.value = "";


            }
        });

    }
}

function getSocket(): Socket | undefined {
    return (window as any).socket;
}


