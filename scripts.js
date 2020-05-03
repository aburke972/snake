import Game from "./game.js"

window.onload = function()
{

    //create a new game

    let myGame = new Game()
    myGame.init(200,75)

    document.onkeydown = function handleKeyDown(e) {
        const key = e.keyCode;
        let newDirection;
    
        switch(key)
        {
            case 37:
                newDirection = "left";
                break;
            
            case 38:
                newDirection = "up";
                break;       
                
            case 39:
                newDirection = "right";
                break;
    
            case 40:
                newDirection = "down";
                break;
            
            case 32:
                myGame.launch()
                return
    
            default:
                throw("Invalid direction !!");
        }
        myGame.snayki.setDirection(newDirection)  
    }
}
