import { BaseAC } from "./BaseAC";
import { instanceTool } from "yayaluoya-tool/dist/instanceTool";
import { NApi } from "../_d/api";

/**
 * 配置接口
 */
@instanceTool()
export class ConfigAC extends BaseAC {
    static readonly instance: ConfigAC;

    /** 获取配置文件 */
    get() {
        return this.getData<NApi.IConfig>({
            url: '/config',
        });
    }
    /** 编辑配置 */
    edit(data: Partial<NApi.IItemD>) {
        return this.putData({
            url: '',
        })
    }
}