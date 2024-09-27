import express from "express"
import { body } from "express-validator"
import { admin, agregarImagen, almacenarImagen, cambiarEstado, crear, editar, eliminar, enviarMensaje, guardar, guardarCambios, mostrarPropiedad, verMensajes } from "../controllers/propiedadesController.js"
import { identificarUsuario } from "../middleware/identificarUsuario.js"
import { protegerRuta } from "../middleware/protegerRutas.js"
import { upload } from "../middleware/subirImagen.js"
import { validacionDatosPropiedades } from "../validations/propiedadesValidaciones.js"

const router = express.Router()

router.get("/mis-propiedades", protegerRuta, admin)

router.get("/propiedades/crear", protegerRuta, crear)
router.post("/propiedades/crear", protegerRuta,
  validacionDatosPropiedades(),
  guardar)

router.get("/propiedades/agregar-imagen/:id", protegerRuta, agregarImagen)
router.post("/propiedades/agregar-imagen/:id", protegerRuta, upload.single('image'), almacenarImagen)

router.get("/propiedades/editar/:id", protegerRuta, editar)
router.post("/propiedades/editar/:id", protegerRuta, validacionDatosPropiedades(), guardarCambios)

router.post("/propiedades/eliminar/:id", protegerRuta, eliminar)

router.put("/propiedades/:id", protegerRuta, cambiarEstado)

// Área publica
router.get("/propiedad/:id", identificarUsuario, mostrarPropiedad)

// Mensajes
router.post("/propiedad/:id",
  identificarUsuario,
  body('mensaje').notEmpty().withMessage("El mensaje no puede ir vacio"),
  body('mensaje').isLength({ min: 10 }).withMessage("El mensaje es demasiado corto"),
  body('mensaje').isLength({ max: 200 }).withMessage("El mensaje es muy largo"),
  enviarMensaje)

router.get("/mensajes/:id", protegerRuta, verMensajes)

export default router

