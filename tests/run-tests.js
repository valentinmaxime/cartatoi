#!/usr/bin/env node
/**
 * Tests automatiques de l'app carte de voyage.
 *
 * Chaque vérification ci-dessous correspond à un vrai bug rencontré au fil du
 * développement (voir le prompt de reprise, section "pièges") : CSS var non
 * définie, ID HTML manquant, chevauchement de calques, etc. Ce script les
 * réunit pour ne plus jamais les rater silencieusement.
 *
 * Usage : node tests/run-tests.js
 * Code de sortie 0 si tout passe, 1 sinon (utilisable en CI GitHub Actions).
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const TRIPS = ['reunion', 'blois'];

let failures = 0;
let checks = 0;

function pass(label) {
    checks++;
    console.log(`  \x1b[32m✓\x1b[0m ${label}`);
}
function fail(label, detail) {
    checks++;
    failures++;
    console.log(`  \x1b[31m✗ ${label}\x1b[0m`);
    if (detail) console.log(`    ${String(detail).split('\n').join('\n    ')}`);
}
function section(title) {
    console.log(`\n${title}`);
}

function read(file) {
    return fs.readFileSync(path.join(ROOT, file), 'utf8');
}
function exists(file) {
    return fs.existsSync(path.join(ROOT, file));
}

// ============================================================================
// 1. Syntaxe JS (node --check)
// ============================================================================
section('1. Syntaxe JavaScript');
for (const f of ['app.js', 'reunion-data.js', 'blois-data.js', 'sw.js']) {
    if (!exists(f)) { fail(`${f} : fichier absent`); continue; }
    try {
        execSync(`node --check "${path.join(ROOT, f)}"`, { stdio: 'pipe' });
        pass(`${f} : syntaxe valide`);
    } catch (e) {
        fail(`${f} : erreur de syntaxe`, e.stderr ? e.stderr.toString() : e.message);
    }
}

// ============================================================================
// 2. JSON valides (manifests)
// ============================================================================
section('2. Manifests JSON');
for (const f of ['manifest-reunion.json', 'manifest-blois.json', 'manifest-hub.json']) {
    if (!exists(f)) { fail(`${f} : fichier absent`); continue; }
    try {
        const data = JSON.parse(read(f));
        if (!data.icons || data.icons.length < 2) {
            fail(`${f} : moins de 2 icônes déclarées`);
        } else {
            pass(`${f} : JSON valide, icônes présentes`);
        }
    } catch (e) {
        fail(`${f} : JSON invalide`, e.message);
    }
}

// ============================================================================
// 3. Variables CSS utilisées mais jamais définies
//    (bug réel : --coral et --accent utilisés en JS/CSS sans jamais être
//    déclarées dans :root -> bouton qui devient invisible)
// ============================================================================
section('3. Variables CSS (var(--x) sans déclaration)');
{
    const css = read('app.css');
    const js = exists('app.js') ? read('app.js') : '';
    const defined = new Set([...css.matchAll(/--([a-zA-Z0-9-]+)\s*:/g)].map(m => m[1]));
    const used = new Set([
        ...[...css.matchAll(/var\(--([a-zA-Z0-9-]+)/g)].map(m => m[1]),
        ...[...js.matchAll(/var\(--([a-zA-Z0-9-]+)/g)].map(m => m[1]),
    ]);
    // Certaines variables sont posées dynamiquement en JS via setProperty (pas
    // dans :root) : whitelist connue, à jour au moment de l'écriture de ce test.
    const dynamicallySet = new Set(['fb-h', 'day-color', 'item-color', 'card-accent', 'fb-color', 'num-bg']);
    const missing = [...used].filter(v => !defined.has(v) && !dynamicallySet.has(v));
    if (missing.length) {
        fail(`Variable(s) CSS jamais définies : ${missing.join(', ')}`,
            'Déclarer dans :root, ou ajouter à dynamicallySet dans ce test si posée en JS via setProperty.');
    } else {
        pass(`Toutes les variables CSS utilisées sont définies (${used.size} vérifiées)`);
    }
}

// ============================================================================
// 4. IDs référencés en JS mais absents du HTML
//    (bug réel : #printView utilisé par app.js pour l'export PDF, disparu du
//    HTML lors d'une reconstruction -> export PDF cassé silencieusement)
// ============================================================================
section('4. Cohérence des ID (JS ↔ HTML)');
{
    const js = read('app.js');
    const html = read('carte.html');
    const jsIds = new Set([...js.matchAll(/getElementById\('([^']+)'\)/g)].map(m => m[1]));
    const htmlIds = new Set([...html.matchAll(/id="([^"]+)"/g)].map(m => m[1]));
    // Certains ID sont créés dynamiquement par le JS lui-même (pas censés préexister dans le HTML statique).
    const createdDynamically = new Set(['locateToast']);
    const missing = [...jsIds].filter(id => !htmlIds.has(id) && !createdDynamically.has(id));
    if (missing.length) {
        fail(`ID demandé(s) par app.js mais absent(s) de carte.html : ${missing.join(', ')}`,
            'Si l\'ID est créé dynamiquement par le JS (document.createElement), l\'ajouter à createdDynamically dans ce test.');
    } else {
        pass(`Tous les ID de app.js existent dans carte.html (${jsIds.size} vérifiés)`);
    }
}

// ============================================================================
// 5. Équilibre des balises HTML (carte.html)
// ============================================================================
section('5. Équilibre des balises HTML');
{
    const html = read('carte.html');
    const tags = ['div', 'a', 'button', 'svg', 'span', 'script'];
    let ok = true;
    for (const tag of tags) {
        const opens = (html.match(new RegExp(`<${tag}(\\s|>)`, 'g')) || []).length;
        const closes = (html.match(new RegExp(`</${tag}>`, 'g')) || []).length;
        if (opens !== closes) {
            fail(`Balise <${tag}> déséquilibrée : ${opens} ouverte(s), ${closes} fermée(s)`);
            ok = false;
        }
    }
    if (ok) pass(`Toutes les balises HTML vérifiées sont équilibrées (${tags.join(', ')})`);
}

// ============================================================================
// 6. Cohérence des données de voyage (structure minimale attendue)
// ============================================================================
section('6. Structure des fichiers de données');
for (const trip of TRIPS) {
    const f = `${trip}-data.js`;
    if (!exists(f)) { fail(`${f} : fichier absent`); continue; }
    const content = read(f);
    const requiredConfigFields = ['pageTitle', 'headerTitle', 'mapCenter', 'mapZoom', 'geoapifyKey', 'googleMapsRegion'];
    const missingFields = requiredConfigFields.filter(field => !content.includes(field + ':'));
    if (missingFields.length) {
        fail(`${f} : champ(s) TRIP_CONFIG manquant(s) : ${missingFields.join(', ')}`);
    } else {
        pass(`${f} : TRIP_CONFIG complet`);
    }
    if (!content.includes('var timelineData')) {
        fail(`${f} : timelineData introuvable`);
    } else {
        pass(`${f} : timelineData présent`);
    }
    if (!content.includes('var specialtyPoints')) {
        fail(`${f} : specialtyPoints introuvable (doit exister même vide : [])`);
    } else {
        pass(`${f} : specialtyPoints présent`);
    }
}

// ============================================================================
// 7. Exécution simulée (jsdom) : charge chaque voyage dans un DOM réaliste,
//    vérifie l'absence d'exception, puis simule quelques interactions clés.
// ============================================================================
section('7. Exécution simulée (jsdom)');
{
    let JSDOM;
    try {
        JSDOM = require('jsdom').JSDOM;
    } catch (e) {
        fail('jsdom non installé', 'Lancer : npm install (jsdom doit être en devDependency)');
        JSDOM = null;
    }

    if (JSDOM) {
        for (const trip of TRIPS) {
            try {
                runSmokeTest(trip, JSDOM);
                pass(`${trip} : chargement + interactions de base sans exception`);
            } catch (e) {
                fail(`${trip} : erreur pendant l'exécution simulée`, e.stack ? e.stack.split('\n').slice(0, 4).join('\n') : e.message);
            }
        }
    }
}

function runSmokeTest(trip, JSDOM) {
    let html = read('carte.html');
    html = html.replace(/<script src="https:\/\/unpkg[^"]*"><\/script>/g, '');
    html = html.replace(/<link rel="stylesheet" href="https:\/\/fonts[^"]*">/g, '');
    // Ne retire que le DERNIER <script> inline (le loader dynamique), en laissant
    // intact celui du <head> (TRIP_META) et tout le HTML du body.
    const scripts = [...html.matchAll(/<script>[\s\S]*?<\/script>/g)];
    const last = scripts[scripts.length - 1];
    html = html.slice(0, last.index) + html.slice(last.index + last[0].length);

    const dom = new JSDOM(html, { runScripts: 'outside-only', url: `https://example.com/carte.html?trip=${trip}`, pretendToBeVisual: true });
    const { window } = dom;

    function makeFakeLeaflet() {
        const handler = {
            get(target, prop) {
                if (prop === 'then' || prop === Symbol.iterator) return undefined;
                if (prop === Symbol.toPrimitive) return (hint) => (hint === 'number' ? 1200 : 'fake');
                return makeFakeLeaflet();
            },
        };
        return new Proxy(function () { return makeFakeLeaflet(); }, handler);
    }
    window.L = makeFakeLeaflet();
    window.ResizeObserver = function () { return { observe() {}, disconnect() {} }; };
    window.fetch = function () { return Promise.resolve({ json: () => Promise.resolve({}) }); };
    window.requestAnimationFrame = function (cb) { return setTimeout(cb, 0); };
    const lsStore = {};
    window.localStorage = {
        getItem: (k) => (Object.prototype.hasOwnProperty.call(lsStore, k) ? lsStore[k] : null),
        setItem: (k, v) => { lsStore[k] = String(v); },
        removeItem: (k) => { delete lsStore[k]; },
    };

    window.eval(read(`${trip}-data.js`));
    window.eval(read('app.js'));

    // Interaction : le bouton Jouer doit changer de texte au clic (bug réel :
    // --accent/--coral non définies rendaient le bouton invisible, pas testé
    // avant que l'utilisateur ne le signale ; ce test vérifie la MÉCANIQUE,
    // pas le rendu visuel des couleurs, que jsdom ne peut pas juger).
    const playBtn = window.document.getElementById('playBtn');
    if (!playBtn) throw new Error('playBtn introuvable dans le DOM après chargement');
    const before = playBtn.innerText;
    playBtn.dispatchEvent(new window.Event('click', { bubbles: true }));
    if (playBtn.innerText === before) {
        throw new Error(`playBtn.innerText inchangé après clic ("${before}") — le gestionnaire de clic ne fonctionne pas`);
    }
    playBtn.dispatchEvent(new window.Event('click', { bubbles: true })); // remet en pause pour ne pas laisser de setInterval actif

    // Interaction : le panneau doit pouvoir s'ouvrir/se fermer.
    const burgerBtn = window.document.getElementById('burgerBtn');
    const sidebar = window.document.getElementById('sidebar');
    if (!burgerBtn || !sidebar) throw new Error('burgerBtn ou sidebar introuvable');
    burgerBtn.dispatchEvent(new window.Event('click', { bubbles: true }));
    if (!sidebar.classList.contains('open')) throw new Error('Le panneau ne s\'ouvre pas au clic sur burgerBtn');
}

// ============================================================================
// Résumé
// ============================================================================
console.log(`\n${'='.repeat(60)}`);
if (failures === 0) {
    console.log(`\x1b[32mTous les tests passent (${checks}/${checks}).\x1b[0m`);
    process.exit(0);
} else {
    console.log(`\x1b[31m${failures} échec(s) sur ${checks} vérification(s).\x1b[0m`);
    process.exit(1);
}
