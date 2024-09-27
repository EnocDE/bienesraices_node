import cookieParser from "cookie-parser"
import csurf from "csurf"
import "dotenv/config"
import express from "express"
import { db } from "./config/db.js"
import appRoutes from "./routes/appRoutes.js"
import propiedadesRoutes from "./routes/propiedadesRoutes.js"
import usuarioRoutes from "./routes/usuarioRoutes.js"
import apiRoutes from "./routes/apiRoutes.js"

const app = express()
const port = process.env.PORT || 3000

// Habilitar lectura de datos
app.use(express.urlencoded({ extended: true }))

// Habilitar cookie parser
app.use(cookieParser())

// Habilitar CSRF
app.use(csurf({ cookie: true }))

// Conexión a la bdd
try {
  await db.authenticate()
  db.sync()
  console.log("Conexión exitosa a la base de datos");
} catch (error) {
  console.log(error);
}

// Configuracion de templates
app.set("view engine", "pug")
app.set("views", "./views")

// Configuracion de archivos publicos
app.use(express.static("public"))

// Rutas
app.use(appRoutes)
app.use("/auth", usuarioRoutes)
app.use(propiedadesRoutes)
app.use("/api", apiRoutes)

app.get("/prueba", (res) => {
  res.render("auth/confirmar-cuenta")
})

app.listen(port, "192.168.1.64", () => {
  console.log(`Servidor funcionando en el puerto ${port}`);
})