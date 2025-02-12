import { createContext, useContext, useEffect, useState } from "react";
import { Client } from "@heroiclabs/nakama-js";
import { nakamaConfig, NODE_API_ENDPOINT } from "../constants/config";
import axios from "axios";

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

  const authenticate = async () => {
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

    setAccount(account);
    setSession(session);
  };
  useEffect(() => {
    authenticate();
  }, []);

  return (
    <NakamaContext.Provider value={{ account, session }}>
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
