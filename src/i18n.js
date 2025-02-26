import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  // 번역 파일을 불러오는 백엔드 모듈 사용
  .use(Backend)
  // 브라우저 언어 감지 모듈 사용
  .use(LanguageDetector)
  // react-i18next 초기화 모듈 사용
  .use(initReactI18next)
  // i18n 초기화
  .init({
    fallbackLng: "en", // 기본 언어
    debug: import.meta.env.DEV, // 디버그 모드 활성화 (개발 환경에서만 사용, 프로덕션에서는 false로 설정)

    interpolation: {
      escapeValue: false, // React에서는 이미 XSS 방지 처리를 하므로 false로 설정
    },

    // 백엔드 설정
    backend: {
      // 번역 파일 경로
      loadPath: "/locales/{{lng}}.json",
    },
  });

export default i18n;

window.setLanguage = (language) => {
  i18n.changeLanguage(language);
};
