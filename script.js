const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 3000;
canvas.height = canvas.width;
ctx.fillStyle = "black"
ctx.fillRect(0,0,canvas.width, canvas.height)

let blockSize = 20;
let blockCount = canvas.width / blockSize;
let matrix = []

window.requestAnimationFrame(run);

let path = [[2,2]]
let curr = [2,2]
let end = [[blockCount-3, blockCount-3], [blockCount-4, blockCount-3], [blockCount-3, blockCount-4], [blockCount-4, blockCount-4]]

initMatrix();
createMaze();

function run() {
    drawMaze();
    window.requestAnimationFrame(run);
}

function initMatrix() {

    for (let j=0; j < blockCount; j ++) {
        let temp = []
        for (let i=0; i < blockCount; i ++) {
            temp = [...temp, 0]
        }
        matrix = [...matrix, temp]
    }
}


function createMaze () {

    while (path.length != 0) {
        path, curr = step(path, curr)
    }

    console.log("creation done!")
    path.push([2,2])
    BFSsearch()
}

function step (path, curr) {

    matrix[curr[0]][curr[1]] = 1
    
    let neighbors = []

    // up
    if (curr[0] - 1 > 1
        && matrix[curr[0] - 1][curr[1] - 1] != 1 && matrix[curr[0] - 1][curr[1]] != 1 && matrix[curr[0] - 1][curr[1] + 1] != 1 
        && matrix[curr[0] - 2][curr[1] - 1] != 1 && matrix[curr[0] - 2][curr[1]] != 1 && matrix[curr[0] - 2][curr[1] + 1] != 1) {
        neighbors.push([curr[0] - 1, curr[1]]);
    }

    // right
    if (curr[1] + 1 < blockCount-2
        && matrix[curr[0] - 1][curr[1] + 1] != 1 && matrix[curr[0]][curr[1] + 1] != 1 && matrix[curr[0] + 1][curr[1] + 1] != 1 
        && matrix[curr[0] - 1][curr[1] + 2] != 1 && matrix[curr[0]][curr[1] + 2] != 1 && matrix[curr[0] + 1][curr[1] + 2] != 1) {
        neighbors.push([curr[0], curr[1] + 1]);
    }

    // down
    if (curr[0] + 1 < blockCount-2
        && matrix[curr[0] + 1][curr[1] - 1] != 1 && matrix[curr[0] + 1][curr[1]] != 1 && matrix[curr[0] + 1][curr[1] + 1] != 1 
        && matrix[curr[0] + 2][curr[1] - 1] != 1 && matrix[curr[0] + 2][curr[1]] != 1 && matrix[curr[0] + 2][curr[1] + 1] != 1) {
        neighbors.push([curr[0] + 1, curr[1]]);
    }

    // left
    if (curr[1] - 1 > 1 
        && matrix[curr[0] - 1][curr[1] - 1] != 1 && matrix[curr[0]][curr[1] - 1] != 1 && matrix[curr[0] + 1][curr[1] - 1] != 1 
        && matrix[curr[0] - 1][curr[1] - 2] != 1 && matrix[curr[0]][curr[1] - 2] != 1 && matrix[curr[0] + 1][curr[1] - 2] != 1) {
        neighbors.push([curr[0], curr[1] - 1]);
    }
    
    if (neighbors.length != 0) {
        let dir = Math.floor(Math.random() * neighbors.length);
        curr = neighbors[dir];
        path.push(curr)
    } else {
        let a = path.pop();
        curr[0] = a[0];
        curr[1] = a[1];
    }

    return path, curr
}

function BFSsearchPretty () {

    console.log("starting search")

    let drawingIntervalId = setInterval(() => {

        path = stepBFS(path)

        var top = path.pop()
        path.push(top)

        if ((top[0] == end[0][0] && top[1] == end[0][1]) ||
            (top[0] == end[1][0] && top[1] == end[1][1]) ||
            (top[0] == end[2][0] && top[1] == end[2][1]) ||
            (top[0] == end[3][0] && top[1] == end[3][1])) { 

            console.log("search done!")
            clearInterval(drawingIntervalId)
        }
    }, 1)
}

function BFSsearch () {

    console.log("starting search")

    var startTime = performance.now()

    do {
        
        path = stepBFS(path)

        var top = path.pop()
        path.push(top)

    } while(!((top[0] == end[0][0] && top[1] == end[0][1]) ||
            (top[0] == end[1][0] && top[1] == end[1][1]) ||
            (top[0] == end[2][0] && top[1] == end[2][1]) ||
            (top[0] == end[3][0] && top[1] == end[3][1])))

    var stopTime = performance.now()

    console.log("search done in", stopTime-startTime, " milliseconds!")

    
}

function stepBFS (path) {

    // get neighbors that are white, and that arent grey
    // remove working guy, push neighbors to back
    neighbors = []
    var curr = path.pop()

    // if in maze and not being processed
    if (matrix[curr[0]][curr[1]+1] == 1) {
        neighbors.push([curr[0], curr[1]+1])
    }
    if (matrix[curr[0]+1][curr[1]] == 1) {
        neighbors.push([curr[0]+1, curr[1]])
    }
    if (matrix[curr[0]][curr[1]-1] == 1) {
        neighbors.push([curr[0], curr[1]-1])
    }
    if (matrix[curr[0]-1][curr[1]] == 1) {
        neighbors.push([curr[0]-1, curr[1]])
    }

    for (let i=0; i < neighbors.length; i++) {
        if (matrix[neighbors[i][0]][neighbors[i][1]] != 2) {
            matrix[neighbors[i][0]][neighbors[i][1]] = 2;
            path.unshift(neighbors[i]);
        }
    }

    return path
}

function drawMaze () {

    // console.log(matrix)
    for (let i=0; i < blockCount; i++) {
        for (let j=0; j < blockCount; j++) {
            
            if (matrix[i][j] == 1) {
                ctx.fillStyle = "white";
                if ((i == end[0][0] && j == end[0][1]) ||
                    (i == end[1][0] && j == end[1][1]) ||
                    (i == end[2][0] && j == end[2][1]) ||
                    (i == end[3][0] && j == end[3][1])) { 
                        ctx.fillStyle = "red"
                }
            } else if (matrix[i][j] == 2) {
                ctx.fillStyle = "grey";
            } else {
                ctx.fillStyle = "black";
            }
            if (curr[0] == i && curr[1] == j) {
                ctx.fillStyle = "green"
            }
            ctx.fillRect(j*blockSize, i*blockSize, blockSize, blockSize)
        }
    }
}