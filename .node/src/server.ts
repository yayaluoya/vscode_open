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
import { createReadStream, statSync } from "fs";
import { vscodeOpen } from "./tool/vscodeOpen";
import { ArrayUtils } from "yayaluoya-tool/dist/ArrayUtils";
import { URLT } from "yayaluoya-tool/dist/http/URLT";
import { openUrl } from "./tool/openUrl";

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
        ConfigDP.instance.data.openBrowser && openUrl(url);
        console.log(chalk.blue(`vscodeOpen服务已开启:\n${url}`))
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
            (ConfigDP.instance.data as any)[i] = (data as any)[i];
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
        let item: IItemD = req.body;
        vscodeOpen(item.paths);
        let onItem = ItemDP.instance.data.find(_ => {
            return _.key == item.key;
        });
        if (onItem) {
            onItem.openNumber = (onItem.openNumber || 0) + 1;
        }
        res.send(new ResData(true));
    })
    app.post('/item', (req, res) => {
        let result = ItemDP.instance.add(req.body);
        if (typeof result == 'string') {
            res.send(new ResData().fail(result));
            return;
        }
        //
        res.send(new ResData(result, undefined, '添加成功'));
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
    app.post('/itemImport', (req, res) => {
        let itemList = req.body as IItemD[];
        if (itemList.length <= 0) {
            res.send(new ResData().fail('一个项目都没有呢'));
            return;
        }
        /**
         * TODO 兼容处理
         * path 到 paths 的兼容
         */
        for (let o of itemList as any) {
            if (o.path) {
                o.paths = [o.path];
                delete o.path;
            }
        }
        //
        for (let o of itemList) {
            let i = ItemDP.instance.data.findIndex(_ => _.key == o.key);
            // 找到就替换，没找到就添加
            if (i >= 0) {
                ItemDP.instance.data[i] = o;
            } else {
                ItemDP.instance.data.push(o);
            }
        }
        res.send(new ResData(null, undefined, '导入成功'));
    })

    /**
     * 其它
     */
    app.get('/file', (req, res) => {
        let path = req.query.path as string;
        if (statSync(path, {
            throwIfNoEntry: false,
        })?.isFile()) {
            createReadStream(path).pipe(res);
        } else {
            res.writeHead(404);
            res.end();
        }
    })
}