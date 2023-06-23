const CACHE_NAME = 'image-cache-v1';

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			console.log('Opened image cache:', CACHE_NAME);
		})
	);
});

function isImageRequest(request) {
	return request.headers.get('Accept').includes('image');
}

self.addEventListener('fetch', (event) => {
	const requestUrl = new URL(event.request.url);

	if (isImageRequest(event.request)) {
		event.respondWith(
			caches.match(event.request).then((response) => {
				if (response) {
					return response;
				}

				return fetch(event.request).then((networkResponse) => {
					if (networkResponse.status >= 400) {
						throw new Error('Network response not successful');
					}

					caches.open(CACHE_NAME).then((cache) => {
						cache.put(event.request, networkResponse.clone());
					});

					return networkResponse;
				});
			})
		);
	} else {
		event.respondWith(fetch(event.request));
	}
});
