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


var map_options = {
    container: 'map',
    style: 'mapbox://styles/kazes/cippyzs87004qdmm8k67m0nuu',
    center: [2.3403505392404895, 48.86056993421974],
    zoom: 12,
    maxZoom: 15
};

// vars
var $popin = $('.station-form');
var found_stations = [];
var stations = [];
var station_to_find = '';
var score = 0;
var total = 0;
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
function findClosestMarker(click_event) {
    var lat = click_event.lngLat.lat;
    var lng = click_event.lngLat.lng;
    var R = 6371; // radius of earth in km
    var distances = [];
    var closest = -1;

    // loop through all stations
    for (i = 0; i < stations.length; i++) {
        var mlat = stations[i].lat;
        var is_already_found = found_stations.indexOf(stations[i].label) !== -1;
        if (is_already_found) {
            continue; // skip iteration
        }
        var mlng = stations[i].lng;
        var dLat = rad(mlat - lat);
        var dLong = rad(mlng - lng);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(lat)) * Math.cos(rad(lat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        distances[i] = d;


        if (closest == -1 || d < distances[closest]) {
            closest = i;


        }
    }

    return stations[closest];
}


/**
 * store cleaned metro stations data
 * @param marker
 */
var storeStations = function (marker) {
    stations.push(
        {
            label: marker.properties.label,
            lat: marker.geometry.coordinates[1],
            lng: marker.geometry.coordinates[0]
        }
    );
};


/**
 * place metro stations on the map
 * @param data
 */
var addStations = function (data) {

    // add the GeoJSON above to a new vector tile source
    map.addSource('glow', {type: 'geojson', data: glow});

    map.addLayer({
        "id": "glow-glow",
        "type": "circle",
        "source": "glow",
        "paint": {
            "circle-radius": 40,
            "circle-color": "#fff",
            "circle-opacity": 0.1
        }
    });


    // gather all useful data for stations
    data.features.forEach(storeStations);

    total = stations.length;
    $('.total').html('/ ' + total);

    // all stations
    map.addSource("stations", {
        "type": "geojson",
        "data": data
    });

    map.addLayer({
        "id": "stations-no-colors",
        "type": "circle",
        "source": "stations",
        "paint": {
            // make circles larger as the user zooms from z12 to z22
            'circle-radius': {
                'base': 1.75,
                'stops': [[5, 2], [12, 7], [22, 180]]
            },
            'circle-color': '#000000'
        }
    });
    // todo create function to reveal all

    map.addLayer({
        "id": "stations-labels",
        "type": "symbol",
        "source": "stations",
        "paint": {
            "text-color": "#ffffff"
        },
        "layout": {
            "text-field": "{label}", // show station name
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-offset": [0, 0.6],
            "text-anchor": "top"
        }
        ,
        "filter": ["==", "label", ""] // display none
    });

    // all stations with colors
    map.addLayer({
        "id": "stations-colors",
        "type": "circle",
        "source": "stations",
        "paint": {
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
        "filter": ["==", "label", ""] // display none
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

        // Add a layer for this symbol type if it hasn't been added already.
        if (!map.getLayer(layerID)) {
            map.addLayer({
                "id": layerID,
                "type": "line",
                "source": "lines",
                "paint": {
                    "line-color": line_color[name],
                    "line-width": {
                        'base': 1.75,
                        'stops': [[5, 2], [13, 7], [22, 180]]
                    }
                },
                "filter": ["==", "name", ""]
                //"filter": ["==", "name", name]
            });

            // Add checkbox and label elements for the layer.
            var input = document.createElement('input');
            input.type = 'checkbox';
            input.id = layerID;
            input.checked = false;
            filterGroup.appendChild(input);

            var label = document.createElement('label');
            label.setAttribute('for', layerID);
            label.textContent = name;
            filterGroup.appendChild(label);

            // When the checkbox changes, update the visibility of the layer.
            input.addEventListener('change', function (e) {
                map.setFilter(layerID, ["==", "name", name]);
                map.setLayoutProperty(layerID, 'visibility', e.target.checked ? 'visible' : 'none');
            });
        }
    });

};

var openPopin = function () {
    $popin.find('.clue').html('(' + station_to_find + ')'); // debug mode
    $popin.addClass('active');
    $popin.find('input').focus();
};

var marker_out = {
    lng: 48,
    lat: 2
};

// create a GeoJSON point to serve as a starting glow
var glow = {
    "type": "Point",
    "coordinates": [marker_out.lng, marker_out.lat] // out there
};


function clearGlow() {
    moveGlowTo(marker_out);
}

function moveGlowTo(marker) {
    glow.coordinates[0] = marker.lng;
    glow.coordinates[1] = marker.lat;
    map.getSource('glow').setData(glow);
}

function centerMapTo(marker) {
    map.flyTo({
        center: [marker.lng, marker.lat - 0.005],
        zoom: 14
    });
    /*map.flyTo({
     center: [0, 0],
     zoom: 9,
     speed: 0.2,
     curve: 1,
     easing(t) {
     return t;
     }
     });*/
}

/**
 * load data for stations
 */
var loadStationsData = function () {

    // load lines
    $.ajax({
        url: lines_url,
        dataType: "json"
    }).done(addLines).then(
        function () {

            // load metro stations
            $.ajax({
                url: stations_metro_url,
                dataType: "json"
            }).done(addStations);

        }
    );


};


var closePopin = function () {
    $popin.removeClass('active');
    clearGlow();
    $popin.find('input').val('');
};


var updateScore = function (num) {
    score += num;
    $('.score').html(score);
};

/**
 * Checks if submited name is correct
 * @param e
 */
var validateStation = function (e) {
    e.preventDefault(); // do not submit

    var input_val = $(this).find('input').val();
    var is_name_match = latinize(input_val.toLowerCase()) === latinize(station_to_find.toLowerCase());

    if (is_name_match) {
        // keep station name
        found_stations.push(station_to_find);

        // show station color and name
        map.setFilter("stations-colors", ["in", "label"].concat(found_stations));
        map.setFilter("stations-labels", ["in", "label"].concat(found_stations));

        // hide black dot of this station
        map.setFilter("stations-no-colors", ["!=", "label", station_to_find]);

        updateScore(1);

        closePopin();
    }
    else {
        // show error message
    }
};


var stationGuess = function (e) {
    // find closest station
    var station = findClosestMarker(e);

    // highlight station to find
    moveGlowTo(station);
    centerMapTo(station);
    station_to_find = station.label;

    // ask user about the station
    openPopin();
};

// on page load
$(window).on('load', function () {

    // create map
    mapboxgl.accessToken = mapbox_token;
    map = new mapboxgl.Map(map_options);

    map.on('load', loadStationsData);

    map.on('click', stationGuess);

    $('.js-close-popin').on('click', closePopin);

    $popin.on('submit', validateStation)
});