import {
  inserta,
  obtTodo,
  categoriasId,
  actualiza,
  elimina,
} from "../modelos/categoriasModelos.js";
//eje1
export const insertacategoria = async (req, res) => {
  try {
    const categorias = await inserta(req.body);
    res.status(201).json(categorias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//eje2
export const muestraCategorias = async (req, res) => {
  try {
    const resultado = await obtTodo();
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//eje3
export const muestracategoriasId = async (req, res) => {
  try {
    const resultado = await categoriasId(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//eje4
export const actualizaCategoria = async (req, res) => {
  try {
    const resultado = await actualiza(req.params.id, req.body);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//eje5
export const eliminaCategoria = async (req, res) => {
  try {
    await elimina(req.params.id);
    res.json({ message: "categoria eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
