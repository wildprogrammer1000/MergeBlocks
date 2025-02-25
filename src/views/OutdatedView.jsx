import Profile from "@/component/Profile";
import { WSButton } from "@/component/ui/WSComponents";
import { useNakama } from "@/providers/NakamaProvider";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import evt from "@/utils/event-handler";

const OutdatedPage = () => {
  const { account } = useNakama();
  const [isSupportedBrowser, setIsSupportedBrowser] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();

    // 인앱 브라우저 체크
    const isInApp = /kakaotalk|line|instagram|facebook|naver|band/i.test(
      userAgent
    );

    setIsSupportedBrowser(!isInApp);
  }, []);
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-main-900)] text-[var(--color-main-100)]">
      <div className="text-center">
        <h1 className="text-2xl font-bold">App Version Updated</h1>
        <p className="text-sm">Please reinstall the latest version of app.</p>
        <p className="text-sm">
          To link account, please click the button in the top right.
        </p>

        {account && (
          <WSButton
            className="absolute top-4 right-4"
            onClick={() => {
              if (isSupportedBrowser) {
                evt.emit("profile:open");
              } else {
                alert(
                  "This feature is not supported in in-app browsers.\nPlease use browsers\n(Chrome , Safari, etc.)"
                );
              }
            }}
          >
            <FaUser />
          </WSButton>
        )}
        <Profile backup={true} />
      </div>
    </div>
  );
};

export default OutdatedPage;
