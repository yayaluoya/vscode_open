import { IConfig } from "./IConfig";

/**
 * 配置管理器
 */
export class ConfigManager {
    private static config_: IConfig;

    static get config() {
        return this.config_;
    }
    static set config(c: IConfig) {
        this.config_ = c;
    }
}