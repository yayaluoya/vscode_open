#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const getCmdOp_1 = require("yayaluoya-tool/dist/node/getCmdOp");
const chalk_1 = __importDefault(require("chalk"));
const server_1 = require("../server");
const vscodeOpen_1 = require("../tool/vscodeOpen");
const ItemDP_1 = require("../localData/ItemDP");
const packageJSON = require('../../../package.json');
let cmdOp = (0, getCmdOp_1.getCmdOp)((pro) => {
    pro.option('-h --help')
        .option('-kl --key-list')
        .option('-k --keys <keys>')
        .option('-p --port');
});
// console.log('cmdOp', cmdOp);
switch (true) {
    case cmdOp.version:
        console.log(chalk_1.default.green('当前工具版本@ ') + chalk_1.default.yellow(packageJSON.version));
        break;
    case cmdOp.help:
        console.log(chalk_1.default.hex('#d2e603')('vscode_open的所有命令😀:'));
        console.log(chalk_1.default.green('   -v --version ') + chalk_1.default.gray('查看当前工具版本'));
        console.log(chalk_1.default.green('   -h --help ') + chalk_1.default.gray('查看所有的命令和帮助信息'));
        console.log(chalk_1.default.green('   -p --port ') + chalk_1.default.gray('指定用哪个端口启动'));
        console.log(chalk_1.default.green('   -kl --key-list ') + chalk_1.default.gray('显示项目列表'));
        console.log(chalk_1.default.green('   -k --keys <keys> ') + chalk_1.default.gray('直接打开哪些项目，多个项目用,，号分隔'));
        break;
    case cmdOp.keyList:
        console.log(chalk_1.default.yellow('项目列表:'));
        for (let { key, path, title } of ItemDP_1.ItemDP.instance.data) {
            console.log(chalk_1.default.green(key), chalk_1.default.gray(title), chalk_1.default.gray(path));
        }
        break;
    case Boolean(cmdOp.keys):
        let keys = (_a = cmdOp.keys) === null || _a === void 0 ? void 0 : _a.split(/[,，]/g);
        if (!keys || keys.length <= 0) {
            console.log(chalk_1.default.red('找不到项目'));
            break;
        }
        //直接打开项目
        (0, vscodeOpen_1.vscodeOpen)(ItemDP_1.ItemDP.instance.data.filter(_ => {
            return keys.includes(_.key);
        }).map(_ => _.path));
        break;
    default:
        (0, server_1.server)({
            port: cmdOp.port,
        });
        break;
}
