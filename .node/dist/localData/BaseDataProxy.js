"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseDataProxy = void 0;
const LocalStorage_1 = require("yayaluoya-tool/dist/node/localData/LocalStorage_");
const BaseDataProxy_1 = require("yayaluoya-tool/dist/node/localData/BaseDataProxy");
const PathManager_1 = require("../manager/PathManager");
class LocalStorage_ extends LocalStorage_1.LocalStorage_ {
    /**
     * 获取数据存储路径
     * TODO 需要重写
     */
    static get getPath() {
        return PathManager_1.PathManager.localDataPath;
    }
}
/**
 * 基类本地数据代理
 */
class BaseDataProxy extends BaseDataProxy_1.BaseDataProxy {
    get LocalStorage_() {
        return LocalStorage_;
    }
}
exports.BaseDataProxy = BaseDataProxy;
