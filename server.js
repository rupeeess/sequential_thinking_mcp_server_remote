import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamable-http';
import { sequentialthinking as sequentialThinkingTool } from '@modelcontextprotocol/server-sequential-thinking';
import express from 'express';

// Get the port from Render's environment variable
const port = process.env.PORT || 10000;
const host = '0.0.0.0';

// 1. Create the MCP Server instance
const mcpServer = new McpServer({
  name: 'sequential-thinking-server',
  version: '1.0.0',
});

// 2. Register the sequential thinking tool
mcpServer.registerTool(sequentialThinkingTool.name, sequentialThinkingTool.tool);

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
