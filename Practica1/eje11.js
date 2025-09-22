console.log("ESCOBAR CATUNTA FREDDY ELIAS - C.I.6068942 L.P");
console.log("Carrera INFORMATICA - INF-133 - 24/09/2025");
console.log(
  "11. Proporcione un ejemplo concreto de encadenamiento de promesas."
);
function promesaCadena(valor) {
  return new Promise((dato) => {
    setTimeout(() => dato(valor * 2), 2000);
  });
}
promesaCadena(2)
  .then((r) => {
    console.log(r);
    return promesaCadena(r);
  })
  .then((r2) => console.log(r2));
