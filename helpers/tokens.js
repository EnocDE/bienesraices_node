import jwt from "jsonwebtoken"
import "dotenv/config"

export const generarToken = () => Math.random().toString(32).substring(2) + Date.now().toString(32)

export const generarJWT = datos => jwt.sign(datos, process.env.JWT_SECRET, { expiresIn: "5h" })