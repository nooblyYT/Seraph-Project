export async function handler(event) {
  let url = event.queryStringParameters?.url;
  if (!url) return { statusCode: 400, body: "Missing URL" };

  // Auto protocol
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;

  const blocked = ["localhost", "127.0.0.1"];
  if (blocked.some(b => url.includes(b)))
    return { statusCode: 403, body: "Blocked URL" };

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "text/html"
      }
    });

    let html = await res.text();

    // Make links behave like a browser
    html = html.replace(/<head>/i, `<head><base href="${url}">`);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/html",
        "Cache-Control": "no-cache"
      },
      body: html
    };
  } catch {
    return { statusCode: 500, body: "Proxy error" };
  }
}
