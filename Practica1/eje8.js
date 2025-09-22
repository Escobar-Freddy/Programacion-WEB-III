console.log("ESCOBAR CATUNTA FREDDY ELIAS - C.I.6068942 L.P");
console.log("Carrera INFORMATICA - INF-133 - 24/09/2025");
console.log(
  "8. Realizar un código para ejecutar una función callback después 2 segundos."
);
function ejecutarCallback(cb) {
  setTimeout(cb, 2000);
}
const miFuncionCallback = () => {
  console.log("¡Hola, mundo han pasado 2 segundos");
};
ejecutarCallback(miFuncionCallback);
