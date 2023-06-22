// make leaflet map
var map = L.map('map').setView([0, 0], 2);

// put the OpenStreetMap tile layer onto the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  maxZoom: 18
}).addTo(map);

// use Fetch to get the earthquake data
var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
fetch(url)
  .then(response => response.json())
  .then(data => {
    
    // make a loop to go through the features of the data
    data.features.forEach(feature => {
      var magnitude = feature.properties.mag;
      var depth = feature.geometry.coordinates[2];
      var coordinates = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
      var place = feature.properties.place;

      // Putting circle marker for earthquakes, with size and color based on magnitude and depth
      var marker = L.circleMarker(coordinates, {
        radius: magnitude * 2,
        fillColor: getColor(depth),
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7
      }).addTo(map);

      // Popup with more info when clicking marker 
      marker.bindPopup('<b>Magnitude:</b> ' + magnitude + '<br><b>Depth:</b> ' + depth + ' km<br><b>Place:</b> ' + place);
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });

// Function to determine the color based on the depth of the earthquake
function getColor(depth) {
  if (depth < 10) {
    return '#00ff00'; // green
  } else if (depth < 30) {
    return '#ffff00'; // yellow
  } else {
    return '#ff0000'; // red
  }
}
