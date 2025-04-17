import { A_Element } from "./A_Element.js";
 

export abstract class A_GameElement extends A_Element
{
    /* ********************************************************************** */
    /* Attributes                                                             */
    /* ********************************************************************** */    
    protected leftWall: boolean = true;
    protected topWall: boolean = true;
    protected rightWall: boolean = true;
    protected bottomWall: boolean = true;

    /* ********************************************************************** */
    /* Constructor                                                            */
    /* ********************************************************************** */
    constructor(
        elementId: string, 
        leftInitialRelative: number, 
        topInitialRelative: number,
        widthFraction: number,
        heightFraction: number | null,
        backgroundColor: string | null,
        parentElement: A_GameElement | null,
        classList: string[]
    )
    {
        super(elementId, leftInitialRelative, topInitialRelative, widthFraction, heightFraction, backgroundColor, parentElement, classList);
    }

    /* ********************************************************************** */
    /* Methods                                                                */
    /* ********************************************************************** */
    hasLeftWall(): boolean { return this.leftWall; }
    hasTopWall(): boolean { return this.topWall; }
    hasRightWall(): boolean { return this.rightWall; }
    hasBottomWall(): boolean { return this.bottomWall; }

    isInsideTop(ofElement: A_GameElement): boolean
    {
        if (this.isactive == true && ofElement.isactive == true)
        {
            this.getAndSetCurrentGeometry();
            ofElement.getAndSetCurrentGeometry();
        
            if (this.topCurrentAbsolute > ofElement.topCurrentAbsolute)
                return true;
        }
        return false; 
    }
    
    isInsideBottom(ofElement: A_GameElement): boolean
    {
        if (this.isactive == true && ofElement.isactive == true)
        {
            this.getAndSetCurrentGeometry();
            ofElement.getAndSetCurrentGeometry();
        
            if (this.bottomCurrentAbsolute < ofElement.bottomCurrentAbsolute)
                return true;
        }
        return false; 
    }
    
    isInsideLeft(ofElement: A_GameElement): boolean
    {
        if (this.isactive == true && ofElement.isactive == true)
        {
            this.getAndSetCurrentGeometry();
            ofElement.getAndSetCurrentGeometry();
        
            if (this.leftCurrentAbsolute > ofElement.leftCurrentAbsolute)
                return true;
        }
        return false;
    }
    
    isInsideRight(ofElement: A_GameElement): boolean
    {
        if (this.isactive == true && ofElement.isactive == true)
        {
            this.getAndSetCurrentGeometry();
            ofElement.getAndSetCurrentGeometry();
        
            if (this.rightCurrentAbsolute < ofElement.rightCurrentAbsolute)
                return true;
        }
        return false;
    }
    
    touches(element: A_GameElement): boolean
    {
        if (this.isactive == true && element.isactive == true)
            {
                this.getAndSetCurrentGeometry();
                element.getAndSetCurrentGeometry();
            
                if (this.rightCurrentAbsolute < element.leftCurrentAbsolute
                || this.leftCurrentAbsolute > element.rightCurrentAbsolute
                || this.bottomCurrentAbsolute < element.topCurrentAbsolute
                || this.topCurrentAbsolute > element.bottomCurrentAbsolute)
                    return false;
                return true;
            }
            return false;
    }
}
