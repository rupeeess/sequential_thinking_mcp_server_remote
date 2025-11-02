const { createHttpServer } = require('mcp-server-http');
const { sequentialThinking } = require('mcp-tool-sequential-thinking');

// Get the port from Render's environment variable, default to 3000
const port = process.env.PORT || 3000;

// Create the server
const server = createHttpServer({
  tools: [sequentialThinking],
});

// Start listening on the port
server.listen(port, () => {
  console.log(`Sequential Thinking MCP Server running on http://localhost:${port}`);
});
