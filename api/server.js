import handler from "../dist/server/server.js";

export default async function(req, res) {
  const url = new URL(req.url, `https://${req.headers.host}`);
  const request = new Request(url, {
    method: req.method,
    headers: req.headers,
    body: ["GET", "HEAD"].includes(req.method) ? undefined : req.body,
  });
  const response = await handler.fetch(request, process.env, {});
  res.status(response.status);
  response.headers.forEach((v, k) => res.setHeader(k, v));
  const body = await response.text();
  res.send(body);
}
