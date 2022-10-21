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
        return (0, path_1.join)(__dirname, '../../../');
    }
    /** node路径 */
    static get nodePath() {
        return (0, path_1.join)(this.rootPath, '/.node');
    }
    /** 获取前端打包文件路径 */
    static get webDistPath() {
        return (0, path_1.join)(this.rootPath, '/dist');
    }
    /** 本地数据存储路径 */
    static get localDataPath() {
        return (0, path_1.join)(this.nodePath, '/_localData');
    }
}
exports.PathManager = PathManager;
