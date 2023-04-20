"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigManager = void 0;
/**
 * 配置管理器
 */
class ConfigManager {
    static get config() {
        return this.config_;
    }
    static set config(c) {
        this.config_ = c;
    }
}
exports.ConfigManager = ConfigManager;
