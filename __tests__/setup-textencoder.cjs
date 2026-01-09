// setup-textencoder.cjs — Jest setup file (CommonJS) to polyfill TextEncoder for jsdom
const { TextEncoder, TextDecoder } = require('util');
if (typeof global.TextEncoder === 'undefined') global.TextEncoder = TextEncoder;
if (typeof global.TextDecoder === 'undefined') global.TextDecoder = TextDecoder;

module.exports = {};
