import { A_Element } from "../graphicElements/A_Element.js";
import { HTMLElementTag } from "../graphicElements/constants_graphic.js";
 

export abstract class A_GameElement extends A_Element<HTMLDivElement>
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
    constructor({elementId, leftInitialRelative, topInitialRelative, widthFraction, heightFraction, backgroundColor, parentElement, classList}:
    {
        elementId: string, 
        leftInitialRelative: number, 
        topInitialRelative: number,
        widthFraction: number,
        heightFraction: number | null,
        backgroundColor: string | null,
        parentElement: A_GameElement | null,
        classList: string[]
    })
    {
        super(
        {
            elementId: elementId, 
            tagName: HTMLElementTag.Div, 
            leftInitialRelative: leftInitialRelative, 
            topInitialRelative: topInitialRelative, 
            widthFraction: widthFraction, 
            heightFraction: heightFraction, 
            backgroundColor: backgroundColor, 
            parentElement: parentElement, 
            classList: classList
        });
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
        
            if (this.getTopCurrentAbsolute() > ofElement.getTopCurrentAbsolute())
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
        
            if (this.getBottomCurrentAbsolute() < ofElement.getBottomCurrentAbsolute())
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
        
            if (this.getLeftCurrentAbsolute() > ofElement.getLeftCurrentAbsolute())
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
        
            if (this.getRightCurrentAbsolute() < ofElement.getRightCurrentAbsolute())
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
            
                if (this.getRightCurrentAbsolute() < element.getLeftCurrentAbsolute()
                || this.getLeftCurrentAbsolute() > element.getRightCurrentAbsolute()
                || this.getBottomCurrentAbsolute() < element.getTopCurrentAbsolute()
                || this.getTopCurrentAbsolute() > element.getBottomCurrentAbsolute())
                    return false;
                return true;
            }
            return false;
    }
}
