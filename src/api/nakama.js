import { nakama } from "@/providers/NakamaProvider";

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

const addRecord = async (score) => {
  try {
    const account = nakama.account;
    const res = await rpc("record:add", {
      score,
      display_name: account.user.display_name || account.user.username,
    });
    return res;
  } catch (err) {
    console.error(err);
  }
};

export { rpc, addRecord };
