import { Op } from "sequelize"
import { Categoria, Precio, Propiedad } from "../models/index.js"

export const inicio = async (req, res) => {

  const [categorias, precios, casas, departamentos] = await Promise.all([
    Categoria.findAll({ raw: true }),
    Precio.findAll({ raw: true }),
    Propiedad.findAll({
      limit: 3,
      where: {
        categoriaId: 1,
        publicado: true
      },
      include: [
        {
          model: Precio
        }
      ],
      order: [
        ["createdAt", "DESC"]
      ]
    }),
    Propiedad.findAll({
      limit: 3,
      where: {
        categoriaId: 2,
        publicado: true
      },
      include: [
        {
          model: Precio
        }
      ],
      order: [
        ["createdAt", "DESC"]
      ]
    })
  ])

  return res.render("inicio", {
    pagina: "Inicio",
    categorias,
    precios,
    casas,
    departamentos,
    csrfToken: req.csrfToken()
  })
}

export const categoria = async (req, res) => {
  const { id } = req.params

  const categoria = await Categoria.findByPk(id)

  if (!categoria) return res.redirect("/404")

  const propiedades = await Propiedad.findAll({
    where: {
      categoriaId: id,
      publicado: true
    },
    include: [
      { model: Precio },
      { model: Categoria },
    ],
  })

  return res.render("categoria", {
    pagina: `${categoria.nombre}s`,
    propiedades,
    csrfToken: req.csrfToken()
  })
}

export const noEncontrado = (req, res) => {
  return res.render("404", {
    pagina: "Página no encontrada",
    csrfToken: req.csrfToken()
  })
}

export const buscador = async (req, res) => {
  const { busqueda } = req.body

  if (!busqueda.trim()) return res.redirect('back')

  const propiedades = await Propiedad.findAll({
    where: {
      nombre: {
        [Op.like]: '%' + busqueda + '%'
      },
      publicado: true
    },
    include: [
      { model: Precio }
    ]
  })



  return res.render("busqueda", {
    pagina: "Resultados para la busqueda",
    busqueda,
    propiedades,
    csrfToken: req.csrfToken()
  })
} 