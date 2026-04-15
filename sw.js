const CACHE_NAME = 'my-flashcards-v2.1'; // Thay đổi số này mỗi khi bạn cập nhật code
const urlsToCache = [
  './',
  './index.html',
  'https://cdn.jsdelivr.net/npm/hanzi-writer@3.5/dist/hanzi-writer.min.js'
];

// Cài đặt và lưu các file cần thiết vào bộ nhớ đệm (Cache)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Xóa cache cũ khi có phiên bản mới
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Phản hồi yêu cầu khi không có mạng
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Trả về file từ cache nếu có, nếu không thì tải từ mạng
      return response || fetch(event.request).catch(() => {
        // Nếu là yêu cầu trang chính mà không có mạng, trả về cache gốc
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
