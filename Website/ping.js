// netlify/functions/ping.js

// In-memory store for live sites
// ⚠️ Note: This resets whenever Netlify redeploys your site.
let liveSites = {};

export async function handler(event, context) {
  if (event.httpMethod === "POST") {
    try {
      const data = JSON.parse(event.body);
      const { link, message } = data;

      if (message === "I am live!" && link) {
        // Store the site as live with a timestamp
        liveSites[link] = new Date().toISOString();
        console.log(`Ping received from: ${link}`);
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ success: true }),
      };
    } catch (err) {
      console.error("Error parsing POST body:", err);
      return { statusCode: 400, body: "Invalid JSON" };
    }
  }

  if (event.httpMethod === "GET") {
    // Return the current live sites
    return {
      statusCode: 200,
      body: JSON.stringify(liveSites),
    };
  }

  return {
    statusCode: 405,
    body: "Method Not Allowed",
  };
}
