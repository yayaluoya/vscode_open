import { BaseAC } from "./BaseAC";
import { instanceTool } from "yayaluoya-tool/dist/instanceTool";
/**
 * 测试api
 */
@instanceTool()
export class TestAC extends BaseAC {
    static readonly instance: TestAC;

    get() {
        return this.getData({
            url: '/test',
        });
    }
    post(data: any) {
        return this.postData({
            url: '/test',
            data,
        });
    }
}