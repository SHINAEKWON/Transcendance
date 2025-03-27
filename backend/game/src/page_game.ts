function renderGamePage(player1: string | null, player2: string | null)
{
    const app: HTMLElement | null = document.getElementById("app");
    
    if (app)
    {
        app.innerHTML = `

    
            <div class="absolute top-[90%] left-1/2 w-9/12 h-[7%] text-4xl transform -translate-x-1/2 flex items-center justify-between">
                <div class="w-[47%] flex items-center">
                    <div id="score_left" class="text-cyan-400 w-1/5 text-left">0</div>
                    <div id="name_left" class="text-cyan-400 w-4/5 text-left">${player1}</div>
                </div>
                <div class="w-[6%] text-center">:</div>
                <div class="w-[47%] flex items-center justify-end">
                    <div id="name_right" class="text-yellow-400 w-4/5 text-right">${player2}</div>
                    <div id="score_right" class="text-yellow-400 w-1/5 text-right">0</div>
                </div>
            </div>
        `;
    
        if (player1 && player2)
        {
            if (!game)
            {
                game = new Game(player1, player2);
                game.loop();
            }
        }
    }
}
