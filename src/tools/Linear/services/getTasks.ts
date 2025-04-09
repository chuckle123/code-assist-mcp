import { IssuesQueryVariables } from "@linear/sdk/dist/_generated_documents";
import { getUser } from "./getUser.js";
import { linearClient } from "../client/index.js";
import { downloadAllImages } from "../utils/imageUtils.js";
import { imageContent } from "fastmcp";

export type SearchOptions = {
  query?: string;
  stateTitle?: string;
  issueId?: number;
};

export const searchTasks = async (options: SearchOptions = {}) => {
  const { query = "", stateTitle, issueId } = options;

  const user = await getUser();

  const baseFilter: IssuesQueryVariables = {
    first: 50,
    includeArchived: false,
  };

  const filterConditions: IssuesQueryVariables["filter"] = {};

  if (issueId) {
    filterConditions.number = { eq: issueId };
  }

  if (stateTitle) {
    filterConditions.state = {
      name: { eq: stateTitle },
    };
  }

  if (query) {
    filterConditions.title = { contains: query };
  }

  filterConditions.team = {
    id: { eq: user.teamId },
  };

  const filter: IssuesQueryVariables = {
    ...baseFilter,
    ...(Object.keys(filterConditions).length > 0
      ? { filter: filterConditions }
      : {}),
  };

  const issues = await linearClient.issues(filter);

  const results = await Promise.all(
    issues.nodes.map(async (issue) => {
      const state = await issue.state;
      const assignee = await issue.assignee;

      // Download all images from the issue description
      const images = await downloadAllImages(issue.description || "");

      return {
        id: issue.id,
        title: issue.title,
        status: state?.name || "No Status",
        assignee: assignee?.name || "Unassigned",
        priority: issue.priority,
        createdAt: issue.createdAt,
        url: issue.url,
        images,
        image: images.length > 0
          ? await imageContent({
              path: images[0].path,
            })
          : undefined,
      };
    })
  );

  return {
    data: results,
    hasNextPage: issues.pageInfo.hasNextPage,
    endCursor: issues.pageInfo.endCursor,
    userInfo: user,
  };
};

// setTimeout(async () => {
//   const res = await searchTasks({
//     issueId: 3058,
//   });
//   console.log(res.data[0]);
// }, 1000);
