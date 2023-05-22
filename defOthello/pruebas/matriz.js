tamano = 8;

const arr = new Array(tamano).fill().map(_ => new Array(tamano).fill(0)) ;
//cuadro interior
arr[tamano/2][tamano/2]=2
arr[tamano/2-1][tamano/2]=2
arr[tamano/2][tamano/2-1]=2
arr[tamano/2-1][tamano/2-1]=2
//Cuadro exterior al interior
arr[tamano/2][tamano/2+1]=3
arr[tamano/2][tamano/2-2]=3
arr[tamano/2+1][tamano/2]=3
arr[tamano/2+1][tamano/2-1]=3
arr[tamano/2-1][tamano/2+1]=3
arr[tamano/2-1][tamano/2-2]=3
arr[tamano/2-2][tamano/2-1]=3
arr[tamano/2-2][tamano/2]=3

arr[tamano/2+1][tamano/2+1]=4
arr[tamano/2-2][tamano/2-2]=4
arr[tamano/2+1][tamano/2-2]=4
arr[tamano/2-2][tamano/2+1]=4

//Esquinas y bordes
arr[tamano-1][tamano-1]=25
arr[tamano-1][0]=25
arr[0][tamano-1]=25
arr[0][0]=25



console.log(arr);
