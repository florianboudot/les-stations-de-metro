<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'/>
    <title></title>
    <meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no'/>
    <script src='https://api.tiles.mapbox.com/mapbox-gl-js/v0.20.0/mapbox-gl.js'></script>
    <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v0.20.0/mapbox-gl.css' rel='stylesheet'/>
    <style>
        body {
            margin: 0;
            padding: 0;
        }

        #map {
            position: absolute;
            top: 0;
            bottom: 0;
            width: 100%;
        }
    </style>
</head>
<body>

<div id='map'></div>

<!-- jquery -->
<script src="js/jquery-2.2.4.min.js"></script>

<script>
    $(window).on('load', function () {

        mapboxgl.accessToken = 'pk.eyJ1Ijoia2F6ZXMiLCJhIjoiMjBiMDc0M2UzYTdkY2NjZDZjZDVhZDdjYWMxMWU4NGMifQ.UbQyYB-QiEQklqy7AXI4XA';
        var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v9',
            center: [2.354216632304883, 48.86083080287793],
            zoom: 12
        });


        // load json
        $.ajax({
            url: 'metro.geojson',
            dataType: "json"
        }).done(function (data) {
            console.log('data', data);
            map.addSource("markers", {
                "type": "geojson",
                "data": data
            });

            map.addLayer({
                "id": "markers",
                "type": "symbol",
                "source": "markers",
                "layout": {
                    "text-field": "{label}",
                    "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                    "text-offset": [0, 0.6],
                    "text-anchor": "top"
                }
            });

            window._map = map;
        });


    });


</script>
</body>
</html>
