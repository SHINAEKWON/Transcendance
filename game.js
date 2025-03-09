function renderGamePage(player1, player2)
{
    const app = document.getElementById("app");

    app.innerHTML = `
        <div id="containerGame" class="containerGame">
            <div id="board" class="board">
                <div id="middleline" class="middleline">
                </div>
                <div id="hor_line" class="hor_line">
                </div>
                <div id="ball" class="ball">
                </div>
                <div id="paddle_left" class="paddle paddle_left">
                </div>
                <div id="paddle_right" class="paddle paddle_right">
                </div>
                <div id="msg_start" class="msg_start msg">
                    NEW GAME
                </div>
                <div id="msg_pressSpace" class="msg_pressSpace msg">
                    Press SPACE to start...
                </div>
            </div>
            <div id="scores" class="scores">
                <div id="score_name_left" class="score_name score_name_left">
                    <div id="score_left" class="score score_left">
                        0
                    </div>
                    <div id="name_left" class="name name_left">
                        ${player1}
                    </div>
                </div>
            
                <div id="score_separator" class="score_separator">
                    :
                </div>
            
                <div id="score_name_right" class="score_name score_name_right">
                    <div id="score_right" class="score score_right">
                        0
                    </div>
                    <div id="name_right" class="name name_right">
                        ${player2}
                    </div>
                </div>
            </div>

        </div>
    `;

    //changeGameStatus(GAME_NEW);
    //gameLoop();
}
