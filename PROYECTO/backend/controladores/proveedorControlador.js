import {
  obtTodo,
  obtUno,
  inserta,
  actualiza,
  elimina,
} from "../modelos/proveedorModelo.js";

export const muestraProveedores = async (req, res) => {
  try {
    const resultado = await obtTodo();
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const muestraProveedor = async (req, res) => {
  try {
    const resultado = await obtUno(req.params.id);
    if (!resultado) {
      return res.status(404).json({ error: "Proveedor no encontrado" });
    }
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const insertaProveedor = async (req, res) => {
  try {
    const resultado = await inserta(req.body);
    res.status(201).json({
      message: "Proveedor creado correctamente",
      data: resultado,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const actualizaProveedor = async (req, res) => {
  try {
    const resultado = await actualiza(req.params.id, req.body);
    res.json({
      message: "Proveedor actualizado correctamente",
      data: resultado,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export const eliminaProveedor = async (req, res) => {
  try {
    await elimina(req.params.id);
    res.json({
      message: "Proveedor eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
