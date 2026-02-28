exports.handler = async function(event) {
  const target = event.queryStringParameters.url;
  if (!target) return { statusCode: 400, body: "Missing url parameter" };

  try {
    const res = await fetch(target, { headers: { "User-Agent": "Mozilla/5.0" } });
    const body = await res.text();
    const contentType = res.headers.get("content-type") || "text/html";

    return {
      statusCode: 200,
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "X-Frame-Options": "",
        "Content-Security-Policy": ""
      },
      body
    };
  } catch (err) {
    return { statusCode: 500, body: "Proxy error: " + err.message };
  }
};
