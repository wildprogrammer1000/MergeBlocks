import { useTranslation } from "react-i18next";
const BuyMeACoffee = () => {
  const { t } = useTranslation();
  return (
    <a
      target="_blank"
      href="https://www.buymeacoffee.com/wildsoft"
      className="absolute bottom-4 right-4 bg-yellow-300 p-2 rounded-md"
    >
      ☕️ {t("Support")}
    </a>
  );
};
export default BuyMeACoffee;
