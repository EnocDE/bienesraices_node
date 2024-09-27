(async function () {
  const lat = 18.8290
  const lng = -98.9436
  const mapa = L.map("mapa-inicio").setView([lat, lng], 13)

  const categorias = document.querySelector("#categoria")
  const precios = document.querySelector("#precio")

  let markers = L.featureGroup().addTo(mapa)

  let propiedades = []

  const filtros = {
    categoria: '',
    precio: ''
  }

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 17
  }).addTo(mapa);

  categorias.addEventListener("change", (e) => {
    filtros.categoria = +e.currentTarget.value
    filtrarPropiedades()
  })

  precios.addEventListener("change", (e) => {
    filtros.precio = +e.currentTarget.value
    filtrarPropiedades()
  })

  const obtenerPropiedades = async () => {
    try {
      const url = "/api/propiedades"
      const respuesta = await fetch(url)
      if (!respuesta.ok) throw new Error("Error fetching data")
      propiedades = await respuesta.json()
      mostrarPropiedades(propiedades)
    } catch (error) {
      return console.error(error);
    }
  }

  const mostrarPropiedades = (propiedades) => {
    propiedades.forEach(propiedad => {
      const marker = new L.marker([propiedad?.lat, propiedad?.lng], {
        autoPan: true
      }).addTo(mapa).bindPopup(`
          <h1 class="text-xl font-extrabold my-5">${propiedad.title}</h1>
          <div class="overflow-hidden">
            <img class="object-cover h-full w-full" src='/uploads/${propiedad.image}' alt='${propiedad.title}'>
          </div>
          <div class="flex justify-between gap-5 items-center">
            <p class="text-indigo-500 font-bold text-xs">${propiedad.categoria.name}</p>
            <p class="font-bold text-xs">${propiedad.precio.name}</p>
          </div>
          <a href="/propiedad/${propiedad.id}" class="py-3 w-full block bg-blackligth font-bold text-center cursor-pointer" style="color:#fff;">Ver Propiedad</a>
        `)
      markers.addLayer(marker)
    });
  }

  const filtrarPropiedades = () => {
    const resultado = propiedades.filter(propiedad => filtros.categoria ? propiedad.categoria.id == filtros.categoria : propiedad).filter(propiedad => filtros.precio ? propiedad.precio.id == filtros.precio : propiedad)

    markers.clearLayers()
    markers = L.featureGroup().addTo(mapa)
    
    mostrarPropiedades(resultado)
  }

  await obtenerPropiedades()

})()