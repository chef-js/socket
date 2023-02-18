import { Request, Response } from "express";
import { Cache } from "latermom";
import { WSConfig, WSFileReaderResponse, WSServer } from "chef-core/dist/types";
export declare function createServer(config: WSConfig): Promise<WSServer>;
export declare function requestHandler(
  fileReaderCache: Cache<WSFileReaderResponse>
): (req: Request, res: Response) => void;
//# sourceMappingURL=index.d.ts.map
