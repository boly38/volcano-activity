// WARN: this file MUST be under <react project>/src/ directory
const {createProxyMiddleware} = require('http-proxy-middleware');

const BACKEND_PORT = process && process.env.BACKEND_PORT || '4000';

module.exports = function (app) {
    console.log("proxy", BACKEND_PORT)
    const changeOrigin = true;
    const target = `http://127.0.0.1:${BACKEND_PORT}`;
    const serverProxy = createProxyMiddleware({changeOrigin, target});
    app.use('/about', serverProxy);
    app.use('/api', serverProxy);
};