import { type Config, config as baseConfig } from "chef-core";
export { baseConfig as config, type Config };
export { chat } from "./chat";
export declare function cook(
  config?: Partial<Config>,
): Promise<import("chef-core").Server>;
//# sourceMappingURL=index.d.ts.map
