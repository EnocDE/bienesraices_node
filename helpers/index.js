export const esVendedor = (usuarioId, propiedadUsuarioId) => {
  return usuarioId == propiedadUsuarioId
}

export const formatearFecha = (fecha) => {
  const opciones = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
  return new Date(fecha).toLocaleDateString('es-MX', opciones)
}