const CACHE_NAME = 'flashcards-final-v1';
const urlsToCache = ['./', './index.html'];

self.addEventListener('install', e => {
    self.skipWaiting();
    e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(urlsToCache)));
});

self.addEventListener('activate', e => {
    e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))));
});

self.addEventListener('fetch', e => {
    // Chiến lược Network First: Thử lấy từ mạng trước, lỗi mạng mới lấy từ Cache
    e.respondWith(
        fetch(e.request).catch(() => caches.match(e.request))
    );
});
