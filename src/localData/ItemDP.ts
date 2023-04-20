import { BaseDataProxy } from "./BaseDataProxy";
import { instanceTool } from "yayaluoya-tool/dist/instanceTool";
import { Crypto } from "yayaluoya-tool/dist/Crypto";
import { ArrayUtils } from "yayaluoya-tool/dist/ArrayUtils";
import { statSync } from "fs";

/**
 * 项目数据管理
 */
@instanceTool()
export class ItemDP extends BaseDataProxy<ComN.IItemD[]> {
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
    add(item: Omit<ComN.IItemD, 'id' | 'openNumber'>): string | ComN.IItemD {
        if (!item.key) {
            return '必须输入key';
        }
        if (!item.paths || item.paths.length <= 0) {
            return '必须输入路径';
        }
        for (let path of item.paths) {
            if (!statSync(path, {
                throwIfNoEntry: false,
            })) {
                return `找不到路径:${path}`;
            }
        }
        //如果存在一样key的话就添加错误
        if (ArrayUtils.has(this.data, _ => {
            return _.key == item.key;
        })) {
            return '不能存在同样的key';
        }
        //
        let op: ComN.IItemD = {
            id: new Crypto('', '').md5(Date.now() + Math.random().toString().split('.')[1]),
            ...item,
            openNumber: 0,
        };
        this.data.push(op);
        //
        return op;
    }
}