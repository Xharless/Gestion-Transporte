document.addEventListener('DOMContentLoaded', () => {
    console.log("Aplicación cargada y lista.");
});

let map;
let directionsService;
let directionsRenderer;
let startMarker;
let endMarker;
let startLocation;
let endLocation;

function iniciarMap() {
    // Configuración inicial del mapa
    const userLocation = { lat: -34.4803521, lng: -71.4790298 };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: userLocation,
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    // Crear el cuadro de búsqueda
    const searchBox = new google.maps.places.Autocomplete(
        document.getElementById('searchBox')
    );

    searchBox.addListener('place_changed', () => {
        const place = searchBox.getPlace();
        if (place.geometry) {
            map.setCenter(place.geometry.location);
            map.setZoom(15);

            if (!startLocation) {
                // Agregar marcador para punto A
                startLocation = place.geometry.location;
                startMarker = new google.maps.Marker({
                    position: startLocation,
                    map: map,
                    label: 'A',
                });
            } else if (!endLocation) {
                // Agregar marcador para punto B
                endLocation = place.geometry.location;
                endMarker = new google.maps.Marker({
                    position: endLocation,
                    map: map,
                    label: 'B',
                });

                // Mostrar controles para calcular la ruta
                document.getElementById('controls').style.display = 'block';
            }
        }
    });

    // Seleccionar puntos en el mapa
    map.addListener('click', (event) => {
        if (!startLocation) {
            startLocation = event.latLng;
            startMarker = new google.maps.Marker({
                position: startLocation,
                map: map,
                label: 'A',
            });
        } else if (!endLocation) {
            endLocation = event.latLng;
            endMarker = new google.maps.Marker({
                position: endLocation,
                map: map,
                label: 'B',
            });

            // Mostrar controles para calcular la ruta
            document.getElementById('controls').style.display = 'block';
        }
    });
}

function calculateRoute() {
    const vehicle = document.getElementById('vehicle').value;

    if (!startLocation || !endLocation) {
        alert('Selecciona ambos puntos para calcular la ruta.');
        return;
    }

    directionsService.route(
        {
            origin: startLocation,
            destination: endLocation,
            travelMode: 'DRIVING',
        },
        (response, status) => {
            if (status === 'OK') {
                directionsRenderer.setDirections(response);
                const route = response.routes[0].legs[0];
                const distance = route.distance.value / 1000; // En km
                const duration = route.duration.value / 3600; // En horas
                const fuelConsumption = vehicle === 'camion' ? 15 : 8; // Litros por cada 100 km
                const fuelUsed = (distance / 100) * fuelConsumption;

                document.getElementById('output').innerHTML = `
                    Distancia: ${distance.toFixed(2)} km<br>
                    Duración: ${duration.toFixed(2)} horas<br>
                    Combustible usado: ${fuelUsed.toFixed(2)} litros
                `;
            } else {
                alert('No se pudo calcular la ruta: ' + status);
            }
        }
    );
}

// Cargar el script de Google Maps dinámicamente
const script = document.createElement('script');
script.src = `/maps-api?callback=iniciarMap&libraries=places`;  // Cargar desde el servidor
script.async = true;
script.defer = true;
document.head.appendChild(script);
