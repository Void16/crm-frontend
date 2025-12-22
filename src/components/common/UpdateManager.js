// components/common/UpdateManager.js
import { useState, useEffect } from 'react';
import { RefreshCw, Download, Info } from 'lucide-react';

const UpdateManager = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newVersion, setNewVersion] = useState('');

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      let refreshing = false;
      
      // Detect when new service worker is waiting
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          console.log('Controller changed - reloading page');
          window.location.reload();
        }
      });

      // Check for updates on mount
      navigator.serviceWorker.ready.then(reg => {
        setRegistration(reg);
        
        // Check for updates immediately
        reg.update();
        
        // Listen for updatefound event
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('New service worker installed and waiting');
              setUpdateAvailable(true);
            }
          });
        });
      });

      // Check for updates every 5 minutes
      const updateInterval = setInterval(() => {
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({ type: 'CHECK_FOR_UPDATES' });
        }
      }, 5 * 60 * 1000); // 5 minutes

      // Check for updates when app comes online
      window.addEventListener('online', () => {
        if (registration) {
          registration.update();
        }
      });

      // Check for updates when page gains visibility
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden && registration) {
          registration.update();
        }
      });

      return () => clearInterval(updateInterval);
    }
  }, []);

  const handleUpdate = () => {
    if (registration && registration.waiting) {
      setIsUpdating(true);
      
      // Tell service worker to skip waiting and activate
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // This will trigger the controllerchange event and reload
    }
  };

  const handleCheckForUpdates = () => {
    if (registration) {
      registration.update();
    }
  };

  if (!updateAvailable) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-2xl p-4 animate-fade-in-up">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Download className="h-6 w-6 mt-1" />
          </div>
          <div className="ml-3 flex-1">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg">Update Available!</h3>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                v{newVersion || 'New'}
              </span>
            </div>
            <p className="text-sm text-blue-100 mt-1 mb-3">
              A new version of CRM BI is available with improvements and bug fixes.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="flex-1 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 disabled:opacity-70 font-medium flex items-center justify-center gap-2 transition-all"
              >
                {isUpdating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Update Now
                  </>
                )}
              </button>
              <button
                onClick={() => setUpdateAvailable(false)}
                className="px-4 py-2 bg-blue-800/50 text-white rounded-lg hover:bg-blue-700/50 transition-colors"
              >
                Later
              </button>
            </div>
            <button
              onClick={handleCheckForUpdates}
              className="text-xs text-blue-200 hover:text-white mt-3 flex items-center gap-1"
            >
              <Info className="h-3 w-3" />
              Check for updates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateManager;