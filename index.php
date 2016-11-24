<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'/>
    <title>
        Les stations de métro
    </title>
    <meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no'/>

    <!-- MAPBOX (LEAFLET) -->
    <script src='https://api.tiles.mapbox.com/mapbox-gl-js/v0.24.0/mapbox-gl.js'></script>
    <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v0.24.0/mapbox-gl.css' rel='stylesheet'/>

    <!-- STYLES -->
    <link href='css/base.css' rel='stylesheet'/>
</head>
<body>

<!-- MAP -->
<div id='map'></div>


<!-- TITLE -->
<div id="header">
    <h1 class="main-title">
        Les stations de métro
    </h1>
    <h2 class="main-subtitle">
        Trouvez et nommez toutes les stations du métro Parisien
    </h2>
</div>

<!-- POPIN ENTER STATION NAME -->
<form class="station-form">
    <div class="close js-close-popin">×</div>
    <label for="station-name">
        Entrez le nom de cette station
    </label>
    <input type="search" id="station-name" autocomplete="off">
    <div class="clue"></div>
</form>


<nav id='filter-group' class='filter-group'></nav>

<div id="score-container">
    <p class="label">
        score
    </p>
    <p class="score">
        0
    </p>
</div>

<!-- GITHUB -->
<p class="github">
    voir source sur
    <a href="https://github.com/kazes/les-stations-de-metro" target="_blank">
        https://github.com/kazes/les-stations-de-metro
    </a>
</p>

<!-- SCRIPTS -->
<script src="js/libs/latinize.js"></script>
<script src="js/jquery-2.2.4.min.js"></script>
<script src="js/base.js"></script>

</body>
</html>
