import { getUsersList } from '../services/userService.js';
import { getConversation } from '../services/chatService.js';
import { User } from "../models/user";
import { Socket } from 'socket.io-client';

export class Sidebar {

    render() {
        const html = `
      <div class="flex flex-col h-full">
        <!-- Liste d’amis scrollable -->
        <div class="flex-1 pr-1" style="overflow: auto; max-height: 500px">
          <ul id="list-user" class="space-y-4"></ul>
        </div>

        <!-- Fenêtre de chat stylée neon -->
        <div id="chat-window" class="mt-4 flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-lg shadow-lg overflow-hidden border border-blue-500 h-[300px]">
          <!-- Header -->
          <div class="flex justify-between items-center px-4 py-2 border-b border-blue-700">
            <h3 id="chat-title" class="text-white text-lg">Chat</h3>
            <button id="chat-close" class="text-white text-xl hover:text-red-500">×</button>
          </div>

          <!-- Messages -->
          <div id="chat-messages" class="flex-1 overflow-y-auto p-4 space-y-2 flex flex-col"></div>

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

    // generer dynamiquement la liste des amis
    async renderFriend() {
        const users = await getUsersList();
        const usersHtml = document.getElementById("list-user");
        let result = '';

        if (users && users.length > 0) {
            users.forEach((user: User) => {
                result += `
          <li class="flex items-center bg-gray-700 p-3 rounded-lg justify-between">
            <div class="flex items-center">
              <img src="${user.avatar}" class="w-12 h-12 rounded-full border border-blue-400 shadow-[0_0_10px_#3b82f6]">
              <p class="ml-4 text-white font-semibold">${user.username}</p>
            </div>
            <button 
              class="open-chat relative bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow-md hover:shadow-blue-400"
              data-nbmessage="0"
              data-id="${user.id}"
              data-user="${user.username}"
              data-avatar="${user.avatar}"
            >
              <span class="chat-icon">💬</span>
              <span class="notif-badge hidden absolute -top-2 -right-2 bg-pink-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
                1
              </span>
            </button>
          </li>`;
            });

            if (usersHtml) {
                usersHtml.innerHTML = result;
            }
        }
    }


    chatEvents() {
        const socket = getSocket()!; // hedhi pour récupérer l'objet socket.io

        // Nouveau message recu via socket
        socket.on("newMessage", (msg) => {
            const chatMessages = document.getElementById("chat-messages")!;

            setTimeout(() => {
                const chatWindow = document.getElementById("chat-window");
                const chatUserId = chatWindow?.getAttribute("data-id");


                // Si le chat n'est pas ouvert OU ouvert avec une autre personne
                if (!chatUserId || chatUserId !== msg.senderId) {
                    // Afficher la notif
                    const buttons = document.getElementsByClassName("open-chat");
                    for (let i = 0; i < buttons.length; i++) {
                        const btn = buttons[i] as HTMLElement;
                        if (btn.getAttribute("data-id") === msg.senderId) {
                            let nb = parseInt(btn.getAttribute("data-nbmessage") || "0");
                            nb++;
                            btn.setAttribute("data-nbmessage", nb.toString());

                            const badge = btn.querySelector(".notif-badge") as HTMLElement;
                            if (badge) {
                                badge.textContent = nb.toString();
                                badge.classList.remove("hidden");
                            }

                            btn.classList.add("pulse");
                            break;
                        }
                    }
                } else {
                    // Chat ouvert avec la bonne personne → afficher direct
                    const chatMessages = document.getElementById("chat-messages")!;
                    const response = document.createElement("div");
                    response.className = "bg-purple-600 text-white px-4 py-2 rounded-lg self-start max-w-[75%] shadow-[0_0_10px_#a855f7]";
                    response.textContent = msg.content;
                    chatMessages.appendChild(response);
                    chatMessages.scrollTo(0, chatMessages.scrollHeight);
                }

            }, 100);
        });

        // si on clic sur bouton message pour ouvrir un chat
        const chatButtons = document.getElementsByClassName("open-chat");
        for (let i = 0; i < chatButtons.length; i++) {
            const btn = chatButtons[i] as HTMLElement;

            btn.addEventListener("click", async () => {
                const user = btn.getAttribute("data-user");
                const userId = btn.getAttribute("data-id");
                const avatar = btn.getAttribute("data-avatar");

                const chatWindow = document.getElementById("chat-window")!;
                const chatTitle = document.getElementById("chat-title")!;
                const chatMessages = document.getElementById("chat-messages")!;

                // Ajouter les infos de l'utilisateur dans le chat window
                chatWindow.setAttribute("data-id", userId || "");
                chatWindow.setAttribute("data-user", user || "");
                chatWindow.setAttribute("data-avatar", avatar || "");

                chatTitle.textContent = `💬 Chat with ${user}`;
                chatMessages.innerHTML = "";
                chatWindow.classList.remove("hidden");

                // reinitialiser le compteur et badge
                btn.setAttribute("data-nbmessage", "0");
                const badge = btn.querySelector(".notif-badge") as HTMLElement;
                if (badge) {
                    badge.textContent = "";
                    badge.classList.add("hidden");
                }
                btn.classList.remove("pulse");

                // Charger anciens messages
                const storedUser = localStorage.getItem("transcendenceUser");
                const myId = storedUser ? JSON.parse(storedUser).id : null;

                console.log("myId =", myId);

                const messages = await getConversation(myId!, userId!);

                messages.forEach((msg: any) => {
                    const div = document.createElement("div");
                    const isMe = String(msg.senderId) === String(myId);
                    console.log("💡 myId =", myId, "↔️ sender =", msg.senderId);

                    div.className = isMe
                        ? "bg-blue-600 text-white px-4 py-2 rounded-lg self-end max-w-[75%] shadow-[0_0_10px_#3b82f6]"
                        : "bg-purple-600 text-white px-4 py-2 rounded-lg self-start max-w-[75%] shadow-[0_0_10px_#a855f7]";

                    div.textContent = msg.content;
                    chatMessages.appendChild(div);
                });

                //Scroll tout en bas
                chatMessages.scrollTo(0, chatMessages.scrollHeight);
            });
        }

        // bouton de fermeture du chat
        const closeBtn = document.getElementById("chat-close");
        closeBtn?.addEventListener("click", () => {
            document.getElementById("chat-window")?.classList.add("hidden");
        });

        // ici c'est la parrtie d l'envoi d’un message
        const chatSendBtn = document.getElementById("chat-send-btn");
        const chatInput = document.getElementById("chat-input") as HTMLInputElement;
        const chatMessages = document.getElementById("chat-messages")!;

        function sendMessage() {
            const messageText = chatInput.value.trim();
            if (messageText !== "") {
                const userMessage = document.createElement("div");
                userMessage.className = "bg-blue-600 text-white px-4 py-2 rounded-lg self-end max-w-[75%] shadow-[0_0_10px_#3b82f6]";
                userMessage.textContent = messageText;
                chatMessages.appendChild(userMessage);
                chatMessages.scrollTo(0, chatMessages.scrollHeight);
                chatInput.value = "";

                const chatWindow = document.getElementById("chat-window")!;
                const userId = chatWindow.getAttribute("data-id");
                if (socket && userId) {
                    socket.emit("chatMessage", {
                        content: messageText,
                        receiverId: userId
                    });
                }
            }
        }

        chatSendBtn?.addEventListener("click", sendMessage);

        chatInput?.addEventListener("keydown", (event: KeyboardEvent) => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
            }
        });
    }
}

// ici c'est une fonction utilitaire pour acceder à l’objet socket.io
function getSocket(): Socket | undefined {
    return (window as any).socket;
}
