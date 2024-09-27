import express from "express"
import { autenticar, cerrarSesion, comprobarToken, confirmar, formularioLogin, formularioOlvidePassword, formularioRegistro, nuevoPassword, registrar, resetPassword } from "../controllers/usuarioController.js"
import { validacionAutenticar, validacionNuevoPassword, validacionRegistrar, validacionResetPassword } from "../validations/usuariosValidaciones.js"


const router = express.Router()

router.get("/login", formularioLogin)
router.post("/login", validacionAutenticar(), autenticar)

router.post("/cerrar-sesion", validacionAutenticar(), cerrarSesion)

router.get("/registro", formularioRegistro)
router.post("/registro", validacionRegistrar(), registrar)

router.get("/confirmar/:token", confirmar)

router.get("/olvide-password", formularioOlvidePassword)
router.post("/olvide-password", validacionResetPassword(), resetPassword)

router.get("/olvide-password/:token", comprobarToken)
router.post("/olvide-password/:token", validacionNuevoPassword(), nuevoPassword)

export default router