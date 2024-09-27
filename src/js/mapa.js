(function () {
  const lat = document.querySelector("#lat").value || 18.8290118
  const lng = document.querySelector("#lng").value || -98.9432244
  const map = L.map('mapa').setView([lat, lng], 14);
  let marker;

  const geocodeService = L.esri.Geocoding.geocodeService()

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
  }).addTo(map);

  marker = new L.marker([lat, lng], {
    draggable: true,
    autoPan: true,
  }).addTo(map);


  marker.on("moveend", (e) => {
    marker = e.target
    const posicion = marker.getLatLng()
    map.panTo(new L.LatLng(posicion?.lat, posicion?.lng))
    geocodeService.reverse().latlng(posicion, 13).run(function(error, result){
      marker.bindPopup(result?.address?.LongLabel)
      document.querySelector(".calle").textContent = result?.address?.Address ?? ""
      document.querySelector("#calle").value = result?.address?.Address ?? ""
      document.querySelector("#lat").value = result?.latlng?.lat ?? ""
      document.querySelector("#lng").value = result?.latlng?.lng ?? ""
    })
    
  })
  
})()