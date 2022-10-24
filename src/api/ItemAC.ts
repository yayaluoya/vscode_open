import { BaseAC } from "./BaseAC";
import { instanceTool } from "yayaluoya-tool/dist/instanceTool";
import { NApi } from "../_d/api";

/**
 * 项目接口
 */
@instanceTool()
export class ItemAC extends BaseAC {
    static readonly instance: ItemAC;

    /** 打开项目 */
    open(path: string) {
        return this.postData({
            url: '/itemOpen',
            data: { path },
        });
    }
    /** 添加项目 */
    add(data: Partial<NApi.IItemD>) {
        return this.postData({
            url: '/item',
            data,
        });
    }
    /** 删除项目 */
    remove(id: string) {
        return this.deleteData({
            url: '/item',
            data: { id },
        });
    }
    /** 修改项目 */
    edit(data: NApi.IItemD) {
        return this.putData({
            url: '/item',
            data,
        });
    }
    /** 获取项目列表 */
    list() {
        return this.getData<NApi.IItemD[]>({
            url: '/item',
        });
    }
}