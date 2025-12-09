import express from "express";
import cors from "cors";
import proveedorRutas from "./rutas/proveedorRutas.js";
import productoRutas from "./rutas/productoRutas.js";
import usuarioRutas from "./rutas/usuarioRutas.js";
import categoriasRutas from "./rutas/categoriasRutas.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/", productoRutas);
app.use("/", usuarioRutas);
app.use("/", proveedorRutas);
app.use("/", categoriasRutas);

const puerto = 5000;

app.listen(puerto, () => {
  console.log(`Servidor en http://localhost:${puerto}`);
});
