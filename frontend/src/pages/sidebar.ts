
import { getUsersFriendsStatus } from '../services/userService.js';
import { getConversation } from '../services/chatService.js';
import { User } from "../models/user";
import { env } from '../env/env.js';
import { getTranslation } from "../i18n/i18n.js";
import { sidebarTranslations } from "../translations/sidebar.js";
import { authorizedFetch } from '../utils/authorizedFetch.js';
import { encodeId } from '../utils/decoder.js';


declare var Socket: any;

export class Sidebar {

  constructor(private initSocket: boolean = true) {

  }

  setInitSocket(initSocket: boolean) {
    this.initSocket = initSocket;
  }
  private statusBadge: { [key in "online" | "offline" | "in-game"]: string } = {
    online: `<span class="flex items-center gap-2 text-green-400 font-semibold mr-3" ><span class="w-3 h-3 rounded-full bg-green-400 animate-pulse"></span></span>`,
    offline: `<span class="mr-3 flex items-center gap-2 text-gray-400 font-semibold"><span class="w-3 h-3 rounded-full bg-gray-400"></span></span>`,
    "in-game": `<span class="mr-3 flex items-center gap-2 text-yellow-300 font-semibold"><span class="w-3 h-3 rounded-full bg-yellow-300 animate-pulse"></span></span>`,
  };
  render() {

    const t = (key: keyof typeof sidebarTranslations) => getTranslation("sidebar", key);

    const html = `
      <div class="flex flex-col h-full">
        <div class="flex-1 pr-1" style="overflow: auto; max-height: 520px">
          <ul id="list-user" class="space-y-4"></ul>
        </div>

        <div id="chat-window" class="mt-4 hidden flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-lg shadow-lg overflow-hidden border border-blue-500 h-[300px]">
          <div class="flex justify-between items-center px-4 py-2 border-b border-blue-700">
           <h3 id="chat-title" class="text-white text-lg">${t("chatTitle")}</h3>
            <button id="chat-close" class="text-white text-xl hover:text-red-500">×</button>
          </div>

          <div id="chat-messages" class="flex-1 overflow-y-auto p-4 space-y-2 text-xs flex flex-col"></div>

          <div class="border-t border-blue-700 px-3 py-1 bg-gray-900 flex items-center">
            <input 
              type="text" 
              id="chat-input"
              placeholder="${t('placeholderMessage')}"
              class="flex-1 bg-gray-700 text-white px-3 py-1.5 text-xs rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button 
              id="chat-send-btn"
              class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-xs rounded-r-full"
              >${t("send")}</button>
          </div>
        </div>
      </div>
    `;

    const app = document.getElementById('sidebar');
    if (app) app.innerHTML = html;

    this.renderFriend(null).then(() => {
      setTimeout(() => {
        if (this.initSocket) {
          this.installSocket();
        }
      }, 200);

    });
  }

