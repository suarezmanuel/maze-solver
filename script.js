class Node {

    constructor (walkable, pos) {

        this.walkable = walkable
        this.pos = pos

        this.parent = null;

        this.gCost = 0;
        this.hCost = 0;
    }

    fCost () {
        return gCost + hCost
    }

    equals(other) {
        return this.pos[0] == other.pos[0] && this.pos[1] == other.pos[1];
    }
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 2000;
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
    path = []
    path.push(new Node(true, [2,2]))
    // aStarSearch()
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

    var top = null;

    do {
        
        path = stepBFS(path)

        top = path.pop()
        path.push(top)

    } while(!((top.pos[0] == end[0][0] && top.pos[1] == end[0][1]) ||
              (top.pos[0] == end[1][0] && top.pos[1] == end[1][1]) ||
              (top.pos[0] == end[2][0] && top.pos[1] == end[2][1]) ||
              (top.pos[0] == end[3][0] && top.pos[1] == end[3][1])))

    var stopTime = performance.now()

    console.log("search done in", stopTime-startTime, " milliseconds!")

    while (top.pos != [2,2]) {
        top = top.parent;
        matrix[top.pos[0]][top.pos[1]] = 3;
    }
}

function getNeighbors (node) {

    let neighbors = []

    if (matrix[node[0]][node[1]+1] == 1) {
        neighbors.push(new Node(true, [node[0], node[1]+1]))
    }
    if (matrix[node[0]+1][node[1]] == 1) {
        neighbors.push(new Node(true, [node[0]+1, node[1]]))
    }
    if (matrix[node[0]][node[1]-1] == 1) {
        neighbors.push(new Node(true, [node[0], node[1]-1]))
    }
    if (matrix[node[0]-1][node[1]] == 1) {
        neighbors.push(new Node(true, [node[0]-1, node[1]]))
    }

    return neighbors;
}

function stepBFS (path) {

    // get neighbors that are white, and that arent grey
    // remove working guy, push neighbors to back
    var curr = path.pop()

    // if in maze and not being processed
    let neighbors = getNeighbors(curr.pos);

    for (let i=0; i < neighbors.length; i++) {
        if (matrix[neighbors[i].pos[0]][neighbors[i].pos[1]] != 2) {
            matrix[neighbors[i].pos[0]][neighbors[i].pos[1]] = 2;
            let n = neighbors[i];
            n.parent = curr;
            path.unshift(n);
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
            } else if (matrix[i][j] == 3) {
                ctx.fillStyle = "orange"
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

// distance between two Nodes
function getDistance(A, B) {

    // console.log("A", A, " B", B);
    // console.log("A pos", A.pos, " B pos", B.pos);

    let deltaX = Math.abs(A.pos[0] - B.pos[0]);
    let deltaY = Math.abs(A.pos[1] - B.pos[1]);

    if (deltaX > deltaY) { return 14*deltaY + 10*(deltaX-deltaY); }
    return 14*deltaX + 10*(deltaY-deltaX);
}

function aStarSearch () {

    console.log("starting search")

    var startTime = performance.now()

    path = aStar(new Node(true, curr), new Node(true, [blockCount-4, blockCount-4]))

    if (path == undefined) {
        console.log("no path found");
    } else {
        console.log(path);

        for (let i=0; i < path.length; i++) {
            matrix[path[i].pos[0]][path[i].pos[1]] = 2;
        }
    }
    

    var stopTime = performance.now()

    console.log("search done in", stopTime-startTime, " milliseconds")
}

function aStar (start, target) {
    
    openSet = []
    closedSet = []

    // need to put gCost, hCost
    openSet.push(start);

    while (openSet.length > 0) {

        let curr = openSet[0];

        for (let i=0; i < openSet.length; i++) {
            // if better path or equal check via hCost
            // get node with lowest fCost
            if (openSet[i].fCost < curr.fCost || (openSet[i].fCost == curr.fCost && openSet[i].hCost < curr.hCost)) {
                curr = openSet[i];
            }
        }

        openSet.splice(openSet.indexOf(curr), 1)
        closedSet.push(curr)

        // we got to target
        if (curr.equals(target)) {
            let path = []
            while (!start.equals(curr)) {
                path.push(curr.parent);
                curr = curr.parent
            }
            return path;
        }

        // neighbors given by getNeighbors are already walkable
        let neighbors = getNeighbors(curr.pos).map(o => new Node(true, o));

        // 14 is diagonal move, 10 is for straight move
        for (let i=0; i < neighbors.length; i++) {

            if (closedSet.some(o => o.equals(neighbors[i]))) {
                continue;
            }

            // distance from start + distance to neighbor
            let newPathToNeighborCost = curr.gCost + getDistance(curr, neighbors[i]);

            // if new path is a better path or neighbor was just discovered
            if (newPathToNeighborCost < neighbors[i].gCost || !openSet.includes(neighbors[i])) {

                neighbors[i].gCost = newPathToNeighborCost;
                neighbors[i].hCost = getDistance(neighbors[i], target);
                neighbors[i].parent = curr;

                if (!openSet.includes(neighbors[i])) {
                    // order doesn't matter, push vs unshift is the same here
                    openSet.push(neighbors[i]);
                }
            }
        }
    }
}