#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const getCmdOp_1 = require("yayaluoya-tool/dist/node/getCmdOp");
const chalk_1 = __importDefault(require("chalk"));
const server_1 = require("../server");
const vscodeOpen_1 = require("../tool/vscodeOpen");
const ItemDP_1 = require("../localData/ItemDP");
const packageJSON = require('../../../package.json');
const inquirer_1 = __importDefault(require("inquirer"));
const ArrayUtils_1 = require("yayaluoya-tool/dist/ArrayUtils");
let cmdOp = (0, getCmdOp_1.getCmdOp)((pro) => {
    pro.option('-h --help')
        .option('-l --list')
        .option('-k --keys <keys>')
        .option('-p --port')
        .option('-add --add <key...>')
        .option('-r --remove <keys>');
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
        console.log(chalk_1.default.green('   -l --list ') + chalk_1.default.gray('显示项目列表，可以选择并打开具体项目'));
        console.log(chalk_1.default.green('   -k --keys <keys> ') + chalk_1.default.gray('直接打开哪些项目，多个项目用,，号分隔'));
        console.log(chalk_1.default.green('   -add --add <key> <path> ') + chalk_1.default.gray('添加一个项目<key> 该项目的key <path> 该项目的本地路径'));
        console.log(chalk_1.default.green('   -r --remove <keys> ') + chalk_1.default.gray('删除项目，多个项目用,，号分隔'));
        break;
    case cmdOp.list:
        let list = ItemDP_1.ItemDP.instance.data;
        inquirer_1.default
            .prompt({
            type: 'checkbox',
            name: 'select',
            message: '项目列表-按空格键选择，按enter键确认:',
            choices: list.map(_ => {
                return {
                    name: `${_.key} ${_.title} ${_.path}`,
                    value: _,
                };
            }),
        })
            .then(({ select }) => {
            select && select.length > 0 && (0, vscodeOpen_1.vscodeOpen)(select.map(_ => _.path));
        })
            .catch((error) => {
            console.log(chalk_1.default.red('出错了'), error);
        });
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
    case Boolean(cmdOp.add):
        if (!cmdOp.add[0]) {
            console.log(chalk_1.default.red('必须输入key'));
            break;
        }
        if (!cmdOp.add[1]) {
            console.log(chalk_1.default.red('必须输入path'));
            break;
        }
        let item = {
            key: cmdOp.add[0],
            icon: '',
            title: '',
            path: cmdOp.add[1],
        };
        ItemDP_1.ItemDP.instance.add(item);
        console.log(chalk_1.default.blue('添加成功'), item);
        break;
    case Boolean(cmdOp.remove):
        let keys2 = (_b = cmdOp.remove) === null || _b === void 0 ? void 0 : _b.split(/[,，]/g);
        ArrayUtils_1.ArrayUtils.eliminate(ItemDP_1.ItemDP.instance.data, _ => {
            return keys2.includes(_.key);
        });
        console.log(chalk_1.default.blue('删除成功'));
        break;
    default:
        (0, server_1.server)({
            port: cmdOp.port,
        });
        break;
}
