import { BaseDataProxy } from './BaseDataProxy';
import { instanceTool } from 'yayaluoya-tool/dist/instanceTool';

/**
 * 配置数据管理
 */
@instanceTool()
export class ConfigDP extends BaseDataProxy<ComN.IConfig> {
    /** 单例 */
    static readonly instance: ConfigDP;

    protected getNewData(): ComN.IConfig {
        return {
            port: 3142,
            openBrowser: true,
            dark: false,
        };
    }
}
