import { type Config, config as baseConfig, cook as core } from "chef-core";
import { createServer, requestHandler } from "./server";
export { baseConfig as config, type Config };
export { chat } from "./chat";

export async function cook(config: Partial<Config> = {}) {
  return await core(
    { ...config, type: "socket" },
    { createServer, requestHandler },
  );
}