  async renderFriend(targetId: any) {
    const socket = getSocket()!;
    if (socket && targetId != null) {
      socket.emit("friendsEvents", {
        to: "" + targetId
      });
    }
    const users = await getUsersFriendsStatus();
    if (!users) { return; }

    const usersHtml = document.getElementById("list-user");
    let result = '';

    const storedUser = localStorage.getItem("transcendenceUser");
    const myId = storedUser ? JSON.parse(storedUser).id : null;

    const me = users.find((u: any) => u.id === myId);
    const others = users.filter((u: any) => u.id !== myId);

    // Afficher moi-même
    if (me) {
      result += `
       <li class="flex flex-col items-center bg-gray-800 px-3 py-1 rounded-lg animate-pulse">
         <img src="${me.avatar}" class="w-12 h-12 rounded-full border border-neon-green shadow-md">
         <p class="mt-1 text-neon-green text-center font-bold text-lg leading-none">${me.username}</p>
       </li> `;
    }

    others.forEach((user: any) => {
      const isFriend = user.friend_status === 'accepted';
      const isPending = user.friend_status === 'pending';
      const isBlocked = user.friend_status === 'blocked';
      const isBlockedByMe = isBlocked && user.action_user_id === myId;
      const hasBlockedMe = isBlocked && user.action_user_id !== myId;
      const sentByMe = user.action_user_id === myId;

      let rowStyle = hasBlockedMe ? 'opacity-50 grayscale pointer-events-none' : '';
      let actionButtons = '';

      const liStyle = isFriend 
    ? 'bg-gradient-to-r from-purple-900 to-purple-700 border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.7)] p-3 rounded-lg hover:brightness-110 transition duration-300 cursor-pointer' 
    : 'bg-gray-700 p-3 rounded-lg';


      if (isFriend) {
        actionButtons += `
           <button class="open-chat relative bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow-md" data-id="${user.id}" data-user="${user.username}" data-avatar="${user.avatar}">
             💬
             <span class="notif-badge hidden absolute -top-2 -right-2 bg-pink-600 text-xs font-bold px-2 py-0.5 rounded-full">1</span>
           </button>`;
        actionButtons += `
            <div class="relative inline-block">
                <button class="love-btn bg-pink-600 hover:bg-pink-700 text-white px-2 py-1 ml-2 rounded text-sm" data-id="${user.id}">🚫</button>
                <div class="hidden action-invite absolute right-0 top-full mt-1 space-x-1 flex">
                <button class="block-btn bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded" data-id="${user.id}">⛔</button>
                <button class="reject-invite-btn bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm" data-id="${user.id}">❌</button>
                </div>
            </div>`;


      }
      if (isBlockedByMe) {
        actionButtons += `
          <button class="unblock-btn bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded" data-id="${user.id}">♻️</button>`;
      }
      else if (!user.friend_status) {
        actionButtons += `<button class="send-invite-btn bg-green-600 hover:bg-green-700 text-white px-2 py-1 ml-2 rounded" data-id="${user.id}">👤</button>`;
      }
      else if (isPending && !sentByMe) {
        actionButtons += `
            <div class="relative inline-block">
                <button class="love-btn bg-pink-600 hover:bg-pink-700 text-white px-2 py-1 ml-2 rounded text-sm" data-id="${user.id}">💖</button>
                <div class="hidden action-invite absolute right-0 top-full mt-1 space-x-1 flex">
                    <button class="accept-invite-btn bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-sm" data-id="${user.id}">✅</button>
                    <button class="reject-invite-btn bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm" data-id="${user.id}">❌</button>
                </div>
            </div>`;
      }
      else if (isPending && sentByMe) {
        actionButtons += `
            <div class="relative">
                <button class="toggle-cancel-btn bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 ml-2 rounded text-sm">...</button>
                <div class="cancel-dropdown hidden absolute right-0 top-full mt-1 bg-gray-700 text-white text-sm px-2 py-1 rounded shadow-lg z-10">
                    <button class="cancel-invite-btn hover:text-red-500 text-sm" data-id="${user.id}">❌</button>
                </div>
            </div>`;
      }

      result += `
            <li class="flex items-center bg-gray-700 p-3 rounded-lg justify-between ${liStyle} ${rowStyle}">
            <div class="flex items-center space-x-2">
              ${this.statusBadge[user.status as "online" | "offline" | "in-game"]}
              ${
                user.friend_status === 'accepted' ? `
                  <img src="${user.avatar}" 
                        class="w-12 h-12 rounded-full border border-blue-400 profile-link" 
                        data-id="${user.id}" 
                        data-type="${user.type}" 
                        alt="Avatar">
                  <p class="ml-4 text-white font-semibold profile-link" 
                      data-id="${user.id}" data-type="${user.type}" >
                      ${user.username}
                  </p>
                ` : `
                  <img src="${user.avatar}" 
                        class="w-12 h-12 rounded-full border border-blue-400 opacity-50" 
                        alt="Avatar">
                  <p class="ml-4 text-white font-semibold text-gray-400">
                      ${user.username}
                  </p>
                `
              }
            </div>
            <div class="flex items-center space-x-2">
              ${actionButtons}
            </div>
          </li>`;
    });

    if (usersHtml) usersHtml.innerHTML = result;
    this.attachFriendActions();
    setTimeout(() => {
      this.chatEvents();
    }, 200);
  }



