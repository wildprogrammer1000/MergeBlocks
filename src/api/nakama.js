import { nakama } from "@/providers/NakamaProvider";

const commonRpc = async (id, data = {}) => {
  try {
    const res = await nakama.client.rpc(nakama.session, id, data);
    return res.payload;
  } catch (err) {
    console.error(err);
  }
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
const addRecord = async ({ score, point }) => {
  const account = nakama.account;
  const res = await rpc("record:add", {
    score,
    point,
    display_name: account.user.display_name || account.user.username,
  });
  return res;
};

const getEvents = async () => await rpc("events:get");

const getRecords = async () => await rpc("records:get");
const listChannelMessages = async () =>
  await commonRpc("channelmessage:list_recent");

const unlinkGoogle = async () => await commonRpc("google:unlink");
const getGoogleLinkedAccount = async (google_id) =>
  await commonRpc("google:linkedAccount", { google_id });

export {
  rpc,
  addRecord,
  getRecords,
  checkDisplayName,
  initDisplayName,
  listChannelMessages,
  getEvents,
  changeDisplayname,
  unlinkGoogle,
  getGoogleLinkedAccount,
};
