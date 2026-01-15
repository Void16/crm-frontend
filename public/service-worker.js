// service-worker.js

// ⚠️ IMPORTANT: Update these version numbers EVERY TIME you deploy changes
const CACHE_NAME = "crm-cache-v1.3.0";
const APP_VERSION = "1.3.0";

// App shell - static assets that make up your PWA
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/bi192.png",
  "/bi500.png",
  // Add any other critical static assets here
];

// API paths to bypass - never cache these
const API_PATHS = ['/api/', '/auth/', '/register/', '/login/'];
const isApiRequest = (url) => API_PATHS.some(path => url.includes(path));

// ============================================
// INSTALL EVENT - Runs when service worker is installed
// ============================================
self.addEventListener("install", (event) => {
  console.log(`📦 Service Worker v${APP_VERSION}: Installing...`);
  
  // Force activation immediately without waiting
  self.skipWaiting();
  
  // Cache the app shell
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log(`📦 Caching app shell with ${urlsToCache.length} assets`);
        return cache.addAll(urlsToCache).catch(error => {
          console.error('Failed to cache some assets:', error);
          // Continue even if some assets fail to cache
        });
      })
      .then(() => {
        console.log(`✅ Service Worker v${APP_VERSION}: Installation complete`);
      })
      .catch(error => {
        console.error(`❌ Service Worker installation failed:`, error);
      })
  );
});

// ============================================
// ACTIVATE EVENT - Runs when service worker becomes active
// ============================================
self.addEventListener("activate", (event) => {
  console.log(`🔄 Service Worker v${APP_VERSION}: Activating...`);
  
  event.waitUntil(
    // Clean up old caches
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log(`🗑️ Deleting old cache: ${name}`);
            return caches.delete(name);
          })
      );
    })
    .then(() => {
      console.log(`✅ Old caches cleaned up`);
      
      // Take control of all clients immediately
      return self.clients.claim();
    })
    .then(() => {
      console.log(`🎯 Service Worker v${APP_VERSION}: Now controlling clients`);
      
      // Notify all open clients about the update
      return self.clients.matchAll();
    })
    .then((clients) => {
      clients.forEach((client) => {
        console.log(`📢 Notifying client about update v${APP_VERSION}`);
        client.postMessage({
          type: 'APP_UPDATED',
          version: APP_VERSION,
          timestamp: new Date().toISOString()
        });
      });
    })
    .catch(error => {
      console.error(`❌ Activation failed:`, error);
    })
  );
});

// ============================================
// MESSAGE EVENT - Handle messages from clients
// ============================================
self.addEventListener('message', (event) => {
  console.log(`📨 Service Worker received message:`, event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log(`⏩ Skipping waiting phase`);
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CHECK_FOR_UPDATES') {
    console.log(`🔍 Manual update check requested`);
    // You could implement update checking logic here
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    // Respond with current version
    event.ports[0].postMessage({
      type: 'VERSION_INFO',
      version: APP_VERSION,
      cacheName: CACHE_NAME
    });
  }
});

