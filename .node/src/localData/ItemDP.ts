import { BaseDataProxy } from "./BaseDataProxy";
import { instanceTool } from "yayaluoya-tool/dist/instanceTool";
import { Crypto } from "yayaluoya-tool/dist/Crypto";

/**
 * 项目数据
 */
export interface IItemD {
    /** 唯一的id */
    id: string,
    /** 一个简称，可以重复 */
    key: string;
    /** 图标，本地文件路径 */
    icon: string;
    /** 标题 */
    title: string;
    /** 项目路径 */
    path: string;
}

/**
 * 项目数据管理
 */
@instanceTool()
export class ItemDP extends BaseDataProxy<IItemD[]> {
    /** 单例 */
    static readonly instance: ItemDP;

    protected getNewData() {
        return [];
    }

    /**
     * 添加一个item
     * @param item 
     */
    add(item: Omit<IItemD, 'id'>) {
        return this.data.push({
            id: new Crypto('', '').md5(Date.now() + Math.random().toString().split('.')[1]),
            ...item,
        });
    }
}