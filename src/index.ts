import { chef, Config } from "chef-core";
import { createServer, requestHandler } from "./server";

export default async function startChef(config?: Partial<Config>) {
  return await chef(
    { ...config, type: "express" },
    { createServer, requestHandler }
  );
}
