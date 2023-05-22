const TAMANO = 40;
const NUMANILLOS = TAMANO / 2;
const anillo1 = new Array(2).fill(2)
modulo = TAMANO % 8;
console.log(modulo);

const anillos = new Array(NUMANILLOS).fill().map(_ => new Array(NUMANILLOS).fill(0));
let caso1 = false;
if( TAMANO%4 == 0){
    caso1 = true;
}
for (let i = 0; i < NUMANILLOS; i++) {
    let numPartesAnillo = (i + 1);
    for (let j = 0; j < numPartesAnillo; j++) {
        if (i == NUMANILLOS - 1) {
            anillos[i][0] = 25;
            anillos[i][1] = 0;
            anillos[i][2] = numPartesAnillo + 2;
            anillos[i][j] = numPartesAnillo + 1;
        }if(caso1){            
            if (i % 2 != 0) {
                anillos[i][0] = numPartesAnillo + 2;
                anillos[i][j] = numPartesAnillo + 1;
            } else if (i % 2 == 0) {
                anillos[i][0] = 0;
                anillos[i][j] = 1;
            }
        }else{
            if (i % 2 == 0) {
                anillos[i][0] = numPartesAnillo + 2;
                anillos[i][j] = numPartesAnillo + 1;
            } else if (i % 2 != 0) {
                anillos[i][0] = 0;
                anillos[i][j] = 1;
            }
        }if (i == 0) {
            anillos[0][j] = 2;
        }         
    }
}
console.log(anillos)
//formar cuarto

const arr = new Array(NUMANILLOS).fill().map(_ => new Array(NUMANILLOS).fill(0));
for (let i = 0; i < NUMANILLOS; i++) {
    for (let j = NUMANILLOS - 1; j >= 0; j--) {        
        arr[i][j] = anillos[NUMANILLOS -j- 1][i-j];
        arr[j][i] = anillos[NUMANILLOS -j- 1][i-j];
    }
}
console.log(arr)