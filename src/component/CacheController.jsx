import { useEffect } from "react";

const CacheController = () => {
  useEffect(() => {
    const removeCache = () => {
      if ("caches" in window) {
        caches.keys().then((cacheNames) => {
          cacheNames.forEach((cacheName) => {
            caches.delete(cacheName).then((deleted) => {
              if (deleted) window.location.reload();
            });
          });
        });
      }
    };
    removeCache();
  }, []);
  return null;
};

export default CacheController;
