"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PathManager = void 0;
const path_1 = require("path");
/**
 * 资源路径管理器
 */
class PathManager {
    /** 获取项目根路径 */
    static get rootPath() {
        return (0, path_1.join)(__dirname, '../../');
    }
    /** 获取打包文件路径 */
    static get distPath() {
        return (0, path_1.join)(this.rootPath, '/dist');
    }
    /** 本地数据存储路径 */
    static get localDataPath() {
        return (0, path_1.join)(this.rootPath, '/_localData');
    }
    /** 公共文件存储路径 */
    static get publicFilePath() {
        return (0, path_1.join)(this.rootPath, '/_public');
    }
    /** 公共文件虚拟目录 */
    static get publicFilePrefix() {
        return '/static/';
    }
    /** 设置静态文件代理 */
    static setStaticFileProxy(_app) {
        _app.useStaticAssets(this.publicFilePath, {
            prefix: this.publicFilePrefix,
            /** 缓存一年的时间 */
            maxAge: 1000 * 60 * 60 * 24 * 360,
        });
    }
    /** 数据路径 */
    static get dataPath() {
        return (0, path_1.join)(this.rootPath, '_data');
    }
}
exports.PathManager = PathManager;
