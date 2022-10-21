"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretCoduDataP = void 0;
const MainConfig_1 = require("config/MainConfig");
const instanceTool_1 = require("yayaluoya-tool/dist/instanceTool");
const BaseDataProxy_1 = require("./BaseDataProxy");
/**
 * 暗号本地数据
 */
let SecretCoduDataP = class SecretCoduDataP extends BaseDataProxy_1.BaseDataProxy {
    //
    getNewData() {
        return [];
    }
    /**
     * 暗号是否过期
     * @param v
     * @param time
     */
    vBeOverdue(v, time) {
        //先剔除掉超时的暗号
        this.data = this.data.filter((item) => {
            return Math.abs(item[1] - Date.now()) <= MainConfig_1.MainConfig.secretCode.overrunTime;
        });
        if (this.data.some((item) => {
            return item[0] == v;
        })) {
            return true;
        }
        else {
            this.data.push([v, time]);
            return false;
        }
    }
};
SecretCoduDataP = __decorate([
    (0, instanceTool_1.instanceTool)()
], SecretCoduDataP);
exports.SecretCoduDataP = SecretCoduDataP;
