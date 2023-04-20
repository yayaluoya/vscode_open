#!/usr/bin/env node
import { getCmdOp, IOp as IOp_ } from "yayaluoya-tool/dist/node/getCmdOp";
import { IConfig } from "../config/IConfig";
import chalk from "chalk";
import { server } from "../server";
import { vscodeOpen } from "../tool/vscodeOpen";
import { IItemD, ItemDP } from "../localData/ItemDP";
const packageJSON = require('../../../package.json');
import inquirer from 'inquirer';
import { ArrayUtils } from "yayaluoya-tool/dist/ArrayUtils";

interface IOp extends IOp_ {
    /** 帮助 */
    help: boolean;
    /** 项目key列表 */
    keys: string;
    /** 显示当前有多少项目 */
    list: boolean;
    /** 添加一个项目 */
    add: [string, string];
    /** 删除一个项目 */
    remove: string;
}

let cmdOp = getCmdOp<IOp &
    Pick<
        IConfig,
        'port'
    >
>((pro) => {
    pro.option('-h --help')
        .option('-l --list')
        .option('-k --keys <keys>')
        .option('-p --port <port>')
        .option('-add --add <key...>')
        .option('-r --remove <keys>')
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
        console.log(chalk.green('   -l --list ') + chalk.gray('显示项目列表，可以选择并打开具体项目'));
        console.log(chalk.green('   -k --keys <keys> ') + chalk.gray('直接打开哪些项目，多个项目用,，号分隔'));
        console.log(chalk.green('   -add --add <key> <paths> ') + chalk.gray('添加一个项目，<key>：该项目的key，<paths>：该项目的本地路径列表，多个用,，号分隔'));
        console.log(chalk.green('   -r --remove <keys> ') + chalk.gray('删除项目，多个项目用,，号分隔'));
        break;
    case cmdOp.list:
        let list = ItemDP.instance.data;
        inquirer
            .prompt({
                type: 'checkbox',
                name: 'select',
                message: '项目列表-按空格键选择，按enter键确认:',
                choices: list.map(_ => {
                    return {
                        name: `${_.key} ${_.title} ${_.paths.join(',')}`,
                        value: _,
                    };
                }),
                pageSize: 20,
            })
            .then(({ select }: { select: IItemD[] }) => {
                select && select.length > 0 && vscodeOpen(select.reduce<string[]>((a, b) => {
                    a.push(...b.paths);
                    return a;
                }, []));
            })
            .catch((error) => {
                console.log(chalk.red('出错了'), error);
            });
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
        }).reduce<string[]>((a, b) => {
            a.push(...b.paths);
            return a;
        }, []));
        break;
    case Boolean(cmdOp.add):
        let result = ItemDP.instance.add({
            key: cmdOp.add[0],
            icon: '',
            title: '',
            paths: cmdOp.add[0].split(/[,，]/g),
        });
        if (typeof result == 'string') {
            console.log(chalk.red(result));
            break;
        }
        console.log(chalk.blue('添加成功'), result);
        break;
    case Boolean(cmdOp.remove):
        let keys2 = cmdOp.remove?.split(/[,，]/g);
        ArrayUtils.eliminate(ItemDP.instance.data, _ => {
            return keys2.includes(_.key);
        });
        console.log(chalk.blue('删除成功'));
        break;
    default:
        server({
            port: cmdOp.port,
        });
        break;
}