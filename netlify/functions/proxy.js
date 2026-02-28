exports.handler = async function (event) {
  const target = event.queryStringParameters.url;

  if (!target) {
    return {
      statusCode: 400,
      body: "Missing url parameter"
    };
  }

  try {
    const response = await fetch(target, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const contentType = response.headers.get("content-type") || "text/html";
    let body = await response.text();

    // Fix relative links
    const base = new URL(target).origin;

    body = body.replace(/(href|src)=["']\/(.*?)["']/g, `$1="${base}/$2"`);

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
      body: "Proxy error: " + err.message
    };
  }
};
