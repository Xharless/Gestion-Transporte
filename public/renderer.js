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

function ajustarAlturaMapa() {
    const mapElement = document.getElementById('map');
    mapElement.style.height = `${window.innerHeight}px`;
}

ajustarAlturaMapa();

window.addEventListener('resize', ajustarAlturaMapa);

function iniciarMap() {
    const userLocation = {
        lat: -34.4803521,
        lng: -71.4790298
    };

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: userLocation,
        zoomControl: true,
        mapTypeControl: false,  // Desactivamos el control de tipo de mapa predeterminado
        streetViewControl: true,
        fullscreenControl: false
    });

    // Crear los botones personalizados para cambiar el tipo de mapa
    const mapTypeControlDiv = document.createElement('div');

    //Crea el boton para el mapa
    const mapButton = document.createElement('button');
    const mapImage = document.createElement('img')
    mapImage.src = 'https://img.icons8.com/?size=100&id=343&format=png&color=000000'
    mapImage.alt='Mapa';
    mapImage.style.width = '30px';
    mapButton.appendChild(mapImage);
    mapButton.classList.add('map-control-button');
    mapButton.onclick = () => map.setMapTypeId(google.maps.MapTypeId.ROADMAP);

    //crear el boton para el satelite
    const satelliteButton = document.createElement('button');
    const satelliteImage = document.createElement('img')
    satelliteImage.src = 'https://img.icons8.com/?size=100&id=2236&format=png&color=000000'
    satelliteImage.alt='Satelite';
    satelliteImage.style.width = '30px';
    satelliteButton.appendChild(satelliteImage);
    satelliteButton.classList.add('satellite-control-button');
    satelliteButton.onclick = () => map.setMapTypeId(google.maps.MapTypeId.SATELLITE);

    mapTypeControlDiv.appendChild(mapButton);
    mapTypeControlDiv.appendChild(satelliteButton);
    
    // Establecer los controles en el mapa
    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(mapTypeControlDiv);

    // Crear los demás controles y funcionalidades
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
    
    searchBox = new google.maps.places.Autocomplete(document.getElementById('searchBox'), {
        types: ['geocode'],
    });

    searchBox.addListener('place_changed', () => {
        const place = searchBox.getPlace();
        if (place.geometry) {
            map.setCenter(place.geometry.location);
            map.setZoom(15);
            if (startMarker) {
                startMarker.setMap(null);
            }
            startMarker = new google.maps.Marker({
                position: place.geometry.location,
                map: map,
                label: 'A',
            });
            startLocation = place.geometry.location;
        } else {
            alert('No se pudo obtener los detalles de la ubicación.');
        }
    });

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
        alert('Por favor selecciona ambos puntos en el mapa.');
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
                const distance = route.distance.value / 1000; // Distancia en km
                const duration = route.duration.value // Duración en segundos

                let fuelConsumption;
                switch (vehicle) {
                    case 'auto':
                        fuelConsumption = 8; // Consumo promedio en litros por 100 km
                        break;
                    case 'camion':
                        fuelConsumption = 15;
                        break;
                    default:
                        fuelConsumption = 8;
                }

                 // convertir tiempo
                let displayDuration;
                let minutes = duration / 60;
                if (minutes < 60) {
                    displayDuration = `${Math.round(minutes)} minutes`; // Show minutes if less than 1 hour
                } else {
                    const hours = Math.floor(minutes / 60);
                    const remainingMinutes = Math.round(minutes % 60);
                    displayDuration = `${hours} hours ${remainingMinutes} minutes`; // Show hours and minutes if more than 1 hour
                }


                const averageSpeed = distance / (duration / 3600); // Velocidad promedio en km/h
                const fuelUsed = (distance / 100) * fuelConsumption; // Consumo total en litros

                const outputHTML = `
                    <p><strong>Distancia:</strong> ${distance.toFixed(2)} km</p>
                    <p><strong>Duración:</strong> ${displayDuration}</p>
                    <p><strong>Velocidad promedio:</strong> ${averageSpeed.toFixed(2)} km/h</p>
                    <p><strong>Combustible usado:</strong> ${fuelUsed.toFixed(2)} litros</p>
                `;

                // Mostrar resultados en el contenedor
                document.getElementById('output').innerHTML = outputHTML;
                document.getElementById('output').style.display = 'block';
            } else {
                alert('Error al calcular la ruta: ' + status);
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
