import multer from "multer"
import path from "path"
import { generarToken } from "../helpers/tokens.js"

//* Configuración de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Calling internal', file)
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    if (file) {
      cb(null, generarToken() + path.extname(file.originalname))
    }
  }
})

export const upload = multer({ storage })