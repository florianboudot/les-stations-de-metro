var markers = [];
var stations_metro_url = 'metro.geojson';
var map = null;

function rad(x) {
    return x * Math.PI / 180;
}

function find_closest_marker(event) {
    console.log('event', event);
    var lat = event.lngLat.lat;
    var lng = event.lngLat.lng;
    var R = 6371; // radius of earth in km
    var distances = [];
    var closest = -1;

    // loop through all markers
    for (i = 0; i < markers.length; i++) {
        var mlat = markers[i].lat;
        var mlng = markers[i].lng;
        var dLat = rad(mlat - lat);
        var dLong = rad(mlng - lng);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(rad(lat)) * Math.cos(rad(lat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        distances[i] = d;
        if (closest == -1 || d < distances[closest]) {
            closest = i;
        }
    }

    alert(markers[closest].label);
}

var storeMarkers = function (element) {
    markers.push(
        {
            lat: element.geometry.coordinates[1],
            lng: element.geometry.coordinates[0],
            label: element.properties.label
        }
    );
};

var addMarkers = function (data) {
    // gather all useful data for markers
    data.features.forEach(storeMarkers);

    map.addSource("markers", {
        "type": "geojson",
        "data": data
    });

    // todo: station must be html icon (to be hidden or visible with css)
    map.addLayer({
        "id": "markers",
        "type": "circle",
        "source": "markers",
        "paint": {
            //"text-color": "#ffffff"
            // make circles larger as the user zooms from z12 to z22
            'circle-radius': {
                'base': 1.75,
                'stops': [[5, 2], [12, 7], [22, 180]]
            },
            'circle-color': {
                property: 'color',
                type: 'categorical',
                stops: [
                    ["connection", '#FFFFFF'],
                    ["M1", '#FFCD00'],
                    ["M2", '#003CA6'],
                    ["M3", '#837902'],
                    ["M3b", '#6EC4E8'],
                    ["M4", '#CF009E'],
                    ["M5", '#FF7E2E'],
                    ["M6", '#6ECA97'],
                    ["M7", '#FA9ABA'],
                    ["M7b", '#6ECA97'],
                    ["M8", '#E19BDF'],
                    ["M9", '#B6BD00'],
                    ["M10", '#C9910D'],
                    ["M11", '#704B1C'],
                    ["M12", '#007852'],
                    ["M13", '#6EC4E8'],
                    ["M14", '#62259D']
                ]
            }
        },
        "layout": {
            //"text-field": "{label}", // show station name
            //"text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            //"text-offset": [0, 0.6],
            //"text-anchor": "top"
        }
    });

    // export for debug
    window._map = map;
};

var loadMetroStations = function () {
    // load json<
    $.ajax({
        url: stations_metro_url,
        dataType: "json"
    }).done(addMarkers);

    map.on('click', find_closest_marker);
};


// on page load
$(window).on('load', function () {

    mapboxgl.accessToken = 'pk.eyJ1Ijoia2F6ZXMiLCJhIjoiMjBiMDc0M2UzYTdkY2NjZDZjZDVhZDdjYWMxMWU4NGMifQ.UbQyYB-QiEQklqy7AXI4XA';

    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/kazes/cippyzs87004qdmm8k67m0nuu',
        center: [2.3797151089356134, 48.88486112278673],
        zoom: 15
    });

    map.style.on('load', loadMetroStations);
});