export async function getConversation(user1: string, user2: string) {
    const res = await fetch(`/chat/messages?user1=${user1}&user2=${user2}`);
    return await res.json();
  }
  