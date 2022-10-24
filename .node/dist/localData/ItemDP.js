"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemDP = void 0;
const BaseDataProxy_1 = require("./BaseDataProxy");
const instanceTool_1 = require("yayaluoya-tool/dist/instanceTool");
const Crypto_1 = require("yayaluoya-tool/dist/Crypto");
/**
 * 项目数据管理
 */
let ItemDP = class ItemDP extends BaseDataProxy_1.BaseDataProxy {
    getNewData() {
        return [];
    }
    /**
     * 添加一个item
     * @param item
     */
    add(item) {
        return this.data.push(Object.assign(Object.assign({ id: new Crypto_1.Crypto('', '').md5(Date.now() + Math.random().toString().split('.')[1]) }, item), { openNumber: 0 }));
    }
};
ItemDP = __decorate([
    (0, instanceTool_1.instanceTool)()
], ItemDP);
exports.ItemDP = ItemDP;
