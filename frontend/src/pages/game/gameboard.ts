export interface GameState {
  ballX: number;
  ballY: number;
  ballSpeedX: number;
  ballSpeedY: number;
  paddle1Y: number;
  paddle2Y: number;
  score1: number;
  score2: number;
  dirX: number;
  dirY: number;
}

export class GameBoard {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;

  private CANVAS_WIDTH = 800;
  private CANVAS_HEIGHT = 450;
  private readonly BALL_SIZE = 12;
  private readonly PADDLE_WIDTH = 5;
  private readonly PADDLE_HEIGHT = 100;
  private readonly PADDLE_SPEED = 15;
  private readonly SCORE_END = 3;
  private readonly BALL_SPEED_X = 6;
  private readonly BALL_SPEED_Y = 6;

  private animationFrameId: number | null = null;

  private gameState: GameState = {
    ballX: this.CANVAS_WIDTH / 2,
    ballY: this.CANVAS_HEIGHT / 2,
    ballSpeedX: this.BALL_SPEED_X,
    ballSpeedY: this.BALL_SPEED_Y,
    paddle1Y: this.CANVAS_HEIGHT / 2 - this.PADDLE_HEIGHT / 2,
    paddle2Y: this.CANVAS_HEIGHT / 2 - this.PADDLE_HEIGHT / 2,
    score1: 0,
    score2: 0,
    dirX: 1,
    dirY: 1
  };

  namePlayer1: string = "Joueur 1";
  namePlayer2: string = "Joueur 2";

  constructor() { }

  render() {
    const page = window.location.hash.slice(1);
    let [pageName, queryString] = page.split("?");
    queryString = queryString || "";
    const params = new URLSearchParams(queryString);
    const player1 = params.get("player1") || "Player 1";
    const player2 = params.get("player2") || "Player 2";

    console.log(`🎮 Lancement du jeu avec: ${player1} vs ${player2}`);
    const html = `
        <div class="flex flex-col items-center space-y-4 font-poppins w-full">
          <!-- Canvas -->
          <canvas id="gameCanvas"></canvas>
    
          <!-- Infos joueurs -->
          <div class="flex justify-between w-full max-w-[1400px] px-6 mt-4 text-white">
            <!-- Joueur 1 : Avatar | (Nom + Score centré) -->
            <div class="w-1/3 flex flex-row items-center space-x-4">
              <img src="/public/images/player1_avatar.png" alt="Player 1 Avatar"
                class="w-24 h-24 rounded-full border-4 border-neon-green" />
              <div class="flex flex-col items-center text-neon-green">
                <div class="text-xl font-semibold">${player1 ?? 'Joueur 1'}</div>
                <div id="score1" class="text-3xl font-bold">${this.gameState.score1}</div>
              </div>
            </div>
    
            <!-- Espace central -->
            <div class="w-1/3"></div>
    
            <!-- Joueur 2 : (Nom + Score centré) | Avatar -->
            <div class="w-1/3 flex flex-row items-center justify-end space-x-4">
              <div class="flex flex-col items-center text-neon-purple">
                <div class="text-xl font-semibold">${player2 ?? 'Joueur 2'}</div>
                <div id="score2" class="text-3xl font-bold">${this.gameState.score2}</div>
              </div>
              <img src="/public/images/player2_avatar.png" alt="Player 2 Avatar"
                class="w-24 h-24 rounded-full border-4 border-neon-purple" />
            </div>
          </div>
        </div>
      `;

    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = html;
    }

