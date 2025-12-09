import { db } from "../config/db.js";

// Almacena datos para captchas (en memoria)
const captchaStore = new Map();

// funcion para generar el captcha

export const generaCaptcha = () => {
  const captchaText = Math.random().toString(36).substring(2, 8).toUpperCase();
  const captchaId = Math.random().toString(36).substring(2, 15);
  captchaStore.set(captchaId, {
    text: captchaText,
    expires: Date.now() + 10 * 60 * 1000,
  });
  return { captchaId, captchaText };
};

export const verificaCaptcha = (captchaId, captchaText) => {
  const captchaData = captchaStore.get(captchaId);

  // Limpiar captchas expirados
  const ahora = Date.now();
  for (const [id, data] of captchaStore.entries()) {
    if (data.expires < ahora) {
      captchaStore.delete(id);
    }
  }

  if (!captchaData) {
    return { valido: false, mensaje: "Captcha inválido o expirado" };
  }

  if (captchaData.text !== captchaText?.toUpperCase()) {
    return { valido: false, mensaje: "Captcha incorrecto" };
  }

  return { valido: true };
};

export const verificaLogin = async (
  email,
  password,
  captchaId,
  captchaText
) => {
  try {
    // Verificar captcha primero
    const captchaValido = verificaCaptcha(captchaId, captchaText);
    if (!captchaValido.valido) {
      return {
        success: false,
        message: captchaValido.mensaje,
      };
    }

    // Buscar usuario en la base de datos
    const [results] = await db.query(
      "SELECT * FROM usuarios WHERE email = ? AND password = ? AND activo = TRUE",
      [email, password]
    );

    if (results.length === 0) {
      return {
        success: false,
        message: "Credenciales incorrectas",
      };
    }

    const user = results[0];

    // Login exitoso
    return {
      success: true,
      message: "Login exitoso",
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "Error del servidor",
    };
  }
};

export const obtTodo = async () => {
  const [resultado] = await db.query("SELECT * FROM usuarios");
  return resultado;
};

export const obtUno = async (id) => {
  const [resultado] = await db.query(
    "SELECT * FROM usuarios WHERE id = ? AND activo = 1",
    [id]
  );
  return resultado[0];
};

export const inserta = async (usuario) => {
  const { nombre, email, password, rol } = usuario;

  const [resultado] = await db.query(
    "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)",
    [nombre, email, password, rol]
  );
  return { id: resultado.insertId, ...usuario };
};

export const actualiza = async (id, usuario) => {
  const { nombre, email, password, rol, activo } = usuario;

  await db.query(
    "UPDATE usuarios SET nombre = ?, email = ?, password = ?, rol = ?, activo=? WHERE id = ?",
    [nombre, email, password, rol, activo, id]
  );

  return { id, ...usuario };
};

export const elimina = async (id) => {
  await db.query("DELETE FROM usuarios WHERE id = ?", [id]);
  return id;
};
