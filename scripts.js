window.onload = function()
{
    var canvas;
    var canvasWidth = 900
    var canvasHeight = 600
    var ctx; 
    var delay = 100
    var snayki
    var blockSize = 30 
    var pommli
    var witdhInBlocks = canvasWidth/blockSize
    var heightInBlocks = canvasHeight/blockSize
    var score = 0
    var timeout
    var userName
    
    init()
    
    function init()
    {
       
        canvas = document.createElement('canvas')
        canvas.width = canvasWidth
        canvas.height = canvasHeight
        canvas.style.border = "30px solid grey"
        canvas.style.margin = "50px auto"
        canvas.style.display = "block"
        canvas.style.background = "#ddd"
        this.document.body.appendChild(canvas)
        ctx = canvas.getContext("2d")
        snayki = new Snake([[6,4],[5,4],[4,4]],"right")
        pommli = new Apple([10,10])
        refreshCanvas()
        userName = askName()

    }

    function refreshCanvas()
    {  
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

    function askName(){
        var userName = prompt("Quel est ton nom ? ")
        return userName
    }

    function displayName(name)
    {
        ctx.save()
        ctx.font = "bold 20px sans-serif"
        ctx.fillStyle = "blue"
        ctx.strokeStyle = "dark"
        ctx.fillText(name,5,20)
        ctx.strokeText(name,5,20)
        ctx.restore()
    }

    function gameOver()
    {
        ctx.save()
        ctx.font = "bold 70px sans-serif"
        ctx.fillStyle = "gray"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.strokeStyle = "dark"
        ctx.lineWidth = 5
        var centreX = canvasWidth / 2
        var centreY = canvasHeight / 2
        ctx.strokeText("Game Over",centreX,centreY - 180)
        ctx.fillText("Game Over",centreX,centreY - 180)
        ctx.font = "bold 30px sans-serif"
        ctx.strokeText("Appuyer sur la touche espace pour rejouer",centreX,centreY - 100)
        ctx.fillText("Appuyer sur la touche espace pour rejouer",centreX,centreY - 100)
        ctx.restore()
    }

    function drawScore()
    {
        ctx.save()
        ctx.font = "bold 200px sans-serif"
        ctx.fillStyle = "gray"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        var centreX = canvasWidth / 2
        var centreY = canvasHeight / 2
        ctx.fillText(score.toString(),centreX,centreY)
        ctx.restore()
    }

    function drawBlock(ctx,position)
    {
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x,y,blockSize,blockSize)
    }

    function Apple(position)
    {
        this.position = position
        this.draw = function()
        {
            ctx.save()
            ctx.fillStyle = "#33cc33"
            ctx.beginPath()
            var radius = blockSize/2
            var x = this.position[0]*blockSize + radius
            var y = this.position[1]*blockSize + radius
            ctx.arc(x,y,radius,0,Math.PI*2,true)
            ctx.fill()
            ctx.restore()
        }
        this.setNewPosition = function()
        {
            var newX = Math.round(Math.random() * (witdhInBlocks -1))
            var newY = Math.round(Math.random() * (heightInBlocks -1))
            this.position = [newX,newY]
        }

        this.isOnSnake = function(snakeToCheck)
        {
            var isOnSnake = false
            for(i = 0; i < snakeToCheck.body.length; i ++)
            {
                if(this.position[0] === snakeToCheck.body[i][0] &&  this.position[1] === snakeToCheck.body[i][1])
                {
                    isOnSnake = true;
                }
            }

            return isOnSnake
        }

    }

    function Snake(body,direction)
    {
        this.body = body
        this.direction = direction
        this.ateApple = false
        this.draw = function()
        {
            ctx.save()
            ctx.fillStyle = "#ff0000"
            for(var i = 0; i < this.body.length; i++)
            {
                drawBlock(ctx, this.body[i])
            }
            ctx.restore()
        }

        this.move = function()
        {
            var nextPosition = this.body[0].slice();
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

        this.setDirection = function(newDirection)
        {
            var allowedDirections;
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

        this.checkCollision = function()
        {
            var wallCollision = false
            var snakeCollision = false
            var head = this.body[0]
            var bodyRest = this.body.slice(1)
            var snakeX = head[0]
            var snakeY = head[1]
            var minX = 0
            var minY = 0
            var maxX = witdhInBlocks - 1
            var maxY = heightInBlocks - 1
            var isOutHorizontal = snakeX < minX || snakeX > maxX
            var isOutVertical = snakeY < minY || snakeY > maxY

            if(isOutHorizontal || isOutVertical)
            {
                wallCollision = true;
            }

            for(var i = 0; i < bodyRest.length; i ++)
            {
                if(snakeX === bodyRest[i][0] && snakeY === bodyRest[i][1])
                {
                    snakeCollision = true
                }
            }

            return wallCollision || snakeCollision

        }

        this.isEatingApple = function(appleToEat)
        {
            var head = this.body[0]
            if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
                return true
            else
                return false
        }
    }

    function ricoumencer()
    {
        snayki = new Snake([[6,4],[5,4],[4,4]],"right")
        pommli = new Apple([10,10])
        score = 0
        clearTimeout(timeout)
        refreshCanvas()
    }
    
document.onkeydown = function handleKeyDown(e)
{
    var key = e.keyCode;
    var newDirection;
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
            ricoumencer()
            return

        default:
            throw("Invalid direction !!");
    }
    snayki.setDirection(newDirection)
}

}
