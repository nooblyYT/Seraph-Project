exports.handler = async function (event) {
  const url = event.queryStringParameters.url;

  if (!url) {
    return { statusCode: 400, body: "No URL provided" };
  }

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const contentType = res.headers.get("content-type") || "text/html";
    let body = await res.text();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*"
      },
      body
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: "Failed to fetch site"
    };
  }
};
