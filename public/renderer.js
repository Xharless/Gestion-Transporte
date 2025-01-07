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
    //intentar obtener la ubicacion de la persona para centrar el mapa
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(
            (position)=>{
                const userLocation ={
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                console.log('Ubicación obtenida:');
                console.log(`Latitud: ${position.coords.latitude}, Longitud: ${position.coords.longitude}`);
                console.log(`Precisión: ${position.coords.accuracy} metros`);
                map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 15,
                    center: userLocation
                });
                
                directionsService = new google.maps.DirectionsService();
                directionsRenderer = new google.maps.DirectionsRenderer();
                directionsRenderer.setMap(map);

                // Agregar un marcador en la ubicación del usuario
                new google.maps.Marker({
                    position: userLocation,
                    map: map,
                    label: 'Tú'
                });
            }, 
            (error) =>{
                alert("No se pudo obtener la ubicacion.");
            },
            {
                enableHighAccuracy: true, // Mejorar la precisión
                timeout: 5000, // Tiempo de espera de 5 segundos
                maximumAge: 0 // No usar ubicación almacenada en caché
            }
        );
    } else {
        alert("Geolocalización no soportada por este navegador.");
    }


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
script.src = `/maps-api?callback=iniciarMap`;  // Cargar desde el servidor
script.async = true;
script.defer = true;
document.head.appendChild(script);