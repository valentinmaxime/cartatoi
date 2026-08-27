// ============================================================================
// Données du voyage — Mariage à Blois
// Ce fichier ne contient QUE des données et de la config : aucune dépendance à
// Leaflet ni à app.js. Il doit être chargé AVANT app.js dans le HTML.
// ============================================================================

var TRIP_CONFIG = {
    pageTitle: "Carte du Voyage - Mariage à Blois",
    headerTitle: "Mariage à Blois",
    searchPlaceholder: "Rechercher un lieu, un hôtel, une étape…",

    // Vue initiale de la carte au chargement
    mapCenter: [47.586, 1.336],
    mapZoom: 12,

    // Fond de carte (Geoapify, même solution que Réunion & Maurice pour la fiabilité et le
    // français garanti)
    geoapifyKey: 'fde2296c330d47ae9ab354513e51feb9',
    mapStyle: 'klokantech-basic',

    // Pas de rando sur ce voyage, le calque Relief n'a pas d'utilité ici.
    showRelief: false,

    // Météo / astronomie : France métropolitaine, fin août = heure d'été (CEST, UTC+2).
    // À ajuster si la carte est un jour réutilisée hors période estivale.
    meteoTimezoneParam: 'Europe%2FParis',
    utcOffsetHours: 2,

    // Région ajoutée à la recherche Google Maps : un seul pays sur ce voyage, pas besoin de
    // logique conditionnelle comme sur Réunion & Maurice.
    googleMapsRegion: function(lat, lng) { return 'France'; },

    printTitle: 'Mariage à Blois — feuille de route',

    // Stat du résumé : pas de rando ici, on compte plutôt les visites optionnelles
    // (Chambord, Cheverny, Château Royal — marquées optional:true dans les données).
    optionalStatKey: 'Visites optionnelles',
    optionalStatLabel: 'visites optionnelles',
    optionalStatCounter: function(pt) { return !!pt.optional; }
};

