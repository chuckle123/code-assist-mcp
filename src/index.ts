import "dotenv/config";

import { FastMCP } from "fastmcp";
import { LinearTools } from "./tools/Linear/index.js";

const server = new FastMCP({
  name: "Software Engineer Assistant",
  version: "1.0.0",
});

server.addTool(LinearTools.linearSearchTasksTool);
server.addTool(LinearTools.linearGetUserTool);

server.start({
  transportType: "stdio",
});
