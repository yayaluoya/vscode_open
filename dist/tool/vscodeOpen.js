"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vscodeOpen = void 0;
const child_process_1 = __importDefault(require("child_process"));
const fs_1 = require("fs");
const ArrayUtils_1 = require("yayaluoya-tool/dist/ArrayUtils");
/**
 * 用vscode打开项目
 * @param url
 */
function vscodeOpen(url) {
    let urls = ArrayUtils_1.ArrayUtils.arraify(url);
    for (let o of urls) {
        (0, fs_1.statSync)(o, {
            throwIfNoEntry: false,
        }) && child_process_1.default.exec(`code ${o}`);
    }
}
exports.vscodeOpen = vscodeOpen;
