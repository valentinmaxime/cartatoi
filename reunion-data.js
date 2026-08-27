// ============================================================================
// Données du voyage — La Réunion & Île Maurice
// Ce fichier ne contient QUE des données et de la config : aucune dépendance à
// Leaflet ni à app.js. Il doit être chargé AVANT app.js dans le HTML.
// ============================================================================

var TRIP_CONFIG = {
    pageTitle: "Carte du Voyage - La Réunion & Île Maurice",
    headerTitle: "Réunion & Maurice",
    searchPlaceholder: "Rechercher un lieu, un gîte, une rando…",

    // Vue initiale de la carte au chargement
    mapCenter: [-21.1151, 55.5364],
    mapZoom: 10,

    // Fond de carte (Geoapify, cf. échanges précédents sur le choix du style et la fiabilité
    // face aux tuiles OSM officielles qui bloquent le hotlinking)
    geoapifyKey: 'fde2296c330d47ae9ab354513e51feb9',
    mapStyle: 'klokantech-basic',

    // Relief (OpenTopoMap) : utile ici, ce voyage comporte de vraies randos
    // (Mafate, Fournaise, Piton Cabri...).
    showRelief: true,

    // Météo / astronomie : La Réunion & Maurice sont en UTC+4 toute l'année (pas de changement
    // d'heure saisonnier dans l'océan Indien à cette latitude).
    meteoTimezoneParam: 'Indian%2FReunion',
    utcOffsetHours: 4,

    // Région ajoutée à la recherche Google Maps pour bien cibler le résultat : dépend de l'île
    // (au-delà de 56° de longitude Est, on est à Maurice, pas à La Réunion).
    googleMapsRegion: function(lat, lng) {
        return lng < 56 ? 'La Réunion' : 'Île Maurice';
    },

    printTitle: 'Réunion &amp; Maurice — feuille de route',

    // Site régional officiel de Météo-France pour l'océan Indien. Pas de lien par coordonnées
    // GPS universel côté Météo-France, donc un seul lien fixe plutôt qu'un lien par jour —
    // imparfait pour les jours à Maurice (pays différent, hors couverture Météo-France), mais
    // c'est la ressource officielle française la plus pertinente disponible pour ce voyage.
    weatherLinkUrl: 'https://meteofrance.re/fr',
    weatherLinkLabel: 'Voir sur Météo France',

    // Stat "Randonnées" du résumé : compte les points marqués avec l'icône rando.
    optionalStatKey: 'Randonnées',
    optionalStatLabel: 'points de rando',
    optionalStatCounter: function(pt) { return pt.icon === 'hiking'; },

    // Spécialités locales (rougail saucisse, produits du terroir) : libellé + icône propres à
    // ce voyage. Un voyage sans spécialité définie (ex. Blois) omet simplement ces deux champs.
    specialtyLabel: 'Rougail saucisse & gastronomie traditionnelle',
    specialtyIcon: {
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="36" height="36">
            <circle cx="32" cy="32" r="30" fill="#fdebd0" stroke="#a0522d" stroke-width="2.5"/>
            <g transform="rotate(-25 32 32)">
                <rect x="12" y="24" width="40" height="16" rx="8" fill="#a0522d" stroke="#6b3410" stroke-width="2"/>
                <ellipse cx="14" cy="32" rx="3" ry="7" fill="#6b3410"/>
                <ellipse cx="50" cy="32" rx="3" ry="7" fill="#6b3410"/>
                <line x1="22" y1="25" x2="22" y2="39" stroke="#6b3410" stroke-width="1.3" opacity="0.45"/>
                <line x1="32" y1="25" x2="32" y2="39" stroke="#6b3410" stroke-width="1.3" opacity="0.45"/>
                <line x1="42" y1="25" x2="42" y2="39" stroke="#6b3410" stroke-width="1.3" opacity="0.45"/>
            </g>
        </svg>`,
        size: [36, 36],
        anchor: [18, 36]
    }
};

// Adresses / Gîtes repères
        var GITE_GUETALI = { name: "Gîte Le Guétali", lat: -21.0328503, lng: 55.4741783 };
        var GITE_ARBRE_VIE = { name: "Gîte L'Arbre de Vie", lat: -21.371321, lng: 55.6733009 };
        var HOTEL_RECIF = { name: "Hôtel Le Récif", lat: -21.0662486, lng: 55.2225537 };
        var HOTEL_VERANDA = { name: "Hôtel Veranda Grand Baie", lat: -20.0084159, lng: 57.5788026 };

        // Liens de randonnée (Visorando / Randopitons) pour les points concernés
        var RANDO_COL_BOEUFS = {
            visorando: "https://www.visorando.com/randonnee-col-des-boeufs-vers-la-nouvelle-et-retou/",
            randopitons: "https://randopitons.re/randonnee/1271-col-ufs-nouvelle-retour"
        };
        var RANDO_FOURNAISE = {
            visorando: "https://www.visorando.com/en/walk-piton-de-la-fournaise.html",
            randopitons: "https://randopitons.re/randonnee/1254-piton-fournaise-depuis-pas-bellecombe-circuit-2018"
        };
        var RANDO_VOILE_MARIEE = {
            visorando: "https://www.visorando.com/en/walk-le-voile-de-la-mariee-au-depart-de-salaz/",
            randopitons: "https://randopitons.re/randonnee/1181-voiles-mariee-cascade-demoiselles-riviere-mat"
        };
        var RANDO_PITON_CABRI = {
            visorando: "https://www.visorando.com/en/walk-fenetre-des-makes-piton-cabri/",
            randopitons: "https://randopitons.re/randonnee/1779-piton-cabris-raccourcis-rf-11-makes"
        };
        var RANDO_NEZ_DE_BOEUF = {
            visorando: "https://www.visorando.com/randonnee-le-nez-de-boeuf/"
        };
        var RANDO_FORMICA_LEO = {
            randopitons: "https://randopitons.re/tourisme/128-formica-leo-depuis-pas-bellecombe"
        };

        // Structure du Voyage
        var timelineData = [
            {
                day: "J1 - Lundi 28/09",
                weatherLinkUrl: "https://meteofrance.re/fr/meteo/salazie",
                date: "2026-09-28",
                theme: "Salazie & Mafate",
                title: "Arrivée St-Denis ➔ Cirque de Salazie ➔ Gîte Grand Îlet",
                center: [-21.026, 55.551],
                zoom: 11,
                color: "#e74c3c",
                points: [
                    { name: "Aéroport St-Denis (Départ 9h10)", time: "09h10", lat: -20.8915972, lng: 55.512241, icon: 'red' },
                    { name: "Cascade Bassin Bœuf", lat: -20.949167, lng: 55.583611, icon: 'red' },
                    { name: "Temple du Colosse (St-André)", lat: -20.9367287, lng: 55.6716746, icon: 'red' },
                    { name: "Resto La Cascade Blanche", lat: -20.9993595, lng: 55.5794508, icon: 'restaurant' },
                    { name: "Cascade Voile de la Mariée (Rando 1h30 AR)", lat: -21.0398724, lng: 55.5380261, icon: 'hiking', randoLink: RANDO_VOILE_MARIEE, onFoot: true, optional: true },
                    { name: "Gîte Le Guétali (Grand Îlet)", lat: GITE_GUETALI.lat, lng: GITE_GUETALI.lng, icon: 'house' }
                ]
            },
            {
                day: "J2 - Mardi 29/09",
                weatherLinkUrl: "https://meteofrance.re/fr/meteo/salazie",
                date: "2026-09-29",
                theme: "Salazie & Mafate",
                title: "Gîte Grand Îlet ➔ Hell-Bourg ➔ Rando Mafate ➔ Gîte Grand Îlet",
                center: [-21.062, 55.470],
                zoom: 12,
                color: "#e74c3c",
                points: [
                    { name: "Gîte Le Guétali", lat: GITE_GUETALI.lat, lng: GITE_GUETALI.lng, icon: 'house' },
                    { name: "Hell-Bourg (Musée Musique)", lat: -21.0637609, lng: 55.5186291, icon: 'red' },
                    { name: "Col des Bœufs (Parking Rando)", lat: -21.0712355, lng: 55.448285, icon: 'hiking', randoLink: RANDO_COL_BOEUFS },
                    { name: "La Nouvelle (Mafate - Rando)", lat: -21.0749944, lng: 55.4229356, icon: 'hiking', randoLink: RANDO_COL_BOEUFS, onFoot: true },
                    { name: "Gîte Le Guétali", lat: GITE_GUETALI.lat, lng: GITE_GUETALI.lng, icon: 'house' }
                ]
            },
            {
                day: "J3 - Mercredi 30/09",
                weatherLinkUrl: "https://meteofrance.re/fr/meteo/saint-philippe",
                date: "2026-09-30",
                theme: "Sud Sauvage",
                title: "Gîte Grand Îlet ➔ Sud Sauvage ➔ Gîte Vincendo",
                center: [-21.210, 55.740],
                zoom: 10,
                color: "#e67e22",
                points: [
                    { name: "Gîte Le Guétali", lat: GITE_GUETALI.lat, lng: GITE_GUETALI.lng, icon: 'house' },
                    { name: "Belvédère Takamaka", lat: -21.0770796, lng: 55.6319329, icon: 'orange' },
                    { name: "Pont Suspendu Rivière de l'Est", lat: -21.1239264, lng: 55.7479361, icon: 'orange' },
                    { name: "Anse des Cascades (Pause Déj)", lat: -21.1850167, lng: 55.8268239, icon: 'restaurant' },
                    { name: "Coulées de Lave (Grands Brûlés)", lat: -21.2290632, lng: 55.804072, icon: 'orange' },
                    { name: "Cap Méchant", lat: -21.3756533, lng: 55.7107871, icon: 'orange' },
                    { name: "Puits des Anglais", lat: -21.3692839, lng: 55.7325253, icon: 'orange' },
                    { name: "Cascade de Grand Galet", lat: -21.3116237, lng: 55.6418507, icon: 'orange' },
                    { name: "Gîte L'Arbre de Vie (Vincendo)", lat: GITE_ARBRE_VIE.lat, lng: GITE_ARBRE_VIE.lng, icon: 'house' }
                ]
            },
            {
                day: "J4 - Jeudi 01/10",
                weatherLinkUrl: "https://meteofrance.re/fr/meteo/le-tampon",
                date: "2026-10-01",
                theme: "Piton de la Fournaise",
                title: "Gîte Vincendo ➔ Bourg-Murat ➔ Nez de Bœuf ➔ Cratère Commerson ➔ Piton de la Fournaise (Plaine des Sables) ➔ Gîte Vincendo",
                center: [-21.230, 55.660],
                zoom: 11,
                color: "#8e44ad",
                points: [
                    { name: "Gîte L'Arbre de Vie", lat: GITE_ARBRE_VIE.lat, lng: GITE_ARBRE_VIE.lng, icon: 'house' },
                    { name: "Bourg-Murat / Plaine des Cafres", lat: -21.2012119, lng: 55.5780219, icon: 'violet' },
                    { name: "Belvédère du Nez de Bœuf", lat: -21.209007, lng: 55.6157861, icon: 'hiking', randoLink: RANDO_NEZ_DE_BOEUF, optional: true, note: "Rando courte mais pas si facile : 1,33 km / ~40 min AR. À voir sur place selon forme/temps." },
                    { name: "Cratère Commerson", lat: -21.2079888, lng: 55.6417072, icon: 'violet' },
                    { name: "Point de vue de la Plaine des Sables", lat: -21.2315663, lng: 55.6486864, icon: 'violet' },
                    { name: "Gîte du Volcan (Déjeuner)", lat: -21.2171853, lng: 55.6871847, icon: 'restaurant' },
                    { name: "Pas de Bellecombe (Vue Volcan)", lat: -21.2222188, lng: 55.6894317, icon: 'hiking', randoLink: RANDO_FOURNAISE },
                    { name: "Formica Leo (Enclos Fouqué)", lat: -21.223859, lng: 55.692042, icon: 'hiking', randoLink: RANDO_FORMICA_LEO, onFoot: true, optional: true, note: "Le Word mentionne une option de rando plus longue depuis Pas de Bellecombe (jusqu'à 3h) selon forme/météo." },
                    { name: "Gîte L'Arbre de Vie", lat: GITE_ARBRE_VIE.lat, lng: GITE_ARBRE_VIE.lng, icon: 'house' }
                ]
            },
            {
                day: "J5 - Vendredi 02/10",
                weatherLinkUrl: "https://meteofrance.re/fr/meteo/saint-louis",
                date: "2026-10-02",
                theme: "Les Makes",
                title: "Gîte Vincendo ➔ Les Makes ➔ Gîte Vincendo",
                center: [-21.195, 55.430],
                zoom: 12,
                color: "#27ae60",
                points: [
                    { name: "Gîte L'Arbre de Vie", lat: GITE_ARBRE_VIE.lat, lng: GITE_ARBRE_VIE.lng, icon: 'house' },
                    { name: "Les Makes (Belvédère de la Fenêtre)", lat: -21.1853877, lng: 55.4330234, icon: 'green' },
                    { name: "Observatoire Astronomique des Makes", lat: -21.1997421, lng: 55.4090289, icon: 'green' },
                    { name: "Piton Cabri (Rando 4h)", lat: -21.189784, lng: 55.437011, icon: 'hiking', randoLink: RANDO_PITON_CABRI, onFoot: true },
                    { name: "Gîte L'Arbre de Vie", lat: GITE_ARBRE_VIE.lat, lng: GITE_ARBRE_VIE.lng, icon: 'house' }
                ]
            },
            {
                day: "J6 - Samedi 03/10",
                weatherLinkUrl: "https://meteofrance.re/fr/meteo/saint-paul",
                date: "2026-10-03",
                theme: "Côte Ouest & Maïdo",
                title: "Gîte Vincendo ➔ St-Pierre ➔ Hôtel Le Récif (St-Gilles)",
                center: [-21.220, 55.350],
                zoom: 11,
                color: "#2980b9",
                points: [
                    { name: "Gîte L'Arbre de Vie", lat: GITE_ARBRE_VIE.lat, lng: GITE_ARBRE_VIE.lng, icon: 'house' },
                    { name: "Marché Forain de St-Pierre", lat: -21.3399311, lng: 55.4597428, icon: 'specialty' },
                    { name: "Saga des Rhums (Isautier)", lat: -21.3123309, lng: 55.4657345, icon: 'blue', note: "Pass dégustation à réserver + prendre la confiture crème de banane (pour Mélanie)" },
                    { name: "Domaine du Café Grillé", lat: -21.306886, lng: 55.423972, icon: 'blue' },
                    { name: "Plage de l'Étang-Salé", lat: -21.2622774, lng: 55.3320837, icon: 'blue' },
                    { name: "Hôtel Le Récif (St-Gilles)", lat: HOTEL_RECIF.lat, lng: HOTEL_RECIF.lng, icon: 'house' }
                ]
            },
            {
                day: "J7 - Dimanche 04/10",
                weatherLinkUrl: "https://meteofrance.re/fr/meteo/saint-paul",
                date: "2026-10-04",
                theme: "Côte Ouest & Maïdo",
                title: "Hôtel St-Gilles ➔ Piton Maïdo ➔ Survol en hélicoptère (Corail, 7h10) ➔ Hôtel",
                center: [-21.030, 55.300],
                zoom: 11,
                color: "#2980b9",
                points: [
                    { name: "Hôtel Le Récif", lat: HOTEL_RECIF.lat, lng: HOTEL_RECIF.lng, icon: 'house' },
                    { name: "Piton Maïdo (Vue 6h00)", time: "06h00", lat: -21.068889, lng: 55.387778, icon: 'blue' },
                    { name: "Corail Hélicoptères (Saint-Paul)", time: "07h10", lat: -21.0679094, lng: 55.2498629, icon: 'blue', infoLink: "https://www.corail-helicopteres.com/tour/tour-de-l-ile-saint-gilles/", note: "Réservé : \"Tour de l'île\" confirmé pour le dimanche 4 octobre, décollage prévu 7h10. L'heure exacte n'est confirmée que la veille, et le vol est maintenu sous réserve d'un taux de remplissage minimum de 5 personnes." },
                    { name: "Hôtel Le Récif (Lagon)", lat: HOTEL_RECIF.lat, lng: HOTEL_RECIF.lng, icon: 'house' }
                ]
            },
            {
                day: "J8 - Lundi 05/10",
                weatherLinkUrl: "https://meteofrance.re/fr/meteo/saint-paul",
                date: "2026-10-05",
                theme: "Côte Ouest & Maïdo",
                title: "Hôtel St-Gilles ➔ Jardin d'Éden ➔ St-Leu ➔ Hôtel",
                center: [-21.100, 55.250],
                zoom: 12,
                color: "#2980b9",
                points: [
                    { name: "Hôtel Le Récif", lat: HOTEL_RECIF.lat, lng: HOTEL_RECIF.lng, icon: 'house' },
                    { name: "Plage de la Saline", lat: -21.0976687, lng: 55.2386044, icon: 'blue' },
                    { name: "Jardin d'Éden", lat: -21.0771788, lng: 55.2289407, icon: 'blue' },
                    { name: "Saint-Leu (Front de mer)", lat: -21.151484, lng: 55.278727, icon: 'blue' },
                    { name: "Hôtel Le Récif", lat: HOTEL_RECIF.lat, lng: HOTEL_RECIF.lng, icon: 'house' }
                ]
            },
            {
                day: "J9 - Mardi 06/10",
                weatherLinkUrl: "https://meteofrance.re/fr/meteo/saint-paul",
                date: "2026-10-06",
                theme: "Côte Ouest & Maïdo",
                title: "Hôtel ➔ Plage de l'Hermitage (Baignade & snorkeling) ➔ Hôtel",
                center: [-21.079, 55.222],
                zoom: 13,
                color: "#2980b9",
                points: [
                    { name: "Hôtel Le Récif", lat: HOTEL_RECIF.lat, lng: HOTEL_RECIF.lng, icon: 'house' },
                    { name: "Plage de l'Hermitage", lat: -21.0794928, lng: 55.222319, icon: 'blue', note: "Sentier du Cap Noir / Dos d'Âne remplacé : fermé depuis 2024 (éboulis), sans date de réouverture. Lagon protégé par le récif, idéal snorkeling." },
                    { name: "Hôtel Le Récif", lat: HOTEL_RECIF.lat, lng: HOTEL_RECIF.lng, icon: 'house' }
                ]
            },
            {
                day: "J10 - Mercredi 07/10",
                weatherLinkUrl: "https://meteofrance.re/fr/meteo/sainte-marie",
                date: "2026-10-07",
                theme: "Île Maurice",
                title: "Hôtel ➔ Boucan Canot ➔ St-Paul ➔ Aéroport St-Denis ➔ Hôtel Maurice",
                center: [-20.700, 56.000],
                zoom: 9,
                color: "#f1c40f",
                points: [
                    { name: "Hôtel Le Récif", lat: HOTEL_RECIF.lat, lng: HOTEL_RECIF.lng, icon: 'house' },
                    { name: "Plage de Boucan Canot", lat: -21.0277948, lng: 55.2259182, icon: 'blue' },
                    { name: "Saint-Paul (Front de mer)", lat: -21.0082928, lng: 55.2694028, icon: 'blue' },
                    { name: "Aéroport Roland Garros (Départ 13h15)", time: "13h15", lat: -20.8915972, lng: 55.512241, icon: 'blue' },
                    { name: "Aéroport Sir Seewoosagur Ramgoolam (Arrivée 14h)", time: "14h00", lat: -20.4334615, lng: 57.6787266, icon: 'yellow', flight: true },
                    { name: "Hôtel Veranda Grand Baie (Maurice)", lat: HOTEL_VERANDA.lat, lng: HOTEL_VERANDA.lng, icon: 'house' }
                ]
            },
            {
                day: "J11 - Jeudi 08/10",
                weatherLinkUrl: "https://www.accuweather.com/fr/mu/grand-baie/235102/daily-weather-forecast/235102",
                weatherLinkLabel: "Voir sur AccuWeather",
                date: "2026-10-08",
                theme: "Île Maurice",
                title: "Plages ➔ Château de Labourdonnais ➔ Hôtel",
                center: [-20.040, 57.570],
                zoom: 12,
                color: "#f1c40f",
                points: [
                    { name: "Hôtel Veranda Grand Baie", lat: HOTEL_VERANDA.lat, lng: HOTEL_VERANDA.lng, icon: 'house' },
                    { name: "Château de Labourdonnais", lat: -20.0735467, lng: 57.6176141, icon: 'yellow', optional: true },
                    { name: "Hôtel Veranda Grand Baie", lat: HOTEL_VERANDA.lat, lng: HOTEL_VERANDA.lng, icon: 'house' }
                ]
            },
            {
                day: "J12 - Vendredi 09/10",
                weatherLinkUrl: "https://www.accuweather.com/fr/mu/grand-baie/235102/daily-weather-forecast/235102",
                weatherLinkLabel: "Voir sur AccuWeather",
                date: "2026-10-09",
                theme: "Île Maurice",
                title: "Hôtel Grand Baie ➔ Jardin Pamplemousses & Sucre ➔ Hôtel",
                center: [-20.060, 57.580],
                zoom: 12,
                color: "#f1c40f",
                points: [
                    { name: "Hôtel Veranda Grand Baie", lat: HOTEL_VERANDA.lat, lng: HOTEL_VERANDA.lng, icon: 'house' },
                    { name: "Jardin Botanique de Pamplemousses", lat: -20.1070516, lng: 57.5797065, icon: 'yellow', optional: true },
                    { name: "L'Aventure du Sucre", lat: -20.0979509, lng: 57.5743829, icon: 'yellow', optional: true },
                    { name: "Hôtel Veranda Grand Baie", lat: HOTEL_VERANDA.lat, lng: HOTEL_VERANDA.lng, icon: 'house' }
                ]
            },
            {
                day: "J13 - Samedi 10/10",
                weatherLinkUrl: "https://www.accuweather.com/fr/mu/grand-baie/235102/daily-weather-forecast/235102",
                weatherLinkLabel: "Voir sur AccuWeather",
                date: "2026-10-10",
                theme: "Île Maurice",
                title: "Massages ➔ Aéroport Maurice (Départ 19h55)",
                center: [-20.220, 57.630],
                zoom: 9,
                color: "#f1c40f",
                points: [
                    { name: "Hôtel Veranda Grand Baie (Massages)", lat: HOTEL_VERANDA.lat, lng: HOTEL_VERANDA.lng, icon: 'house' },
                    { name: "Aéroport Sir Seewoosagur Ramgoolam (Départ 19h55)", time: "19h55", lat: -20.4334615, lng: 57.6787266, icon: 'yellow' }
                ]
            }
        ];

        // Points de spécialités locales (indépendants de la timeline)
        var specialtyPoints = [
            {
                name: "La Case de l'Oncle Tom",
                desc: "Table locale et conviviale axée sur le partage et le respect des saveurs réunionnaises d'autrefois.",
                lat: -20.8936172, lng: 55.4691815
            },
            {
                name: "Les Marmites d'Armelle",
                desc: "Établissement réputé pour ses carries et rougails mijotés à l’ancienne, symboles du patrimoine 'lontan'.",
                lat: -21.0930012, lng: 55.2360023
            },
            {
                name: "Pépé Dofé",
                desc: "Concept culinaire mettant en avant l'art du feu de bois ('dofé' signifiant le feu), un élément central dans la cuisson parfaite des saucisses traditionnelles.",
                lat: -20.8817626, lng: 55.4512965
            },
            {
                name: "Charcuterie Maillot",
                desc: "Charcuterie artisanale hautement estimée à La Réunion, essentielle pour l'approvisionnement en authentiques saucisses fumées et en boucané de porc de haute qualité.",
                lat: -20.8804338, lng: 55.4568312
            },
            {
                name: "Marché Forain du Chaudron",
                desc: "Grand marché traditionnel pour sélectionner les légumes, oignons, tomates et piments directement auprès des producteurs locaux.",
                lat: -20.8913291, lng: 55.4877958
            }
        ];