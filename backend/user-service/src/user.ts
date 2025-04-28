
export class User {
    constructor(
      public id: number | null,
      public firstname: string,
      public lastname: string,
      public username: string,
      public nickname: string,
      public avatar: string | null = null,
      public status: string = 'offline',
      public email: string,
      public address: string | null = null,
      public telephone: string | null = null,
      public matches: number = 0,
      public wins: number = 0,
      public losses: number = 0,
      public created_at: string = new Date().toISOString()
    ) {}
  
    getFullName(): string {
      return `${this.firstname} ${this.lastname}`;
    }
  
    isOnline(): boolean {
      return this.status === 'online';
    }
  }

