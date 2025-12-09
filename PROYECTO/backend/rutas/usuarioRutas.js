import express from "express";
import {
  muestra,
  muestraUsuario,
  insertaUsuario,
  actualizaUsuario,
  eliminaUsuario,
  generaCaptcha,
  verificaLogin,
} from "../controladores/usuarioControlador.js";

const rutas = express.Router();

rutas.get("/captcha", generaCaptcha);
rutas.post("/login", verificaLogin);

rutas.get("/verusuario", muestra);
rutas.get("/verusuario/:id", muestraUsuario);
rutas.post("/insertausuario/adi", insertaUsuario);
rutas.put("/actusuario/:id", actualizaUsuario);
rutas.delete("/eliusuario/:id", eliminaUsuario);

export default rutas;
