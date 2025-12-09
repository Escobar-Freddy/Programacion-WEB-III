import { db } from "../config/db.js";

export const obtTodo = async () => {
  const [resultado] = await db.query("SELECT * FROM productos");
  return resultado;
};

export const obtUno = async (id) => {
  const [resultado] = await db.query(
    "SELECT * FROM productos WHERE id = ? AND activo = 1",
    [id]
  );
  return resultado[0];
};

export const inserta = async (producto) => {
  const {
    nombre,
    descripcion,
    unidad_medida,
    precio_costo,
    precio_venta,
    categoria,
    marca,
    codigo_referencia,
    stock,
    stock_minimo,
  } = producto;

  const [resultado] = await db.query(
    "INSERT INTO productos (nombre, descripcion, unidad_medida, precio_costo, precio_venta, categoria, marca, codigo_referencia, stock, stock_minimo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      nombre,
      descripcion,
      unidad_medida,
      precio_costo,
      precio_venta,
      categoria,
      marca,
      codigo_referencia,
      stock,
      stock_minimo,
    ]
  );

  return { id: resultado.insertId, ...producto };
};

export const actualiza = async (id, producto) => {
  const {
    nombre,
    descripcion,
    unidad_medida,
    precio_costo,
    precio_venta,
    categoria,
    marca,
    codigo_referencia,
    stock,
    stock_minimo,
  } = producto;

  await db.query(
    "UPDATE productos SET nombre = ?, descripcion = ?, unidad_medida = ?, precio_costo = ?, precio_venta = ?, categoria = ?, marca = ?, codigo_referencia = ?, stock = ?, stock_minimo = ? WHERE id = ?",
    [
      nombre,
      descripcion,
      unidad_medida,
      precio_costo,
      precio_venta,
      categoria,
      marca,
      codigo_referencia,
      stock,
      stock_minimo,
      id,
    ]
  );

  return { id, ...producto };
};

export const elimina = async (id) => {
  await db.query("DELETE FROM productos WHERE id = ?", [id]);
  return id;
};
