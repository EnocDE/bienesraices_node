(function () {
  const lat = document.querySelector("#lat").textContent
  const lng = document.querySelector("#lng").textContent
  const street = document.querySelector("#calle").textContent
  const mapa = L.map('mapa').setView([lat, lng], 15);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
  }).addTo(mapa);
  
  L.marker([lat, lng]).addTo(mapa).bindPopup(street)
  
})()