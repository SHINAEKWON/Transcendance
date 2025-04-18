// This is a draft made in order to test the basic function of
// CLASS - APP - DB

// TODO 1: PASSWORD HASHING
// import bcrypt from 'bcrypt'
// is a library containing a password hashing function


// Temporary commenting : if Ahlem's code below works, I have to reactivate this code 

export type UserStatus = 'online' | 'offline';

export class User {
    // Defining a type of each variables
    // TODO 2: string actually permit emoji chars. Should only authorize for nickname.
    // (Other entries should only takes a-z,A-Z,0-9.)
    // Must be done in BE and in FE.

    // WARNING ! CHECK IF IT IS OKAY TO USE [PUBLIC] EVERYWHERE
    private idNumber: string;
    private firstName: string;
    private lastName: string;
    private nickName: string;
    private password: string;
    private email: string;
    private address: string; // Optional
    private telephone: string; // Optional

    // Initialization
    constructor(
        idNumber: string,
        firstName: string,
        lastName: string,
        nickName: string,
        password: string, // should be encrypted
        email: string,
        address?: string,
        telephone?: string,
    ){
        this.idNumber = idNumber;
        this.firstName = firstName;
        this.lastName = lastName;
        this.nickName = nickName
        this.password = password;
        this.email = email;
        this.address = address ?? '';
        this.telephone = telephone ?? '';
    }

    // Getters 

    getId(): string {
        return this.idNumber;
      }
    
      getFirstName(): string {
        return this.firstName;
      }
    
      getLastName(): string {
        return this.lastName;
      }
    
      getNickName(): string {
        return this.nickName;
      }
      
      getPassword(): string {
        return this.password;
      }
    
      getEmail(): string {
        return this.email;
      }
    
      getAddress(): string {
        return this.address;
      }
    
      getTelephone(): string {
        return this.telephone;
      }


    /*
    // Functions
    login(): void {
        this.status = 'online';
        console.log("User " + this.id + " logged in");
    }

    logout(): void {
        this.status = 'offline';
        console.log("User " + this.id + " logged out");
    }

    wonMatch(): void {
        this.matchNb += 1;
        this.winNb += 1;
        console.log("User " + this.id + " won 1 match" );
        console.log("Current record : " + this.winNb + " wins, " + this.loseNb + " losts");
    }

      // getMatchNb(): number {
      //   return this.matchNb;
      // }
      // getWinNb(): number {
      //   return this.winNb;
      // }
    
      // getloseNb(): number {
      //   return this.loseNb;
      // }
    
      // getFriends(): string[] {
      //   return this.friends;
      // }
    
      // getBlockedUsers(): string[] {
      //   return this.blockedUsers;
      // }
    lostMatch(): void {
        this.matchNb += 1;
        this.loseNb += 1;
        console.log("User " + this.id + " lost 1 match" );
        console.log("Current record : " + this.winNb + " wins, " + this.loseNb + " losts");
    }

    addFriend(friendId: string): void {
        if (!this.friends.includes(friendId)) {
            this.friends.push(friendId);
        }
    }

    removeFriend(friendId: string): void {
        if (this.friends.includes(friendId)) {
            this.friends = this.friends.filter(id => id !== friendId);
        }
    }

    blockUser(blockedUserId: string): void {
        if (!this.blockedUsers.includes(blockedUserId)) {
            this.blockedUsers.push(blockedUserId);
        }
    }

    unblockUser(blockedUserId: string): void {
        if (this.blockedUsers.includes(blockedUserId)) {
            this.blockedUsers = this.blockedUsers.filter(id => id !== blockedUserId);
        }
    }
    */
}
