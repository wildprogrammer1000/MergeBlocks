// 설치 이벤트: 바로 활성화하기 위해 대기 상태 건너뛰기
self.addEventListener("install", () => {
  self.skipWaiting();
});

// 활성화 이벤트: 제어중인 클라이언트 즉시 확보
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
