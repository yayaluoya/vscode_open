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
const vscodeOpen_1 = require("./tool/vscodeOpen");
const ArrayUtils_1 = require("yayaluoya-tool/dist/ArrayUtils");
const URLT_1 = require("yayaluoya-tool/dist/http/URLT");
const openUrl_1 = require("./tool/openUrl");
/**
 * 启动服务
 * @param config 一个临时的config
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
        (0, openUrl_1.openUrl)(url);
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
            (i in ConfigDP_1.ConfigDP.instance.data) && (ConfigDP_1.ConfigDP.instance.data[i] = data[i]);
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
        let path = req.body.path;
        if (!(0, fs_1.statSync)(path, {
            throwIfNoEntry: false,
        })) {
            res.send(new ResData_1.ResData().fail('找不到这个目录或文件'));
            return;
        }
        (0, vscodeOpen_1.vscodeOpen)(path);
        let onItem = ItemDP_1.ItemDP.instance.data.find(_ => {
            return URLT_1.URLT.contrast(_.path, path);
        });
        if (onItem) {
            onItem.openNumber = (onItem.openNumber || 0) + 1;
        }
        res.send(new ResData_1.ResData());
    });
    app.post('/item', (req, res) => {
        let item = req.body;
        if (!(0, fs_1.statSync)(item.path, {
            throwIfNoEntry: false,
        })) {
            res.send(new ResData_1.ResData().fail('path不是一个文件或目录'));
            return;
        }
        ItemDP_1.ItemDP.instance.add(item);
        //
        res.send(new ResData_1.ResData(item, undefined, '添加成功'));
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
        for (let o of itemList) {
            if (!ArrayUtils_1.ArrayUtils.has(ItemDP_1.ItemDP.instance.data, _ => {
                return _.id == o.id;
            })) {
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
}
