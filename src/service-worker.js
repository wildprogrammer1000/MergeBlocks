self.addEventListener("install", (event) => {
  console.log("Service Worker Installed");
  self.skipWaiting(); // 새로운 SW가 즉시 활성화되도록 설정
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker Activated");
  event.waitUntil(self.clients.claim()); // 기존 클라이언트들에 즉시 적용
});

self.addEventListener("fetch", (event) => {
  // 캐시를 사용하지 않고 항상 네트워크에서 최신 파일을 가져오도록 설정
  event.respondWith(fetch(event.request));
});