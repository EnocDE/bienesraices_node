import { validationResult } from "express-validator"
import { unlink } from "node:fs/promises"
import { Op } from "sequelize"
import { esVendedor, formatearFecha } from "../helpers/index.js"
import { Categoria, Precio, Propiedad, Usuario } from "../models/index.js"
import { Mensaje } from "../models/Mensaje.js"

export const admin = async (req, res) => {
  const { pagina: paginaActual } = req.query
  const limit = 6
  const offset = (+paginaActual * limit) - limit

  const exp = /^[0-9]$/
  if (!exp.test(paginaActual)) return res.redirect("/mis-propiedades?pagina=1")

  try {
    const { id } = req.usuario

    const total = await Propiedad.count({
      where: {
        usuarioId: id
      }
    })

    if (+paginaActual < 1) return res.redirect("/mis-propiedades?pagina=1")

    const propiedades = await Propiedad.findAll(
      {
        offset,
        limit: limit,
        where: {
          usuarioId: id
        },
        include: [
          { model: Categoria },
          { model: Precio },
          { model: Mensaje }
        ],
      })

    if (+paginaActual != 1 && !propiedades || +paginaActual != 1 && +paginaActual > Math.ceil(total / limit)) return res.redirect("/mis-propiedades?pagina=1")

    return res.render("propiedades/admin", {
      pagina: "Mis propiedades",
      propiedades,
      csrfToken: req.csrfToken(),
      paginaActual,
      paginas: Math.ceil(total / limit),
      total,
      offset,
      limit
    })
  } catch (error) {
    console.log(error);

  }
}

export const crear = async (req, res) => {
  const [precios, categorias] = await Promise.all([Precio.findAll(), Categoria.findAll()])

  return res.render("propiedades/crear", {
    pagina: "Crear propiedad",
    csrfToken: req.csrfToken(),
    precios,
    categorias,
  })
}

export const guardar = async (req, res) => {
  const { nombre, descripcion, categoria, precio, habitaciones, estacionamientos, wc, calle, lat, lng } = req.body

  const resultado = validationResult(req)

  if (!resultado.isEmpty()) {
    const [precios, categorias] = await Promise.all([Precio.findAll(), Categoria.findAll()])

    return res.render("propiedades/crear", {
      pagina: "Crear propiedad",
      csrfToken: req.csrfToken(),
      precios,
      categorias,
      errores: resultado.array(),
      nombre,
      descripcion: descripcion.trim(),
      categoria,
      precio,
      habitaciones,
      estacionamientos,
      wc,
      calle,
      lat,
      lng
    })
  }

  try {
    const propiedadGuardada = await Propiedad.create({
      nombre,
      descripcion: descripcion.trim(),
      habitaciones,
      estacionamientos,
      wc,
      calle,
      lat,
      lng,
      categoriaId: categoria,
      precioId: precio,
      usuarioId: req?.usuario?.id,
      imagen: ''
    })
    const { id } = propiedadGuardada
    res.redirect(`/propiedades/agregar-imagen/${id}`)
  } catch (error) {
    console.log(error);
  }
}

export const agregarImagen = async (req, res) => {
  const { id } = req.params

  const propiedad = await Propiedad.findByPk(id)

  if (!propiedad) return res.redirect("/mis-propiedades")
  if (propiedad.publicado) return res.redirect("/mis-propiedades")
  if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) return res.redirect("/mis-propiedades")

  res.render("propiedades/agregar-imagen", {
    pagina: "Agregar imagen",
    propiedad,
    csrfToken: req.csrfToken(),
  })
}

export const almacenarImagen = async (req, res, next) => {
  const { id } = req.params

  const propiedad = await Propiedad.findByPk(id)

  if (!propiedad) return res.redirect("/mis-propiedades")
  if (propiedad.publicado) return res.redirect("/mis-propiedades")
  if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) return res.redirect("/mis-propiedades")

  try {

    propiedad.imagen = req.file.filename
    propiedad.publicado = true
    await propiedad.save()
    next()
  } catch (error) {
    console.log(error);
  }
}

export const editar = async (req, res) => {
  const { id } = req.params

  const propiedad = await Propiedad.findByPk(id)
  if (!propiedad) return res.redirect("/mis-propiedades")
  if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) return res.redirect("/mis-propiedades")

  const [categorias, precios] = await Promise.all([Categoria.findAll(), Precio.findAll()])

  return res.render("propiedades/editar", {
    pagina: `Editando la propiedad:`,
    propiedad,
    categorias,
    precios,
    csrfToken: req.csrfToken(),
  })
}

