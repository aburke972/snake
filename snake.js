export default class Snake {
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