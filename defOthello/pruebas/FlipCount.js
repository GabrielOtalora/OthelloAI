const TAMANO = 8;
const arr = new Array(TAMANO).fill().map(_ => new Array(TAMANO).fill(0));
//1 = Blancas
//2 = Negras
let ACTPLAYER = 2;
let ACTOP = 1;

let count = 0;
arr[4][4] = 1;
arr[4][3] = 2;
arr[3][4] = 2;
arr[3][3] = 1;
const directions = [
    [0, 1], // right
    [0, -1], // left
    [1, 0], // down
    [-1, 0], // up
    [1, 1], // diagonal down-right
    [1, -1], // diagonal down-left
    [-1, 1], // diagonal up-right
    [-1, -1], // diagonal up-left
];
let lastMove = [[5, 4], [5, 5], [4, 5], [5, 3],[4,2],[2,4],[2,3],[2,2],[1,2],[0,2]];
for (let m = 0; m < lastMove.length; m++) {
    let fliped = [];
    
    if (m % 2 == 0) {
        ACTPLAYER = 2
        ACTOP = 1
    } else {
        ACTPLAYER = 1
        ACTOP = 2
    }
    let [lastRow, lastCol] = lastMove[m];
    arr[lastRow][lastCol] = ACTPLAYER;
    console.log(ACTPLAYER);


    for (let i = 0; i < directions.length; i++) {
        let temp = [];
        const [deltaRow, deltaCol] = directions[i];
        let currentRow = lastRow + deltaRow;
        let currentCol = lastCol + deltaCol;        
        if( currentRow < TAMANO && currentRow > 0 && currentCol < TAMANO && currentCol>0 ){
            while (arr[currentRow][currentCol] == ACTOP) {
                    temp.push([currentRow, currentCol]);            
                    currentRow = currentRow + deltaRow;
                    currentCol = currentCol + deltaCol;
                    if(arr[currentRow][currentCol] == ACTPLAYER && currentRow < TAMANO && currentRow>=0 && currentCol < TAMANO && currentCol>=0 ){
                        fliped.push(temp);                
                        //Voltear las piezas
                        for (let k = 0; k < temp.length; k++) {
                            const [x,y] = temp[k];
                            arr[x][y]= ACTPLAYER;
                        }
                    }
                }
        }     
    }    
    console.log(arr);
    console.log(fliped);
}
