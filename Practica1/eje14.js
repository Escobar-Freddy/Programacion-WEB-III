console.log("ESCOBAR CATUNTA FREDDY ELIAS - C.I.6068942 L.P");
console.log("Carrera INFORMATICA - INF-133 - 24/09/2025");
console.log(
  "14. Proporcione un ejemplo para convertir una promesa en un callback."
);
function promesa_callback(p, cb) {
  p.then((b) => cb(null, b)).catch((a) => cb(a));
}
promesa_callback(Promise.resolve("De promesa a callback"), (a, b) => {
  if (a) console.error(a);
  else console.log(b);
});
