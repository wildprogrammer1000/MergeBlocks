class EventHandler {
  constructor() {
    this.events = new Map();
    this.methods = new Map();
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

  /**
   * 메서드 등록
   * @param {string} name - 메서드 이름
   * @param {Function} fn - 호출할 함수
   */
  method(name, fn) {
    if (this.methods.get(name)) {
      throw new Error(`${this._name} method '${name}' already registered`);
    }
    this.methods.set(name, fn);
  }

  /**
   * 메서드 제거
   * @param {string} name - 메서드 이름
   */
  methodRemove(name) {
    this.methods.delete(name);
  }

  /**
   * 메서드 호출
   * @param {string} name - 메서드 이름
   * @param {...*} args - 전달할 인자들
   * @returns {*} 메서드 반환값
   */
  call(name, ...args) {
    const fn = this.methods.get(name);
    if (fn) {
      try {
        return fn(...args);
      } catch (error) {
        console.info(
          "%c%s %c(editor.method error)",
          "color: #06f",
          name,
          "color: #f00"
        );
        console.error(error);
      }
    }
    return null;
  }
}

// 싱글톤 인스턴스 생성 및 내보내기
const evt = new EventHandler();
export default evt;
