import { linearClient } from "../client/index.js";

let cachedUser: {
  id: string;
  name: string;
  email: string;
  teamId: string;
} | null = null;

const _getUser = async () => {
  if (cachedUser) {
    return { user: cachedUser };
  }

  try {
    const viewer = await linearClient.viewer;

    const teams = await viewer.teams();
    if (!teams.nodes.length) {
      throw new Error("No teams found for the user");
    }

    cachedUser = {
      id: viewer.id,
      name: viewer.name,
      email: viewer.email,
      teamId: teams.nodes[0].id,
    };

    return {
      user: cachedUser,
    };
  } catch (error) {
    console.error("Error initializing user and team:", error);
    throw error;
  }
};

export const getUser = async () => {
  const { user } = await _getUser();
  return user;
};
