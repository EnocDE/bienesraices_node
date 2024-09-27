(function () {
  const cambiarEstadoBotones = document.querySelectorAll(".cambiar-estado")
  const token = document.querySelector("meta[name='csrf-token']").getAttribute("content")

  cambiarEstadoBotones.forEach(boton => boton.addEventListener("click", cambiarEstado))

  async function cambiarEstado(e) {
    const { propiedadId: id } = e?.currentTarget?.dataset
    const url = `/propiedades/${id}`
    try {
      const response = await fetch(url, {
        method: "PUT", 
        body: {
          published: true
        },
        headers: {
          "CSRF-Token": token
        }
      })

      const { respuesta } = await response.json()
      if (respuesta) {
        if (e.target.classList.contains("bg-red-500")) {
          e.target.classList.remove('bg-red-500', 'hover:bg-red-600')
          e.target.classList.add('bg-green-500', 'hover:bg-green-600')
          e.target.textContent = "Publicado"
        } else {
          e.target.classList.remove('bg-green-500', 'hover:bg-green-600')
          e.target.classList.add('bg-red-500', 'hover:bg-red-600')
          e.target.textContent = "No publicado"
        } 
      }
    }
    catch (error) {
      console.log(error);
    }
  }
})()