import Apple from "./apple.js"
import Snake from "./snake.js"
import Drawing from "./drawing.js"

export default class Game {

    constructor(canvasWidth = 900,canvasHeight = 600)
    {
        this.canvasWidth = canvasWidth
        this.canvasHeight = canvasHeight
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