import { join } from 'path';
/**
 * 资源路径管理器
 */
export class PathManager {
    /** 获取项目根路径 */
    static get rootPath(): string {
        return join(__dirname, '../../');
    }

    /** 获取前端打包文件路径 */
    static get webDistPath(): string {
        return join(this.rootPath, '/web/dist');
    }

    /** 本地数据存储路径 */
    static get localDataPath(): string {
        return join(this.rootPath, '/_localData');
    }
}
