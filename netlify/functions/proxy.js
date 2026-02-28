export async function handler(event) {
  const url = event.queryStringParameters.url;

  if (!url) {
    return {
      statusCode: 400,
      body: "Missing URL"
    };
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "*/*"
      }
    });

    const contentType = response.headers.get("content-type") || "text/html";
    let body = await response.text();

    // Basic HTML fixes so assets load better
    body = body.replace(/href="\//g, `href="${url}/`);
    body = body.replace(/src="\//g, `src="${url}/`);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*"
      },
      body
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: "Proxy failed to load site."
    };
  }
}
