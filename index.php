<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'/>
    <title>Les stations de métro</title>
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




    <style>
        .filter-group {
            font: 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
            font-weight: 600;
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 1;
            border-radius: 3px;
            width: 120px;
            color: #fff;
        }

        .filter-group input[type=checkbox]:first-child + label {
            border-radius: 3px 3px 0 0;
        }

        .filter-group label:last-child {
            border-radius: 0 0 3px 3px;
            border: none;
        }

        .filter-group input[type=checkbox] {
            display: none;
        }

        .filter-group input[type=checkbox] + label {
            background-color: #3386c0;
            display: block;
            cursor: pointer;
            padding: 10px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.25);
        }

        .filter-group input[type=checkbox] + label {
            background-color: #3386c0;
            text-transform: capitalize;
        }

        .filter-group input[type=checkbox] + label:hover,
        .filter-group input[type=checkbox]:checked + label {
            background-color: #4ea0da;
        }

        .filter-group input[type=checkbox]:checked + label:before {
            content: '✔';
            margin-right: 5px;
        }
    </style>
</head>
<body>

<!-- MAP -->
<div id='map'></div>


<nav id='filter-group' class='filter-group'></nav>

<!-- JQUERY -->
<script src="js/jquery-2.2.4.min.js"></script>
<script src="js/base.js"></script>


</body>
</html>
