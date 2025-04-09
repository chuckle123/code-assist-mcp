import { z } from "zod";
import { Tool } from "fastmcp";
import { protectedToolCall } from "../../utils/toolWrapper.js";
import { getUser } from "../services/getUser.js";

const searchArgsSchema = z.object({});

export const linearGetUserTool: Tool<undefined, typeof searchArgsSchema> = {
  name: "linear_get_user",
  description: "Get current Linear user information",
  parameters: searchArgsSchema,
  execute: async (args) => {
    return protectedToolCall(getUser, args);
  },
};
