console.log("ESCOBAR CATUNTA FREDDY ELIAS - C.I.6068942 L.P");
console.log("Carrera INFORMATICA - INF-133 - 24/09/2025");
invertir = (a) => {
  let cadena = "";
  for (let i = a.length - 1; i >= 0; i--) {
    cadena = cadena + a[i];
  }
  return cadena;
};
miFuncion = (a) => {
  if (a === invertir(a)) {
    return true;
  } else {
    return false;
  }
};
console.log(
  "5. Crear una función que determine si una cadena es palíndromo (se lee igual al derecho y al revés)."
);
console.log();
let band = miFuncion("oruro");
console.log(band);
console.log();
band = miFuncion("hola");
console.log(band);
