import { IConfig } from "./config/IConfig";
import { ObjectUtils } from "yayaluoya-tool/dist/obj/ObjectUtils";
import { ConfigDP } from "./localData/ConfigDP";
import { ConfigManager } from "./config/ConfigManager";
import express, { Express } from "express";
import { ResData } from "yayaluoya-tool/dist/http/ResData";
import { PathManager } from "./manager/PathManager";
import serveStatic from "serve-static";
import chalk from "chalk";
import { IItemD, ItemDP } from "./localData/ItemDP";
import { statSync } from "fs";
import { vscodeOpen } from "./tool/vscodeOpen";
import { Crypto } from "yayaluoya-tool/dist/Crypto";
import { ArrayUtils } from "yayaluoya-tool/dist/ArrayUtils";

/**
 * 启动服务
 * @param config 一个临时的config
 */
export function server(config_: Partial<IConfig>) {
    let config = ObjectUtils.clone2(ConfigDP.instance.data);
    for (let i in config_) {
        (config_ as any)[i] && ObjectUtils.merge(config, {
            [i]: (config_ as any)[i],
        } as any)
    }
    ConfigManager.config = config;

    /**
     * 开启服务
     */
    const app = express()

    app.use(express.json()) // for parsing application/json
    app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

    //添加web资源代理
    app.use(
        serveStatic(PathManager.webDistPath),
    )

    //设置跨域访问（设置在所有的请求前面即可）
    app.all("*", function (req, res, next) {
        //设置允许跨域的域名，*代表允许任意域名跨域
        res.header("Access-Control-Allow-Origin", "*");
        //允许的header类型
        res.header("Access-Control-Allow-Headers", "*");
        //跨域允许的请求方式 
        res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
        if (req.method == 'OPTIONS')
            res.sendStatus(200); //让options尝试请求快速结束
        else
            next();
    });

    app.get('/test', (req, res) => {
        setTimeout(() => {
            res.send(new ResData(req.query));
        }, 300);
    })
    app.post('/test', (req, res) => {
        setTimeout(() => {
            res.send(new ResData(req.body));
        }, 300);
    });

    addApi(app);

    app.listen(config.port, () => {
        let url = `http://localhost:${config.port}`;
        console.log(chalk.blue(`服务已开启@${url}`))
    })
}

/**
 * 添加api
 * @param app 
 */
function addApi(app: Express) {
    /** 
     * 配置文件
     */
    app.put('/config', (req, res) => {
        let data: Partial<IConfig> = req.body;
        for (let i in data) {
            (i in ConfigDP.instance.data) && ((ConfigDP.instance.data as any)[i] = (data as any)[i]);
        }
        res.send(new ResData(null, undefined, '修改成功'));
    });
    app.get('/config', (req, res) => {
        res.send(new ResData(ConfigDP.instance.data));
    })


    /**
     * 项目相关
     */
    app.post('/itemOpen', (req, res) => {
        let path: string = req.body.path;
        if (!statSync(path, {
            throwIfNoEntry: false,
        })) {
            res.send(new ResData().fail('找不到这个目录或文件'));
            return;
        }
        vscodeOpen(path);
        res.send(new ResData());
    })
    app.post('/item', (req, res) => {
        let item: IItemD = req.body;
        if (!statSync(item.path, {
            throwIfNoEntry: false,
        })) {
            res.send(new ResData().fail('path不是一个文件或目录'));
            return;
        }
        ItemDP.instance.add(item);
        //
        res.send(new ResData(item, undefined, '添加成功'));
    })
    app.delete('/item', (req, res) => {
        let id = req.body.id;
        ArrayUtils.eliminate(ItemDP.instance.data, _ => _.id == id);
        res.send(new ResData(null, undefined, '删除成功'));
    })
    app.put('/item', (req, res) => {
        let item: IItemD = req.body;
        let onItem = ItemDP.instance.data.find(_ => _.id == item.id);
        if (!onItem) {
            res.send(new ResData().fail('找不到这个项目'));
            return;
        }
        for (let i in item) {
            (onItem as any)[i] = (item as any)[i];
        }
        res.send(new ResData(null, undefined, '修改成功'));
    });
    app.get('/item', (req, res) => {
        res.send(new ResData(ItemDP.instance.data));
    })
}