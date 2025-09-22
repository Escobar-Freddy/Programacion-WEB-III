console.log("ESCOBAR CATUNTA FREDDY ELIAS - C.I.6068942 L.P");
console.log("Carrera INFORMATICA - INF-133 - 24/09/2025");
console.log(
  "15. Proporcione un ejemplo para convertir un callback en una promesa."
);
function callback_promesa() {
  return new Promise((mensaje, reject) => {
    setTimeout(() => mensaje("callback a promesa"), 2000);
  });
}
callback_promesa().then(console.log);
