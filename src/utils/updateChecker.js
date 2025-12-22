// utils/updateChecker.js
export class UpdateChecker {
  static async checkForUpdates() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        
        // Force update check
        const newRegistration = await registration.update();
        
        // Check if there's a new service worker waiting
        if (registration.waiting) {
          return {
            available: true,
            registration: registration
          };
        }
        
        return { available: false };
      } catch (error) {
        console.error('Update check failed:', error);
        return { available: false, error };
      }
    }
    return { available: false };
  }

  static async applyUpdate() {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      
      if (registration.waiting) {
        // Post skip waiting message
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        return true;
      }
    }
    return false;
  }
}