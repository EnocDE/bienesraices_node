import { db } from "../config/db.js"
import { categorias } from "./categorias.js"
import { precios } from "./precios.js"
import { Categoria, Precio, Propiedad, Usuario } from "../models/index.js"
import { usuarios } from "./usuarios.js"
import { propiedades } from "./propiedades.js"

const importarDatos = async () => {
  try {
    await db.authenticate()
    await db.sync()
    await Promise.all([Categoria.bulkCreate(categorias), Precio.bulkCreate(precios), Usuario.bulkCreate(usuarios), Propiedad.bulkCreate(propiedades)])
    process.exit()
  } catch (error) {
    console.log(error);
    process.exit(1)
  }
}

const eliminarDatos = async () => {
  try {
     
      await db.sync({force:true}) 
     
    process.exit()
  } catch (error) {
    console.log(error);
    process.exit(1)
  }
}

if (process.argv[2] === "-i") {
  importarDatos()
}

if (process.argv[2] === "-e") {
  eliminarDatos()
}

