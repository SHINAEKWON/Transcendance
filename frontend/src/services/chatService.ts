import { env } from "../env/env";
import { authorizedFetch } from "../utils/authorizedFetch";

export async function getConversation(user1: string, user2: string) {
    const res = await authorizedFetch(`${env.backChat}/messages?user1=${user1}&user2=${user2}`);
    return await res.json();
  }
  