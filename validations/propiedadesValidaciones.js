import { body } from "express-validator";

export function validacionDatosPropiedades() {
  return [body("nombre").notEmpty().withMessage("El titulo del anuncio es obligatorio"),
  body("descripcion").notEmpty().withMessage("La descripción es obligatoria").isLength({ max: 500 }).withMessage("La descripción es muy grande"),
  body("categoria").isNumeric().withMessage("Selecciona una categoria"),
  body("precio").isString().withMessage("Selecciona un precio"),
  body("habitaciones").isString().withMessage("Selecciona la cantidad de cuartos"),
  body("estacionamientos").isString().withMessage("Selecciona la cantidad de estacionamientos"),
  body("wc").isString().withMessage("Selecciona la cantidad de baños"),
  body("calle").notEmpty().withMessage("Selecciona la ubicación de la propiedad"),
  body("lat").notEmpty().withMessage("Selecciona la ubicación de la propiedad"),
  body("lng").notEmpty().withMessage("Selecciona la ubicación de la propiedad")]
}