// ============================================
// FETCH EVENT - Handle network requests
// ============================================
self.addEventListener("fetch", (event) => {
  const requestUrl = event.request.url;
  const requestMethod = event.request.method;
  
  // ⚠️ Skip API requests - never cache these
  if (isApiRequest(requestUrl)) {
    console.log(`🌐 Bypassing API request: ${requestMethod} ${requestUrl}`);
    return; // Let browser handle API requests
  }
  
  // ⚠️ Skip non-GET requests
  if (requestMethod !== 'GET') {
    console.log(`🚫 Bypassing non-GET request: ${requestMethod} ${requestUrl}`);
    return;
  }
  
  // ⚠️ Skip browser extensions and devtools
  if (requestUrl.startsWith('chrome-extension://') || 
      requestUrl.includes('chrome://') || 
      requestUrl.includes('safari-extension://')) {
    return;
  }
  
  // Handle GET requests for static assets
  console.log(`🔄 Handling request: ${requestUrl}`);
  
  event.respondWith(
    // Try network first for fresh content
    fetch(event.request)
      .then((networkResponse) => {
        // Validate response
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }
        
        // Clone response for caching
        const responseToCache = networkResponse.clone();
        
        // Update cache in background
        caches.open(CACHE_NAME)
          .then((cache) => {
            console.log(`💾 Caching updated resource: ${requestUrl}`);
            cache.put(event.request, responseToCache);
          })
          .catch(error => {
            console.error(`❌ Failed to cache: ${requestUrl}`, error);
          });
        
        return networkResponse;
      })
      .catch((networkError) => {
        console.log(`📡 Network failed, trying cache: ${requestUrl}`);
        
        // Network failed, try cache
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              console.log(`✅ Serving from cache: ${requestUrl}`);
              return cachedResponse;
            }
            
            // If navigation request and no cache, return offline page
            if (event.request.mode === 'navigate') {
              console.log(`🏠 Serving offline page for: ${requestUrl}`);
              return caches.match('/index.html');
            }
            
            // For other failed requests
            console.log(`❌ No cache available for: ${requestUrl}`);
            
            // You could return a custom offline page for other assets
            if (requestUrl.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
              return caches.match('/bi192.png');
            }
            
            return new Response(`
              <!DOCTYPE html>
              <html>
                <head>
                  <title>Offline - CRM BI Solutions</title>
                  <style>
                    body {
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      height: 100vh;
                      margin: 0;
                      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                      color: white;
                    }
                    .offline-container {
                      text-align: center;
                      padding: 2rem;
                      background: rgba(255,255,255,0.1);
                      backdrop-filter: blur(10px);
                      border-radius: 20px;
                      max-width: 400px;
                    }
                    h1 { margin-bottom: 1rem; }
                    p { opacity: 0.8; }
                  </style>
                </head>
                <body>
                  <div class="offline-container">
                    <h1>📡 You're Offline</h1>
                    <p>Please check your internet connection and try again.</p>
                    <p>The CRM BI app requires an internet connection for this feature.</p>
                  </div>
                </body>
              </html>
            `, {
              status: 200,
              headers: { 'Content-Type': 'text/html' }
            });
          });
      })
  );
});

// ============================================
// SYNC EVENT - Handle background sync
// ============================================
self.addEventListener('sync', (event) => {
  console.log(`🔄 Background sync event: ${event.tag}`);
  
  if (event.tag === 'update-check') {
    event.waitUntil(
      // You could implement periodic update checking here
      checkForUpdates()
    );
  }
});

// ============================================
// PUSH EVENT - Handle push notifications
// ============================================
self.addEventListener('push', (event) => {
  console.log(`🔔 Push notification received`);
  
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'New update available!',
      icon: '/bi192.png',
      badge: '/bi192.png',
      vibrate: [200, 100, 200],
      data: {
        url: data.url || '/',
        version: APP_VERSION
      },
      actions: [
        {
          action: 'update',
          title: 'Update Now'
        },
        {
          action: 'close',
          title: 'Dismiss'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'CRM BI Update', options)
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  console.log(`🔔 Notification clicked: ${event.action}`);
  
  event.notification.close();
  
  if (event.action === 'update') {
    // Tell service worker to update
    self.skipWaiting();
    
    // Open app
    event.waitUntil(
      clients.openWindow('/')
    );
  } else {
    // Default action - open app
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

// ============================================
// HELPER FUNCTIONS
// ============================================

async function checkForUpdates() {
  try {
    // This is where you could check for updates from your server
    console.log(`🔍 Checking for updates...`);
    
    // Example: Check if there's a new version available
    // const response = await fetch('/api/version');
    // const serverVersion = await response.text();
    
    // if (serverVersion !== APP_VERSION) {
    //   console.log(`🆕 New version available: ${serverVersion}`);
    //   self.registration.update();
    // }
    
    return true;
  } catch (error) {
    console.error(`❌ Update check failed:`, error);
    return false;
  }
}

// ============================================
// ERROR HANDLING
// ============================================
self.addEventListener('error', (event) => {
  console.error(`💥 Service Worker error:`, event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error(`💥 Service Worker unhandled rejection:`, event.reason);
});

// Log when service worker is ready
self.addEventListener('statechange', () => {
  console.log(`📊 Service Worker state: ${self.state}`);
});

console.log(`🚀 Service Worker v${APP_VERSION} loaded successfully`);