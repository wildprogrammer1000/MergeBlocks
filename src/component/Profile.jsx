import { useNakama } from "@/providers/NakamaProvider";
import { useEffect, useState, useRef } from "react";
import evt from "@/utils/event-handler";
import { auth, googleProvider } from "@/utils/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider } from "firebase/auth";
import {
  WSButton,
  WSCloseButton,
  WSModal,
  WSModalHeader,
} from "./ui/WSComponents";
import {
  changeDisplayname,
  checkDisplayName,
  getGoogleLinkedAccount,
  initDisplayName,
  unlinkGoogle,
} from "@/api/rpc";
import { CgSpinner } from "react-icons/cg";
import { FaCheck } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import { FaUnlink } from "react-icons/fa";
import { FaLink } from "react-icons/fa";
import { FaCloudDownloadAlt } from "react-icons/fa";
import axios from "axios";
import { useTranslation } from "react-i18next";

const Profile = ({ backup = false }) => {
  const { t } = useTranslation();
  const { client, session, account, refreshAccount, authenticate } =
    useNakama();
  const [isOpen, setIsOpen] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [nicknameLoading, setNicknameLoading] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [checked, setChecked] = useState(false);
  const [checking, setChecking] = useState(false);
  const checkTimeout = useRef(null);

  useEffect(() => {
    if (account) {
      setDisplayName(account.user.display_name || "");
    }
  }, [account]);

  const handleDisplayNameChange = (e) => {
    const value =
      e.target.value.length > 16 ? e.target.value.slice(0, 16) : e.target.value;

    setDisplayName(value);

    if (value === account.user.display_name) {
      setChecked(true);
      setChecking(false);
      return;
    }

    setChecking(true);
    if (checkTimeout.current) clearTimeout(checkTimeout.current);
    checkTimeout.current = setTimeout(() => check(value), 1000);
  };

  const check = async (value) => {
    setChecking(false);
    if (value.length < 3 || value.length > 16) {
      setChecked(false);
      return;
    }
    const { success } = await checkDisplayName(value);
    setChecked(success);
  };

  const handleUpdateDisplayName = async (e) => {
    e.preventDefault();
    if (
      checking ||
      !checked ||
      !displayName.trim() ||
      displayName === account.user.display_name
    )
      return;

    try {
      setNicknameLoading(true);
      if (account.user.display_name) await changeDisplayname(displayName);
      else await initDisplayName(displayName);
      await refreshAccount();
      alert(t("Update Nickname"));
    } catch (error) {
      console.error("Update display name error:", error);
    } finally {
      setNicknameLoading(false);
    }
  };

  const openProfile = () => setIsOpen(true);
  const closeProfile = () => setIsOpen(false);

  const load = async () => {
    if (!window.confirm(t("Google Load Confirm"))) return;

    try {
      let response;
      const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`;

      setGoogleLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken(); // Firebase ID Token

      response = await axios({
        url,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: { idToken },
      });
      const rawId = response.data.users[0].providerUserInfo[0].rawId;
      const { userId } = await getGoogleLinkedAccount(rawId);
      if (userId) {
        await authenticate(userId);
        alert(t("Google Link Success"));
      } else {
        alert(t("Google Not Linked"));
      }
    } catch (error) {
      console.error("Load error:", error);
    } finally {
      setGoogleLoading(false);
    }
  };

  const unlink = async () => {
    if (!window.confirm(t("Google Unlink Confirm"))) return;

    try {
      setGoogleLoading(true);
      await unlinkGoogle();
      await refreshAccount();
      await signOut(auth);
    } catch (error) {
      console.error("Unlink error:", error);
      // 사용자에게 에러 메시지 표시
    } finally {
      setGoogleLoading(false);
    }
  };

  const linkGoogle = async () => {
    try {
      setGoogleLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      await client.linkGoogle(session, { token: credential.idToken });
      refreshAccount();
    } catch (error) {
      if (error.status === 409) {
        alert(t("Google Already Linked"));
      }
      console.error("Google link error:", error);
    } finally {
      setGoogleLoading(false);
    }
  };

  useEffect(() => {
    evt.on("profile:open", openProfile);
    evt.on("profile:close", closeProfile);
    return () => {
      evt.off("profile:open", openProfile);
      evt.off("profile:close", closeProfile);
    };
  }, []);

  if (!isOpen || !account) return null;

  return (
    <WSModal onClick={() => setIsOpen(false)}>
      <div className="rounded-lg flex flex-col">
        <WSModalHeader className="flex w-full p-2">
          <div className="text-xl font-bold">{t("Account")}</div>
          <WSCloseButton onClick={closeProfile} />
        </WSModalHeader>
        <div className="flex flex-col gap-4 p-4">
          <form
            onSubmit={handleUpdateDisplayName}
            className="flex flex-col gap-1"
          >
            <div className="text-[var(--color-main-900)] font-bold">
              {t("Nickname")}
            </div>
            <div className="flex gap-2">
              <div className="flex-1 relative flex gap-2 items-center">
                <input
                  type="text"
                  value={displayName || ""}
                  onChange={handleDisplayNameChange}
                  className="w-full p-2 border-2 border-[var(--color-main-900)] rounded-xl focus:border-[var(--color-main-500)] outline-none text-[var(--color-main-900)] font-bold"
                  disabled={nicknameLoading}
                />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center">
                  {displayName !== account.user.display_name &&
                  displayName &&
                  displayName.length > 0 ? (
                    checking ? (
                      <CgSpinner className="animate-spin text-2xl text-main-900" />
                    ) : (
                      <FaCheck
                        className={`text-2xl ${
                          checked ? "text-green-500" : "text-red-500"
                        }`}
                      />
                    )
                  ) : (
                    <BsThreeDots className="text-2xl text-main-900" />
                  )}
                </div>
              </div>
              <WSButton
                disabled={
                  nicknameLoading ||
                  checking ||
                  !checked ||
                  !displayName ||
                  displayName.length === 0 ||
                  displayName === account.user.display_name
                }
              >
                {nicknameLoading ? (
                  <CgSpinner className="animate-spin" />
                ) : (
                  <MdEdit />
                )}
              </WSButton>
            </div>
          </form>
          <div className="flex flex-col gap-2">
            <div className="text-[var(--color-main-900)] font-bold">
              {t("Social")}
            </div>
            <div className="flex justify-between">
              <div className="flex gap-1 items-center text-[var(--color-main-900)]">
                <FcGoogle className="text-xl" />
                Google
              </div>
              <div className="flex gap-2">
                {!backup && (
                  <WSButton onClick={load}>
                    <FaCloudDownloadAlt />
                  </WSButton>
                )}
                {account.user.google_id ? (
                  <WSButton onClick={unlink} disabled={googleLoading}>
                    {googleLoading ? (
                      <CgSpinner className="animate-spin" />
                    ) : (
                      <FaUnlink />
                    )}
                  </WSButton>
                ) : (
                  <WSButton onClick={linkGoogle} disabled={googleLoading}>
                    {googleLoading ? (
                      <CgSpinner className="animate-spin" />
                    ) : (
                      <FaLink />
                    )}
                  </WSButton>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </WSModal>
  );
};

export default Profile;
