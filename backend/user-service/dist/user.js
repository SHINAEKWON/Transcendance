export class User {
    id;
    firstname;
    lastname;
    username;
    nickname;
    avatar;
    status;
    email;
    address;
    telephone;
    matches;
    wins;
    losses;
    created_at;
    constructor(id, firstname, lastname, username, nickname, avatar = null, status = 'offline', email, address = null, telephone = null, matches = 0, wins = 0, losses = 0, created_at = new Date().toISOString()) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.username = username;
        this.nickname = nickname;
        this.avatar = avatar;
        this.status = status;
        this.email = email;
        this.address = address;
        this.telephone = telephone;
        this.matches = matches;
        this.wins = wins;
        this.losses = losses;
        this.created_at = created_at;
    }
    getFullName() {
        return `${this.firstname} ${this.lastname}`;
    }
    isOnline() {
        return this.status === 'online';
    }
}
