var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  '/',
  '/css/styles.css',
  '/js/main.js',
  '/js/dbhelper.js',
  '/js/restaurant_info.js',
  '/restaurant.html?id',
  'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
  'https://api.mapbox.com/mapbox-gl-js/v1.0.0/mapbox-gl.js',
  'https://api.mapbox.com/mapbox-gl-js/v1.0.0/mapbox-gl.css',
  'https://api.tiles.mapbox.com/v4/mapbox.streets/12/1205/1539.jpg70?access_token=pk.eyJ1IjoibWFmZWc5NSIsImEiOiJjangwZDY4bmcxYzA2NDhydjNvcWh5NnptIn0.z5TgfJdzqZ2VFuvMmVMngw',
  'https://api.tiles.mapbox.com/v4/mapbox.streets/12/1206/1539.jpg70?access_token=pk.eyJ1IjoibWFmZWc5NSIsImEiOiJjangwZDY4bmcxYzA2NDhydjNvcWh5NnptIn0.z5TgfJdzqZ2VFuvMmVMngw',
  'https://api.tiles.mapbox.com/v4/mapbox.streets/12/1205/1540.jpg70?access_token=pk.eyJ1IjoibWFmZWc5NSIsImEiOiJjangwZDY4bmcxYzA2NDhydjNvcWh5NnptIn0.z5TgfJdzqZ2VFuvMmVMngw',
  'https://api.tiles.mapbox.com/v4/mapbox.streets/12/1206/1540.jpg70?access_token=pk.eyJ1IjoibWFmZWc5NSIsImEiOiJjangwZDY4bmcxYzA2NDhydjNvcWh5NnptIn0.z5TgfJdzqZ2VFuvMmVMngw',
  'https://api.tiles.mapbox.com/v4/mapbox.streets/12/1204/1539.jpg70?access_token=pk.eyJ1IjoibWFmZWc5NSIsImEiOiJjangwZDY4bmcxYzA2NDhydjNvcWh5NnptIn0.z5TgfJdzqZ2VFuvMmVMngw',
  'https://api.tiles.mapbox.com/v4/mapbox.streets/12/1207/1539.jpg70?access_token=pk.eyJ1IjoibWFmZWc5NSIsImEiOiJjangwZDY4bmcxYzA2NDhydjNvcWh5NnptIn0.z5TgfJdzqZ2VFuvMmVMngw',
  'https://api.tiles.mapbox.com/v4/mapbox.streets/12/1204/1540.jpg70?access_token=pk.eyJ1IjoibWFmZWc5NSIsImEiOiJjangwZDY4bmcxYzA2NDhydjNvcWh5NnptIn0.z5TgfJdzqZ2VFuvMmVMngw',
  'https://api.tiles.mapbox.com/v4/mapbox.streets/12/1207/1540.jpg70?access_token=pk.eyJ1IjoibWFmZWc5NSIsImEiOiJjangwZDY4bmcxYzA2NDhydjNvcWh5NnptIn0.z5TgfJdzqZ2VFuvMmVMngw',
  'http://localhost:8000/marker-icon-2x.png',
  'http://localhost:8000/marker-shadow.png',
  'https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,600,700&amp;subset=cyrillic',
  ];

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});
