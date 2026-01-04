const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const router = express.Router();

// En Docker el servicio se llama "user_service" (nombre del servicio en docker-compose)
const AUTH_SERVICE_URL = "http://user_service:8000";

// Proxy para todos los endpoints del auth-service
router.use(
  "/",
  createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/api/auth": "", // /api/auth/login → /login
    },
    onProxyReq: (proxyReq, req) => {
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader("Content-Type", "application/json");
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
  })
);

module.exports = router;