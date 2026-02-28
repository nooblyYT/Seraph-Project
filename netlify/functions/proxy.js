export async function handler(event) {
  const url = event.queryStringParameters?.url;

  if (!url) {
    return { statusCode: 400, body: "Missing URL" };
  }

  if (!url.startsWith("https://")) {
    return { statusCode: 400, body: "HTTPS only" };
  }

  const blocked = ["localhost", "127.0.0.1"];
  if (blocked.some(b => url.includes(b))) {
    return { statusCode: 403, body: "Blocked URL" };
  }

  try {
    const res = await fetch(url);
    const text = await res.text();

    return {
      statusCode: 200,
      headers: { "Content-Type": "text/html" },
      body: text
    };
  } catch {
    return { statusCode: 500, body: "Proxy error" };
  }
}
