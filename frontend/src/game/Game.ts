
import { Board } from "./Board.js";
import { Player } from "./Player.js";
import { GameMode } from "./Paddle.js";

// Game status constants
const GAME_NEW: number = 0;
const GAME_STARTED: number = 1;
const GAME_PAUSED: number = 2;
const GAME_ENDED: number = 3;

export class Game
{
    private readonly score_winning: number = 3;

    private board: Board;
    private state: number;
    private animationFrameID: number | null = null;
    private eventListeners: { [key: string]: EventListener } = {};
    isMasterBall= false;
    idPlayer = 0;

    constructor(playerLeft: string | null, playerRight: string | null, isAI_left : boolean | false, avatarPlayerLeft: string | null,isAI_right: boolean | false, avatarPlayerRight: string | null,private socket: any,private mode: GameMode,private idPlayerLeft: number,private idPlayerRight: number, private endGameEvents: (playerLeft: Player,playerRight: Player) => void)
    {
        const savedUser = localStorage.getItem("transcendenceUser");
        if(savedUser){
            const user = JSON.parse(savedUser);
            this.idPlayer = user.id == this.idPlayerLeft ? this.idPlayerRight : this.idPlayerLeft;
        }
        this.board = new Board(
        {
            elementId: "board", 
            leftInitialRelative: 10, 
            topInitialRelative: 0, 
            widthFraction: 80, 
            heightFraction: 80, 
            backgroundColor: "black", 
            parentElement: null, 
            classList: ["border-white"], 
            count_balls: 1, 
            name_left: playerLeft, 
            color_left: "yellow", 
            keys_left: [[mode == "remote" ? "ArrowUp": "w", mode == "remote" ? "ArrowDown": "s"]], 
            isAI_left: isAI_left,
            avatarPlayerLeft: avatarPlayerLeft,
            name_right: playerRight, 
            color_right: "#3498db",   
            keys_right: [["ArrowUp", "ArrowDown"]], 
            isAI_right: isAI_right,
            avatarPlayerRight: avatarPlayerRight,
            socket,
            mode,
            idPlayerLeft,
            idPlayerRight,
            isMasterBall: this.isMasterBall,
            idPlayer: this.idPlayer
        });

        this.state = GAME_NEW;
        this.initializeEventListeners();
        if(socket && mode == "remote"){
            this.socket.on("pressSpace", (data: any) => {
                console.log('receive press space')
                this.isMasterBall = false;
                this.board.setIsMasterBall(this.isMasterBall);
                this.pressSpace();
            });

            this.socket.on("ballMove", (data: any) => {
                this.board.setPositionBallAndDraw(data.dx, data.dy);
            })
        }
    }

    private initializeEventListeners(): void
    {
        this.eventListeners["keydown"] = this.keyDownHandler.bind(this) as EventListener;
        
        document.addEventListener("keydown", this.eventListeners["keydown"]);
    }

    private changeState(newState: number): void
    {
        this.state = newState;
    }

    private pressSpace(): void
    {
        console.log('this.state ', this.state)
        if (this.state == GAME_NEW || this.state == GAME_PAUSED)
            this.start();
        else if (this.state == GAME_STARTED)
            this.pause();
        else if (this.state == GAME_ENDED)
        {
            //window.location.hash = "no page";
        }
    }
    
    private keyDownHandler(event: KeyboardEvent): void
    {
        switch (event.key)
        {
            case " ":
                this.pressSpace();
                console.log('press space ....',this.mode)
                console.log('press space this.socket ....',this.socket)
                if (this.mode == "remote" && this.socket) {
                    console.log('set press space ....')
                    this.isMasterBall = true;
                    this.board.setIsMasterBall(this.isMasterBall);
                    const storedUser: any = localStorage.getItem("transcendenceUser");
                    if(storedUser){
                        let currentUser = JSON.parse(storedUser);
                        this.socket.emit("pressSpace", {
                            to: ""+(currentUser.id == this.idPlayerLeft ? this.idPlayerRight : this.idPlayerLeft)
                        });
                    }
                   
                }
                break ;
            default:
        }
    }

    private start(): void
    {
        console.log('GAME_STARTED')
        this.changeState(GAME_STARTED);
    }

    private pause(): void
    {
        this.changeState(GAME_PAUSED);
    }

    private checkGameEnded(): boolean
    {
        const leadingPlayer: Player | null = this.board.getLoosingPlayer();
        if (leadingPlayer !== null)
        {
            let ecart = 0;
            if(this.board.players.left && this.board.players.right){
                ecart = Math.abs(this.board.players.left.getScore() - this.board.players.right.getScore());
            }
           
            if (leadingPlayer.getScore() >= this.score_winning && ecart > 1)
                return true;
        }
        return false;
    }

    private ballout(): void
    {
        if (this.board.countActiveBalls() == 0)
        {
            this.changeState(GAME_PAUSED);
            this.board.reinitializeBalls()
            this.board.reinitializePlayers();

            if (this.checkGameEnded() == true)
            {
                this.end();
            }
        }
    }

    private end(): void
    {
        this.changeState(GAME_ENDED);
        if(this.board.players.left && this.board.players.right)
            this.endGameEvents(this.board.players.left, this.board.players.right);
    }

    private update(): void
    {
        if (this.state == GAME_STARTED)
        {
            
            if(this.mode == "remote"){
                this.board.moveRemoteBalls() 
            }else {
                this.board.moveBalls();
            }
            
            this.board.movePaddles();
            
            if (this.board.checkBalls() == true)
                this.ballout();
        }
    }

    loop(): void
    {
        this.update();
        this.animationFrameID = requestAnimationFrame(()=>this.loop());
    }
    
    private stopLoop(): void
    {
        if (this.animationFrameID !== null)
        {
            cancelAnimationFrame(this.animationFrameID);
            this.animationFrameID = null;
        }
    }

    private removeEventListeners(): void
    {
        for (const event in this.eventListeners)
        {
            if (this.eventListeners.hasOwnProperty(event))
            {
                document.removeEventListener(event, this.eventListeners[event]);

            }
        }
        this.eventListeners = {};

        this.board.removeEventListeners();
    }
    
    destroy(): void
    {
        this.stopLoop();
        this.removeEventListeners();
    }
}
