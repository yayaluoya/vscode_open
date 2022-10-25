import { BaseDataProxy } from "./BaseDataProxy";
import { instanceTool } from "yayaluoya-tool/dist/instanceTool";
import { Crypto } from "yayaluoya-tool/dist/Crypto";
import { ArrayUtils } from "yayaluoya-tool/dist/ArrayUtils";
import { statSync } from "fs";

/**
 * 项目数据
 */
export interface IItemD {
    /** 唯一的id */
    id?: string,
    /** 一个简称，可以重复 */
    key: string;
    /** 图标，本地文件路径 */
    icon: string;
    /** 标题 */
    title: string;
    /** 项目路径 */
    path: string;
    /** 打开次数 */
    openNumber: number;
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
     * 如果返回-1的话则添加失败
     * @param item 
     */
    add(item: Omit<IItemD, 'id' | 'openNumber'>): string | IItemD {
        if (!item.key) {
            return '必须输入key';
        }
        if (!item.path) {
            return '必须输入路径';
        }
        if (!statSync(item.path, {
            throwIfNoEntry: false,
        })) {
            return 'path不是一个文件或目录';
        }
        //如果存在一样key的话就添加错误
        if (ArrayUtils.has(this.data, _ => {
            return _.key == item.key;
        })) {
            return '不能存在同样的key';
        }
        //
        let op: IItemD = {
            id: new Crypto('', '').md5(Date.now() + Math.random().toString().split('.')[1]),
            ...item,
            openNumber: 0,
        };
        this.data.push(op);
        //
        return op;
    }
}