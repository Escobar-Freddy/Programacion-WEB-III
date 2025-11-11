import { db } from "../config/db.js";

export const instertapro = async (producto) => {
  const { nombre, precio, stock, categoria_id } = producto;
  const [resultado] = await db.query(
    "INSERT INTO productos(nombre, precio, stock, categoria_id) values(?,?,?,?)",
    [nombre, precio, stock, categoria_id]
  );
  console.log(producto);
  return { id: resultado.insertId, ...producto };
};

export const obtTodo = async () => {
  const [resultado] = await db.query(
    "SELECT c.nombre as nombre_categoria, p.nombre, p.precio, p.stock FROM productos p, categorias c WHERE c.id=p.categoria_id"
  );
  return resultado;
};

export const productosId = async (id) => {
  const [prod] = await db.query(
    "SELECT c.nombre as nombre_categoria, p.nombre, p.precio, p.stock FROM categorias c, productos p WHERE c.id=p.categoria_id and p.categoria_id=?",
    [id]
  );
  return prod;
};

export const actualiza = async (id, producto) => {
  const { nombre, precio, stock, categoria_id } = producto;
  await db.query(
    "UPDATE productos SET nombre=?, precio=?, stock=?, categoria_id=? WHERE id=?",
    [nombre, precio, stock, categoria_id, id]
  );
  return { id, ...producto };
};

export const actualizarStock = async (id, cantidad) => {
  const [productos] = await db.query(
    "SELECT stock FROM productos WHERE id = ?",
    [id]
  );
  const stockActual = productos[0].stock;
  const nuevoStock = stockActual + cantidad;
  const [resultado] = await db.query(
    "UPDATE productos SET stock = ? WHERE id = ?",
    [nuevoStock, id]
  );
};
