import { validationResult } from "express-validator"
import { emailPassword, emailRegistro } from "../helpers/emails.js"
import { hashClave } from "../helpers/hash.js"
import { generarJWT, generarToken } from "../helpers/tokens.js"
import { Usuario } from "../models/Usuario.js"

export const formularioLogin = (req, res) => {
  return res.render("auth/login", {
    pagina: "Iniciar sesión",
    csrfToken: req.csrfToken()
  })
}

export const autenticar = async (req, res) => {
  const { correo, clave } = req.body

  const resultado = validationResult(req)
  if (!resultado.isEmpty()) {
    return res.render("auth/login", {
      pagina: "Iniciar sesión",
      errores: resultado.array(),
      correo,
      csrfToken: req.csrfToken()
    })
  }

  const usuario = await Usuario.findOne({ where: { correo } })

  if (!usuario) {
    return res.render("auth/login", {
      pagina: "Iniciar sesión",
      msg: "Datos de inicio de sesión incorrectos",
      correo,
      error: true,
      csrfToken: req.csrfToken()
    })
  }

  if (!usuario.confirmado) {
    return res.render("auth/login", {
      pagina: "Iniciar sesión",
      msg: "La cuenta no ha sido activada",
      email,
      error: true,
      csrfToken: req.csrfToken()
    })
  }

  if (!usuario.verificarClave(clave)) {
    return res.render("auth/login", {
      pagina: "Iniciar sesión",
      msg: "Datos de inicio de sesión incorrectos",
      correo,
      error: true,
      csrfToken: req.csrfToken()
    })
  }

  const token = generarJWT({ id: usuario.id, nombre: usuario.nombre })

  return res.cookie('_token', token, {
    httpOnly: true,
    // secure: true
  }).redirect('/mis-propiedades')
}

export const cerrarSesion = (req, res) => {
  return res.clearCookie("_token").status(200).redirect("/")
}

export const formularioRegistro = (req, res) => {
  return res.render("auth/registro", {
    pagina: "Crear cuenta",
    csrfToken: req.csrfToken()
  })
}

export const registrar = async (req, res) => {
  const { nombre, correo, clave } = req.body

  const resultado = validationResult(req)

  if (!resultado.isEmpty()) {
    return res.render("auth/registro", {
      pagina: "Registrarse",
      errores: resultado.array(),
      nombre,
      correo,
      csrfToken: req.csrfToken()
    })
  }

  const usuarioExiste = await Usuario.findOne({ where: { correo } })

  if (usuarioExiste) {
    return res.render("auth/registro", {
      pagina: "Registrarse",
      errores: [{ msg: "Ese correo ya esta registrado", path: "correo" }],
      nombre,
      correo,
      csrfToken: req.csrfToken()
    })
  }

  const usuario = await Usuario.create({
    nombre,
    correo,
    clave,
    token: generarToken()
  })

  emailRegistro({
    nombre: usuario.nombre,
    correo: usuario.correo,
    token: usuario.token,
  })

  return res.render("template/mensaje", {
    pagina: "Activa tu cuenta",
    nombre,
    imagen: "mensaje.png",
    msg: "Porfavor revisa la bandeja de entrada de tu correo para activar tu cuenta"
  })
}

export const confirmar = async (req, res) => {
  const { token } = req.params
  const usuario = await Usuario.findOne({ where: { token } })
  if (!usuario) {
    return res.render("template/mensaje", {
      pagina: "Error al intentar activar la cuenta",
      imagen: "error.png",
      msg: "El token ingresado es invalido o ha expirado, por favor vuelve a intentarlo.",
      error: true,
    })
  }

  usuario.token = null
  usuario.confirmado = true
  await usuario.save()

  return res.render("template/mensaje", {
    pagina: "Tu cuenta ha sido activada",
    nombre: usuario.nombre,
    imagen: "aprobado.png",
    msg: "Ya puedes acceder al sitio de BienesRaices con tu cuenta!",
  })
}

export const formularioOlvidePassword = (req, res) => {
  return res.render("auth/olvide-password", {
    pagina: "Restablecer contraseña",
    csrfToken: req.csrfToken()
  })
}

export const resetPassword = async (req, res) => {
  const { correo } = req.body
  
  const resultado = validationResult(req)

  if (!resultado.isEmpty()) {
    return res.render("auth/olvide-password", {
      pagina: "Restablecer contraseña",
      errores: resultado.array(),
      csrfToken: req.csrfToken()
    })
  }

  const usuario = await Usuario.findOne({ where: { correo } })

  if (!usuario) {
    return res.render("auth/olvide-password", {
      pagina: "Restablecer contraseña",
      errores: [{ path: "correo", msg: "El correo no pertenece a ninguna cuenta" }],
      csrfToken: req.csrfToken()
    })
  }

  usuario.token = generarToken();
  await usuario.save()

  await emailPassword({
    nombre: usuario.nombre,
    correo: usuario.correo,
    token: usuario.token,
  })

  return res.render("template/mensaje", {
    pagina: "Restablecer contraseña",
    imagen: "mensaje.png",
    nombre: usuario.nombre,
    msg: "Se han enviado las instrucciones, porfavor comprueba tu correo.",
    csrfToken: req.csrfToken()
  })
}

export const comprobarToken = async (req, res) => {
  const { token } = req.params

  const usuario = await Usuario.findOne({ where: { token } })

  if (!usuario) {
    return res.render("template/mensaje", {
      pagina: "Error al intentar cambiar tu contraseña",
      imagen: "error.png",
      msg: "El token es inválido o ha expirado, porfavor vuelve a intentarlo."
    })
  }

  return res.render("auth/cambiar-password", {
    pagina: "Cambia tu contraseña",
    csrfToken: req.csrfToken()
  })
}

export const nuevoPassword = async (req, res) => {
  const { clave } = req.body
  const { token } = req.params

  const resultado = validationResult(req)

  if (!resultado.isEmpty()) {
    return res.render("auth/cambiar-password", {
      pagina: "Cambia tu contraseña",
      errores: resultado.array(),
      csrfToken: req.csrfToken()
    })
  }

  const usuario = await Usuario.findOne({ where: { token } })

  usuario.token = null
  usuario.clave = await hashClave(password)
  usuario.save()

  return res.render("template/mensaje", {
    pagina: "Contraseña cambiada correctamente",
    imagen: "clave-ok.png",
    nombre: usuario.name,
    msg: "Tu contraseña se ha cambiado correctamente, ya puedes ingresar a tu cuenta.",
    csrfToken: req.csrfToken()
  })
}
