import { Categoria, Precio, Propiedad } from "../models/index.js"

export const propiedades = async (req, res) => {
  const propiedades = await Propiedad.findAll({
    include: [
      { model: Precio },
      { model: Categoria }
    ]
  })
  return res.json(propiedades)
}