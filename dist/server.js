"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const ObjectUtils_1 = require("yayaluoya-tool/dist/obj/ObjectUtils");
const ConfigDP_1 = require("./localData/ConfigDP");
const ConfigManager_1 = require("./config/ConfigManager");
const express_1 = __importDefault(require("express"));
const ResData_1 = require("yayaluoya-tool/dist/http/ResData");
const PathManager_1 = require("./manager/PathManager");
const serve_static_1 = __importDefault(require("serve-static"));
const chalk_1 = __importDefault(require("chalk"));
const ItemDP_1 = require("./localData/ItemDP");
const fs_1 = require("fs");
const openItem_1 = require("./tool/openItem");
const ArrayUtils_1 = require("yayaluoya-tool/dist/ArrayUtils");
const openUrl_1 = require("./tool/openUrl");
/**
 * 启动服务
 * @param config_
 */
function server(config_) {
    let config = ObjectUtils_1.ObjectUtils.clone2(ConfigDP_1.ConfigDP.instance.data);
    for (let i in config_) {
        config_[i] && ObjectUtils_1.ObjectUtils.merge(config, {
            [i]: config_[i],
        });
    }
    ConfigManager_1.ConfigManager.config = config;
    /**
     * 开启服务
     */
    const app = (0, express_1.default)();
    app.use(express_1.default.json()); // for parsing application/json
    app.use(express_1.default.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
    //添加web资源代理
    app.use((0, serve_static_1.default)(PathManager_1.PathManager.webDistPath));
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
            res.send(new ResData_1.ResData(req.query));
        }, 300);
    });
    app.post('/test', (req, res) => {
        setTimeout(() => {
            res.send(new ResData_1.ResData(req.body));
        }, 300);
    });
    addApi(app);
    app.listen(config.port, () => {
        let url = `http://localhost:${config.port}`;
        ConfigDP_1.ConfigDP.instance.data.openBrowser && (0, openUrl_1.openUrl)(url);
        console.log(chalk_1.default.blue(`vscodeOpen服务已开启:\n${url}`));
    });
}
exports.server = server;
/**
 * 添加api
 * @param app
 */
function addApi(app) {
    /**
     * 配置文件
     */
    app.put('/config', (req, res) => {
        let data = req.body;
        for (let i in data) {
            ConfigDP_1.ConfigDP.instance.data[i] = data[i];
        }
        res.send(new ResData_1.ResData(null, undefined, '修改成功'));
    });
    app.get('/config', (req, res) => {
        res.send(new ResData_1.ResData(ConfigDP_1.ConfigDP.instance.data));
    });
    /**
     * 项目相关
     */
    app.post('/itemOpen', (req, res) => {
        let item = req.body;
        (0, openItem_1.openItem)(item.paths, item.openType);
        let onItem = ItemDP_1.ItemDP.instance.data.find(_ => {
            return _.key == item.key;
        });
        if (onItem) {
            onItem.openNumber = (onItem.openNumber || 0) + 1;
        }
        res.send(new ResData_1.ResData(true));
    });
    app.post('/item', (req, res) => {
        let result = ItemDP_1.ItemDP.instance.add(req.body);
        if (typeof result == 'string') {
            res.send(new ResData_1.ResData().fail(result));
            return;
        }
        //
        res.send(new ResData_1.ResData(result, undefined, '添加成功'));
    });
    app.delete('/item', (req, res) => {
        let id = req.body.id;
        ArrayUtils_1.ArrayUtils.eliminate(ItemDP_1.ItemDP.instance.data, _ => _.id == id);
        res.send(new ResData_1.ResData(null, undefined, '删除成功'));
    });
    app.put('/item', (req, res) => {
        let item = req.body;
        let onItem = ItemDP_1.ItemDP.instance.data.find(_ => _.id == item.id);
        if (!onItem) {
            res.send(new ResData_1.ResData().fail('找不到这个项目'));
            return;
        }
        for (let i in item) {
            onItem[i] = item[i];
        }
        res.send(new ResData_1.ResData(null, undefined, '修改成功'));
    });
    app.get('/item', (req, res) => {
        res.send(new ResData_1.ResData(ItemDP_1.ItemDP.instance.data));
    });
    app.post('/itemImport', (req, res) => {
        let itemList = req.body;
        if (itemList.length <= 0) {
            res.send(new ResData_1.ResData().fail('一个项目都没有呢'));
            return;
        }
        /**
         * TODO 兼容处理
         * path 到 paths 的兼容
         */
        for (let o of itemList) {
            if (o.path) {
                o.paths = [o.path];
                delete o.path;
            }
        }
        //
        for (let o of itemList) {
            let i = ItemDP_1.ItemDP.instance.data.findIndex(_ => _.key == o.key);
            // 找到就替换，没找到就添加
            if (i >= 0) {
                ItemDP_1.ItemDP.instance.data[i] = o;
            }
            else {
                ItemDP_1.ItemDP.instance.data.push(o);
            }
        }
        res.send(new ResData_1.ResData(null, undefined, '导入成功'));
    });
    /**
     * 其它
     */
    app.get('/file', (req, res) => {
        var _a;
        let path = req.query.path;
        if ((_a = (0, fs_1.statSync)(path, {
            throwIfNoEntry: false,
        })) === null || _a === void 0 ? void 0 : _a.isFile()) {
            (0, fs_1.createReadStream)(path).pipe(res);
        }
        else {
            res.writeHead(404);
            res.end();
        }
    });
    // 打开一个项目路径
    app.post('/open_item_path', (req, res) => {
        if (!req.body.path) {
            return new ResData_1.ResData().fail('必须输入路径');
        }
        if (!(0, fs_1.statSync)(req.body.path, {
            throwIfNoEntry: false,
        })) {
            return new ResData_1.ResData().fail('这个路径不存在');
        }
        (0, openItem_1.openItem)(req.body.path, req.body.type);
        return new ResData_1.ResData(true);
    });
}
