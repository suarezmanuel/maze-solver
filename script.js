const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = canvas.width;
ctx.fillStyle = "black"
ctx.fillRect(0,0,canvas.width, canvas.height)

let blockCount = 20;
let blockSize = canvas.width / blockCount;
let matrix = []

window.requestAnimationFrame(run);

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

let path = [[2,2]]
let curr = [2,2]

function createMaze () {

    let drawingIntervalId = setInterval(() => {

        path, curr = step(path, curr)

        if (path.length == 0) {
            console.log("done!")
            clearInterval(drawingIntervalId)
        }
    }, 10)
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

function drawMaze () {

    // console.log(matrix)
    for (let i=0; i < blockCount; i++) {
        for (let j=0; j < blockCount; j++) {
            
            if (matrix[i][j] == 1) {
                ctx.fillStyle = "white";
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