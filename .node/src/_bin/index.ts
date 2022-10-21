#!/usr/bin/env node
import { getCmdOp, IOp as IOp_ } from "yayaluoya-tool/dist/node/getCmdOp";
import { IConfig } from "../config/IConfig";
import chalk from "chalk";
import { server } from "../server";
import { vscodeOpen } from "../tool/vscodeOpen";
import { ItemDP } from "../localData/ItemDP";
const packageJSON = require('../../../package.json');

interface IOp extends IOp_ {
    /** 帮助 */
    help: boolean;
    /** 项目key列表 */
    keys: string;
    /** 显示当前有多少项目 */
    keyList: boolean;
}

let cmdOp = getCmdOp<IOp &
    Pick<
        IConfig,
        'port'
    >
>((pro) => {
    pro.option('-h --help')
        .option('-kl --key-list')
        .option('-k --keys <keys>')
        .option('-p --port');
});

// console.log('cmdOp', cmdOp);

switch (true) {
    case cmdOp.version:
        console.log(chalk.green('当前工具版本@ ') + chalk.yellow(packageJSON.version));
        break;
    case cmdOp.help:
        console.log(chalk.hex('#d2e603')('vscode_open的所有命令😀:'));
        console.log(chalk.green('   -v --version ') + chalk.gray('查看当前工具版本'));
        console.log(chalk.green('   -h --help ') + chalk.gray('查看所有的命令和帮助信息'));
        console.log(chalk.green('   -p --port ') + chalk.gray('指定用哪个端口启动'));
        console.log(chalk.green('   -kl --key-list ') + chalk.gray('显示项目列表'));
        console.log(chalk.green('   -k --keys <keys> ') + chalk.gray('直接打开哪些项目，多个项目用,，号分隔'));
        break;
    case cmdOp.keyList:
        console.log(chalk.yellow('项目列表:'));
        for (let { key, path, title } of ItemDP.instance.data) {
            console.log(chalk.green(key), chalk.gray(title), chalk.gray(path));
        }
        break;
    case Boolean(cmdOp.keys):
        let keys = cmdOp.keys?.split(/[,，]/g);
        if (!keys || keys.length <= 0) {
            console.log(chalk.red('找不到项目'));
            break;
        }
        //直接打开项目
        vscodeOpen(ItemDP.instance.data.filter(_ => {
            return keys.includes(_.key);
        }).map(_ => _.path));
        break;
    default:
        server({
            port: cmdOp.port,
        });
        break;
}