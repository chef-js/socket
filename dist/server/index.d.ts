import { Request, Response } from "express";
import { Cache } from "@pietal.dev/cache";
import { Config, Server, FileReaderResponse } from "chef-core";
export declare function createServer(config: Config): Promise<Server>;
export declare function requestHandler(
  fileReaderCache: Cache<FileReaderResponse>,
): (req: Request, res: Response) => void;
//# sourceMappingURL=index.d.ts.map
