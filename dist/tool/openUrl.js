"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openUrl = void 0;
const child_process_1 = require("child_process");
/**
 * 用浏览器打开一个url
 * @param _url 该url
 */
function openUrl(_url) {
    let ch_p = (0, child_process_1.exec)(`start ${_url}`);
    ch_p.on('error', (mes) => {
        // console.log(mes);
    });
}
exports.openUrl = openUrl;