    this.init();
  }





  init(): void {
    this.canvas = document.querySelector('#gameCanvas') as HTMLCanvasElement;
    if (!this.canvas) throw new Error('Canvas not found');
    this.canvas = document.querySelector('#gameCanvas') as HTMLCanvasElement;
    if (!this.canvas) throw new Error('Canvas not found');

    const parent = this.canvas.parentElement;
    if (!parent) throw new Error('Canvas parent not found');

    const parentWidth = parent.clientWidth;
    const aspectRatio = 16 / 9;

    this.CANVAS_WIDTH = parentWidth - 80;
    this.CANVAS_HEIGHT = Math.round(parentWidth / aspectRatio) - 140;

    this.canvas.width = this.CANVAS_WIDTH;
    this.canvas.height = this.CANVAS_HEIGHT;
    this.resetGame();

    const context = this.canvas.getContext('2d');
    if (!context) throw new Error('2D context not supported');
    this.ctx = context;

    this.drawGame();
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
  }
  randomDirection(): number {
    return Math.random() < 0.5 ? -1 : 1;
  }

  private startGame(): void {

    this.gameState.ballX = this.gameState.ballX + this.gameState.ballSpeedX * this.gameState.dirX;
    this.gameState.ballY = this.gameState.ballY + this.gameState.ballSpeedY * this.gameState.dirY;

    if (
      this.gameState.ballY <= 0 ||
      this.gameState.ballY >= this.CANVAS_HEIGHT - this.BALL_SIZE
    ) {
      this.gameState.ballSpeedY = -this.gameState.ballSpeedY;
    }

    const eventCode = this.detectBallEvent();
    switch (eventCode) {
      case 1:
        this.gameState.ballSpeedX = -this.gameState.ballSpeedX;
        this.gameState.ballX = this.PADDLE_WIDTH + this.BALL_SIZE;
        break;
      case 2:
        this.gameState.ballSpeedX = -this.gameState.ballSpeedX;
        this.gameState.ballX =
          this.CANVAS_WIDTH - this.PADDLE_WIDTH - this.BALL_SIZE;
        break;
      case -1:
        this.gameState.score2++;
        if (this.checkGameEnd()) return;
        this.resetGame();
        this.drawGame();
        return;
      case -2:
        this.gameState.score1++;
        if (this.checkGameEnd()) return;
        this.resetGame();
        this.drawGame();
        return;
    }

    this.drawGame();
    this.animationFrameId = requestAnimationFrame(() => this.startGame());
  }

  private detectBallEvent(): number {
    const s = this.gameState;
    if (
      s.ballX <= this.PADDLE_WIDTH &&
      s.ballY >= s.paddle1Y &&
      s.ballY <= s.paddle1Y + this.PADDLE_HEIGHT
    ) {
      return 1;
    }

    if (
      s.ballX >= this.CANVAS_WIDTH - this.PADDLE_WIDTH - this.BALL_SIZE &&
      s.ballY >= s.paddle2Y &&
      s.ballY <= s.paddle2Y + this.PADDLE_HEIGHT
    ) {
      return 2;
    }

    if (s.ballX < -this.BALL_SIZE) return -1;
    if (s.ballX > this.CANVAS_WIDTH + this.BALL_SIZE) return -2;

    return 0;
  }

  private handleKeyDown(event: KeyboardEvent): void {
    switch (event.key.toLowerCase()) {
      case 'enter':
        event.preventDefault();
        console.log('Enter pressed');
        const dirX = this.randomDirection();
        const dirY = this.randomDirection();
        this.gameState.dirX = dirX;
        this.gameState.dirY = dirY;
        this.startGame();
        break;
      case 'arrowup':
        event.preventDefault();
        this.gameState.paddle2Y = this.clampPaddlePosition(
          this.gameState.paddle2Y - this.PADDLE_SPEED
        );
        break;
      case 'arrowdown':
        event.preventDefault();
        this.gameState.paddle2Y = this.clampPaddlePosition(
          this.gameState.paddle2Y + this.PADDLE_SPEED
        );
        break;
      case 'z':
        event.preventDefault();
        this.gameState.paddle1Y = this.clampPaddlePosition(
          this.gameState.paddle1Y - this.PADDLE_SPEED
        );
        break;
      case 's':
        event.preventDefault();
        this.gameState.paddle1Y = this.clampPaddlePosition(
          this.gameState.paddle1Y + this.PADDLE_SPEED
        );
        break;
    }
    this.drawGame();
  }

  private clampPaddlePosition(y: number): number {
    return Math.max(0, Math.min(y, this.CANVAS_HEIGHT - this.PADDLE_HEIGHT));
  }

  private resetGame(): void {
    this.gameState.ballX = this.CANVAS_WIDTH / 2;
    this.gameState.ballY = this.CANVAS_HEIGHT / 2;
    this.gameState.ballSpeedX = this.BALL_SPEED_X;
    this.gameState.ballSpeedY = this.BALL_SPEED_Y;
    this.gameState.paddle1Y = this.CANVAS_HEIGHT / 2 - this.PADDLE_HEIGHT / 2;
    this.gameState.paddle2Y = this.CANVAS_HEIGHT / 2 - this.PADDLE_HEIGHT / 2;
  }

  private checkGameEnd(): boolean {
    const s = this.gameState;
    if (
      s.score1 >= this.SCORE_END ||
      (s.score2 >= this.SCORE_END &&
        Math.abs(s.score1 - s.score2) >= 2)
    ) {
      // this.onGameEnd(s.score1, s.score2);
      this.resetGame();
      this.drawGame();
      cancelAnimationFrame(this.animationFrameId!);
      this.animationFrameId = null;
      return true;
    }
    return false;
  }

  private drawGame(): void {
    const s = this.gameState;

    this.ctx.fillStyle = '#003366';
    this.ctx.fillRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);

    this.ctx.strokeStyle = '#fff';
    this.ctx.setLineDash([10, 15]);
    this.ctx.beginPath();
    this.ctx.moveTo(this.CANVAS_WIDTH / 2, 0);
    this.ctx.lineTo(this.CANVAS_WIDTH / 2, this.CANVAS_HEIGHT);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(0, s.paddle1Y, this.PADDLE_WIDTH, this.PADDLE_HEIGHT);
    this.ctx.fillRect(
      this.CANVAS_WIDTH - this.PADDLE_WIDTH,
      s.paddle2Y,
      this.PADDLE_WIDTH,
      this.PADDLE_HEIGHT
    );

    this.ctx.beginPath();
    this.ctx.arc(s.ballX, s.ballY, this.BALL_SIZE / 2, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.font = '48px Poppins';
    this.ctx.fillStyle = '#fff';
    this.ctx.textAlign = 'center';
    document.getElementById('score1')!.textContent = s.score1.toString();
    document.getElementById('score2')!.textContent = s.score2.toString();

  }
}
