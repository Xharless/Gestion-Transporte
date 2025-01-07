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
    const coord = { lat: -34.4780272, lng: -71.4809727 };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: coord,
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
script.src = `https://maps.googleapis.com/maps/api/js?key=TU_API_KEY&callback=iniciarMap`;
script.async = true;
script.defer = true;
document.head.appendChild(script);
