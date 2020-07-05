var lat, lon; // latitude and longitude of the current position


navigator.geolocation.getCurrentPosition(function (position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    init();
  });
  
/**
 * @desc Function to initiate everything
 *
 */
function init() {
    locate();
    radiusCircle(radius);
    // hier werden die anderen Methoden aufgerufen
    initVenues(lat, lon);
    initBusstops(lat, lon);
    initBuslines(lat, lon);
  }