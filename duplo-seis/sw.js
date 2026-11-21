/**
 * Duplo Seis fora do ar: tudo o que a página carregou uma vez fica guardado.
 * Com rede, vale sempre a versão nova; sem rede, a guardada.
 */
const CACHE = 'duplo-seis-v1';

self.addEventListener('install', (ev) => {
  ev.waitUntil(caches.open(CACHE).then((c) => c.addAll(['./', 'duplo-seis.css', 'ui.js'])).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (ev) => {
  ev.waitUntil(
    caches.keys()
      .then((nomes) => Promise.all(nomes.filter((n) => n.startsWith('duplo-seis-') && n !== CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (ev) => {
  const req = ev.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const daCasa = url.origin === location.origin && url.pathname.startsWith(new URL('./', location.href).pathname);
  const fonte = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (!daCasa && !fonte) return;
  ev.respondWith(
    fetch(req)
      .then((resp) => {
        if (resp.ok || resp.type === 'opaque') {
          const copia = resp.clone();
          caches.open(CACHE).then((c) => c.put(req, copia));
        }
        return resp;
      })
      .catch(() => caches.match(req, { ignoreSearch: req.mode === 'navigate' }).then((r) => r ?? caches.match('./'))),
  );
});
