console.log("ESCOBAR CATUNTA FREDDY ELIAS - C.I.6068942 L.P");
console.log("Carrera INFORMATICA - INF-133 - 24/09/2025");
miFuncion = (a) => {
  let cadena = "";
  for (let i = a.length - 1; i >= 0; i--) {
    cadena = cadena + a[i];
  }
  return cadena;
};
console.log(
  "Crear una función que invierta el orden de las palabras en una frase."
);
console.log();
let obj = miFuncion("Juan");
console.log(obj);
