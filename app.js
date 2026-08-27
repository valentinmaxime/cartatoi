
        var map = L.map('map', { zoomControl: false }).setView(TRIP_CONFIG.mapCenter, TRIP_CONFIG.mapZoom);
        L.control.zoom({ position: 'topright' }).addTo(map);

        // Fonds de carte disponibles
        // Note : Geoapify (service commercial, palier gratuit ~360 000 tuiles/mois) avec le
        // paramètre lang=fr qui force l'affichage en français sur toutes les tuiles — plus
        // fiable qu'un service communautaire (testé et confirmé cassé avec les tuiles OSM
        // officielles, qui bloquent le hotlinking).
        var streetLayer = L.tileLayer(`https://maps.geoapify.com/v1/tile/${TRIP_CONFIG.mapStyle}/{z}/{x}/{y}.png?lang=fr&apiKey=${TRIP_CONFIG.geoapifyKey}`, {
            attribution: 'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | &copy; OpenStreetMap contributors',
            maxZoom: 20
        }).addTo(map);

        var satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community',
            maxZoom: 19
        });

        // Relief (OpenTopoMap) : seulement pour les voyages avec de vraies randos
        // (TRIP_CONFIG.showRelief), inutile sinon.
        var layersControl = {
            "🗺️ Plan": streetLayer,
            "🛰️ Satellite": satelliteLayer
        };
        if (TRIP_CONFIG.showRelief) {
            var reliefLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
                attribution: 'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap (CC-BY-SA)',
                subdomains: 'abc',
                maxZoom: 17
            });
            layersControl["⛰️ Relief"] = reliefLayer;
        }
        L.control.layers(layersControl, null, { position: 'topright', collapsed: true }).addTo(map);

        function createIcon(color) {
            return L.icon({
                iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
            });
        }

        var houseIcon = L.icon({
            iconUrl: 'https://img.icons8.com/color/48/000000/home--v1.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -30], shadowSize: [32, 32]
        });

        var restaurantIcon = L.icon({
            iconUrl: 'https://img.icons8.com/color/48/000000/restaurant.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -30], shadowSize: [32, 32]
        });

        // Icône Rougail Saucisse encodée pour Leaflet (badge + saucisse allongée, extrémités nouées)
        var rawSausageSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="36" height="36">
            <circle cx="32" cy="32" r="30" fill="#fdebd0" stroke="#a0522d" stroke-width="2.5"/>
            <g transform="rotate(-25 32 32)">
                <rect x="12" y="24" width="40" height="16" rx="8" fill="#a0522d" stroke="#6b3410" stroke-width="2"/>
                <ellipse cx="14" cy="32" rx="3" ry="7" fill="#6b3410"/>
                <ellipse cx="50" cy="32" rx="3" ry="7" fill="#6b3410"/>
                <line x1="22" y1="25" x2="22" y2="39" stroke="#6b3410" stroke-width="1.3" opacity="0.45"/>
                <line x1="32" y1="25" x2="32" y2="39" stroke="#6b3410" stroke-width="1.3" opacity="0.45"/>
                <line x1="42" y1="25" x2="42" y2="39" stroke="#6b3410" stroke-width="1.3" opacity="0.45"/>
            </g>
        </svg>`;
        var sausageSvg = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(rawSausageSvg);

        var sausageIcon = L.icon({
            iconUrl: sausageSvg,
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -32], shadowSize: [36, 36]
        });

        // Icône Randonnée encodée pour Leaflet (badge + montagne + sentier balisé)
        var rawHikingSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="36" height="36">
            <circle cx="32" cy="32" r="30" fill="#16a085" stroke="#ffffff" stroke-width="3"/>
            <path d="M10,44 L24,20 L31,32 L38,22 L54,44 Z" fill="#ffffff"/>
            <path d="M24,20 L28,26 L24,32 L20,26 Z" fill="#eafaf1"/>
            <path d="M38,22 L41,27 L38,32 L35,27 Z" fill="#eafaf1"/>
            <circle cx="16" cy="46" r="2" fill="#16a085"/>
            <circle cx="24" cy="42" r="2" fill="#16a085"/>
            <circle cx="32" cy="46" r="2" fill="#16a085"/>
            <circle cx="40" cy="42" r="2" fill="#16a085"/>
            <circle cx="48" cy="46" r="2" fill="#16a085"/>
        </svg>`;
        var hikingSvg = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(rawHikingSvg);

        var hikingIcon = L.icon({
            iconUrl: hikingSvg,
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -32], shadowSize: [36, 36]
        });

        var redIcon = createIcon('red');
        var orangeIcon = createIcon('orange');
        var violetIcon = createIcon('violet');
        var greenIcon = createIcon('green');
        var blueIcon = createIcon('blue');
        var yellowIcon = createIcon('yellow');

        // Icône "activité(s) à définir" : cercle pointillé + point d'interrogation, pour
        // signaler sur la carte les activités sans lieu précis, sans inventer de coordonnées
        // exactes non vérifiées (même mécanisme que sur la carte Blois).
        var rawTbdSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="34" height="34">
            <circle cx="32" cy="32" r="27" fill="#f4f6f7" stroke="#7f8c8d" stroke-width="3" stroke-dasharray="5,4"/>
            <text x="32" y="43" font-size="32" font-family="Arial, sans-serif" font-weight="bold" fill="#7f8c8d" text-anchor="middle">?</text>
        </svg>`;
        var tbdSvg = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(rawTbdSvg);
        var tbdIcon = L.icon({
            iconUrl: tbdSvg,
            iconSize: [34, 34], iconAnchor: [17, 17], popupAnchor: [0, -15]
        });

        // Table de correspondance clé texte (utilisée dans les fichiers de données, ex.
        // icon: "house") → objet icône Leaflet réel. Ça découple complètement les fichiers de
        // données du moteur de rendu : un fichier data.js n'a jamais besoin de connaître les
        // objets Leaflet, ni l'ordre de chargement des scripts entre eux.
        var ICONS = {
            house: houseIcon, restaurant: restaurantIcon, sausage: sausageIcon,
            hiking: hikingIcon, tbd: tbdIcon,
            red: redIcon, orange: orangeIcon, violet: violetIcon,
            green: greenIcon, blue: blueIcon, yellow: yellowIcon
        };
        function resolveIcon(key) { return ICONS[key] || redIcon; }

        // Calques permanents
        var allStepsLayer = L.layerGroup().addTo(map);
        var allAccLayer = L.layerGroup().addTo(map);
        var allRestoLayer = L.layerGroup().addTo(map);
        var allSausageLayer = L.layerGroup().addTo(map);
        var allTbdLayer = L.layerGroup().addTo(map);
        var activeRouteLayer = L.layerGroup().addTo(map);

        // Pane dédié pour les halos de mise en avant du jour actif (sous les icônes, au-dessus des tuiles)
        map.createPane('highlightPane');
        map.getPane('highlightPane').style.zIndex = 450;
        var highlightLayer = L.layerGroup().addTo(map);

        // Pane des numéros d'étape, au-dessus des icônes
        map.createPane('numberPane');
        map.getPane('numberPane').style.zIndex = 660;
        map.getPane('numberPane').style.pointerEvents = 'none';
        var numberLayer = L.layerGroup().addTo(map);

        L.control.scale({ position: 'bottomleft', imperial: false, maxWidth: 120 }).addTo(map);

        // Mini-carte de situation : vue d'ensemble du voyage avec un point sur la zone du jour
        // affiché — utile quand certaines étapes sont loin les unes des autres (îles, aller-retour
        // longue distance...) et sortent du cadre de la grande carte.
        var miniMap = null, miniDot = null;
        var miniControl = L.control({ position: 'bottomright' });
        miniControl.onAdd = function() {
            var div = L.DomUtil.create('div', 'mini-map-ctl');
            L.DomEvent.disableClickPropagation(div);
            setTimeout(function() {
                miniMap = L.map(div, {
                    zoomControl: false, attributionControl: false,
                    dragging: false, scrollWheelZoom: false, doubleClickZoom: false,
                    boxZoom: false, keyboard: false, touchZoom: false, tap: false
                });
                L.tileLayer('https://maps.geoapify.com/v1/tile/klokantech-basic/{z}/{x}/{y}.png?apiKey=' + GEOAPIFY_API_KEY + '&lang=fr', {
                    maxZoom: 10
                }).addTo(miniMap);
                var pts = [];
                timelineData.forEach(function(d) { pts.push(d.center); });
                miniMap.fitBounds(L.latLngBounds(pts), { padding: [8, 8] });
                miniDot = L.circleMarker(timelineData[0].center, {
                    radius: 5, weight: 2, color: '#0e6b6f', fillColor: '#0e6b6f', fillOpacity: 0.9
                }).addTo(miniMap);
                miniMap.invalidateSize();
            }, 0);
            return div;
        };
        miniControl.addTo(map);

        // Pane dédié pour les indicateurs permanents "à pied" / "en avion" (toujours visibles,
        // contrairement au halo du jour actif qui est redessiné à chaque changement de jour)
        map.createPane('indicatorPane');
        map.getPane('indicatorPane').style.zIndex = 440;
        var indicatorLayer = L.layerGroup().addTo(map);

        // ---------- Ma position (géolocalisation navigateur) ----------
        map.createPane('userLocationPane');
        map.getPane('userLocationPane').style.zIndex = 650; // au-dessus des marqueurs d'étapes

        var LocateControl = L.Control.extend({
            options: { position: 'topright' },
            onAdd: function() {
                var container = L.DomUtil.create('div', 'leaflet-bar');
                var link = L.DomUtil.create('a', 'locate-btn', container);
                link.href = '#';
                link.title = 'Me localiser';
                link.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M12 2v3M12 19v3M2 12h3M19 12h3"></path></svg>';
                L.DomEvent.disableClickPropagation(container);
                L.DomEvent.on(link, 'click', function(e) {
                    L.DomEvent.stop(e);
                    toggleLocate(link);
                });
                return container;
            }
        });
        map.addControl(new LocateControl());

        var geoWatchId = null, userMarker = null, userAccuracyCircle = null;

        function showLocateError(msg) {
            var el = document.getElementById('locateToast');
            if (!el) {
                el = document.createElement('div');
                el.id = 'locateToast';
                el.className = 'locate-toast';
                document.body.appendChild(el);
            }
            el.textContent = msg;
            el.classList.add('visible');
            clearTimeout(showLocateError._t);
            showLocateError._t = setTimeout(function() { el.classList.remove('visible'); }, 5000);
        }

        function updateUserMarker(lat, lng, acc) {
            var latlng = [lat, lng];
            if (!userMarker) {
                userMarker = L.marker(latlng, {
                    pane: 'userLocationPane',
                    icon: L.divIcon({
                        className: 'user-loc-dot',
                        html: '<span class="loc-pulse"></span><span class="loc-dot"></span>',
                        iconSize: [14, 14], iconAnchor: [7, 7]
                    }),
                    interactive: false
                }).addTo(map);
            } else {
                userMarker.setLatLng(latlng);
            }
            if (!userAccuracyCircle) {
                userAccuracyCircle = L.circle(latlng, {
                    pane: 'userLocationPane', radius: acc, color: '#0e6b6f', weight: 1,
                    fillColor: '#0e6b6f', fillOpacity: 0.1, opacity: 0.35
                }).addTo(map);
            } else {
                userAccuracyCircle.setLatLng(latlng).setRadius(acc);
            }
        }

        function stopLocate(btnEl) {
            if (geoWatchId !== null) { navigator.geolocation.clearWatch(geoWatchId); geoWatchId = null; }
            btnEl.classList.remove('locating', 'active');
            if (userMarker) { map.removeLayer(userMarker); userMarker = null; }
            if (userAccuracyCircle) { map.removeLayer(userAccuracyCircle); userAccuracyCircle = null; }
        }

        function toggleLocate(btnEl) {
            if (geoWatchId !== null) { stopLocate(btnEl); return; }
            if (!navigator.geolocation) {
                showLocateError('Géolocalisation non prise en charge par ce navigateur.');
                return;
            }
            btnEl.classList.add('locating');
            var firstFix = true;
            geoWatchId = navigator.geolocation.watchPosition(function(pos) {
                btnEl.classList.remove('locating');
                btnEl.classList.add('active');
                var lat = pos.coords.latitude, lng = pos.coords.longitude, acc = pos.coords.accuracy || 30;
                updateUserMarker(lat, lng, acc);
                if (firstFix) {
                    map.flyTo([lat, lng], Math.max(map.getZoom(), 14), { duration: 1 });
                    firstFix = false;
                }
            }, function(err) {
                var msg = err.code === 1
                    ? "Localisation refusée : autorise l'accès à la position dans les réglages du navigateur."
                    : err.code === 2
                    ? 'Position indisponible (pas de signal GPS/réseau).'
                    : 'Délai de localisation dépassé, réessaie.';
                showLocateError(msg);
                stopLocate(btnEl);
            }, { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 });
        }

        var markersRegistry = {};

        // Fonctions auxiliaires pour générer les boutons de navigation dans les popups
        function getWazeBtn(lat, lng) {
            // Format officiel Waze Deep Links : www. + virgule encodée + zoom (sinon lien peu fiable)
            return `<a class="waze-btn" href="https://www.waze.com/ul?ll=${lat}%2C${lng}&navigate=yes&zoom=17" target="_blank" rel="noopener">🚙 Waze</a>`;
        }

        function getGoogleMapsBtn(lat, lng, name) {
            // Recherche texte (fiable, ne dépend pas d'une correspondance exacte) plutôt que
            // le format /place/ qui échoue si le nom ne matche pas exactement un lieu Google.
            // On retire les précisions entre parenthèses ("Départ 9h10", "optionnel"...) qui ne
            // sont pas de vrais noms de lieux, et on ajoute la région (TRIP_CONFIG.googleMapsRegion)
            // pour bien cibler le résultat.
            if (name) {
                var cleanName = name.replace(/\s*\([^)]*\)/g, '').trim();
                var region = TRIP_CONFIG.googleMapsRegion(lat, lng);
                var query = `${cleanName}, ${region}`;
                return `<a class="gmaps-btn" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}" target="_blank" rel="noopener">🗺️ Google Maps</a>`;
            }
            return `<a class="gmaps-btn" href="https://www.google.com/maps/search/?api=1&query=${lat},${lng}" target="_blank" rel="noopener">🗺️ Google Maps</a>`;
        }

        function getRandoBtn(randoLink) {
            if (!randoLink) return '';
            var btns = '';
            if (randoLink.randopitons) {
                btns += `<a class="rando-btn" href="${randoLink.randopitons}" target="_blank" rel="noopener">🥾 Randopitons</a>`;
            }
            if (randoLink.visorando) {
                btns += `<a class="rando-btn" href="${randoLink.visorando}" target="_blank" rel="noopener">🥾 Visorando</a>`;
            }
            return btns;
        }

        function getInfoBtn(infoLink) {
            if (!infoLink) return '';
            return `<a class="info-btn" href="${infoLink}" target="_blank" rel="noopener">ℹ️ Site officiel</a>`;
        }

        function getActionButtons(lat, lng, randoLink, name, infoLink) {
            return `<div class="popup-actions">${getGoogleMapsBtn(lat, lng, name)}${getWazeBtn(lat, lng)}${getRandoBtn(randoLink)}${getInfoBtn(infoLink)}</div>`;
        }

        // 1. Afficher TOUS LES POINTS du séjour dès le départ
        // On regroupe d'abord les occurrences par point (jour + nom + horaire). Un gîte utilisé
        // plusieurs jours pour la même chose n'a qu'un seul marqueur avec tous les jours listés ;
        // mais si un même lieu sert à des fins différentes selon le jour (ex. un aéroport où l'on
        // arrive un jour et d'où l'on repart un autre jour, avec un nom/horaire différent), la
        // popup détaille chaque jour séparément au lieu d'afficher le nom du premier jour pour tous.
        // "Hôtel Le Récif (St-Gilles)" et "Hôtel Le Récif" désignent la même étape :
        // on ignore la précision entre parenthèses et la casse pour les regrouper.
        function normalizeStayName(name) {
            return (name || '').replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
        }

        // ["J6","J7","J8","J10"] → "J6–J8, J10"
        function formatDayRange(days) {
            var nums = days.map(function(d) { return { d: d, n: parseInt(String(d).replace(/\D/g, ''), 10) }; });
            if (nums.some(function(x) { return isNaN(x.n); })) return days.join(', ');
            var out = [], i = 0;
            while (i < nums.length) {
                var j = i;
                while (j + 1 < nums.length && nums[j + 1].n === nums[j].n + 1) j++;
                out.push(j - i >= 1 ? nums[i].d + '–' + nums[j].d : nums[i].d);
                i = j + 1;
            }
            return out.join(', ');
        }

        var pointOccurrences = {};
        timelineData.forEach(function(d) {
            d.points.forEach(function(pt) {
                var key = `${pt.lat.toFixed(4)}_${pt.lng.toFixed(4)}`;
                if (!pointOccurrences[key]) pointOccurrences[key] = [];
                var shortDay = d.day.split(' - ')[0]; // "J1 - Lundi 28/09" → "J1"
                var existing = pointOccurrences[key].find(o => o.day === shortDay);
                if (!existing) {
                    pointOccurrences[key].push({ day: shortDay, name: pt.name, time: pt.time });
                } else if ((pt.name || '').length > (existing.name || '').length &&
                           normalizeStayName(pt.name) === normalizeStayName(existing.name)) {
                    existing.name = pt.name; // garde la variante la plus descriptive
                }
            });
        });

        var addedPointsKeys = new Set();

        timelineData.forEach(function(d) {
            d.points.forEach(function(pt) {
                var key = `${pt.lat.toFixed(4)}_${pt.lng.toFixed(4)}`;
                
                if (!addedPointsKeys.has(key)) {
                    addedPointsKeys.add(key);
                    var occurrences = pointOccurrences[key];
                    var daysLabel = occurrences.map(o => o.day).join(', ');
                    var noteHtml = pt.note ? `<div class="popup-note">${pt.note}</div>` : '';
                    // Regroupe les jours consécutifs qui partagent le même libellé pour ne pas
                    // répéter cinq fois "Hôtel Le Récif" dans la popup.
                    var groups = [];
                    occurrences.forEach(function(o) {
                        var last = groups[groups.length - 1];
                        var label = normalizeStayName(o.name);
                        if (last && last.label === label && last.time === (o.time || '')) {
                            last.days.push(o.day);
                        } else {
                            groups.push({ label: label, name: o.name, time: o.time || '', days: [o.day] });
                        }
                    });

                    var popupContent;
                    if (groups.length === 1) {
                        var soleTime = groups[0].time ? ` <span class="popup-time">${groups[0].time}</span>` : '';
                        popupContent = `<div class="popup-eyebrow">${formatDayRange(groups[0].days)}${soleTime}</div><div class="popup-title">${groups[0].name}</div>${noteHtml}${getActionButtons(pt.lat, pt.lng, pt.randoLink, pt.name, pt.infoLink)}`;
                    } else {
                        // Le lieu sert à des fins différentes selon le jour : détail par étape
                        var breakdown = groups.map(function(g) {
                            var timeLabel = g.time ? ` (${g.time})` : '';
                            return `<b>${formatDayRange(g.days)}</b>${timeLabel} : ${g.name}`;
                        }).join('<br>');
                        popupContent = `<div class="popup-list">${breakdown}</div>${noteHtml}${getActionButtons(pt.lat, pt.lng, pt.randoLink, pt.name, pt.infoLink)}`;
                    }

                    var marker = L.marker([pt.lat, pt.lng], { icon: resolveIcon(pt.icon) })
                        .bindPopup(popupContent);

                    if (pt.icon === 'house') {
                        marker.addTo(allAccLayer);
                    } else if (pt.icon === 'restaurant') {
                        marker.addTo(allRestoLayer);
                    } else if (pt.icon === 'sausage') {
                        marker.addTo(allSausageLayer);
                    } else {
                        marker.addTo(allStepsLayer);
                    }

                    markersRegistry[key] = marker;
                    // Clic sur un marqueur = on bascule aussi la frise sur le jour concerné
                    // (la popup reste celle du marqueur cliqué, d'où skipPopup).
                    var firstDayIdx = timelineData.findIndex(function(dd) {
                        return (dd.points || []).some(function(pp) { return ptKey(pp) === key; });
                    });
                    if (firstDayIdx >= 0) {
                        marker.on('click', function() {
                            if (parseInt(timeSlider.value) === firstDayIdx || overviewMode) return;
                            selectDay(firstDayIdx, { skipPopup: true });
                        });
                    }

                    // Indicateur permanent : anneau pointillé pour les points à pied ou en avion
                    if (pt.onFoot || pt.flight) {
                        L.circleMarker([pt.lat, pt.lng], {
                            pane: 'indicatorPane',
                            radius: 16,
                            color: pt.onFoot ? '#16a085' : '#3498db',
                            weight: 2,
                            dashArray: '4,3',
                            fill: false,
                            opacity: 0.85
                        }).addTo(indicatorLayer);
                    }

                    // Indicateur permanent : anneau ambre pour les visites "OPTION" du programme
                    // (selon temps/forme/envie) — anneau plus large pour s'emboîter proprement
                    // autour de l'anneau à pied/avion si le point cumule les deux indicateurs.
                    if (pt.optional) {
                        L.circleMarker([pt.lat, pt.lng], {
                            pane: 'indicatorPane',
                            radius: 21,
                            color: '#e67e22',
                            weight: 2,
                            dashArray: '3,4',
                            fill: false,
                            opacity: 0.85
                        }).addTo(indicatorLayer);
                    }
                }
            });
        });

        // 1bis. Indicateur "activité(s) à définir" : un marqueur par jour concerné, positionné
        // au centre approximatif de la zone du jour (pas de coordonnées précises inventées),
        // avec une popup qui liste les activités et leurs horaires (port depuis la carte Blois).
        timelineData.forEach(function(d) {
            if (!d.extras || d.extras.length === 0) return;
            var listHtml = d.extras.map(function(ex) {
                var timeLabel = ex.time ? `<b>${ex.time}</b> : ` : '';
                return `<li>${timeLabel}${ex.name}</li>`;
            }).join('');
            var popupContent = `<b>${d.day}</b><br>❓ <b>Activité(s) à définir</b><br>` +
                `<span style="font-size:11px;">Emplacement approximatif (zone du jour) : lieu exact à confirmer</span>` +
                `<ul style="margin:4px 0 0 16px; padding:0; font-size:12px;">${listHtml}</ul>`;
            L.marker(d.center, { icon: tbdIcon })
                .bindPopup(popupContent)
                .addTo(allTbdLayer);
        });

        // 2. Afficher les points Gastronomie & Saucisse
        sausagePoints.forEach(function(pt) {
            var popupContent = `<div class="popup-eyebrow">Gastronomie</div><div class="popup-title">${pt.name}</div><div class="popup-desc">${pt.desc}</div>${getActionButtons(pt.lat, pt.lng, null, pt.name)}`;
            var marker = L.marker([pt.lat, pt.lng], { icon: sausageIcon })
                .bindPopup(popupContent);
            marker.addTo(allSausageLayer);
        });

        // 3. Gestion API OSRM pour calcul de route réelle
        var routeCache = {};

        async function fetchOSRMRoute(points) {
            if (points.length < 2) return null;
            var coords = points.map(p => `${p.lng},${p.lat}`).join(';');
            var url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;
            
            try {
                var response = await fetch(url);
                var data = await response.json();
                if (data.routes && data.routes.length > 0) {
                    return data.routes[0];
                }
            } catch (err) {
                console.error("Erreur itinéraire OSRM:", err);
            }
            return null;
        }

        // Découpe les points d'un jour en segments routables séparés par les portions
        // non routières : les points "onFoot" (rando) sont exclus de tout segment (juste
        // un marqueur isolé) ; les points "flight" (avion) terminent le segment en cours
        // et démarrent un nouveau segment à partir de leur position (le trajet en voiture
        // reprend normalement après l'atterrissage). Les points "excludeFromRoute" (visite
        // optionnelle/alternative, port depuis la carte Blois) sont eux aussi exclus du calcul,
        // pour ne pas fausser la distance/temps avec une visite qui ne sera pas forcément faite.
        function getDrivableSegments(points) {
            var segments = [];
            var current = [];
            points.forEach(function(p) {
                if (p.onFoot || p.excludeFromRoute) return;
                if (p.flight) {
                    if (current.length >= 2) segments.push(current);
                    current = [p];
                } else {
                    current.push(p);
                }
            });
            if (current.length >= 2) segments.push(current);
            return segments;
        }

        // Récupère (avec cache) tous les segments routables d'un jour ; retourne un tableau
        // de trajets OSRM (un par segment continu en voiture).
        async function fetchDayRoutes(dayIndex, points) {
            if (routeCache[dayIndex]) return routeCache[dayIndex];
            var segments = getDrivableSegments(points);
            var results = [];
            for (var s of segments) {
                var r = await fetchOSRMRoute(s);
                if (r) results.push(r);
            }
            routeCache[dayIndex] = results;
            return results;
        }

        // 3bis. Résumé global du voyage (distance & temps de route cumulés)
        var summaryKmEl = document.getElementById('summaryKm');
        var summaryTimeEl = document.getElementById('summaryTime');
        var summaryHikesEl = document.getElementById('summaryHikes');

        function computeHikeCount() {
            var count = 0;
            timelineData.forEach(function(d) {
                d.points.forEach(function(pt) {
                    if (TRIP_CONFIG.optionalStatCounter(pt)) count++;
                });
            });
            summaryHikesEl.innerHTML = `<b>${count}</b><small>${TRIP_CONFIG.optionalStatLabel}</small>`;
        }

        var summaryDaysEl = document.getElementById('summaryDays');
        function computeDayCount() {
            summaryDaysEl.innerHTML = `<b>${timelineData.length}</b><small>jours</small>`;
        }

        // Génère la légende des dates/couleurs à partir de timelineData (regroupe les jours
        // consécutifs de même couleur/thème), pour qu'elle ne puisse jamais se désynchroniser.
        function formatDDMM(isoDate) {
            var parts = isoDate.split('-');
            return `${parts[2]}/${parts[1]}`;
        }

        // Ne montre dans la légende et les filtres que ce qui existe réellement dans les données.
        function prunePanelEntries() {
            var all = [];
            timelineData.forEach(function(d) { (d.points || []).forEach(function(p) { all.push(p); }); });
            var present = {
                acc: all.some(p => p.icon === 'house'),
                resto: all.some(p => p.icon === 'restaurant'),
                sausage: all.some(p => p.icon === 'sausage') || (typeof sausagePoints !== 'undefined' && sausagePoints.length > 0),
                rando: all.some(p => p.icon === 'hiking' || p.randoLink),
                foot: all.some(p => p.onFoot),
                flight: all.some(p => p.flight),
                optional: all.some(p => p.optional),
                tbd: timelineData.some(d => d.extras && d.extras.length > 0)
            };
            document.querySelectorAll('[data-need]').forEach(function(el) {
                var need = el.getAttribute('data-need');
                if (present[need]) return;
                el.style.display = 'none';
                var cb = el.querySelector('input[type=checkbox]');
                if (cb) { cb.checked = false; cb.dispatchEvent(new Event('change')); }
            });
            var visible = document.querySelectorAll('.filter-item:not([style*="none"])').length;
            var hint = document.getElementById('filterHint');
            if (hint) hint.textContent = visible + ' calques';
        }

        function renderLegendDates() {
            var groups = [];
            var current = null;

            timelineData.forEach(function(d) {
                if (!current || current.color !== d.color || current.theme !== d.theme) {
                    if (current) groups.push(current);
                    current = { color: d.color, theme: d.theme, startDate: d.date, endDate: d.date };
                } else {
                    current.endDate = d.date;
                }
            });
            if (current) groups.push(current);

            var container = document.getElementById('legendDates');
            container.innerHTML = groups.map(function(g) {
                var dateLabel = g.startDate === g.endDate
                    ? formatDDMM(g.startDate)
                    : `${formatDDMM(g.startDate)} - ${formatDDMM(g.endDate)}`;
                return `<div class="legend-row"><span class="legend-color" style="background: ${g.color};"></span><span><b>${dateLabel}</b><span class="legend-theme">${g.theme}</span></span></div>`;
            }).join('');
        }

        async function computeTripSummary() {
            var totalKm = 0;
            var totalSeconds = 0;

            for (var i = 0; i < timelineData.length; i++) {
                var d = timelineData[i];
                var routeDataArr = await fetchDayRoutes(i, d.points);
                routeDataArr.forEach(function(routeData) {
                    totalKm += routeData.distance / 1000;
                    totalSeconds += routeData.duration;
                });
            }

            summaryKmEl.innerHTML = `<b>${Math.round(totalKm)}</b><small>km</small>`;
            var totalMinutes = Math.round(totalSeconds / 60);
            var h = Math.floor(totalMinutes / 60);
            var m = totalMinutes % 60;
            summaryTimeEl.innerHTML = `<b>${h}h${m < 10 ? '0' : ''}${m}</b><small>au volant</small>`;
        }

        // 4. Gestion API Open-Meteo (météo en direct)
        var weatherCache = {};
        var WEATHER_ICONS = {
            0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
            45: "🌫️", 48: "🌫️",
            51: "🌦️", 53: "🌦️", 55: "🌦️",
            56: "🌧️", 57: "🌧️",
            61: "🌧️", 63: "🌧️", 65: "🌧️",
            66: "🌧️", 67: "🌧️",
            71: "🌨️", 73: "🌨️", 75: "🌨️", 77: "🌨️",
            80: "🌦️", 81: "🌧️", 82: "⛈️",
            85: "🌨️", 86: "🌨️",
            95: "⛈️", 96: "⛈️", 99: "⛈️"
        };

        async function fetchClimateNormal(lat, lng, isoDate) {
            // Calcule une normale saisonnière (moyenne sur plusieurs années passées)
            // pour la même date calendaire, utilisée uniquement quand le jour est trop
            // éloigné pour une vraie prévision (au-delà de la fenêtre de 16 jours d'Open-Meteo).
            var monthDay = isoDate.substring(5); // "MM-DD"
            var key = `normal_${lat.toFixed(3)}_${lng.toFixed(3)}_${monthDay}`;
            if (weatherCache[key]) return weatherCache[key];

            var years = [2020, 2021, 2022, 2023, 2024];
            var requests = years.map(function(year) {
                var dateStr = `${year}-${monthDay}`;
                var url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lng}&start_date=${dateStr}&end_date=${dateStr}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=${TRIP_CONFIG.meteoTimezoneParam}`;
                return fetch(url).then(r => r.json()).catch(() => null);
            });

            try {
                var results = await Promise.all(requests);
                var maxTemps = [], minTemps = [], codes = [];
                results.forEach(function(r) {
                    if (r && r.daily && r.daily.temperature_2m_max && r.daily.temperature_2m_max.length > 0 && r.daily.temperature_2m_max[0] !== null) {
                        maxTemps.push(r.daily.temperature_2m_max[0]);
                        minTemps.push(r.daily.temperature_2m_min[0]);
                        codes.push(r.daily.weathercode[0]);
                    }
                });
                if (maxTemps.length === 0) return null;

                var avgMax = maxTemps.reduce((a, b) => a + b, 0) / maxTemps.length;
                var avgMin = minTemps.reduce((a, b) => a + b, 0) / minTemps.length;
                var freq = {};
                codes.forEach(c => freq[c] = (freq[c] || 0) + 1);
                var modeCode = Object.keys(freq).reduce((a, b) => freq[a] > freq[b] ? a : b);

                var result = { tempMax: avgMax, tempMin: avgMin, weathercode: parseInt(modeCode), label: `normale sur ${maxTemps.length} ans` };
                weatherCache[key] = result;
                return result;
            } catch (err) {
                console.error("Erreur normales climatiques Open-Meteo:", err);
            }
            return null;
        }

        // Vraie prévision (fiable jusqu'à ~16 jours avant la date)
        async function fetchForecastDay(lat, lng, isoDate) {
            var key = `forecast_${lat.toFixed(3)}_${lng.toFixed(3)}_${isoDate}`;
            if (weatherCache[key]) return weatherCache[key];

            var url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,weathercode&start_date=${isoDate}&end_date=${isoDate}&timezone=${TRIP_CONFIG.meteoTimezoneParam}`;
            try {
                var response = await fetch(url);
                var data = await response.json();
                if (data.daily && data.daily.temperature_2m_max && data.daily.temperature_2m_max.length > 0) {
                    var result = {
                        tempMax: data.daily.temperature_2m_max[0],
                        tempMin: data.daily.temperature_2m_min[0],
                        weathercode: data.daily.weathercode[0],
                        label: "prévision"
                    };
                    weatherCache[key] = result;
                    return result;
                }
            } catch (err) {
                console.error("Erreur prévision Open-Meteo:", err);
            }
            return null;
        }

        // Météo réellement observée (pour un jour du voyage déjà passé)
        async function fetchObservedDay(lat, lng, isoDate) {
            var key = `observed_${lat.toFixed(3)}_${lng.toFixed(3)}_${isoDate}`;
            if (weatherCache[key]) return weatherCache[key];

            var url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lng}&start_date=${isoDate}&end_date=${isoDate}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=${TRIP_CONFIG.meteoTimezoneParam}`;
            try {
                var response = await fetch(url);
                var data = await response.json();
                if (data.daily && data.daily.temperature_2m_max && data.daily.temperature_2m_max.length > 0 && data.daily.temperature_2m_max[0] !== null) {
                    var result = {
                        tempMax: data.daily.temperature_2m_max[0],
                        tempMin: data.daily.temperature_2m_min[0],
                        weathercode: data.daily.weathercode[0],
                        label: "observé ce jour-là"
                    };
                    weatherCache[key] = result;
                    return result;
                }
            } catch (err) {
                console.error("Erreur historique Open-Meteo:", err);
            }
            return null;
        }

        // Sélectionne automatiquement la meilleure source météo selon la proximité de la date :
        // jour déjà passé → météo observée ; dans les 15 prochains jours → vraie prévision ;
        // au-delà → normale saisonnière moyenne (seule donnée fiable aussi loin à l'avance).
        async function fetchDayWeather(lat, lng, isoDate) {
            var todayStr = new Date().toISOString().substring(0, 10);
            var diffDays = Math.round((new Date(isoDate + "T00:00:00") - new Date(todayStr + "T00:00:00")) / 86400000);

            if (diffDays < 0) {
                return fetchObservedDay(lat, lng, isoDate);
            } else if (diffDays <= 15) {
                return fetchForecastDay(lat, lng, isoDate);
            } else {
                return fetchClimateNormal(lat, lng, isoDate);
            }
        }

        // 5. Gestion API Sunrise-Sunset (lever / coucher du soleil)
        var sunCache = {};

        function utcToLocalTime(isoString) {
            // Convertit une heure UTC (ISO) en heure locale du voyage (TRIP_CONFIG.utcOffsetHours).
            // Attention : décalage fixe, ne gère pas automatiquement les changements d'heure d'été/
            // hiver — à ajuster dans TRIP_CONFIG si la carte est réutilisée hors de sa période.
            var d = new Date(isoString);
            d.setUTCHours(d.getUTCHours() + TRIP_CONFIG.utcOffsetHours);
            var h = String(d.getUTCHours()).padStart(2, '0');
            var m = String(d.getUTCMinutes()).padStart(2, '0');
            return `${h}:${m}`;
        }

        async function fetchSunTimes(lat, lng, date) {
            var key = `${lat.toFixed(3)}_${lng.toFixed(3)}_${date}`;
            if (sunCache[key]) return sunCache[key];

            var url = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=${date}&formatted=0`;
            try {
                var response = await fetch(url);
                var data = await response.json();
                if (data.status === "OK") {
                    var result = {
                        sunrise: utcToLocalTime(data.results.sunrise),
                        sunset: utcToLocalTime(data.results.sunset)
                    };
                    sunCache[key] = result;
                    return result;
                }
            } catch (err) {
                console.error("Erreur Sunrise-Sunset:", err);
            }
            return null;
        }

        // Décalage à réserver à gauche quand le panneau est ouvert (sinon 0).
        // On utilise offsetLeft/offsetWidth — la géométrie de mise en page, insensible au
        // translateX de la transition — car getBoundingClientRect() renvoie la position
        // ANIMÉE : lu en pleine ouverture il donne un bord droit négatif, et l'auto-pan de
        // la popup se cale alors sur un panneau large de zéro.
        function panelOffset() {
            var sb = document.getElementById('sidebar');
            if (!sb || !sb.classList.contains('open')) return 0;
            var right = sb.offsetLeft + sb.offsetWidth;
            if (right >= window.innerWidth - 20) return 0; // plein écran (mobile) : pas de décalage
            return Math.max(0, right);
        }

        // Interface & Menu
        var sidebar = document.getElementById('sidebar');
        var burgerBtn = document.getElementById('burgerBtn');
        var closeBtn = document.getElementById('closeBtn');

        // Résolue quand le panneau a fini de coulisser ET que Leaflet connaît sa nouvelle
        // taille utile : tout cadrage/popup doit l'attendre, sinon l'auto-pan se calcule sur
        // une carte périmée et la popup finit derrière le panneau.
        var panelSettled = Promise.resolve();

        function setPanel(open) {
            var changed = sidebar.classList.contains('open') !== open;
            sidebar.classList.toggle('open', open);
            document.body.classList.toggle('panel-open', open);
            panelSettled = new Promise(function(resolve) {
                var done = false;
                function finish() {
                    if (done) return;
                    done = true;
                    sidebar.removeEventListener('transitionend', onEnd);
                    map.invalidateSize({ animate: false });
                    resolve();
                }
                function onEnd(e) {
                    if (e.target === sidebar && e.propertyName === 'transform') finish();
                }
                if (!changed) { finish(); return; }
                sidebar.addEventListener('transitionend', onEnd);
                setTimeout(finish, 700); // repli si la transition ne se déclenche pas
            });
            return panelSettled;
        }
        setPanel(window.innerWidth > 900);

        burgerBtn.addEventListener('click', function() { setPanel(true); });
        closeBtn.addEventListener('click', function() { setPanel(false); });

        var timelineList = document.getElementById('timelineList');
        var dayBadge = document.getElementById('dayBadge');
        var routeBadge = document.getElementById('routeBadge');
        var dayExtra = document.getElementById('dayExtra');
        var weatherBadge = document.getElementById('weatherBadge');
        var sunBadge = document.getElementById('sunBadge');
        var timeSlider = document.getElementById('timeSlider');

        timelineData.forEach(function(item, idx) {
            var li = document.createElement('li');
            li.className = 'timeline-item' + (idx === 0 ? ' active' : '');
            li.style.setProperty('--item-color', item.color);
            var dp = item.day.split(' - ');
            li.innerHTML = `<span class="ti-day">${dp[0]}</span><span class="ti-title">${item.title}</span><span class="ti-date">${dp[1] || ''}</span>`;
            li.addEventListener('click', function() {
                selectDay(idx);
                if (window.innerWidth <= 520) setPanel(false);
            });
            timelineList.appendChild(li);
        });

        timeSlider.max = timelineData.length - 1;

        // Jeton de requête pour éviter que des réponses tardives n'écrasent l'affichage du jour courant
        // ---------- Outils partagés (distances, index de lieux, réservations, plan B) ----------
        function ptKey(p) { return p.lat.toFixed(4) + '_' + p.lng.toFixed(4); }

        function deaccent(s) {
            return (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        }

        // Tout ce qui demande une réservation : détecté sur les notes (« à réserver », « pass »…)
        // et sur les prestations à créneau (hélicoptère), jamais saisi en double.
        var BOOKING_RE = /r[ée]serv|pass |billet|cr[ée]neau|sur inscription/i;

        // Les notes contiennent du HTML (liens de réservation) : on en extrait le TEXTE avant
        // de tronquer, sinon une balise coupée en deux avale le reste de la liste au rendu.
        function plainExcerpt(src, max) {
            var tmp = document.createElement('div');
            tmp.innerHTML = src;
            var text = (tmp.textContent || '').replace(/\s+/g, ' ').trim();
            if (text.length <= max) return escapeHtml(text);
            return escapeHtml(text.slice(0, max).replace(/\s+\S*$/, '')) + '…';
        }

        function escapeHtml(s) {
            return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        }
        function collectBookings() {
            var out = [];
            timelineData.forEach(function(d, i) {
                (d.points || []).forEach(function(p) {
                    var viaNote = p.note && BOOKING_RE.test(p.note);
                    var viaHeli = /h[ée]licopt|helilagon|corail/i.test(p.name);
                    if (!viaNote && !viaHeli) return;
                    out.push({
                        dayIndex: i,
                        day: d.day.split(' - ')[0],
                        name: p.name,
                        note: p.note ? plainExcerpt(p.note, 130) : 'Prestation à créneau : à réserver à l\'avance.'
                    });
                });
            });
            return out;
        }

        var selectionToken = 0;

        // Résout quand la carte n'a plus bougé depuis 220 ms (fin de vol, zoom compris),
        // avec un plafond pour ne jamais bloquer si un mouvement s'éternise.
        function whenMapIdle(timeout) {
            return new Promise(function(resolve) {
                var timer, cap, done = false;
                function finish() {
                    if (done) return;
                    done = true;
                    clearTimeout(timer); clearTimeout(cap);
                    map.off('move zoom movestart zoomstart', bump);
                    resolve();
                }
                function bump() {
                    clearTimeout(timer);
                    timer = setTimeout(finish, 220);
                }
                map.on('move zoom movestart zoomstart', bump);
                bump();
                cap = setTimeout(finish, timeout || 3000);
            });
        }

        async function selectDay(index, opts) {
            index = parseInt(index);
            opts = opts || {};
            var myToken = ++selectionToken;
            // Lien partageable : l'URL retient toujours le jour affiché (#j8)
            try { history.replaceState(null, '', '#j' + (index + 1)); } catch (e) {}
            await panelSettled;
            if (myToken !== selectionToken) return;

            if (typeof overviewMode !== 'undefined' && overviewMode) {
                exitOverview();
            }

            timeSlider.value = index;
            var data = timelineData[index];
            timeSlider.style.setProperty('--day-color', data.color);
            dayBadge.style.setProperty('--day-color', data.color);
            document.querySelector('.day-info-card').style.setProperty('--day-color', data.color);
            var dparts = data.day.split(' - ');
            dayBadge.innerHTML = `<span class="db-main">${dparts[0]}<em>${dparts[1] || ''}</em></span><span class="db-theme">${data.theme}</span>`;
            updateNavButtons(index);
            routeBadge.innerHTML = `<span class="rb-load">Calcul du trajet…</span>`;
            weatherBadge.innerHTML = `<span class="wl">chargement…</span>`;
            sunBadge.innerHTML = `<span class="wl">chargement…</span>`;

            var items = timelineList.querySelectorAll('.timeline-item');
            items.forEach((el, i) => {
                if (i === index) el.classList.add('active');
                else el.classList.remove('active');
            });

            activeRouteLayer.clearLayers();
            highlightLayer.clearLayers();
            numberLayer.clearLayers();

            // Estompage des marqueurs qui n'appartiennent pas au jour affiché : le contexte
            // de l'île reste lisible sans noyer l'étape du jour.
            var activeKeys = new Set((data.points || []).map(ptKey));
            Object.keys(markersRegistry).forEach(function(k) {
                var mk = markersRegistry[k];
                if (mk.setOpacity) mk.setOpacity(activeKeys.has(k) ? 1 : 0.35);
            });

            // Étapes numérotées dans l'ordre du parcours (un même lieu revu dans la journée
            // porte ses deux numéros, ex. « 1·5 » pour l'hôtel de départ et d'arrivée).
            var orderMap = {};
            (data.points || []).forEach(function(p, i) {
                var k = ptKey(p);
                if (!orderMap[k]) orderMap[k] = { pt: p, nums: [] };
                orderMap[k].nums.push(i + 1);
            });
            Object.keys(orderMap).forEach(function(k) {
                var o = orderMap[k];
                L.marker([o.pt.lat, o.pt.lng], {
                    pane: 'numberPane',
                    interactive: false,
                    icon: L.divIcon({
                        className: '',
                        html: '<span class="step-number" style="--num-bg:' + data.color + '">' + o.nums.join('·') + '</span>',
                        iconSize: null,
                        iconAnchor: [-9, 26]
                    })
                }).addTo(numberLayer);
            });

            if (miniDot) miniDot.setLatLng(data.center).setStyle({ color: data.color, fillColor: data.color });

            // Halo de mise en avant sur les points du jour sélectionné
            data.points.forEach(function(pt) {
                L.circleMarker([pt.lat, pt.lng], {
                    pane: 'highlightPane',
                    radius: 18,
                    color: data.color,
                    weight: 3,
                    fillColor: data.color,
                    fillOpacity: 0.18,
                    opacity: 0.7
                }).addTo(highlightLayer);
            });

            // Cadrage automatique sur tous les points du jour (au lieu d'un centre/zoom fixe),
            // pour qu'un point excentré (ex. un détour avant l'étape principale) reste toujours visible.
            if (data.points.length > 0) {
                var boundsCoords = data.points.map(p => [p.lat, p.lng]);
                if (data.extras && data.extras.length > 0) boundsCoords.push(data.center);
                var bounds = L.latLngBounds(boundsCoords);
                map.flyToBounds(bounds, {
                    paddingTopLeft: L.point(panelOffset() + 50, 170),
                    paddingBottomRight: L.point(50, 60),
                    maxZoom: data.zoom, duration: 1.0
                });
            } else {
                map.flyTo(data.center, data.zoom, { duration: 1.0 });
            }

            // Fiche jour : nuit sur place uniquement (départ conseillé et plan B pluie retirés).
            var stay = (data.points || []).filter(p => p.icon === 'house').slice(-1)[0];

            function paintDayExtra() {
                if (myToken !== selectionToken) return;
                var rows = '';
                if (stay) {
                    rows += '<div class="dx-item"><div class="dx-k">Nuit sur place</div><div class="dx-v">' + stay.name + '</div></div>';
                }
                dayExtra.innerHTML = rows;
            }
            paintDayExtra();

            // Météo du jour : observée / prévision / normale saisonnière selon la proximité de la date
            fetchDayWeather(data.center[0], data.center[1], data.date).then(function(w) {
                if (myToken !== selectionToken) return;
                if (w) {
                    var icon = WEATHER_ICONS[w.weathercode] || "🌡️";
                    weatherBadge.innerHTML = `<span class="wv">${icon} ${w.tempMin.toFixed(0)}–${w.tempMax.toFixed(0)}°C</span><span class="wl">${w.label}</span>`;
                } else {
                    weatherBadge.innerHTML = `<span class="wl">météo indisponible</span>`;
                }
            });

            // Lever / coucher du soleil (heure locale du voyage, TRIP_CONFIG.utcOffsetHours)
            fetchSunTimes(data.center[0], data.center[1], data.date).then(function(s) {
                if (myToken !== selectionToken) return;
                if (s) {
                    sunBadge.innerHTML = `<span class="wv">${s.sunrise} → ${s.sunset}</span><span class="wl">lever · coucher</span>`;
                } else {
                    sunBadge.innerHTML = `<span class="wl">horaires indisponibles</span>`;
                }
            });

            var footPoints = data.points.filter(p => p.onFoot);
            var flightPoints = data.points.filter(p => p.flight);

            var routeDataArr = await fetchDayRoutes(index, data.points);

            if (myToken !== selectionToken) return;

            if (routeDataArr.length > 0) {
                var totalKm = 0, totalSeconds = 0;

                routeDataArr.forEach(function(routeData) {
                    var latLngs = routeData.geometry.coordinates.map(c => [c[1], c[0]]);
                    var polyline = L.polyline(latLngs, {
                        color: data.color,
                        weight: 6,
                        opacity: 0.9
                    }).addTo(activeRouteLayer);
                    polyline.bindPopup(`<b>${data.day}</b><br>🚗 Distance : ${(routeData.distance / 1000).toFixed(1)} km`);

                    totalKm += routeData.distance / 1000;
                    totalSeconds += routeData.duration;
                });

                var km = totalKm.toFixed(1);
                var durationMinutes = Math.round(totalSeconds / 60);
                var h = Math.floor(durationMinutes / 60);
                var m = durationMinutes % 60;
                var timeStr = h > 0 ? `${h}h${m < 10 ? '0' : ''}${m}` : `${m} min`;

                var footNote = footPoints.length > 0 ? `<div class="rb-note">🥾 portion(s) accessible(s) uniquement à pied</div>` : '';
                var flightNote = flightPoints.length > 0 ? `<div class="rb-note">✈️ portion(s) en avion</div>` : '';
                var segmentNote = routeDataArr.length > 1 ? ` <span class="rb-seg">${routeDataArr.length} segments</span>` : '';
                var longAlert = durationMinutes >= 120
                    ? `<div class="rb-alert">⚠ Plus de 2 h de route : prévoir des pauses et partir tôt</div>` : '';
                routeBadge.innerHTML = `<div class="rb-main"><b>${km} km</b><span class="rb-dot"></span><b>~${timeStr}</b> de conduite${segmentNote}</div>${footNote}${flightNote}${longAlert}`;
            } else if (footPoints.length > 0 || flightPoints.length > 0) {
                var footNote2 = footPoints.length > 0 ? `🥾 Accessible uniquement à pied. ` : '';
                var flightNote2 = flightPoints.length > 0 ? `✈️ Trajet en avion. ` : '';
                routeBadge.innerHTML = `<div class="rb-main">${footNote2}${flightNote2}</div>`;
            } else {
                routeBadge.innerHTML = `<div class="rb-main">Journée sur place · détente</div>`;
            }

            if (data.points.length > 0 && !opts.skipPopup) {
                var firstPt = data.points[0];
                var key = `${firstPt.lat.toFixed(4)}_${firstPt.lng.toFixed(4)}`;
                var marker = markersRegistry[key];
                if (marker) {
                    // Ouverture après la fin du vol de caméra, avec une zone d'auto-pan qui
                    // exclut le panneau latéral : sinon la popup se cale sur la vue d'avant
                    // l'animation et finit derrière le panneau ou coupée en haut.
                    // La popup ne s'ouvre qu'une fois la caméra RÉELLEMENT immobile : ouverte
                    // pendant le vol, son auto-pan se calcule sur une vue intermédiaire et elle
                    // reste à moitié derrière le panneau jusqu'au prochain déplacement.
                    await whenMapIdle();
                    if (myToken !== selectionToken) return;
                    var p = marker.getPopup();
                    if (p) {
                        // pas de keepInView : la popup doit rester libre quand
                        // l'utilisateur se déplace lui-même sur la carte
                        p.options.autoPanPaddingTopLeft = L.point(panelOffset() + 24, 120);
                        p.options.autoPanPaddingBottomRight = L.point(24, 24);
                    }
                    marker.openPopup();
                    // Filet de sécurité : recalcule l'auto-pan après le rendu, au cas où la
                    // popup aurait été mesurée avant que son contenu ait sa taille finale.
                    requestAnimationFrame(function() {
                        if (myToken !== selectionToken || !p || !p.isOpen()) return;
                        if (p._adjustPan) p._adjustPan();
                    });
                }
            }
        }

        timeSlider.addEventListener('input', function(e) {
            selectDay(e.target.value);
        });

        // Boutons Jour précédent / Jour suivant
        var prevBtn = document.getElementById('prevBtn');
        var nextBtn = document.getElementById('nextBtn');

        function updateNavButtons(index) {
            prevBtn.disabled = (index <= 0);
            nextBtn.disabled = (index >= timelineData.length - 1);
        }

        prevBtn.addEventListener('click', function() {
            var curr = parseInt(timeSlider.value);
            if (curr > 0) selectDay(curr - 1);
        });
        nextBtn.addEventListener('click', function() {
            var curr = parseInt(timeSlider.value);
            if (curr < timelineData.length - 1) selectDay(curr + 1);
        });

        // Animation de lecture automatique
        var playBtn = document.getElementById('playBtn');
        var isPlaying = false;
        var playTimer = null;

        playBtn.addEventListener('click', function() {
            if (isPlaying) stopAnimation();
            else startAnimation();
        });

        function startAnimation() {
            isPlaying = true;
            playBtn.innerText = "⏸ Pause";
            playBtn.style.background = "var(--coral)";
            
            playTimer = setInterval(function() {
                var curr = parseInt(timeSlider.value);
                var next = (curr + 1) % timelineData.length;
                selectDay(next);
            }, 4000);
        }

        function stopAnimation() {
            isPlaying = false;
            playBtn.innerText = "▶ Jouer";
            playBtn.style.background = "var(--accent)";
            if (playTimer) clearInterval(playTimer);
        }

        // Gestion des Filtres
        document.getElementById('toggleSteps').addEventListener('change', function(e) {
            if(e.target.checked) map.addLayer(allStepsLayer); else map.removeLayer(allStepsLayer);
        });
        document.getElementById('toggleRoutes').addEventListener('change', function(e) {
            if(e.target.checked) map.addLayer(activeRouteLayer); else map.removeLayer(activeRouteLayer);
        });
        document.getElementById('toggleAcc').addEventListener('change', function(e) {
            if(e.target.checked) map.addLayer(allAccLayer); else map.removeLayer(allAccLayer);
        });
        document.getElementById('toggleResto').addEventListener('change', function(e) {
            if(e.target.checked) map.addLayer(allRestoLayer); else map.removeLayer(allRestoLayer);
        });
        document.getElementById('toggleSausage').addEventListener('change', function(e) {
            if(e.target.checked) map.addLayer(allSausageLayer); else map.removeLayer(allSausageLayer);
        });
        document.getElementById('toggleTbd').addEventListener('change', function(e) {
            if(e.target.checked) map.addLayer(allTbdLayer); else map.removeLayer(allTbdLayer);
        });

        // Compte à rebours avant le départ / statut du voyage
        function updateCountdown() {
            var todayStr = new Date().toISOString().substring(0, 10);
            var firstDate = timelineData[0].date;
            var lastDate = timelineData[timelineData.length - 1].date;
            var diffToStart = Math.round((new Date(firstDate + "T00:00:00") - new Date(todayStr + "T00:00:00")) / 86400000);
            var diffToEnd = Math.round((new Date(lastDate + "T00:00:00") - new Date(todayStr + "T00:00:00")) / 86400000);

            var badge = document.getElementById('countdownBadge');
            if (diffToStart > 0) {
                badge.innerHTML = `<span class="cd-k">Départ</span><span class="cd-v">dans ${diffToStart} jour${diffToStart > 1 ? 's' : ''}</span>`;
            } else if (diffToEnd >= 0) {
                var todayIdx = timelineData.findIndex(d => d.date === todayStr);
                badge.innerHTML = todayIdx >= 0
                    ? `<span class="cd-k">En voyage</span><span class="cd-v">${timelineData[todayIdx].day}</span>`
                    : `<span class="cd-k">En voyage</span>`;
            } else {
                badge.innerHTML = `<span class="cd-k">Voyage terminé</span>`;
            }
            badge.classList.add('visible');
        }

        // Sélectionne le jour demandé par l'URL (#j8, lien partagé), sinon le jour réel du
        // voyage si l'on y est, sinon le premier jour.
        function getInitialDayIndex() {
            var m = (location.hash || '').match(/^#j(\d+)$/i);
            if (m) {
                var wanted = parseInt(m[1]) - 1;
                if (wanted >= 0 && wanted < timelineData.length) return wanted;
            }
            var todayStr = new Date().toISOString().substring(0, 10);
            var idx = timelineData.findIndex(d => d.date === todayStr);
            return idx >= 0 ? idx : 0;
        }

        // ---------- Recherche de lieu ----------
        var searchField = document.getElementById('searchField');
        var searchInput = document.getElementById('placeSearch');
        var searchResults = document.getElementById('searchResults');
        var searchClear = document.getElementById('searchClear');

        var searchIndex = [];
        (function buildSearchIndex() {
            var seen = {};
            timelineData.forEach(function(d, i) {
                (d.points || []).forEach(function(p) {
                    var k = ptKey(p);
                    if (seen[k]) { seen[k].days.push(d.day.split(' - ')[0]); return; }
                    var entry = { key: k, name: p.name, dayIndex: i, days: [d.day.split(' - ')[0]], theme: d.theme, hayName: deaccent(p.name), hayTheme: deaccent(d.theme) };
                    seen[k] = entry;
                    searchIndex.push(entry);
                });
            });
            if (typeof sausagePoints !== 'undefined') {
                sausagePoints.forEach(function(p) {
                    var k = ptKey(p);
                    if (seen[k]) return;
                    var entry = { key: k, name: p.name, dayIndex: null, days: ['Gastronomie'], theme: 'Rougail saucisse', hayName: deaccent(p.name), hayTheme: '' };
                    seen[k] = entry;
                    searchIndex.push(entry);
                });
            }
        })();

        function closeSearch() { searchResults.classList.remove('open'); searchResults.innerHTML = ''; }

        function runSearch(q) {
            var needle = deaccent(q.trim());
            searchField.classList.toggle('filled', q.length > 0);
            if (needle.length < 2) { closeSearch(); return; }
            // Classement par pertinence : le nom du lieu compte plus que le thème du jour
            // (ex. taper "Maïdo" doit remonter "Piton Maïdo" avant les autres étapes du J6/J7
            // qui ne matchent que parce que leur thème contient "Maïdo").
            var hits = searchIndex.map(function(e) {
                var idxName = e.hayName.indexOf(needle);
                var score;
                if (idxName === 0) score = 0;
                else if (idxName > 0) score = 1;
                else if (e.hayTheme.indexOf(needle) >= 0) score = 2;
                else score = -1;
                return { e: e, score: score };
            }).filter(function(x) { return x.score >= 0; })
              .sort(function(a, b) { return a.score - b.score || a.e.name.length - b.e.name.length; })
              .slice(0, 8)
              .map(function(x) { return x.e; });
            if (hits.length === 0) {
                searchResults.innerHTML = '<div class="sr-empty">Aucun lieu ne correspond.</div>';
            } else {
                searchResults.innerHTML = hits.map(function(e, i) {
                    var meta = e.days.join(', ') + ' · ' + e.theme;
                    return '<button class="sr-item" data-hit="' + i + '"><span class="sr-name">' + escapeHtml(e.name) + '</span><span class="sr-meta">' + escapeHtml(meta) + '</span></button>';
                }).join('');
                searchResults.querySelectorAll('.sr-item').forEach(function(btn) {
                    btn.addEventListener('click', function() {
                        var e = hits[parseInt(btn.getAttribute('data-hit'))];
                        goToPlace(e);
                    });
                });
            }
            searchResults.classList.add('open');
        }

        async function goToPlace(entry) {
            closeSearch();
            searchInput.value = '';
            searchField.classList.remove('filled');
            if (entry.dayIndex !== null) {
                await selectDay(entry.dayIndex, { skipPopup: true });
            }
            var mk = markersRegistry[entry.key];
            if (mk) {
                await whenMapIdle(1500);
                var p = mk.getPopup();
                if (p) {
                    p.options.autoPanPaddingTopLeft = L.point(panelOffset() + 24, 120);
                    p.options.autoPanPaddingBottomRight = L.point(24, 24);
                }
                mk.openPopup();
            }
            if (window.innerWidth <= 520) setPanel(false);
        }

        searchInput.addEventListener('input', function(e) { runSearch(e.target.value); });
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') { searchInput.value = ''; closeSearch(); searchField.classList.remove('filled'); }
            if (e.key === 'Enter') {
                var first = searchResults.querySelector('.sr-item');
                if (first) first.click();
            }
        });
        searchClear.addEventListener('click', function() {
            searchInput.value = ''; closeSearch(); searchField.classList.remove('filled'); searchInput.focus();
        });
        document.addEventListener('click', function(e) {
            if (!searchField.contains(e.target) && !searchResults.contains(e.target)) closeSearch();
        });

        // ---------- À réserver ----------
        function renderBookings() {
            var items = collectBookings();
            var section = document.getElementById('bookingSection');
            var list = document.getElementById('bookingList');
            var hint = document.getElementById('bookingHint');
            if (items.length === 0) { section.style.display = 'none'; return; }
            hint.textContent = items.length + (items.length > 1 ? ' prestations' : ' prestation');
            list.innerHTML = items.map(function(it, i) {
                return '<button class="booking-item" data-i="' + i + '">' +
                    '<span class="bk-day">' + escapeHtml(it.day) + '</span>' +
                    '<span class="bk-name">' + escapeHtml(it.name) + '</span>' +
                    '<span class="bk-note">' + it.note + '</span></button>';
            }).join('');
            list.querySelectorAll('.booking-item').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    var it = items[parseInt(btn.getAttribute('data-i'))];
                    selectDay(it.dayIndex);
                    if (window.innerWidth <= 520) setPanel(false);
                });
            });
        }

        window.addEventListener('hashchange', function() {
            var idx = getInitialDayIndex();
            if (idx !== parseInt(timeSlider.value)) selectDay(idx);
        });

        // Vue d'ensemble : superpose les trajets de tous les jours sur la carte
        var overviewRouteLayer = L.layerGroup();
        var overviewMode = false;
        var overviewBtn = document.getElementById('overviewBtn');

        function getOverviewLabel(active) {
            var isMobile = window.innerWidth <= 480;
            if (active) return isMobile ? "Quitter" : "Quitter la vue d'ensemble";
            return isMobile ? "Vue d'ensemble" : "Vue d'ensemble · tous les trajets";
        }

        function exitOverview() {
            overviewMode = false;
            overviewBtn.classList.remove('active');
            overviewBtn.innerText = getOverviewLabel(false);
            map.removeLayer(overviewRouteLayer);
            // Bug corrigé : toggleOverview() détache activeRouteLayer de la carte en entrant
            // dans la vue d'ensemble (map.removeLayer), mais ne le rattachait jamais en sortant —
            // les trajets étaient bien redessinés dans le calque par selectDay(), mais dans un
            // calque qui n'était plus posé sur la carte, donc invisible. On respecte l'état de
            // la case "Trajet routier du jour" plutôt que de le forcer à true.
            if (document.getElementById('toggleRoutes').checked) map.addLayer(activeRouteLayer);
        }

        async function toggleOverview() {
            // La vue d'ensemble montre tout : on rend leur pleine opacité aux marqueurs et on
            // retire les numéros, qui n'ont de sens que pour un jour précis.
            if (!overviewMode) {
                Object.keys(markersRegistry).forEach(function(k) {
                    if (markersRegistry[k].setOpacity) markersRegistry[k].setOpacity(1);
                });
                numberLayer.clearLayers();
            }
            if (overviewMode) {
                exitOverview();
                selectDay(parseInt(timeSlider.value));
                return;
            }

            overviewMode = true;
            overviewBtn.classList.add('active');
            overviewBtn.innerText = getOverviewLabel(true);
            map.removeLayer(activeRouteLayer);
            overviewRouteLayer.clearLayers();

            for (var i = 0; i < timelineData.length; i++) {
                var d = timelineData[i];
                var routeDataArr = await fetchDayRoutes(i, d.points);
                if (!overviewMode) return; // l'utilisateur a quitté la vue entre-temps
                routeDataArr.forEach(function(routeData) {
                    var latLngs = routeData.geometry.coordinates.map(c => [c[1], c[0]]);
                    L.polyline(latLngs, { color: d.color, weight: 4, opacity: 0.75 })
                        .bindPopup(`<b>${d.day}</b> — ${d.title}`)
                        .addTo(overviewRouteLayer);
                });
            }

            if (!overviewMode) return;
            map.addLayer(overviewRouteLayer);
            var allLatLngs = [];
            timelineData.forEach(d => d.points.forEach(p => allLatLngs.push([p.lat, p.lng])));
            map.flyToBounds(L.latLngBounds(allLatLngs), {
                paddingTopLeft: L.point(panelOffset() + 40, 60),
                paddingBottomRight: L.point(40, 40),
                duration: 1.0
            });
        }

        overviewBtn.addEventListener('click', toggleOverview);

        // Convertit un horaire ("9h10", "17h00 - 00h00"...) en minutes depuis 00h00, pour
        // trier les activités d'une journée dans l'ordre chronologique. On se base sur l'heure
        // de début de chaque créneau ; les horaires manquants sont envoyés en fin de liste.
        // (port depuis la carte Blois)
        function timeSortKey(str) {
            if (!str) return 9999;
            var m = str.match(/(\d{1,2})h(\d{2})/);
            if (!m) return 9999;
            return parseInt(m[1]) * 60 + parseInt(m[2]);
        }

        // Vue imprimable / export PDF : génère une feuille de route texte complète, avec
        // horaires quand ils sont connus. Fusionne les points géolocalisés et les activités
        // sans lieu précis (extras) dans une seule liste triée par heure (port depuis Blois).
        // URL d'itinéraire Google Maps pour la journée (départ, étapes, arrivée) : encodée dans
        // un QR code pour lancer la navigation depuis la feuille papier, sans retaper les lieux.
        async function renderPrintView() {
            var html = `<h1>${TRIP_CONFIG.printTitle}</h1>`;

            for (var i = 0; i < timelineData.length; i++) {
                var d = timelineData[i];
                var routes = await fetchDayRoutes(i, d.points);
                var w = await fetchDayWeather(d.center[0], d.center[1], d.date);
                var s = await fetchSunTimes(d.center[0], d.center[1], d.date);
                var stay = (d.points || []).filter(function(p) { return p.icon === 'house'; }).slice(-1)[0];

                var totalKm = 0, totalSec = 0;
                routes.forEach(function(r) { totalKm += r.distance / 1000; totalSec += r.duration; });
                var mins = Math.round(totalSec / 60);
                var routeStr = routes.length > 0
                    ? totalKm.toFixed(0) + ' km · ~' + (mins >= 60 ? Math.floor(mins / 60) + 'h' + (mins % 60 < 10 ? '0' : '') + (mins % 60) : mins + ' min')
                    : 'Journée sur place';

                var meta = '<span><i>Trajet</i> <b>' + routeStr + '</b></span>';
                if (w) meta += '<span><i>Météo</i> <b>' + w.tempMin.toFixed(0) + '–' + w.tempMax.toFixed(0) + '°C</b> ' + w.label + '</span>';
                if (s) meta += '<span><i>Soleil</i> <b>' + s.sunrise + ' → ' + s.sunset + '</b></span>';
                if (stay) meta += '<span><i>Nuit</i> <b>' + stay.name + '</b></span>';

                html += '<div class="print-day">' +
                    '<div class="print-head"><div class="print-head-main">' +
                    '<div class="print-day-theme">' + d.theme + '</div>' +
                    '<div class="print-day-title">' + d.day + ' — ' + d.title + '</div>' +
                    '<div class="print-meta">' + meta + '</div>' +
                    '</div></div><ul>';

                var items = d.points.map(function(p) {
                    return { time: p.time, name: p.name, onFoot: p.onFoot };
                });
                if (d.extras) items = items.concat(d.extras);
                items.sort(function(a, b) { return timeSortKey(a.time) - timeSortKey(b.time); });

                items.forEach(function(item) {
                    var timeLabel = item.time ? '<b>' + item.time + '</b> : ' : '';
                    var footTag = item.onFoot ? ' (accessible à pied uniquement)' : '';
                    html += '<li' + (item.onFoot ? ' class="on-foot"' : '') + '>' + timeLabel + item.name + footTag + '</li>';
                });

                html += '</ul>';
                html += '</div>';
            }

            var view = document.getElementById('printView');
            view.innerHTML = html;
        }

        document.getElementById('printBtn').addEventListener('click', async function() {
            var btn = this;
            var label = btn.textContent;
            btn.disabled = true;
            btn.textContent = 'Préparation…';
            try {
                await renderPrintView();
                window.print();
            } finally {
                btn.disabled = false;
                btn.textContent = label;
            }
        });

        // Chargement initial
        document.title = TRIP_CONFIG.pageTitle;
        var headerEl = document.querySelector('.sb-head h3');
        if (headerEl) headerEl.textContent = TRIP_CONFIG.headerTitle;
        if (searchInput) searchInput.setAttribute('placeholder', TRIP_CONFIG.searchPlaceholder);
        var statKEl = document.getElementById('summaryHikes') && document.getElementById('summaryHikes').previousElementSibling;
        if (statKEl && statKEl.classList.contains('stat-k')) statKEl.textContent = TRIP_CONFIG.optionalStatKey;

        selectDay(getInitialDayIndex());
        computeTripSummary();
        computeHikeCount();
        computeDayCount();
        renderLegendDates();
        prunePanelEntries();
        renderBookings();
        updateCountdown();
        overviewBtn.innerText = getOverviewLabel(false);
    