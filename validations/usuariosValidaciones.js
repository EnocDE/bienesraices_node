import { body } from "express-validator"

export const validacionAutenticar = () => {
  return [body("correo").isEmail().withMessage("El correo no es válido"),
  body("clave").notEmpty().withMessage("Debes ingresar tu contraseña")]
}

export const validacionRegistrar = () => {
  return [
    body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
    body("correo").isEmail().withMessage("El correo no es válido"),
    body("clave").isLength({ min: 8 }).withMessage("La contraseña debe tener al menos 8 caracteres"),
    body("repetir_clave").custom((value, { req }) => {
      if (value !== req.body.clave) {
        throw new Error("Las contraseñas no coinciden")
      }
      return true
    })
  ]
}

export const validacionResetPassword = () => {
  return [
    body("correo").isEmail().withMessage("El correo no es válido")
  ]
}

export const validacionNuevoPassword = () => {
  return [
    body("clave").isLength({ min: 8 }).withMessage("La contraseña debe contener minimo 8 caracteres"),
    body("repetir_clave").custom((value, { req }) => {
      if (value !== req.body.clave) {
        throw new Error("Las contraseñas no coinciden")
      }
      return true
    })
  ]
}

