# Les stations de métro (work in progress)
Jeu gratuit où il faut découvrir toutes les stations du métro Parisien sur une carte.

# Démo
https://kazes.github.io/les-stations-de-metro/

# Règles
* Découvrez sur la carte les stations de métro de Paris. Pas celles du RER, ni du bus, ni du tramway.
* Un joueur s'inscrit pour se créer un compte et sauvegarder son score. Il est possible de jouer en mode guest mais les résultats ne seront pas sauvegardés au départ du joueur (page ou onglet fermé).
* Une question à choix multiple apparait. La bonne réponse permet de savoir quelle station de métro chercher.
* Pour chercher une station il faut alors cliquer sur la carte, le nombre de clics est pris en compte dans le score. 
* La rapidité du joueur ainsi que sa précision seront récompensés par plus de points ! Par exemple lorsqu'on découvre une station en ayant cliqué le plus près possible et en utilisant le moins de clics.

# commands
1. `npm install`
2. `npm run wp -- --watch` js watcher (creates and overwrites `/compiled-scripts/bundle.js`)
3. `grunt fw` scss watcher (creates and overwrites `/compiled-styles/all.css`)

# Sources
* Indices et couleurs de lignes du réseau ferré RATP
 http://data.ratp.fr/explore/dataset/indices-et-couleurs-de-lignes-du-reseau-ferre-ratp/
* Gares et stations du réseau ferré d'Île-de-France (donnée généralisée)
 https://opendata.stif.info/explore/dataset/emplacement-des-gares-idf-data-generalisee/map/?location=15,48.87293,2.365&basemap=jawg.streets
* Tracé des lignes de métro : http://wiki.openstreetmap.org/wiki/M%C3%A9tro_de_Paris 
* (Tracés du réseau de transport ferré d'Ile-de-France
 https://opendata.stif.info/explore/dataset/traces-du-reseau-ferre-idf/export/?location=16,48.86711,2.35971&basemap=jawg.streets)
