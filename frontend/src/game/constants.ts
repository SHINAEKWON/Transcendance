// direction constants
enum Direction
{
    Left,
    Up,
    Right,
    Down
}

// HTMLElement constants
export enum HTMLElementTag
{
    Div = "div",
    Label = "label",
    Input = "input",
    Element = ""

}

// position constants
export enum Position
{
    Left,
    Top,
    Right,
    Bottom,
    None
}

type PlayerProperties = 
{
    color: string;
    textColor: string;
    positionLabel: { left: number; top: number };
};

export const playerDictionary: Record<Position, PlayerProperties> = 
{
    [Position.Left]: { color: "yellow", textColor: "text-yellow-400", positionLabel: { left: 0, top: 42.5 } },
    [Position.Top]: { color: "red", textColor: "text-red-400", positionLabel: { left: 46, top: 2.5 } },
    [Position.Right]: { color: "cyan", textColor: "text-cyan-400", positionLabel: { left: 92, top: 35.5 } },
    [Position.Bottom]: { color: "blue", textColor: "text-blue-400", positionLabel: { left: 46, top: 92.5 } } ,
    [Position.None]: { color: "black", textColor: "text-black-400", positionLabel: { left: 0, top: 0 } } 
};