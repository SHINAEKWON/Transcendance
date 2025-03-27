// message constants
const MAINMESSAGE: number = 0;
const SIDEMESSAGE: number = 1;

class Message extends GameElement
{
    constructor(text: string, mainOrSideMessage: number, parentElement: GameElement, classList: string[] = [])
    {
        if (mainOrSideMessage == MAINMESSAGE)
        {
            super("msg_start", 0, 0, parentElement, classList);
            this.changeText(text);
        }
        else if (mainOrSideMessage == SIDEMESSAGE)
        {
            super("msg_pressSpace", 0, 0, parentElement, classList);
            this.changeText(text);
        }
    }
}