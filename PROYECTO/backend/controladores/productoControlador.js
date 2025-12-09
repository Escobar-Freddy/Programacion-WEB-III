import {
  obtTodo,
  obtUno,
  inserta,
  actualiza,
  elimina,
} from "../modelos/productoModelo.js";

export const muestraProductos = async (req, res) => {
  try {
    const resultado = await obtTodo();
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const muestraProducto = async (req, res) => {
  try {
    const resultado = await obtUno(req.params.id);
    if (!resultado) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const insertaProducto = async (req, res) => {
  try {
    const resultado = await inserta(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const actualizaProducto = async (req, res) => {
  try {
    const resultado = await actualiza(req.params.id, req.body);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const eliminaProducto = async (req, res) => {
  try {
    await elimina(req.params.id);
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
