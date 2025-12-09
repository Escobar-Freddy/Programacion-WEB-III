import { db } from "../config/db.js";

export const obtTodo = async () => {
  const [resultado] = await db.query("SELECT * FROM categorias");
  return resultado;
};

export const obtUno = async (id) => {
  const [resultado] = await db.query(
    "SELECT * FROM categorias WHERE id = ? AND activo = 1",
    [id]
  );
  return resultado[0];
};

export const inserta = async (categorias) => {
  const { nombre, descripcion } = categorias;

  const [resultado] = await db.query(
    "INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)",
    [nombre, descripcion]
  );

  return { id: resultado.insertId, ...categorias };
};

export const actualiza = async (id, categorias) => {
  const { nombre, descripcion } = categorias;

  await db.query(
    "UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ?",
    [nombre, descripcion, id]
  );

  return { id, ...categorias };
};

export const elimina = async (id) => {
  await db.query("DELETE FROM categorias WHERE id = ?", [id]);
  return id;
};
