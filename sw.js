const cacheName = 'version 1';
const cacheFiles = [
					'./',
					'./js/',
					'./css/'
					]


self.addEventListener('install', (e) => {
		console.log(`Installing SW`);
	e.waitUntil(
				caches.open('cacheName')
				.then((cache) => {
					console.log(`Adding cacheFiles`);
					return cache.addAll(cacheFiles);
					console.log(...cacheFiles);
					console.log(`SW installed`)
				})
			)
});


self.addEventListener('activate', (e) => {
	console.log(`Activating SW`);
	e.waitUntil(
				caches.keys()
				.then((cacheNames) => {
					return Promise.all(
							cacheNames.map((thisCacheName) => {
								if(thisCacheName !== cacheName){
									console.log(`Deleting cacheFiles from ${cacheName}`);
									return caches.delete(thisCacheName);
								}
							})
						)
				console.log(`SW activated`)
				})
		)
});


self.addEventListener('fetch', (e) => {
	console.log(`Fetching ${e.request.url}`);
	e.respondWith(
			caches.match(e.request)
			.then((res1) => {
				if(res1){
					console.log(`Match of ${e.request.url} found in SW`);
					return res1;
				}

				let clonedRequest = e.request.clone();

				fetch(clonedRequest)
				.then((res2) => {
					if(!res2){
						console.log(`No response from new fetch by SW`);
					}

				let clonedResponse = res2.clone();

					caches.open(cacheName)
					.then((cache) => {
						console.log(`New Data fetched & cached by SW`);
						cache.put(e.request, clonedResponse);
						return res2;
					})
				})
				.catch((err) => {
					console.log(`Error in Fetching & Caching by SW`);
				})
			})

		)
});







// var CACHE = 'cache-update-and-refresh';

// // On install, cache some resource.
// self.addEventListener('install', function(evt) {
//   console.log('The service worker is being installed.');
//   // Open a cache and use `addAll()` with an array of assets to add all of them
//   // to the cache. Ask the service worker to keep installing until the
//   // returning promise resolves.
//   evt.waitUntil(caches.open(CACHE).then(function (cache) {
//     cache.addAll([
//       './controlled.html',
//       './asset'
//     ]);
//   }));
// });

// // On fetch, use cache but update the entry with the latest contents
// // from the server.
// self.addEventListener('fetch', function(evt) {
//   console.log('The service worker is serving the asset.');
//   // You can use `respondWith()` to answer ASAP...
//   evt.respondWith(fromCache(evt.request));
//   // ...and `waitUntil()` to prevent the worker to be killed until
//   // the cache is updated.
//   evt.waitUntil(
//     update(evt.request)
//     // Finally, send a message to the client to inform it about the
//     // resource is up to date.
//     .then(refresh)
//   );
// });

// // Open the cache where the assets were stored and search for the requested
// // resource. Notice that in case of no matching, the promise still resolves
// // but it does with `undefined` as value.
// function fromCache(request) {
//   return caches.open(CACHE).then(function (cache) {
//     return cache.match(request);
//   });
// }


// // Update consists in opening the cache, performing a network request and
// // storing the new response data.
// function update(request) {
//   return caches.open(CACHE).then(function (cache) {
//     return fetch(request).then(function (response) {
//       return cache.put(request, response.clone()).then(function () {
//         return response;
//       });
//     });
//   });
// }

// // Sends a message to the clients.
// function refresh(response) {
//   return self.clients.matchAll().then(function (clients) {
//     clients.forEach(function (client) {
//       // Encode which resource has been updated. By including the
//       // [ETag](https://en.wikipedia.org/wiki/HTTP_ETag) the client can
//       // check if the content has changed.
//       var message = {
//         type: 'refresh',
//         url: response.url,
//         // Notice not all servers return the ETag header. If this is not
//         // provided you should use other cache headers or rely on your own
//         // means to check if the content has changed.
//         eTag: response.headers.get('ETag')
//       };
//       // Tell the client about the update.
//       client.postMessage(JSON.stringify(message));
//     });
//   });
// }
