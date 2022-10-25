import { IConfig } from "../config/IConfig";
import { BaseDataProxy } from "./BaseDataProxy";
import { instanceTool } from "yayaluoya-tool/dist/instanceTool";

/**
 * 配置数据管理
 */
@instanceTool()
export class ConfigDP extends BaseDataProxy<IConfig> {
    /** 单例 */
    static readonly instance: ConfigDP;

    protected getNewData(): IConfig {
        return {
            port: 3142,
            openBrowser: true,
        };
    }
}