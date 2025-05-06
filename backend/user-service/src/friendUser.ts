import { User } from './user.js';

export class FriendUser extends User {
  friend_status: string;
  action_user_id: number;

  constructor(user: User, friend_status: string, action_user_id: number) {
    super(
      user.id,
      user.firstname,
      user.lastname,
      user.username,
      user.avatar,
      user.status,
      user.email,
      user.address,
      user.telephone,
      user.type,
      user.matches,
      user.wins,
      user.losses,
      user.created_at
    );
    this.friend_status = friend_status;
    this.action_user_id = action_user_id;
  }
}
