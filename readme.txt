
#Contexto#
- Pagina Web de gestion de transporte echo con Electron. Se utiliza la Api de Google maps para todo el tema de mostrar los mapas y crear rutas. Lo que hace esta pagina Web es que se toman 2 puntos en el mapa y este crea una ruta entre los dos puntos, pero se debe de elegir el tipo de vehiculo con el que se desea hacer la ruta para ver la cantidad de combustible utilizado

# Consideraciones #
- Hay que instalar las independencias de node_modules por lo que hay que hacer "npt install"
- Utilizar propia clave API de Google Maps ya que ésta se encuentra oculta
- Se utiliza el servidor de Render para poder alojar la pagina
- Se asume que el consumo de un auto es de 10 litros cada 100 kilometros y el del camion es de 35 litros
- Se asume que el auto va a viajar a 100 Km/h y el camion viajara a 90 Km/h
- Se recomienda utilizarlo para trayectos lejanos en donde se haga uso de carretera
- La ubicacion la saca con el gps utilizando la api de google
# Link # 
- https://gestion-transporte.onrender.com
# APIS #
- Places API
- Maps JavaScript API
- Directions API
- Geolocation API

