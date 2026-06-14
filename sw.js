const CACHE_NAME = 'calcu-note-v3'; // Version ကို မြှင့်လိုက်ပါတယ်
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
  // တကယ်လို့ icon ပုံတွေ ရှိတယ်ဆိုရင် အောက်ကစာသားတွေကို content ဖွင့်ပေးပါ
  // './icon-192.png',
  // './icon-512.png'
];

// Install Event - ဖိုင်များကို Cache ထဲ သိမ်းဆည်းခြင်း
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching App Assets...');
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting()) // SW အသစ်ကို ချက်ချင်း အသက်ဝင်စေရန်
  );
});

// Activate Event - Cache အဟောင်းများ ရှင်းလင်းခြင်း
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim()) // စာမျက်နှာအားလုံးကို ချက်ချင်း ထိန်းချုပ်ရန်
  );
});

// Fetch Event - အင်တာနက်မရှိချိန် ဖုန်းထဲက Cache ဒေတာကို ထုတ်ပေးခြင်း
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      // ဖုန်းထဲတွင် ရှိလျှင်၎င်း၊ မရှိလျှင် အင်တာနက်မှ၎င်း ယူမည်
      return cachedResponse || fetch(e.request).catch(() => {
        // အင်တာနက် လုံးဝမရှိဘဲ ဖိုင်ရှာမတွေ့ပါက index.html ကို ပြန်ပြမည်
        if (e.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
