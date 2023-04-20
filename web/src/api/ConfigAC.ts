import { BaseAC } from "./BaseAC";
import { instanceTool } from "yayaluoya-tool/dist/instanceTool";

/**
 * 配置接口
 */
@instanceTool()
export class ConfigAC extends BaseAC {
    static readonly instance: ConfigAC;

    /** 获取配置文件 */
    get() {
        return this.getData<ComN.IConfig>({
            url: '/config',
        });
    }
    /** 编辑配置 */
    edit(data: Partial<ComN.IConfig>) {
        return this.putData({
            url: '/config',
            data,
        })
    }
}