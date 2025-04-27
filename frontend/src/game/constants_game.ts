// direction constants
enum Direction
{
    Left,
    Up,
    Right,
    Down
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
    bgColor: string;
    textColor: string;
    positionLabel: { left: number; top: number };
};

export const playerDictionary: Record<Position, PlayerProperties> = 
{
    [Position.Left]: { bgColor: "bg-yellow-400", textColor: "text-yellow-400", positionLabel: { left: 1, top: 47.5 } },
    [Position.Top]: { bgColor: "bg-red-400", textColor: "text-red-400", positionLabel: { left: 46, top: 2.5 } },
    [Position.Right]: { bgColor: "bg-cyan-400", textColor: "text-cyan-400", positionLabel: { left: 91, top: 47.5 } },
    [Position.Bottom]: { bgColor: "bg-blue-400", textColor: "text-blue-400", positionLabel: { left: 46, top: 92.5 } } ,
    [Position.None]: { bgColor: "bg-black-400", textColor: "text-black-400", positionLabel: { left: 0, top: 0 } } 
};