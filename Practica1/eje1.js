console.log("ESCOBAR CATUNTA FREDDY ELIAS - C.I.6068942 L.P");
console.log("Carrera INFORMATICA - INF-133 - 24/09/2025");
function miFuncion(palabra) {
  const contador = { a: 0, e: 0, i: 0, o: 0, u: 0 };
  for (const vocal of palabra) {
    if (contador[vocal] !== undefined) {
      contador[vocal]++;
    }
  }
  return contador;
}
console.log(
  "1. Crear una función que cuente cuántas veces aparece cada vocal en un texto y devuelva el resultado en un objeto."
);
console.log();
let obj = miFuncion("euforia");
console.log(obj);
