const TAMANO = 8;
//for odd size

function crearMCompleta(){
    const NUMANILLOS = Math.floor(TAMANO / 2)+1;
    const anillos = new Array(NUMANILLOS).fill().map(_ => new Array(NUMANILLOS).fill(0));
    let caso1 = false;
    if (TAMANO % 3 == 0) {
        caso1 = true;
    }
    for (let i = 0; i < NUMANILLOS; i++) {
        let numPartesAnillo = (i + 1);
        for (let j = 0; j < numPartesAnillo; j++) {
            //El tamaño del tablero es divisible por 4? 
            if (caso1) {
                if (i % 2 != 0) {
                    anillos[i][0] = numPartesAnillo + 2;
                    anillos[i][j] = numPartesAnillo + 1;
                } else if (i % 2 == 0) {
                    anillos[i][0] = 0;
                    anillos[i][j] = 1;
                }
            }
            //El tamaño del tablero no es divisible por 4?
            if (!caso1) {
                if (i % 2 == 0) {
                    anillos[i][0] = numPartesAnillo + 2;
                    anillos[i][j] = numPartesAnillo + 1;
                } else if (i % 2 != 0) {
                    anillos[i][0] = 0;
                    anillos[i][j] = 1;
                }
            } else if (i == 0) {
                anillos[0][j] = 2;
            }
            if (i == 0) {
                anillos[0][j] = 2;
            }

            if (i == NUMANILLOS - 1) {
                anillos[i][0] = (NUMANILLOS+1)*5;
                anillos[i][1] = 0;
                anillos[i][2] = numPartesAnillo +3;
            }
        }
    }
    //Formar una cuarta parte de la matriz
    const cuarto = new Array(NUMANILLOS).fill().map(_ => new Array(NUMANILLOS).fill(0));
    for (let i = 0; i < NUMANILLOS; i++) {
        for (let j = NUMANILLOS - 1; j >= 0; j--) {
            cuarto[i][j] = anillos[NUMANILLOS - j - 1][i - j];
            cuarto[j][i] = anillos[NUMANILLOS - j - 1][i - j];
        }
    }
    const completa = new Array(TAMANO).fill().map(_ => new Array(TAMANO).fill(0));
    for (let i = 0; i < NUMANILLOS; i++) {
        reves =cuarto[i].slice().splice(0,NUMANILLOS-1).reverse() 
        fila =(cuarto[i]).concat(reves);
        completa[i]= fila//ncuarto[i].reverse().concat(ncuarto[i]);
        completa[TAMANO -i-1]= fila
    }
    return completa;
}
const start= performance.now();
mcompleta = crearMCompleta();
const end= performance.now();
let tiempo = end-start;
console.log(mcompleta, "Tiempo: ", tiempo);