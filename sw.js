// Service worker minimal : sert à rendre l'app installable (condition requise par Chrome/
// Android pour proposer "Ajouter à l'écran d'accueil" comme une vraie PWA, pas un simple
// favori), et met en cache les fichiers propres à l'app (pas les tuiles de carte ni les API
// météo/itinéraire — ça, c'est un chantier à part, plus gros, pas fait ici).
var CACHE_NAME = 'carte-voyage-v1';
var CORE_FILES = [
    './app.css',
    './app.js'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(CORE_FILES);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(names) {
            return Promise.all(
                names.filter(function(n) { return n !== CACHE_NAME; })
                     .map(function(n) { return caches.delete(n); })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', function(event) {
    var url = new URL(event.request.url);
    // Seulement le même domaine, et seulement les GET (jamais les API météo/itinéraire ni les
    // tuiles de carte, volontairement hors périmètre ici).
    if (event.request.method !== 'GET' || url.origin !== location.origin) return;

    event.respondWith(
        caches.match(event.request).then(function(cached) {
            var network = fetch(event.request).then(function(response) {
                if (response && response.ok) {
                    var copy = response.clone();
                    caches.open(CACHE_NAME).then(function(cache) { cache.put(event.request, copy); });
                }
                return response;
            }).catch(function() { return cached; });
            // Cache d'abord si dispo (rapide, fonctionne hors-ligne), sinon réseau.
            return cached || network;
        })
    );
});
