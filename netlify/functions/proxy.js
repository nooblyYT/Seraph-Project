export async function handler(event) {
  let url = event.queryStringParameters?.url;

  if (!url) {
    return { statusCode: 400, body: "Missing URL" };
  }

  // Auto add protocol
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  // Basic safety blocks
  const blocked = ["localhost", "127.0.0.1"];
  if (blocked.some(b => url.includes(b))) {
    return { statusCode: 403, body: "Blocked URL" };
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      }
    });

    let html = await response.text();

    // Inject base tag so links work like a browser
    html = html.replace(
      /<head>/i,
      `<head><base href="${url}">`
    );

    return {
      statusCode: 200,
      headers: { "Content-Type": "text/html" },
      body: html
    };
  } catch (err) {
    return { statusCode: 500, body: "Proxy failed to load site" };
  }
}
