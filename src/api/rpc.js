import { nakama } from "@/providers/NakamaProvider";

const commonRpc = async (id, data = {}) => {
  const res = await nakama.client.rpc(nakama.session, id, data);
  return res.payload;
};
const rpc = async (id, data = {}) => {
  try {
    const res = await nakama.client.rpc(
      nakama.session,
      "mergeblocks." + id,
      data
    );
    return res.payload;
  } catch (err) {
    console.error(err);
  }
};
const doHealthCheck = async () => {
  const res = await commonRpc("healthcheck", {});
  return res.payload;
};
const getServerConfig = async () => {
  const res = await commonRpc("config:get", {});
  return res;
};
const getVersion = async () => await commonRpc("version:get");

const checkDisplayName = async (displayName) =>
  await commonRpc("displayname:check", { display_name: displayName });

const initDisplayName = async (displayName) =>
  await commonRpc("displayname:init", {
    display_name: displayName,
  });

const changeDisplayname = async (displayName) => {
  await rpc("displayname:change", {
    display_name: displayName,
  });
};
const addRecord = async ({ score }) => {
  const account = nakama.account;
  const res = await rpc("record:add", {
    score,
    display_name: account.user.display_name || account.user.username,
  });
  return res;
};

const getEvents = async () => await rpc("events:get");

const getRecords = async () => await rpc("records:get");
const unlinkGoogle = async () => await commonRpc("google:unlink");
const getGoogleLinkedAccount = async (google_id) =>
  await commonRpc("google:linkedAccount", { google_id });

const getReward = async (level) => await rpc("reward:get", { level });
const getPatchNote = async () => await rpc("patchnote");

const findMatch = async (module) => await commonRpc("match:find", { module });

const doUseItem = async (item) => await rpc("item:use", { item });

const getShopProducts = async () => await rpc("shop:products");
const purchaseItem = async (item) => await rpc("shop:purchase", { item });

export {
  rpc,
  doHealthCheck,
  getServerConfig,
  addRecord,
  getRecords,
  checkDisplayName,
  initDisplayName,
  getEvents,
  changeDisplayname,
  unlinkGoogle,
  getGoogleLinkedAccount,
  getVersion,
  getReward,
  getPatchNote,
  findMatch,
  doUseItem,
  getShopProducts,
  purchaseItem,
};
