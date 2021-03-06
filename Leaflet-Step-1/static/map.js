// map.js-- ran by index.html

// create function to set magnitude of earthquakes
function setSize(mag) {
    return mag * 3;
}

// create function to set depth color
function setColor(depth) {
    if (depth < 10) {return "#85FF33";}
    if (depth >= 10 && depth < 30) {return "yellow";}
    if (depth >= 30 && depth < 50) {return "#FFEC33";}
    if (depth >= 50 && depth < 70) {return "#FFB733";}
    if (depth >= 70 && depth < 90) {return "#FF8E33";}
    if (depth >= 90) {return "red";}
}




// create promise to earthquake data via d3.json
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(data => {
    console.log(data.features);
    var myMap = L.map("map", {
        center: [37.0902, -95.7129],
        zoom: 4
    });
      
      
      // Adding a tile layer (the background map image) to our map
      L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/light-v10",
        accessToken: API_KEY
      }).addTo(myMap);

    //loop through features and create earthquake markers
    data.features.forEach(feature => {
        L.circleMarker([feature.geometry.coordinates[1],feature.geometry.coordinates[0]], {
            stroke: true,
            weight: .5,
            fillOpacity: 0.75,
            color : "black",
            fillColor: setColor(feature.geometry.coordinates[2]),
            radius: setSize(feature.properties.mag)
        }).bindPopup("<h2>Magnitude: " + feature.properties.mag + "</h2><h2>Depth: " + feature.geometry.coordinates[2].toFixed(2) + "</h2>").addTo(myMap);
    });    

    // create legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var limits = ["-10-10", "10-30", "30-50", "50-70", "70-90", "90+"];
        var colors = [ "#85FF33", "yellow",  "#FFEC33", "#FFB733", "#FF8E33", "red" ];
        var labels = [];

        // Add min & max
        var legendInfo = 
        "<div class=\"labels\">Depth (m)" +
        "</div>";

        div.innerHTML = legendInfo;

        limits.forEach(function(limit, index) {
        labels.push("<li style=\"background-color: " + colors[index] + "\">" + limit + "</li>");
        });

        div.innerHTML += '<ul">' + labels.join("") + "</ul>";
        return div;
    };
    legend.addTo(myMap);
})