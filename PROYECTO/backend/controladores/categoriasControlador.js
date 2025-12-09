import {
  obtTodo,
  obtUno,
  inserta,
  actualiza,
  elimina,
} from "../modelos/categoriaModelo.js";

export const muestra = async (req, res) => {
  try {
    const resultado = await obtTodo();
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const muestraCategoria = async (req, res) => {
  try {
    const resultado = await obtUno(req.params.id);
    if (!resultado) {
      return res.status(404).json({ error: "Categoria no encontrado" });
    }
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const insertaCategoria = async (req, res) => {
  try {
    const resultado = await inserta(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const actualizaCategoria = async (req, res) => {
  try {
    const resultado = await actualiza(req.params.id, req.body);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const eliminaCategoria = async (req, res) => {
  try {
    await elimina(req.params.id);
    res.json({ message: "categoria eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
