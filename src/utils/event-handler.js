class EventHandler {
  constructor() {
    this.events = new Map();
  }

  /**
   * 이벤트 리스너 등록
   * @param {string} eventName 이벤트 이름
   * @param {Function} callback 콜백 함수
   * @param {object} context this 컨텍스트 (옵션)
   */
  on(eventName, callback, context = null) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }

    this.events.get(eventName).push({
      callback,
      context,
    });
  }

  /**
   * 이벤트 리스너 제거
   * @param {string} eventName 이벤트 이름
   * @param {Function} callback 콜백 함수
   * @param {object} context this 컨텍스트 (옵션)
   */
  off(eventName, callback, context = null) {
    if (!this.events.has(eventName)) return;

    const listeners = this.events.get(eventName);
    const filteredListeners = listeners.filter((listener) => {
      return !(listener.callback === callback && listener.context === context);
    });

    if (filteredListeners.length === 0) {
      this.events.delete(eventName);
    } else {
      this.events.set(eventName, filteredListeners);
    }
  }

  /**
   * 이벤트 트리거
   * @param {string} eventName 이벤트 이름
   * @param {...any} args 전달할 인자들 (최대 5개)
   */
  emit(eventName, ...args) {
    if (!this.events.has(eventName)) return;

    const listeners = this.events.get(eventName);
    listeners.forEach(({ callback, context }) => {
      if (args.length > 5) {
        console.warn(
          `Event ${eventName} was emitted with more than 5 arguments. Only first 5 will be used.`
        );
        args = args.slice(0, 5);
      }
      callback.apply(context, args);
    });
  }
}

// 싱글톤 인스턴스 생성 및 내보내기
const evt = new EventHandler();
export default evt;
