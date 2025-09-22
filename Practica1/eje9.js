console.log("ESCOBAR CATUNTA FREDDY ELIAS - C.I.6068942 L.P");
console.log("Carrera INFORMATICA - INF-133 - 24/09/2025");
console.log(
  "9. Crear una promesa que devuelva un mensaje de éxito después de 3 segundos."
);
function promesaExito() {
  return new Promise((mensaje) => {
    setTimeout(() => mensaje("Éxito"), 3000);
  });
}
promesaExito().then((msg) => console.log(msg));