export const guardarCambios = async (req, res) => {
  const resultados = validationResult(req)

  if (!resultados.isEmpty()) {
    const { categoria, precio, descripcion } = req.body
    const [categorias, precios] = await Promise.all([Categoria.findAll(), Precio.findAll()])

    return res.render("propiedades/editar", {
      pagina: `Editando la propiedad:`,
      propiedad: { ...req.body, descripcion: descripcion.trim(), categoriaId: categoria, precioId: precio },
      categorias,
      precios,
      errores: resultados.array(),
      csrfToken: req.csrfToken(),
    })
  }

  const { id } = req.params
  const propiedad = await Propiedad.findByPk(id)
  if (!propiedad) return res.redirect("/mis-propiedades")
  if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) return res.redirect("/mis-propiedades")

  const { categoria, precio, descripcion } = req.body
  try {
    propiedad.set({
      ...req.body,
      descripcion: descripcion.trim(),
      categoriaId: categoria,
      precioId: precio
    })
    await propiedad.save()
    return res.redirect("/mis-propiedades")
  } catch (error) {
    console.log(error);
  }
}

export const eliminar = async (req, res) => {
  const propiedad = await Propiedad.findByPk(req.params.id)
  if (!propiedad) return res.redirect("/mis-propiedades")
  if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) return res.redirect("/mis-propiedades")

  try {
    await propiedad.destroy()
    await unlink(`public/uploads/${propiedad.imagen}`)
    return res.redirect("/mis-propiedades")
  } catch (error) {
    console.log(error);
  }
}

export const cambiarEstado = async (req, res) => {
  const { id } = req.params
  const propiedad = await Propiedad.findByPk(id)
  if (!propiedad) return res.redirect("/mis-propiedades")
  if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) return res.redirect("/mis-propiedades")

  try {
    propiedad.publicado = !propiedad.publicado
    await propiedad.save()
    return res.json({ respuesta: true })
  } catch (error) {
    console.log(error);
    return res.json({ respuesta: false })
  }
}

// Mostrar la propiedad
export const mostrarPropiedad = async (req, res) => {
  const { id } = req.params
  const propiedad = await Propiedad.findByPk(id,
    {
      include:
        [
          { model: Precio },
          { model: Categoria }
        ]
    }
  )

  if (!propiedad) return res.redirect("/404")
  if (!propiedad.publicado) return res.redirect("/404")

  const propiedades = await Propiedad.findAll(
    {
      where:
      {
        publicado: true,
        categoriaId:
          propiedad.categoriaId,
        id: {
          [Op.ne]: propiedad.id
        }
      },
    })

  return res.render("propiedades/mostrar", {
    pagina: propiedad.nombre,
    propiedad,
    propiedades,
    csrfToken: req.csrfToken(),
    usuario: req?.usuario,
    vendedor: esVendedor(+req?.usuario?.id, +propiedad.usuarioId)
  })
}

export const enviarMensaje = async (req, res) => {
  const { id } = req.params
  const propiedad = await Propiedad.findByPk(id,
    {
      include:
        [
          { model: Precio },
          { model: Categoria }
        ]
    })

  if (!propiedad) return res.redirect("/404")
  if (!propiedad.publicado) return res.redirect("/404")

  const propiedades = await Propiedad.findAll(
    {
      where:
      {
        publicado: true,
        categoriaId:
          propiedad.categoriaId,
        id: {
          [Op.ne]: propiedad.id
        }
      },
    })

  const resultado = validationResult(req)

  if (!resultado.isEmpty()) {
    return res.render("propiedades/mostrar", {
      pagina: propiedad.nombre,
      propiedad,
      propiedades,
      csrfToken: req.csrfToken(),
      usuario: req.usuario,
      vendedor: esVendedor(+req?.usuario?.id, +propiedad.usuarioId),
      errores: resultado.array(),
      mensaje: req?.body?.mensaje
    })
  }

  try {
    await Mensaje.create({
      mensaje: req?.body?.mensaje,
      propiedadId: req.params.id,
      usuarioId: req.usuario.id
    })
    return res.render("propiedades/mostrar", {
      pagina: propiedad.nombre,
      propiedad,
      propiedades,
      csrfToken: req.csrfToken(),
      usuario: req.usuario,
      vendedor: esVendedor(+req?.usuario?.id, +propiedad.usuarioId),
      errores: resultado.array(),
      enviado: true
    })
  } catch (error) {
    console.log(error);
  }
}

export const verMensajes = async (req, res) => {
  const { id } = req.params

  const propiedad = await Propiedad.findByPk(id, {
    include: [
      {
        model: Mensaje,
        include: [
          { model: Usuario.scope("eliminarPassword") }
        ]
      }
    ],
  })

  if (!propiedad) return res.redirect("/mis-propiedades")
  if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) return res.redirect("/mis-propiedades")


  return res.render("propiedades/mensajes", {
    pagina: "Mensajes",
    propiedadTitulo: propiedad.nombre,
    mensajes: propiedad.mensajes,
    formatearFecha
  })
}