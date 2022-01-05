"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var typeorm_1 = require("typeorm");
exports.default = (function () {
    return (0, typeorm_1.createConnection)()
        .then(function () {
        /* CODE HERE */
        console.log('ORM running');
    })
        .catch(function (error) { return console.log(error); });
});
//# sourceMappingURL=index.js.map