document.addEventListener('DOMContentLoaded', () => {
    console.log("Aplicación cargada y lista.");
});

let map;
let directionsService;
let directionsRenderer;
let startMarker;
let searchBox;
let endMarker;
let startLocation;
let endLocation;

function iniciarMap() {
    // Establecer una ubicación fija en lugar de usar geolocalización
    const userLocation = {
        lat: -34.4803521,
        lng: -71.4790298
    };
    
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: userLocation
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    
    
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
        }
    });
    // Crear el cuadro de búsqueda
    searchBox = new google.maps.places.Autocomplete(document.getElementById('searchBox'), {
        types: ['geocode'], // Solo resultados de direcciones
    });

    searchBox.addListener('place_changed', () => {
        const place = searchBox.getPlace();
        if (place.geometry) {
            // Centrar el mapa en la ubicación seleccionada
            map.setCenter(place.geometry.location);
            map.setZoom(15);

            // Colocar un marcador en la ubicación seleccionada
            if (startMarker) {
                startMarker.setMap(null); // Eliminar marcador anterior si existe
            }
            startMarker = new google.maps.Marker({
                position: place.geometry.location,
                map: map,
                label: 'A',
            });

            // Guardar la ubicación como punto de inicio
            startLocation = place.geometry.location;
        } else {
            alert('No se pudo obtener los detalles de la ubicación.');
        }
    });
}

function calculateRoute() {
    const vehicle = document.getElementById('vehicle').value;

    if (!startLocation || !endLocation) {
        alert('Please select both start and end locations on the map.');
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
                const distance = route.distance.value / 1000; // distance in km
                const duration = route.duration.value / 3600; // duration in hours

                let fuelConsumption;
                switch (vehicle) {
                    case 'auto':
                        fuelConsumption = 8; // average fuel consumption in liters per 100 km
                        break;
                    case 'camion':
                        fuelConsumption = 15;
                        break;
                    default:
                        fuelConsumption = 8;
                }

                const averageSpeed = distance / duration; // km/h
                const fuelUsed = (distance / 100) * fuelConsumption; // total fuel used in liters
                const output = `Distance: ${distance.toFixed(2)} km<br>Duration: ${duration.toFixed(
                    2
                )} hours<br>Average Speed: ${averageSpeed.toFixed(
                    2
                )} km/h<br>Fuel Used: ${fuelUsed.toFixed(2)} liters`;
                document.getElementById('output').innerHTML = output;
            } else {
                alert('Directions request failed due to ' + status);
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
