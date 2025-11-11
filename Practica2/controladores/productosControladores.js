import {
  instertapro,
  obtTodo,
  productosId,
  actualiza,
  actualizarStock,
} from "../modelos/productosModelo.js";

export const insertaproducto = async (req, res) => {
  try {
    const producto = await instertapro(req.body);
    res.status(201).json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const muestraCategorias = async (req, res) => {
  try {
    const resultado = await obtTodo();
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const muestraproductosId = async (req, res) => {
  try {
    const resultado = await productosId(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const actualizaproducto = async (req, res) => {
  try {
    const resultado = await actualiza(req.params.id, req.body);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const cambiarStock = async (req, res) => {
  const { id } = req.params;
  const { cantidad } = req.body;

  if (typeof cantidad !== "number" || cantidad === 0) {
    return res.status(400).json({
      error:
        "Debe enviar una 'cantidad' numérica para sumar o restar al stock.",
    });
  }
  try {
    const resultado = await actualizarStock(id, cantidad);
    res.status(200).json({
      mensaje: `Stock del producto ${id} actualizado correctamente.`,
      ...resultado,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
