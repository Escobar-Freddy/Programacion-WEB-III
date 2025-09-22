console.log("ESCOBAR CATUNTA FREDDY ELIAS - C.I.6068942 L.P");
console.log("Carrera INFORMATICA - INF-133 - 24/09/2025");
console.log(
  "12. Proporcione un ejemplo concreto donde el anidamiento de callbacks se puede reescribir mejor con async/await haciendo el código más limpio y mantenible."
);
function control(cb) {
  setTimeout(() => cb("Hola"), 2000);
}
async function tareaAsync() {
  let promesa = new Promise((mensaje) => control(mensaje));
  let resultado = await promesa;
  console.log(resultado);
}
tareaAsync();
