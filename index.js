import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamable-http.js';
import express from 'express';

// --- This is the tool definition ---
// We are defining it ourselves instead of importing a broken package.
const sequentialThinkingTool = {
  name: 'sequential_thinking',
  description: 'Facilitates a detailed, step-by-step thinking process for problem-solving and analysis.',
  inputSchema: {
    type: 'object',
    properties: {
      thought: { type: 'string', description: 'The current thinking step.' },
      nextThoughtNeeded: { type: 'boolean', description: 'Whether another thought step is needed.' },
      thoughtNumber: { type: 'integer', description: 'Current thought number.' },
      totalThoughts: { type: 'integer', description: 'Estimated total thoughts needed.' },
      isRevision: { type: 'boolean', description: 'Whether this revises previous thinking.' },
      revisesThought: { type: 'integer', description: 'Which thought is being reconsidered.' },
      branchFromThought: { type: 'integer', description: 'Branching point thought number.' },
      branchId: { type: 'string', description: 'Branch identifier.' },
      needsMoreThoughts: { type: 'boolean', description: 'If more thoughts are needed.' }
    },
    required: ['thought', 'nextThoughtNeeded', 'thoughtNumber', 'totalThoughts']
  }
};
// --- End of tool definition ---


// Get the port from Render's environment variable
const port = process.env.PORT || 10000;
const host = '0.0.0.0';

// 1. Create the MCP Server instance
const mcpServer = new McpServer({
  name: 'sequential-thinking-server',
  version: '1.0.0',
});

// 2. Register the tool
// The handler just returns the thought, as this tool is for logging.
mcpServer.registerTool(sequentialThinkingTool.name, {
  ...sequentialThinkingTool,
  handler: async (params) => {
    console.log(`Thought ${params.thoughtNumber}: ${params.thought}`);
    return {
      content: [
        { type: 'text', text: `Acknowledged thought ${params.thoughtNumber}.` }
      ]
    };
  }
});

// 3. Create a web app (Express) to host the server
const app = express();
app.use(express.json());

// 4. Create the HTTP transport and link it to the web app
const transport = new StreamableHTTPServerTransport({
  app,
  mcpPath: '/mcp', // This will be your endpoint
});

// 5. Connect the MCP server to the transport
mcpServer.connect(transport);

// 6. Start the web server
app.listen(port, host, () => {
  console.log(`✅ Sequential Thinking MCP Server running on http://${host}:${port}`);
});
