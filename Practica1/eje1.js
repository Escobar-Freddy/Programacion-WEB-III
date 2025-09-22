console.log("ESCOBAR CATUNTA FREDDY ELIAS - C.I.6068942 L.P");
console.log("Carrera INFORMATICA - INF-133 - 24/09/2025");
function contarVocales(texto = "") {
  const base = texto.toString().toLowerCase();
  const contador = { a: 0, e: 0, i: 0, o: 0, u: 0 };

  for (const vocal of base) {
    if (contador[vocal] !== undefined) {
      contador[vocal]++;
    }
  }
  return contador;
}
console.log("1) Contar vocales en un texto");
console.log();
console.log(contarVocales("euforia"));
