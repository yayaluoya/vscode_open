"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openItem = void 0;
const child_process_1 = __importDefault(require("child_process"));
const fs_1 = require("fs");
const ArrayUtils_1 = require("yayaluoya-tool/dist/ArrayUtils");
/**
 * 打开项目
 * @param url
 * @param type 打开方式
 */
function openItem(url, type = 'vscode') {
    let urls = ArrayUtils_1.ArrayUtils.arraify(url);
    for (let o of urls) {
        if ((0, fs_1.statSync)(o, {
            throwIfNoEntry: false,
        })) {
            switch (type) {
                case 'webStorm':
                    child_process_1.default.exec(`webStorm ${o}`);
                    break;
                case 'vscode':
                default:
                    child_process_1.default.exec(`code ${o}`);
                    break;
            }
        }
    }
}
exports.openItem = openItem;
