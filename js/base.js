/*

 * "Les stations de métro" : mini game to find and locate metro stations of Paris
 * author : florian.boudot@gmail.com
 * Date : november 2016
 *
 * */


// data urls
var stations_metro_url = 'stations.geojson';
var lines_url = 'lines.geojson';

// the map
var map = null;
var mapbox_token = 'pk.eyJ1Ijoia2F6ZXMiLCJhIjoiMjBiMDc0M2UzYTdkY2NjZDZjZDVhZDdjYWMxMWU4NGMifQ.UbQyYB-QiEQklqy7AXI4XA';
var map_style_url = 'mapbox://styles/kazes/cippyzs87004qdmm8k67m0nuu';
var map_center = [2.3626665182515296, 48.8620380668425];
var map_zoom = 12;
var map_id = 'map';

// vars

var $form = $('.station-form');
var stations = [];
var station_to_match = '';
var line_color = {
    "M1": '#FFCD00',
    "M2": '#003CA6',
    "M3": '#837902',
    "M3b": '#6EC4E8',
    "M4": '#CF009E',
    "M5": '#FF7E2E',
    "M6": '#6ECA97',
    "M7": '#FA9ABA',
    "M7b": '#6ECA97',
    "M8": '#E19BDF',
    "M9": '#B6BD00',
    "M10": '#C9910D',
    "M11": '#704B1C',
    "M12": '#007852',
    "M13": '#6EC4E8',
    "M14": '#62259D'
};

/**
 *
 * @param x
 * @returns {number}
 */
function rad(x) {
    return x * Math.PI / 180;
}

/**
 * Find the closest marker
 * @param click_event
 */
function find_closest_marker(click_event) {
    var lat = click_event.lngLat.lat;
    var lng = click_event.lngLat.lng;
    var R = 6371; // radius of earth in km
    var distances = [];
    var closest = -1;

    // loop through all stations
    for (i = 0; i < stations.length; i++) {
        var mlat = stations[i].lat;
        var mlng = stations[i].lng;
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

    return closest;

}


/**
 * store cleaned metro stations data
 * @param element
 */
var storeMarkers = function (element) {
    stations.push(
        {
            label: element.properties.label,
            lat: element.geometry.coordinates[1],
            lng: element.geometry.coordinates[0]
        }
    );
};


/**
 * place metro stations on the map
 * @param data
 */
var addStations = function (data) {
    // gather all useful data for stations
    data.features.forEach(storeMarkers);

    // all stations
    map.addSource("stations", {
        "type": "geojson",
        "data": data
    });

    // all stations
    map.addLayer({
        "id": "stations",
        "type": "circle",
        "source": "stations",
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
                    ["M1", line_color["M1"]],
                    ["M2", line_color["M2"]],
                    ["M3", line_color["M3"]],
                    ["M3b", line_color["M3b"]],
                    ["M4", line_color["M4"]],
                    ["M5", line_color["M5"]],
                    ["M6", line_color["M6"]],
                    ["M7", line_color["M7"]],
                    ["M7b", line_color["M7b"]],
                    ["M8", line_color["M8"]],
                    ["M9", line_color["M9"]],
                    ["M10", line_color["M10"]],
                    ["M11", line_color["M11"]],
                    ["M12", line_color["M12"]],
                    ["M13", line_color["M13"]],
                    ["M14", line_color["M14"]]
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

var filterGroup = document.getElementById('filter-group');
var addLines = function (lines) {
    map.addSource("lines", {
        "type": "geojson",
        "data": lines
    });

    // https://www.mapbox.com/mapbox-gl-js/example/filter-markers/
    lines.features.forEach(function (feature) {
        var name = feature.properties['name'];
        var layerID = 'line-' + name;
        console.log('layerID', layerID);
        // Add a layer for this symbol type if it hasn't been added already.
        if (!map.getLayer(layerID)) {
            map.addLayer({
                "id": layerID,
                "type": "line",
                "source": "lines",
                "paint": {
                    "line-color": line_color[name],
                    "line-width":{
                        'base': 1.75,
                        'stops': [[5, 2], [13, 7], [22, 180]]
                    }
                },
                "filter": ["==", "name", name]
            });

            // Add checkbox and label elements for the layer.
            var input = document.createElement('input');
            input.type = 'checkbox';
            input.id = layerID;
            input.checked = true;
            filterGroup.appendChild(input);

            var label = document.createElement('label');
            label.setAttribute('for', layerID);
            label.textContent = name;
            filterGroup.appendChild(label);

            // When the checkbox changes, update the visibility of the layer.
            input.addEventListener('change', function (e) {
                map.setLayoutProperty(layerID, 'visibility',
                    e.target.checked ? 'visible' : 'none');
            });
        }
    });

};

var loadMetroStations = function () {
    // load metro stations
    $.ajax({
        url: stations_metro_url,
        dataType: "json"
    }).done(addStations);

    // load lines
    /*$.ajax({
        url: lines_url,
        dataType: "json"
    }).done(addLines);
   */
    map.on('click', function (e) {
        var closest = find_closest_marker(e);
        var label = stations[closest].label;

        console.log('to match',label);

        station_to_match = label;

        $form.addClass('active');

    });
};


// on page load
$(window).on('load', function () {
    mapboxgl.accessToken = mapbox_token;
    map = new mapboxgl.Map({
        container: map_id,
        style: map_style_url,
        center: map_center,
        zoom: map_zoom
    });

    map.style.on('load', loadMetroStations);

    $form.on('submit', function (e) {
        e.preventDefault(); // do not submit


        var input_val = $(this).find('input').val();
        console.log('input', input_val, input_val.toLowerCase() === station_to_match.toLowerCase());
    })
});