console.log("ESCOBAR CATUNTA FREDDY ELIAS - C.I.6068942 L.P");
console.log("Carrera INFORMATICA - INF-133 - 24/09/2025");
console.log(
  "13. Proporcione un ejemplo concreto donde el anidamiento de promesas se puede reescribir mejor con async/await haciendo el código más limpio y mantenible."
);
function tarea(mensaje, tiempo) {
  return new Promise((resolve) => setTimeout(() => resolve(mensaje), tiempo));
}
async function ejecutarTareas() {
  let r1 = await tarea("Primera tarea", 2000);
  console.log(r1);
  let r2 = await tarea("Segunda tarea", 2000);
  console.log(r2);
}
ejecutarTareas();
