import { db } from "../config/db.js";

export const inserta = async (categorias) => {
  const { nombre, descripcion } = categorias;
  const [resultado] = await db.query(
    "INSERT INTO categorias(nombre,descripcion) VALUES(?,?)",
    [nombre, descripcion]
  );
  console.log(resultado);
  return { id: resultado.insertId, ...categorias };
};

export const obtTodo = async () => {
  const [resultado] = await db.query("SELECT * FROM categorias");
  return resultado;
};

export const categoriasId = async (id) => {
  const [cat] = await db.query(
    "SELECT c.id, p.nombre FROM categorias c, productos p WHERE c.id=p.categoria_id and c.id=?",
    [id]
  );
  return cat;
};

export const actualiza = async (id, categoria) => {
  const { nombre, descripcion } = categoria;
  await db.query("UPDATE categorias SET nombre=?, descripcion=?  WHERE id=?", [
    nombre,
    descripcion,
    id,
  ]);
  return { id, ...categoria };
};

export const elimina = async (id) => {
  await db.query("DELETE FROM productos WHERE categoria_id = ?", [id]);
  await db.query("DELETE FROM categorias WHERE id=?", [id]);
  return id;
};
