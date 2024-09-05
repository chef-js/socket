import { Config, FileReaderResponse, Server } from "chef-core";
import { NextFunction, Request, Response } from "express";
import { Cache } from "@pietal.dev/cache";
export declare function createServer(config: Config): Promise<Server>;
export declare function requestHandler(
  fileReaderCache: Cache<FileReaderResponse>,
): (req: Request, res: Response, next: NextFunction) => boolean | void;
//# sourceMappingURL=index.d.ts.map
