const nakamaConfig = {
  host: import.meta.env.VITE_NAKAMA_HOST,
  port: import.meta.env.VITE_NAKAMA_PORT,
  useSSL: import.meta.env.VITE_NAKAMA_USESSL,
  serverKey: import.meta.env.VITE_NAKAMA_SERVER_KEY,
};
const NODE_API_ENDPOINT = import.meta.env.VITE_NODE_API_ENDPOINT;
export { nakamaConfig, NODE_API_ENDPOINT };
