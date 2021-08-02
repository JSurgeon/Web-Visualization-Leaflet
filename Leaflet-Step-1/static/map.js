// map.js-- ran by index.html

// create function to set magnitude of earthquakes
function setSize(mag) {
    return mag * 3;
}

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
      // We use the addTo method to add objects to our map
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
       // console.log(feature.properties.mag);
        L.circleMarker([feature.geometry.coordinates[1],feature.geometry.coordinates[0]], {
            stroke: false,
            fillOpacity: 0.75,
            color: setColor(feature.geometry.coordinates[2]),
            radius: setSize(feature.properties.mag)
        }).bindPopup("<h1>" + feature.geometry.coordinates[2] + "</h1>").addTo(myMap);
    });    
})