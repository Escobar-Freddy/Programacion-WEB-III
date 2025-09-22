console.log("ESCOBAR CATUNTA FREDDY ELIAS - C.I.6068942 L.P");
console.log("Carrera INFORMATICA - INF-133 - 24/09/2025");
function miFuncion(num) {
  return {
    pares: num.filter((n) => n % 2 === 0),
    impares: num.filter((n) => n % 2 !== 0),
  };
}
console.log(
  "3. Crear una función que reciba un arreglo de números y devuelva en un objeto a los pares e impares:"
);
console.log();
let obj = miFuncion([1, 2, 3, 4, 5]);
console.log(obj);
