import express from "express";
import cors from "cors";
import categoriaRutas from "./rutas/categoriaRutas.js";
import productoRutas from "./rutas/productoRutas.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/", categoriaRutas);
app.use("/", productoRutas);

const puerto = 3001;
app.listen(puerto, () => {
  console.log(`Servidor en http:\\localhost:${puerto}`);
});
