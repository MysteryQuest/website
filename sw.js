const CACHE = 'unverified-file-shell-v3';
const SHELL = [
  '/', '/index.html', '/case-files.html', '/case.html', '/broadcasts.html', '/methodology.html', '/about.html',
  '/archive.html', '/map.html', '/labs.html', '/investigations.html', '/uap-alignments.html', '/hoax.html',
  '/article.html', '/detail.html', '/offline.html', '/styles.css', '/evidence-platform.css',
  '/js/header.js', '/js/footer.js', '/logo.png', '/icon-192.png', '/icon-512.png'
];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== location.origin) return;
  const acceptsHtml = event.request.mode === 'navigate';
  event.respondWith(fetch(event.request).then(response => {
    if (response.ok) caches.open(CACHE).then(cache => cache.put(event.request, response.clone()));
    return response;
  }).catch(() => caches.match(event.request).then(hit => hit || (acceptsHtml ? caches.match('/offline.html') : Response.error()))));
});
