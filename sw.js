// ဗားရှင်း နာမည်ကို v1 ကနေ v2 ပြောင်းပေးခြင်းဖြင့် ဖုန်းကို အသစ်လဲခိုင်းတာ ဖြစ်ပါတယ်
const CACHE_NAME = 'converter-v2'; 
const ASSETS = [
  'index.html',
  'manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  // ဖိုင်အသစ်တွေကို ချက်ချင်း အသက်ဝင်စေရန်
  self.skipWaiting(); 
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            // Cache အဟောင်းတွေကို အလိုအလျောက် ဖျက်ပစ်ခြင်း
            return caches.delete(key); 
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
