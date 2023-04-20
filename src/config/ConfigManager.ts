/**
 * 配置管理器
 */
export class ConfigManager {
    private static config_: ComN.IConfig;

    static get config() {
        return this.config_;
    }
    static set config(c: ComN.IConfig) {
        this.config_ = c;
    }
}