// Adresses / lieux repères (coordonnées vérifiées via Google Places)
        var VERNET = { name: "Vernet", lat: 43.4334591, lng: 1.4297166 };
        var HOTEL_MERCURE = { name: "Hôtel Mercure Blois Centre", lat: 47.5893227, lng: 1.3400294 };
        var MAIRIE_BLOIS = { name: "Hôtel de Ville de Blois", lat: 47.58866, lng: 1.337214 };
        var CHATEAU_GROTTEAUX = { name: "Château des Grotteaux", lat: 47.5851242, lng: 1.4212533 };
        var AIRBNB_STLOUIS = { name: "16 Grands Degrés Saint-Louis", lat: 47.5881373, lng: 1.3357515 };
        var CHATEAU_ROYAL_BLOIS = { name: "Château Royal de Blois", lat: 47.5857044, lng: 1.330705 };
        var CHATEAU_CHAMBORD = { name: "Château de Chambord (optionnel, au choix)", lat: 47.6158089, lng: 1.5169189 };
        var CHATEAU_CHEVERNY = { name: "Château de Cheverny (optionnel, au choix)", lat: 47.500233, lng: 1.4580211 };

        // Liens d'information officiels (sites de billetterie / visite) pour les visites optionnelles
        var INFO_CHAMBORD = "https://www.chambord.org/fr/";
        var INFO_CHEVERNY = "https://www.chateau-cheverny.fr/";
        var INFO_CHATEAU_ROYAL = "https://www.chateaudeblois.fr";

        // Structure du Voyage
        var timelineData = [
            {
                day: "J1 - Vendredi 28/08",
                date: "2026-08-28",
                theme: "Route vers Blois",
                title: "Route Vernet ➔ Blois • Installation à l'hôtel (17h) • Dîner (lieu à définir, 20h)",
                center: [47.586, 1.336],
                zoom: 7,
                color: "#3498db",
                points: [
                    { name: VERNET.name, time: "13h00", lat: VERNET.lat, lng: VERNET.lng, icon: 'blue' },
                    { name: HOTEL_MERCURE.name, time: "17h00", lat: HOTEL_MERCURE.lat, lng: HOTEL_MERCURE.lng, icon: 'house' }
                ],
                extras: [
                    { time: "20h00", name: "Dîner (lieu à définir)" }
                ]
            },
            {
                day: "J2 - Samedi 29/08",
                date: "2026-08-29",
                theme: "Jour du mariage",
                title: "Petit-déjeuner & préparatifs à l'hôtel • Cérémonie civile (14h15) • Bus vers le château (15h30-16h00) • Cocktail (17h) & dîner/soirée (19h) au Château des Grotteaux",
                center: [47.586, 1.36],
                zoom: 12,
                color: "#e74c3c",
                points: [
                    { name: HOTEL_MERCURE.name, time: "10h00 - 14h00", lat: HOTEL_MERCURE.lat, lng: HOTEL_MERCURE.lng, icon: 'house' },
                    { name: MAIRIE_BLOIS.name, time: "14h15", lat: MAIRIE_BLOIS.lat, lng: MAIRIE_BLOIS.lng, icon: 'red', note: "Arrivée à 14h15 au plus tard : deux personnes vous guideront à l'intérieur. Merci de laisser vos téléphones de côté pendant la cérémonie, le photographe s'occupe des photos." },
                    { name: "Parking de la République / Halle aux Grains", time: "15h30 - 16h00", lat: 47.589661, lng: 1.3339048, icon: 'red', note: "Embarquement dans le bus pour le Château des Grotteaux (départ entre 15h30 et 16h00). À 3 min à pied de la mairie." },
                    { name: CHATEAU_GROTTEAUX.name, time: "17h00 - 00h00", lat: CHATEAU_GROTTEAUX.lat, lng: CHATEAU_GROTTEAUX.lng, icon: 'red', note: "Retour vers le centre-ville de Blois en bus à partir de 3h00 du matin. Sinon Uber (attente possible) ou taxi : +33 2 54 78 07 67." }
                ],
                extras: [
                    { time: "12h00", name: "Déjeuner (lieu à définir)" }
                ]
            },
            {
                day: "J3 - Dimanche 30/08",
                date: "2026-08-30",
                theme: "Loire Valley & suite des festivités",
                title: "Fin de soirée au château (bus retour 3h) • Petit-déjeuner • Visite d'un château au choix (Chambord ou Cheverny) • Installation Airbnb (16h) • The Petit Pub (15h) • Dîner (lieu à définir, optionnel)",
                center: [47.55, 1.4],
                zoom: 11,
                color: "#9b59b6",
                points: [
                    { name: CHATEAU_GROTTEAUX.name, time: "00h00 - 03h00", lat: CHATEAU_GROTTEAUX.lat, lng: CHATEAU_GROTTEAUX.lng, icon: 'violet', note: "Bus retour vers le centre-ville de Blois à partir de 3h00 du matin. Sinon Uber (attente possible) ou taxi : +33 2 54 78 07 67." },
                    { name: HOTEL_MERCURE.name, time: "10h00", lat: HOTEL_MERCURE.lat, lng: HOTEL_MERCURE.lng, icon: 'house' },
                    { name: CHATEAU_CHAMBORD.name, time: "11h00 - 16h00", lat: CHATEAU_CHAMBORD.lat, lng: CHATEAU_CHAMBORD.lng, icon: 'violet', infoLink: INFO_CHAMBORD, excludeFromRoute: true, optional: true },
                    { name: CHATEAU_CHEVERNY.name, time: "11h00 - 16h00", lat: CHATEAU_CHEVERNY.lat, lng: CHATEAU_CHEVERNY.lng, icon: 'violet', infoLink: INFO_CHEVERNY, excludeFromRoute: true, optional: true },
                    { name: "The Petit Pub", time: "15h00", lat: 47.5864567, lng: 1.3337, icon: 'violet', note: "Pour prolonger les festivités du week-end. 6 Rue Saint-Martin, Blois." },
                    { name: AIRBNB_STLOUIS.name, time: "16h00", lat: AIRBNB_STLOUIS.lat, lng: AIRBNB_STLOUIS.lng, icon: 'house' }
                ],
                extras: [
                    { time: "20h00", name: "Dîner (lieu à définir, optionnel)" }
                ]
            },
            {
                day: "J4 - Lundi 31/08",
                date: "2026-08-31",
                theme: "Départ",
                title: "Château Royal de Blois (optionnel, 10h) • Route retour Blois ➔ Vernet (11h - 18h30)",
                center: [45.7, 1.4],
                zoom: 7,
                color: "#16a085",
                points: [
                    { name: CHATEAU_ROYAL_BLOIS.name, time: "10h00", lat: CHATEAU_ROYAL_BLOIS.lat, lng: CHATEAU_ROYAL_BLOIS.lng, icon: 'green', infoLink: INFO_CHATEAU_ROYAL, optional: true },
                    { name: VERNET.name + " (Retour)", time: "11h00 - 18h30", lat: VERNET.lat, lng: VERNET.lng, icon: 'green' }
                ]
            }
        ];

        // Pas de gastronomie/rando dédiée pour ce voyage — tableau vide conservé pour que le
        // reste du code (recherche, légende auto-masquée) continue de fonctionner sans changement.
        var sausagePoints = [];

        