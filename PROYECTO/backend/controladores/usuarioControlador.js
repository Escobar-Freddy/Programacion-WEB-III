import {
  obtTodo,
  obtUno,
  inserta,
  actualiza,
  elimina,
  generaCaptcha as modeloGeneraCaptcha,
  verificaLogin as modeloVerificaLogin,
} from "../modelos/usuarioModelo.js";

//controladores para ingresar autentificacion de credenciales

export const generaCaptcha = async (req, res) => {
  try {
    const captcha = modeloGeneraCaptcha();
    res.json(captcha);
  } catch (error) {
    console.error("Error generando captcha:", error);
    res.status(500).json({
      success: false,
      message: "Error generando captcha",
    });
  }
};

export const verificaLogin = async (req, res) => {
  try {
    const { email, password, captchaId, captchaText } = req.body;
    const resultado = await modeloVerificaLogin(
      email,
      password,
      captchaId,
      captchaText
    );

    res.status(resultado.success ? 200 : 401).json(resultado);
  } catch (error) {
    res.status(500).json({
      message: "Error del servidor",
    });
  }
};

// CONTROLADORES DE USUARIO

export const muestra = async (req, res) => {
  try {
    const resultado = await obtTodo();
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const muestraUsuario = async (req, res) => {
  try {
    const resultado = await obtUno(req.params.id);
    if (!resultado) {
      return res.status(404).json({ error: "usuario no encontrado" });
    }
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const insertaUsuario = async (req, res) => {
  try {
    const resultado = await inserta(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const actualizaUsuario = async (req, res) => {
  try {
    const resultado = await actualiza(req.params.id, req.body);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const eliminaUsuario = async (req, res) => {
  try {
    await elimina(req.params.id);
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
