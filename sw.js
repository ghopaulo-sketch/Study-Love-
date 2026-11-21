/* StudyLove - service worker: guarda o app no aparelho para funcionar sem internet.
   Ao publicar uma nova versão do app, aumente o número em VERSAO para forçar a atualização. */
const VERSAO = 'studylove-v7';
const ARQUIVOS = [
  './', 'index.html', 'manifest.webmanifest',
  'libs/pdf.min.js', 'libs/pdf.worker.min.js', 'libs/pdf-lib.min.js',
  'fonts/nunito-latin-400-normal.woff2', 'fonts/nunito-latin-700-normal.woff2', 'fonts/nunito-latin-800-normal.woff2',
  'fonts/caveat-latin-400-normal.woff2',
  'fonts/patrick-hand-latin-400-normal.woff2',
  'fonts/kalam-latin-400-normal.woff2',
  'fonts/dancing-script-latin-400-normal.woff2',
  'fonts/pacifico-latin-400-normal.woff2',
  'fonts/lora-latin-400-normal.woff2',
  'fonts/roboto-mono-latin-400-normal.woff2',
  'fonts/indie-flower-latin-400-normal.woff2',
  'fonts/shadows-into-light-latin-400-normal.woff2',
  'fonts/gloria-hallelujah-latin-400-normal.woff2',
  'fonts/handlee-latin-400-normal.woff2',
  'fonts/architects-daughter-latin-400-normal.woff2',
  'fonts/permanent-marker-latin-400-normal.woff2',
  'fonts/amatic-sc-latin-400-normal.woff2',
  'fonts/satisfy-latin-400-normal.woff2',
  'fonts/great-vibes-latin-400-normal.woff2',
  'fonts/lobster-latin-400-normal.woff2',
  'fonts/courgette-latin-400-normal.woff2',
  'fonts/special-elite-latin-400-normal.woff2',
  'fonts/playfair-display-latin-400-normal.woff2',
  'fonts/merriweather-latin-400-normal.woff2',
  'fonts/comfortaa-latin-400-normal.woff2',
  'fonts/fredoka-latin-400-normal.woff2',
  'fonts/bebas-neue-latin-400-normal.woff2',
  'fonts/press-start-2p-latin-400-normal.woff2',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSAO).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSAO).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Abre do cache (rápido e offline) e, havendo internet, atualiza o cache em segundo plano.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.open(VERSAO).then(async c => {
      const guardado = await c.match(req, { ignoreSearch: true });
      const rede = fetch(req).then(r => { if (r && r.ok) c.put(req, r.clone()); return r; }).catch(() => null);
      return guardado || (await rede) || (req.mode === 'navigate' ? c.match('index.html') : Response.error());
    })
  );
});
