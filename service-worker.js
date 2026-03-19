const CACHE_NAME = 'think-app-v1';
const urlsToCache = [
  '/',
  '/index-pwa.html',
  '/manifest.json'
];

// 安装Service Worker并缓存资源
self.addEventListener('install', event => {
  console.log('Service Worker 安装中...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('缓存打开成功');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('缓存失败:', err);
      })
  );
  self.skipWaiting();
});

// 激活Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker 激活中...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('删除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 拦截请求并返回缓存
self.addEventListener('fetch', event => {
  const url = event.request.url;
  
  // 1. 跳过所有外部CDN请求（避免CORS问题）- 这是最高优先级
  if (url.startsWith('https://esm.sh/') || 
      url.startsWith('https://cdn.jsdelivr.net/') ||
      url.startsWith('https://unpkg.com/')) {
    console.log('Service Worker: 跳过CDN请求', url);
    return; // 完全跳过Service Worker处理，让浏览器直接请求
  }

  // 2. 只处理HTML页面和manifest，其他资源直接通过网络
  if (!url.includes('/index-pwa.html') && !url.includes('/manifest.json')) {
    return fetch(event.request);
  }

  // 3. 处理需要缓存的资源
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('从缓存返回:', url);
          return response;
        }
        return fetch(event.request);
      })
      .catch(err => {
        console.error('缓存失败:', err);
        return fetch(event.request); // 失败时直接网络请求
      })
  );
});

// 后台同步（可选）
self.addEventListener('sync', event => {
  console.log('后台同步:', event.tag);
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  console.log('执行数据同步...');
  // 这里可以添加数据同步逻辑
}
