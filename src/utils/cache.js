export async function clearCaches() {
  if ("caches" in window) {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => {
          console.log(`Deleting cache: ${cacheName}`);
          return caches.delete(cacheName);
        })
      );
      console.log("All caches deleted.");
    } catch (error) {
      console.error("Error while deleting caches:", error);
    }
  } else {
    console.log("Caches API is not available in this browser.");
  }
}
