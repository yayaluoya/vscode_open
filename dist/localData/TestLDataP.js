"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestLDataP = void 0;
const instanceTool_1 = require("yayaluoya-tool/dist/instanceTool");
const BaseDataProxy_1 = require("./BaseDataProxy");
/**
 * 测试数据
 */
let TestLDataP = class TestLDataP extends BaseDataProxy_1.BaseDataProxy {
    test() {
        this.data.n++;
    }
    //
    getNewData() {
        return {
            s: 's',
            n: 1,
            obj: {
                a: [],
                b: false,
            },
        };
    }
};
TestLDataP = __decorate([
    (0, instanceTool_1.instanceTool)()
], TestLDataP);
exports.TestLDataP = TestLDataP;
