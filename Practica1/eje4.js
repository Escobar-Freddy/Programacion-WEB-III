console.log("ESCOBAR CATUNTA FREDDY ELIAS - C.I.6068942 L.P");
console.log("Carrera INFORMATICA - INF-133 - 24/09/2025");
function miFuncion(arr) {
  return {
    mayor: Math.max(...arr),
    menor: Math.min(...arr),
  };
}
console.log(
  "4. Crear una función que reciba un arreglo de números y devuelva el número mayor y el menor, en un objeto."
);
console.log();
let obj = miFuncion([1, 2, 3, 4, 5]);
console.log(obj);
