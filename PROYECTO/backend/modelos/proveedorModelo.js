import { db } from "../config/db.js";

export const obtTodo = async () => {
  const [resultado] = await db.query("SELECT * FROM proveedores WHERE activo = 1 ORDER BY nombre");
  return resultado;
};

export const obtUno = async (id) => {
  const [resultado] = await db.query(
    "SELECT * FROM proveedores WHERE id = ? AND activo = 1",
    [id]
  );
  return resultado[0];
};

export const inserta = async (proveedor) => {
  const {
    nombre,
    empresa,
    telefono,
    email,
    direccion
  } = proveedor;

  const [resultado] = await db.query(
    "INSERT INTO proveedores (nombre, empresa, telefono, email, direccion) VALUES (?, ?, ?, ?, ?)",
    [
      nombre,
      empresa,
      telefono,
      email,
      direccion
    ]
  );

  return { id: resultado.insertId, ...proveedor };
};

export const actualiza = async (id, proveedor) => {
  const {
    nombre,
    empresa,
    telefono,
    email,
    direccion
  } = proveedor;

  await db.query(
    "UPDATE proveedores SET nombre = ?, empresa = ?, telefono = ?, email = ?, direccion = ? WHERE id = ?",
    [
      nombre,
      empresa,
      telefono,
      email,
      direccion,
      id
    ]
  );

  return { id, ...proveedor };
};

export const elimina = async (id) => {
  await db.query("UPDATE proveedores SET activo = 0 WHERE id = ?", [id]);
  return id;
};