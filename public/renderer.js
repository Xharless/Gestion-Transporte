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
            // Traza la ruta automáticamente y muestra los íconos
            calculateRoute();
            document.getElementById('vehicleIcons').style.display = 'flex';
        }
    });
}


function calculateRoute() {
    if (!startLocation || !endLocation) return;

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
                displayRouteInfo(route);
            } else {
                alert('No se pudo calcular la ruta: ' + status);
            }
        }
    );
}
function displayRouteInfo(route) {
    // Verificar si existe un contenedor para mostrar resultados
    const outputContainer = document.getElementById('output');
    if (!outputContainer) {
        console.error('No se encontró el contenedor para mostrar los resultados.');
        return;
    }

    

    const distance = route.distance.value / 1000; // Distancia en kilómetros
    

    // Definir las velocidades promedio 
    let averageSpeed;
    if(selectedVehicle === 'auto'){
        averageSpeed = 100;
    } else if (selectedVehicle ==='camion'){
        averageSpeed = 80;
    }

    const durationMinutes = (distance / averageSpeed) * 60; // Duración total en minutos


    // Calcular la duración ajustada según la velocidad del vehículo
    const hours = Math.floor(durationMinutes/60); // Duración ajustada en horas
    const minutes = Math.round(durationMinutes%60); // minutos restantes 
    
    
    // Calcular consumo de combustible
    const fuelConsumption = selectedVehicle === 'auto' ? 10 : 35; // Litros cada 100 km (promedio de ellos)
    const fuelUsed = (distance / 100) * fuelConsumption; // Combustible total usado

    // Crear la salida de datos
    let outputHTML = `
        <h3>Información de la ruta</h3>
        <p><strong>Distancia:</strong> ${distance.toFixed(2)} km</p>`;
    if(hours > 0){
        outputHTML += `<p><strong>Duración:</strong> ${hours} horas ${minutes} minutos</p>`;
    } else {
        outputHTML += `<p><strong>Duración:</strong> ${minutes} minutos</p>`;
    }

    outputHTML += `<p><strong>Combustible estimado:</strong> ${fuelUsed.toFixed(2)} litros</p>`;

    // Actualizar el contenido del contenedor
    outputContainer.innerHTML = outputHTML;

    // Mostrar el contenedor si está oculto (opcional)
    outputContainer.style.display = 'block';
}

function selectVehicle(vehicle) {
    selectedVehicle = vehicle;
    calculateRoute();
}


// Cargar el script de Google Maps dinámicamente
const script = document.createElement('script');
script.src = `/maps-api?callback=iniciarMap&libraries=places`;  // Cargar desde el servidor
script.async = true;
script.defer = true;
document.head.appendChild(script);
