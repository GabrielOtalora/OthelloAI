const TAMANO = 8;
const arr = new Array(TAMANO).fill().map(_ => new Array(TAMANO).fill(0));
const MITAD = TAMANO / 2;
for (let i = 0; i < TAMANO; i++) {
    for (let j = 0; j < TAMANO; j++) {
        //Esquinas:
        if ((i == 0 && j == 0) || (i == 0 && j == TAMANO - 1 )|| (i == TAMANO - 1 && j == 0 )||( i == TAMANO - 1 && j == TAMANO - 1)) {
            arr[i][j] = 9;
        }
        //Cuadro interior
        if ((i == MITAD && j == MITAD) || (i == MITAD - 1 && j == MITAD - 1) || (i == MITAD - 1 && j == MITAD )|| (i == MITAD && j == MITAD - 1)) {
            arr[i][j] = 2;
        }
        //Cuadro exterior del interior
        if ((i == MITAD + 1 && j == MITAD) || (i == MITAD - 2 && j == MITAD -1 )|| (i == MITAD - 2 && j == MITAD )|| (i == MITAD +1 && j == MITAD -1)
        ||(i == MITAD && j == MITAD+1) || (i == MITAD -1 && j == MITAD +1 )||( i == MITAD  && j == MITAD-2 )|| (i == MITAD -1 && j == MITAD -2))
        {
            arr[i][j] = 3;
        }
        //Esquinas que llevan a un borde
        if ((i == 2 && j == 2) || i == 2 && j == TAMANO - 3 || i == TAMANO - 3 && j == 2 || i == TAMANO - 3 && j == TAMANO - 3) {
            arr[i][j] = 4;
        }
        //Columnas de unos
        if ((i == 1 && j>1 && j< TAMANO-2)  ||(i == TAMANO-2 && j>1 && j< TAMANO-2 )||( i >1&& i< TAMANO - 2 && j == 1 )||(i >1&& i< TAMANO - 2  &&  j == MITAD+2)) {
            arr[i][j] = 1;
        }
        //Columnas de 5s
        if ((i == 0 && j>2 && j< TAMANO-3)  ||(i == TAMANO-1 && j>2 && j< TAMANO-3 )||( i >2&& i< TAMANO - 3 && j == 0 )||(i >2&& i< TAMANO - 3  &&  j == TAMANO-1)) {
            arr[i][j] = 5;
        }
        //6ses xd
        if ((i == 0 && (j== TAMANO-3|| j== 2))||(i == TAMANO-1 && (j== TAMANO-3|| j== 2))||(j == 0 && (i== TAMANO-3|| i== 2))||(j == TAMANO-1 && (i== TAMANO-3|| i== 2))) {
            arr[i][j] = 6;
        }

    }
}
console.log(arr)
