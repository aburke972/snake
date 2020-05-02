window.onload = function()
{
    class Game {

        constructor()
        {
            this.canvasWidth = 900
            this.canvasHeight = 600
            this.blockSize = 30 
            this.canvas = document.createElement('canvas')
            this.ctx  = this.canvas.getContext("2d")
            this.delay = 100
            this.snayki
            this.pommli
            this.witdhInBlocks = this.canvasWidth/this.blockSize
            this.heightInBlocks = this.canvasHeight/this.blockSize
            this.centreX = this.canvasWidth / 2
            this.centreY = this.canvasHeight / 2
            this.score
            this.timeout
        }

        init() {
            this.userName = this.askName()
            this.canvas.width = this.canvasWidth
            this.canvas.height = this.canvasHeight
            this.canvas.style.border = "30px solid grey"
            this.canvas.style.margin = "50px auto"
            this.canvas.style.display = "block"
            this.canvas.style.background = "#ddd"
            document.body.appendChild(this.canvas)
            this.launch()
        }
    
        refreshCanvas() {
            this.snayki.move()
            if(this.snayki.checkCollision(this.witdhInBlocks,this.heightInBlocks))
            {
                Drawing.gameOver(this.ctx,this.centreX,this.centreY)
            }
            else
            {
                if(this.snayki.isEatingApple(this.pommli))
                {
                    this.snayki.ateApple = true
                    this.score ++
                    do
                    {
                        this.pommli.setNewPosition(this.witdhInBlocks,this.heightInBlocks)
                    }
                    while(this.pommli.isOnSnake(this.snayki))
    
                   // if(this.score %5 == 0) this.speedUp()
                }
                this.ctx.clearRect(0,0,this.canvasWidth,this.canvasHeight)
                Drawing.drawScore(this.ctx,this.centreX,this.centreY,this.score)
                Drawing.drawSnake(this.ctx,this.blockSize,this.snayki)
                Drawing.drawApple(this.ctx,this.blockSize,this.pommli)
                this.displayName(this.userName)
                this.timeout = setTimeout(this.refreshCanvas.bind(this),this.delay)
            }
    
    
        }
    
        launch() {
            this.snakeColor = this.askSnakeColor()
            this.appleColor = this.askAppleColor()
            this.snayki = new Snake("right",this.snakeColor,[6,4],[5,4],[4,4])
            this.pommli = new Apple(this.appleColor)
            this.score = 0
            this.delay = 100
            clearTimeout(this.timeout)
            this.refreshCanvas()
        }
    
        speedUp() {
           this.delay /= 2
        }

        askName() {
            const userName = prompt("Quel est ton nom ? ")
            return userName
        }
    
        askAppleColor() {
            const colorChoice = prompt(`Choisir la couleur de la pomme. 
            2 possibilités :
            Rends-toi sur le site https://www.w3schools.com/colors/colors_picker.asp et colle le code hexadécimal (commence par #) de la couleur que vous souhaitez pour la pomme")
            OU
            Saisis en ANGLAIS le nom de la couleur que tu veux`)
            return colorChoice
        }
    
        askSnakeColor() {
            const colorChoice = prompt("Couleur du serpent ? Violet (v) / Rouge (r) / Jaune (j)")
            console.log("touche pressee: " + colorChoice)
            switch (colorChoice){
    
                case "v":
                    this.snakeColor = "violet"
                    break
                
                case "j":
                    this.snakeColor = "#ffff00"
                    break
    
                case "r":
                    this.snakeColor = "#cc0000"
                    break
                
                default:
                    this.snakeColor = "black"
            }
            return this.snakeColor
        }
    
        displayName(name) {
            this.ctx.save()
            this.ctx.font = "bold 30px sans-serif"
            this.ctx.fillStyle = "#ffff66"
            this.ctx.strokeStyle = "#ff9900"
            this.ctx.fillText(name,5,20)
            this.ctx.strokeText(name,5,20)
            this.ctx.restore()
        }
    }

    class Drawing {

        static gameOver(ctx,centreX,centreY) {
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

        static drawScore(ctx,centreX,centreY,score) {
            ctx.save()
            ctx.font = "bold 200px sans-serif"
            ctx.fillStyle = "gray"
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            ctx.fillText(score.toString(),centreX,centreY)
            ctx.restore()
        }

        static drawSnake(ctx,blockSize,snake) {
            ctx.save()
            ctx.fillStyle = snake.color
            for(let block of snake.body)
            {
                this.drawBlock(ctx, block,blockSize)
            }
            ctx.restore()
        }

        static drawApple(ctx,blockSize,apple) {
            const radius = blockSize/2
            const x = apple.position[0]*blockSize + radius
            const y = apple.position[1]*blockSize + radius
            ctx.save()
            ctx.fillStyle = apple.color
            ctx.beginPath()
            ctx.arc(x,y,radius,0,Math.PI*2,true)
            ctx.fill()
            ctx.restore()
        }

        static drawBlock(ctx,position,blockSize) {
            const [x,y] = position;
            ctx.fillRect(x*blockSize,y*blockSize,blockSize,blockSize)
        }

    }

    class Snake {
        constructor(direction,color,...body) {
            this.body = body
            this.direction = direction
            this.ateApple = false
            this.color = color
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

        checkCollision (witdhInBlocks,heightInBlocks) {
            let wallCollision = false
            let snakeCollision = false
            const [head, ...bodyRest] = this.body
            const [snakeX, snakeY] = head
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

            for(let block of bodyRest)
            {
                if(snakeX === block[0] && snakeY === block[1])
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
        
        constructor(color,position = [10,10]){
            this.position = position
            this.color = color
        }

        setNewPosition (witdhInBlocks,heightInBlocks) {
            const newX = Math.round(Math.random() * (witdhInBlocks -1))
            const newY = Math.round(Math.random() * (heightInBlocks -1))
            this.position = [newX,newY]
        }

        isOnSnake(snakeToCheck){
            let isOnSnake = false
            for(let block of snakeToCheck.body)
            {
                if(this.position[0] === block[0] &&  this.position[1] === block[1])
                {
                    isOnSnake = true;
                }
            }

            return isOnSnake
        }

    }
    
    //create a new game

    let myGame = new Game()
    myGame.init()

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
