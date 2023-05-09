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
const ArrayUtils_1 = require("yayaluoya-tool/dist/ArrayUtils");
const fs_1 = require("fs");
/**
 * 项目数据管理
 */
let ItemDP = class ItemDP extends BaseDataProxy_1.BaseDataProxy {
    getNewData() {
        return [];
    }
    /**
     * 添加一个item
     * 如果返回-1的话则添加失败
     * @param item
     */
    add(item) {
        if (!item.key) {
            return '必须输入key';
        }
        if (!item.paths || item.paths.length <= 0) {
            return '必须输入路径';
        }
        for (let path of item.paths) {
            if (!(0, fs_1.statSync)(path, {
                throwIfNoEntry: false,
            })) {
                return `找不到路径:${path}`;
            }
        }
        //如果存在一样key的话就添加错误
        if (ArrayUtils_1.ArrayUtils.has(this.data, (_) => {
            return _.key == item.key;
        })) {
            return '不能存在同样的key';
        }
        //
        let op = Object.assign(Object.assign({ id: new Crypto_1.Crypto('', '').md5(Date.now() + Math.random().toString().split('.')[1]) }, item), { openNumber: 0 });
        this.data.push(op);
        //
        return op;
    }
};
ItemDP = __decorate([
    (0, instanceTool_1.instanceTool)()
], ItemDP);
exports.ItemDP = ItemDP;
