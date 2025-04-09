export const protectedToolCall = async <T, R>(
  tool: (args: T) => Promise<R>,
  args: T
): Promise<string> => {
  try {
    const result = await tool(args);
    return JSON.stringify({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);
    return JSON.stringify({
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
};
