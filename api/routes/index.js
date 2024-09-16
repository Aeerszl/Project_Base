var express = require('express');
var router = express.Router();
// eslint-disable-next-line no-unused-vars
const config = require('../config'); // config.js dosyasını import ettik.

const fs = require("fs");
// eslint-disable-next-line no-undef
let routes = fs.readdirSync(__dirname);
for (let route of routes) {
  if (route.includes(".js") && route != "index.js") {
    router.use("/" +route.replace(".js",""), require('./' + route));
    
  }
}

module.exports = router;