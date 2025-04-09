import { z } from "zod";
import { Tool } from "fastmcp";
import { protectedToolCall } from "../../utils/toolWrapper.js";
import { searchTasks } from "../services/getTasks.js";

const searchArgsSchema = z.object({
  query: z.string().optional().describe("A fuzzy search query for tasks"),
  stateTitle: z
    .string()
    .optional()
    .describe("A specific state title to filter by"),
  issueId: z
    .number()
    .optional()
    .describe(
      "A specific issue ID to filter by (the number part of the ID. In the case of 'DEV-2985' it is '2985')"
    ),
});

// TODO: IMPLEMENT RESPONSE IN SCHEMA?
// const searchResSchema = z.object({
//   tasks: z.array(
//     z.object({
//       id: z.string().describe("The ID of the task"),
//       title: z.string().describe("The title of the task"),
//       description: z.string().describe("The description of the task"),
//     })
//   ),
// });
// type SearchResSchema = z.infer<typeof searchResSchema>;

export const linearSearchTasksTool: Tool<undefined, typeof searchArgsSchema> = {
  name: "linear_search",
  description: `
  Search for tasks in Linear
  ${Object.entries(searchArgsSchema.shape)
    .map(([key, value]) => `${key}: ${value.description}`)
    .join("\n")}
  `,
  parameters: searchArgsSchema,
  execute: async (args) => {
    return protectedToolCall(searchTasks, args);
  },
};
