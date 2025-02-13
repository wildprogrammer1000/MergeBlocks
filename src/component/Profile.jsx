import { useNakama } from "@/providers/NakamaProvider";
import { useEffect, useState } from "react";
import evt from "@/utils/event-handler";
import { auth, googleProvider } from "@/utils/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider } from "firebase/auth";

const Profile = () => {
  const { client, session, account, refreshAccount } = useNakama();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const openProfile = () => setIsOpen(true);
  const closeProfile = () => setIsOpen(false);

  const unlinkGoogle = async () => {
    try {
      setLoading(true);

      // 사용자 재인증 요청
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);

      if (!credential) {
        throw new Error("재인증에 실패했습니다.");
      }

      // 재인증 성공 후 토큰으로 연동 해제
      const token = credential.idToken;
      await client.unlinkGoogle(session, { token });
      refreshAccount();

      await signOut(auth);
    } catch (error) {
      console.error("Unlink error:", error);
      // 사용자에게 에러 메시지 표시
    } finally {
      setLoading(false);
    }
  };

  const linkGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      await client.linkGoogle(session, { token: credential.idToken });
      refreshAccount();
    } catch (error) {
      if (error.status === 409) {
        alert("Google ID is already in use.");
      }
      console.error("Google link error:", error);
    } finally {
      setLoading(false);
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
    <div className="absolute inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="w-96 bg-white rounded-lg p-6 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Profile</h2>
          <button
            onClick={closeProfile}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            {account.photoURL && (
              <img
                src={account.photoURL}
                alt="profile"
                className="w-12 h-12 rounded-full"
              />
            )}
            <div>
              <div className="font-bold">{account.displayName}</div>
              <div className="text-sm text-gray-500">{account.email}</div>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex gap-1 items-center">
            <FcGoogle className="text-xl" />
            Google
          </div>
          {account.user.google_id ? (
            <button
              onClick={unlinkGoogle}
              disabled={loading}
              className="flex items-center justify-center gap-2  py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {loading ? "LOADING" : "UNLINK"}
            </button>
          ) : (
            <button
              onClick={linkGoogle}
              disabled={loading}
              className="flex items-center justify-center gap-2  py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Link
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
