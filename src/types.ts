import { ToolParameters } from "fastmcp";

export type Tool<A = ToolParameters, R = ToolParameters> = {
  name: string;
  description?: string;
  argsSchema?: A;
  resSchema?: R;
  execute: (args: A) => Promise<R>;
};
