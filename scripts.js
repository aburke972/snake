window.onload = function()
{
    const canvasWidth = 900
    const canvasHeight = 600
    const blockSize = 30 
    const canvas = document.createElement('canvas')
    const ctx  = canvas.getContext("2d")
    const delay = 100
    let snayki
    let pommli
    const witdhInBlocks = canvasWidth/blockSize
    const heightInBlocks = canvasHeight/blockSize
    const centreX = canvasWidth / 2
    const centreY = canvasHeight / 2
    let score
    let timeout
    
    const init = () => {
        const userName = askName()
        /*
        const snakeColor = askSnakeColor()
        const appleColor = askAppleColor() */

        canvas.width = canvasWidth
        canvas.height = canvasHeight
        canvas.style.border = "30px solid grey"
        canvas.style.margin = "50px auto"
        canvas.style.display = "block"
        canvas.style.background = "#ddd"
        this.document.body.appendChild(canvas)
        launch()
    }

    const refreshCanvas = () => {
        snayki.move()
        if(snayki.checkCollision())
        {
            gameOver()
        }
        else
        {
            
            if(snayki.isEatingApple(pommli))
            {
                snayki.ateApple = true
                score ++
                do
                {
                    pommli.setNewPosition()
                }
                while(pommli.isOnSnake(snayki))
            }
            ctx.clearRect(0,0,canvasWidth,canvasHeight)
            drawScore()
            snayki.draw()
            pommli.draw()
            displayName(userName)
            timeout = setTimeout(refreshCanvas,delay)
        }


    }

    const gameOver = () => {
        ctx.save()
        ctx.font = "bold 70px sans-serif"
        ctx.fillStyle = "gray"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.strokeStyle = "dark"
        ctx.lineWidth = 5
        ctx.strokeText("Game Over",centreX,centreY - 180)
        ctx.fillText("Game Over",centreX,centreY - 180)
        ctx.font = "bold 30px sans-serif"
        ctx.strokeText("Appuyer sur la touche espace pour rejouer",centreX,centreY - 100)
        ctx.fillText("Appuyer sur la touche espace pour rejouer",centreX,centreY - 100)
        ctx.restore()
    }

    const launch = () => {
        const snakeColor = askSnakeColor()
        const appleColor = askAppleColor()
        snayki = new Snake([[6,4],[5,4],[4,4]],"right",snakeColor)
        pommli = new Apple([10,10],appleColor)
        score = 0
        clearTimeout(timeout)
        refreshCanvas()
    }

    const drawScore = () => {
        ctx.save()
        ctx.font = "bold 200px sans-serif"
        ctx.fillStyle = "gray"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(score.toString(),centreX,centreY)
        ctx.restore()
    }

    const drawBlock = (ctx,position) => {
        const x = position[0] * blockSize;
        const y = position[1] * blockSize;
        ctx.fillRect(x,y,blockSize,blockSize)
    }

    class Snake {
        constructor(body,direction,color) {
            this.body = body
            this.direction = direction
            this.ateApple = false
            this.color = color
        }

        draw () {
            ctx.save()
            ctx.fillStyle = this.color
            for(let i = 0; i < this.body.length; i++)
            {
                drawBlock(ctx, this.body[i])
            }
            ctx.restore()
        }

        move () {
            const nextPosition = this.body[0].slice();
            switch(this.direction)
            {
                case "left":
                    nextPosition[0] -= 1;
                    break;
                    
                case "right":
                    nextPosition[0] += 1; 
                    break;
                        
                case "up":
                    nextPosition[1] -= 1; 
                    break;
                
                case "down":
                    nextPosition[1] += 1;
                    break;
                
                default:
                    throw("Invalid direction !!");
            }
            this.body.unshift(nextPosition)
            if(!(this.ateApple))
                this.body.pop()
            else
                this.ateApple = false
        }

        setDirection (newDirection) {
            let allowedDirections;
            switch(this.direction)
            {
                case "left":
                case "right":
                    allowedDirections = ["up","down"];
                    break;
                    
                case "up":
                case "down":
                    allowedDirections = ["left","right"];
                    break;
                
                default:
                    throw("Invalid direction !!")
            }
            if(allowedDirections.indexOf(newDirection) > -1)
            {
                this.direction = newDirection;
            }
        }

        checkCollision () {
            let wallCollision = false
            let snakeCollision = false
            const head = this.body[0]
            const bodyRest = this.body.slice(1)
            const snakeX = head[0]
            const snakeY = head[1]
            const minX = 0
            const minY = 0
            const maxX = witdhInBlocks - 1
            const maxY = heightInBlocks - 1
            const isOutHorizontal = snakeX < minX || snakeX > maxX
            const isOutVertical = snakeY < minY || snakeY > maxY

            if(isOutHorizontal || isOutVertical)
            {
                wallCollision = true;
            }

            for(let i = 0; i < bodyRest.length; i ++)
            {
                if(snakeX === bodyRest[i][0] && snakeY === bodyRest[i][1])
                {
                    snakeCollision = true
                }
            }

            return wallCollision || snakeCollision

        }

        isEatingApple (appleToEat) {
            const head = this.body[0]
            if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
                return true
            else
                return false
        }
    }

    class Apple {
        
        constructor(position,color){
            this.position = position
            this.color = color
        }

        draw() {
            const radius = blockSize/2
            const x = this.position[0]*blockSize + radius
            const y = this.position[1]*blockSize + radius
            ctx.save()
            ctx.fillStyle = this.color
            ctx.beginPath()
            ctx.arc(x,y,radius,0,Math.PI*2,true)
            ctx.fill()
            ctx.restore()
        }

        setNewPosition () {
            const newX = Math.round(Math.random() * (witdhInBlocks -1))
            const newY = Math.round(Math.random() * (heightInBlocks -1))
            this.position = [newX,newY]
        }

        isOnSnake(snakeToCheck){
            let isOnSnake = false
            for(let i = 0; i < snakeToCheck.body.length; i ++)
            {
                if(this.position[0] === snakeToCheck.body[i][0] &&  this.position[1] === snakeToCheck.body[i][1])
                {
                    isOnSnake = true;
                }
            }

            return isOnSnake
        }

    }

    const askName = () => {
        userName = prompt("Quel est ton nom ? ")
        return userName
    }

    const askAppleColor = () => {
        colorChoice = prompt("Rendez-vous sur le site https://www.w3schools.com/colors/colors_picker.asp et coller le code hexadécimal (commence par #) de la couleur que vous souhaitez pour la pomme")
        return colorChoice
    }

    const askSnakeColor = () => {
        const colorChoice = prompt("Couleur du serpent ? Violet (v) / Rouge (r) / Jaune (j)")
        console.log("touche pressee: " + colorChoice)
        switch (colorChoice){

            case "v":
                snakeColor = "violet"
                break
            
            case "j":
                snakeColor = "#ffff00"
                break

            case "r":
                snakeColor = "#cc0000"
                break
            
            default:
                snakeColor = "black"
        }
        return snakeColor
    }

    const displayName = name => {
        ctx.save()
        ctx.font = "bold 30px sans-serif"
        ctx.fillStyle = "#ffff66"
        ctx.strokeStyle = "#ff9900"
        ctx.fillText(name,5,20)
        ctx.strokeText(name,5,20)
        ctx.restore()
    }
    
document.onkeydown = function handleKeyDown(e)
{
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
            launch()
            return

        default:
            throw("Invalid direction !!");
    }
    snayki.setDirection(newDirection)  
}

init()

}
