import { createContext, useContext, useEffect, useState } from "react";
import { Client } from "@heroiclabs/nakama-js";
import { nakamaConfig, NODE_API_ENDPOINT } from "../constants/config";
import axios from "axios";
import { WebSocketAdapterPb } from "@heroiclabs/nakama-js-protobuf";

const NakamaContext = createContext();
export const nakama = {
  client: null,
  session: null,
  account: null,
};

export const NakamaProvider = ({ children }) => {
  const [client] = useState(
    new Client(
      nakamaConfig.serverKey,
      nakamaConfig.host,
      nakamaConfig.port,
      nakamaConfig.useSSL === "true"
    )
  );
  const [session, setSession] = useState(null);
  const [account, setAccount] = useState(null);
  const [socket, setSocket] = useState(null);

  const authenticate = async () => {
    try {
      let res = await axios({
        method: "get",
        url: `${NODE_API_ENDPOINT}/auth`,
        withCredentials: true,
      });
      const user_id = res.data.user_id;

      const session = await client.authenticateCustom(user_id, true);
      const account = await client.getAccount(session);
      nakama.client = client;
      nakama.session = session;
      nakama.account = account;

      const socket = client.createSocket(
        nakamaConfig.useSSL === "true",
        false,
        new WebSocketAdapterPb()
      );
      await socket.connect(session);

      setAccount(account);
      setSession(session);
      setSocket(socket);
    } catch (error) {
      console.error("Authentication failed:", error);
    }
  };
  const refreshAccount = async () => {
    const account = await client.getAccount(session);
    nakama.account = account;
    setAccount(account);
  };
  useEffect(() => {
    authenticate();

    // 페이지 가시성 변경 이벤트 리스너
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        authenticate();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 클린업
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <NakamaContext.Provider
      value={{ account, client, session, refreshAccount, socket }}
    >
      {children}
    </NakamaContext.Provider>
  );
};

export const useNakama = () => {
  const context = useContext(NakamaContext);
  if (!context) {
    throw new Error("useNakama must be used within a NakamaProvider");
  }
  return context;
};
export default NakamaProvider;
