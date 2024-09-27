import { Dropzone } from "dropzone"

const token = document.querySelector("meta[name='csrf-token']").getAttribute("content")
const MAX_FILES = 1
console.log(token);

Dropzone.options.image = {
  maxFilesize: 5,
  maxFiles: MAX_FILES,
  parallelUploads: MAX_FILES,
  autoProcessQueue: false,
  addRemoveLinks: true,
  acceptFiles: ".png,.jpg,.jpeg",
  dictRemoveFile: "Borrar imagen",
  dictDefaultMessage: "Suelta tus imagenes aquí",
  dictMaxFilesExceeded: `No puedes subir mas de ${MAX_FILES} ${MAX_FILES > 1 ? "imagenes" : "imagen"}`,
  headers: {
    'CSRF-Token': token
  },
  // Name del dropzone
  paramName: 'image',
  init: function () {
    const dropzone = this
    const publicar = document.querySelector("#publicar")

    publicar.addEventListener("click", function () {
      dropzone.processQueue()
    })

    dropzone.on('queuecomplete', function () {
      if (dropzone.getActiveFiles().length === 0) {
        window.location.href = "/mis-propiedades"
      }
    })
  }
}