  public attachFriendActions() {
    const storedUser = localStorage.getItem("transcendenceUser");
    const myId = storedUser ? JSON.parse(storedUser).id : null;

    document.querySelectorAll('.send-invite-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const targetId = (e.currentTarget as HTMLElement).getAttribute("data-id");
        await authorizedFetch(`${env.backUser}/users/${myId}/friends/${targetId}`, { method: 'POST' });
        this.renderFriend(targetId);
      });
    });

    // 💖 → Toggle ✅ ❌
    document.querySelectorAll('.love-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const parent = (e.currentTarget as HTMLElement).parentElement;
        const dropdown = parent?.querySelector('.action-invite') as HTMLElement;
        if (dropdown) {
          dropdown.classList.toggle('hidden');
        }
      });
    });

    // ✅ Accepter
    document.querySelectorAll('.accept-invite-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const targetId = (e.currentTarget as HTMLElement).getAttribute("data-id");
        await authorizedFetch(`${env.backUser}/users/${myId}/friends/${targetId}`, { method: 'PUT' });
        this.renderFriend(targetId);
      });
    });

    // ❌ Rejeter
    document.querySelectorAll('.reject-invite-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const targetId = (e.currentTarget as HTMLElement).getAttribute("data-id");
        await authorizedFetch(`${env.backUser}/users/${myId}/friends/${targetId}`, { method: 'DELETE' });
        this.renderFriend(targetId);
        const chatWindow = document.getElementById("chat-window");
        let id = chatWindow?.getAttribute("data-id");
        if (id && (id == targetId)) {
          document.getElementById("chat-window")?.classList.add("hidden");
          chatWindow?.removeAttribute("data-id");
        }
      });
    });

    document.querySelectorAll('.profile-link').forEach(el => {
      el.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const targetId = target.getAttribute('data-id');
        const userType = target.getAttribute('data-type');
        if (targetId) {
          if(userType == 'guest'){
            window.location.hash = `#profileGuest?id=${encodeId(targetId)}`;
          }else {
            window.location.hash = `#profile?id=${encodeId(targetId)}`;
          }

         
        }
      });
    });



    // Annuler invitation envoyée
    document.querySelectorAll('.cancel-invite-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const targetId = (e.currentTarget as HTMLElement).getAttribute("data-id");
        await authorizedFetch(`${env.backUser}/users/${myId}/friends/${targetId}`, { method: 'DELETE' });
        this.renderFriend(targetId);
      });
    });

    // Toggle menu ...
    document.querySelectorAll('.toggle-cancel-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const parent = (e.currentTarget as HTMLElement).parentElement;
        const dropdown = parent?.querySelector('.cancel-dropdown') as HTMLElement;
        if (dropdown) {
          dropdown.classList.toggle('hidden');
        }

      });
    });

    // Bloquer
    document.querySelectorAll('.block-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const targetId = (e.currentTarget as HTMLElement).getAttribute("data-id");
        await authorizedFetch(`${env.backUser}/users/${myId}/friends/${targetId}/block`, { method: 'POST' });
        this.renderFriend(targetId);
        const chatWindow = document.getElementById("chat-window");
        let id = chatWindow?.getAttribute("data-id");
        if (id && (id == targetId)) {
          document.getElementById("chat-window")?.classList.add("hidden");
          chatWindow?.removeAttribute("data-id");
        }
      });
    });

    // Débloquer
    document.querySelectorAll('.unblock-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const targetId = (e.currentTarget as HTMLElement).getAttribute("data-id");
        await authorizedFetch(`${env.backUser}/users/${myId}/friends/${targetId}/block`, { method: 'DELETE' });
        this.renderFriend(targetId);
      });
    });
  }


  installSocket() {
    const socket = getSocket()!;

    // Nouveau message recu via socket
    socket.on("newMessage", (msg: any) => {
      console.log("newMessage ...")
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
          if (msg.content.startsWith('<a ')) {
            response.innerHTML = msg.content;
          } else {
            response.textContent = msg.content;
          }

          chatMessages.appendChild(response);
          chatMessages.scrollTo(0, chatMessages.scrollHeight);
        }

      }, 100);
    });
  }

  chatEvents() {
    const socket = getSocket()!;
    const t = (key: keyof typeof sidebarTranslations) => getTranslation("sidebar", key);

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

        chatTitle.textContent = `💬 ${t("chatWith")} ${user}`;
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
        const messages = await getConversation(myId!, userId!);
        messages.forEach((msg: any) => {
          const div = document.createElement("div");
          const isMe = String(msg.senderId) === String(myId);
          console.log("💡 myId =", myId, "↔️ sender =", msg.senderId);

          div.className = isMe
            ? "bg-blue-600 text-white px-4 py-2 rounded-lg self-end max-w-[75%] shadow-[0_0_10px_#3b82f6]"
            : "bg-purple-600 text-white px-4 py-2 rounded-lg self-start max-w-[75%] shadow-[0_0_10px_#a855f7]";
          if (msg.content?.startsWith('<a ')) {
            div.innerHTML = msg.content;
          } else {
            div.textContent = msg.content;
          }

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
      const chatWindow = document.getElementById("chat-window");
      chatWindow?.removeAttribute("data-id");
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

        if (messageText?.startsWith('<a ')) {
          userMessage.innerHTML = messageText;
        } else {
          userMessage.textContent = messageText;
        }

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

function getSocket(): any | undefined {
  return (window as any).socket;
}