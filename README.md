# Code Assist MCP

## How to Run

`export $ANTHROPIC_API_KEY=<api-key>`

`yarn build`

`claude mcp add code-assist-mcp -- node /<path>/<to>/code-assist-mcp/build/index.js`

```
claude --json --verbose -p "Please help me implement linear ticket DEV-2145:

1. First, search for and summarize the ticket details (description, requirements, comments, and attached images). You are tasks with understanding all of the asks within a linear ticket. Think hard by reviewing all aspects of the ticket, openning any links, reviewing all images and comments and more.
2. Thoroughly analyze the codebase to understand the context:
- Identify all relevant files that need modification
- Understand the current implementation and architecture
- Map out dependencies that might be affected
3. Develop a clear implementation plan with specific steps
4. Execute the implementation by:
- Making precise code changes
- Adding appropriate comments
- Following project coding standards
- Ensuring backward compatibility

Be thorough in your analysis and implementation." --allowedTools "mcp__code-assist-mcp__linear_search" "Bash(git add:*)" "Bash(git commit:*)" Edit
```
