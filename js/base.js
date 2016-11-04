var markers = [];
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


$(window).on('load', function () {

    mapboxgl.accessToken = 'pk.eyJ1Ijoia2F6ZXMiLCJhIjoiMjBiMDc0M2UzYTdkY2NjZDZjZDVhZDdjYWMxMWU4NGMifQ.UbQyYB-QiEQklqy7AXI4XA';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/kazes/cippyzs87004qdmm8k67m0nuu',
        center: [2.3797151089356134, 48.88486112278673],
        zoom: 15
    });


    map.style.on('load', function () {
        // load json
        $.ajax({
            url: 'metro.geojson',
            dataType: "json"
        }).done(function (data) {
            console.log('data', data);

            data.features.forEach(function (element, index, array) {
                markers.push(
                    {
                        lat: element.geometry.coordinates[1],
                        lng: element.geometry.coordinates[0],
                        label: element.properties.label
                    }
                );
            });


            console.log('markers', markers);
            map.addSource("markers", {
                "type": "geojson",
                "data": data
            });

            map.addLayer({
                "id": "markers",
                "type": "symbol",
                "source": "markers",
                "paint": {
                    "text-color": "#ffffff"
                },
                "layout": {
                    "text-field": "{label}", // show station name
                    "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                    "text-offset": [0, 0.6],
                    "text-anchor": "top"
                }
            });


            window._map = map;
        });

        map.on('click', find_closest_marker);
    });
});