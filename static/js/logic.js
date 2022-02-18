//get data
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//create layer groups to build later
var earthquake = L.layerGroup();

// Create the tile layer that will be the background of our map.
var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Create a baseMaps object.
var baseMaps = {
  "Street Map": streetmap,
};

// Create an overlays object to add to the layer control
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers:[streetmap, earthquake]
  });

 // Pass our map layers to our layer control.
// Add the layer control to the map.
L.control.layers(baseMaps, overlays, {
  collapsed: false
}).addTo(myMap); 

// Create an overlay object.
var overlays = {
  "Earthquake": earthquake,
};

// Create a legend to display information about our map.
var legend = L.control({
  position: "bottomright"
});

d3.json(url).then(function(data) {
    function earthquake_color(depth) {
        switch (true) {
            case depth > 90:
              return "red";
            case depth > 70:
              return "orangered";
            case depth > 50:
              return "orange";
            case depth > 30:
              return "gold";
            case depth > 10:
              return "yellow";
            default:
              return "green";
        }
    };
    function earthquake_size(magnitude) {
        return magnitude * 3;
    };

    function styleInfo(feature) {
      return {
        stroke: true,
        fillOpacity: 0.75,
        color: earthquake_color(feature.geometry.coordinates[2]),
        fillColor: earthquake_color(feature.geometry.coordinates[2]),
        radius: earthquake_size(feature.properties.mag)
      }
    }

    L.geoJSON(data, {
        pointToLayer: function(feature, lat_long) {
            return L.circleMarker(lat_long);
        },
          style: styleInfo,
        onEachFeature: function(feature, layer) {
            layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
        }
    }).addTo(earthquake);
    earthquake.addTo(myMap)
  })

    // Create a legend to display information about our map.
    var legend = L.control({
        position: "bottomright"
    });
    // When the layer control is added, insert a div with the class of "legend".
    legend.onAdd = function(map) {
        var div = L.DomUtil.create("div", "info legend");
        var intensity =[-10,10,30,50,70,90];
        var colors =["green","yellow","gold","orange","orangered","red"];

        for (var i = 0; i < intensity.length; i++) {
            div.innerHTML +=
                "<i style='background: " + colors[i] + "'></i> " +
                intensity[i] + (intensity[i + 1] ? "&ndash;" + intensity[i + 1] + "<br>" : "+");
        }
        console.log(div)
        return div;
    };
legend.addTo(myMap);
