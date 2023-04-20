import { BaseAC } from "./BaseAC";
import { instanceTool } from "yayaluoya-tool/dist/instanceTool";

/**
 * 项目接口
 */
@instanceTool()
export class ItemAC extends BaseAC {
    static readonly instance: ItemAC;

    /** 打开项目 */
    open(item: ComN.IItemD) {
        return this.postData({
            url: '/itemOpen',
            data: item,
        });
    }
    /** 添加项目 */
    add(data: Partial<ComN.IItemD>) {
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
    edit(data: ComN.IItemD) {
        return this.putData({
            url: '/item',
            data,
        });
    }
    /** 获取项目列表 */
    list() {
        return this.getData<ComN.IItemD[]>({
            url: '/item',
        });
    }
    /** 导入项目 */
    itemImport(data: ComN.IItemD[]) {
        return this.postData({
            url: '/itemImport',
            data,
        });
    }
}