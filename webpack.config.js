import path from "path"

export default {
  mode: "development",
  entry: {
    mapa: "./src/js/mapa.js",
    mostrarMapa: "./src/js/mostrarMapa.js",
    dropzone: "./src/js/dropzone.js",
    mapaInicio: "./src/js/mapaInicio.js",
    cambiarEstado: "./src/js/cambiarEstado.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve('public/js')
  }
}