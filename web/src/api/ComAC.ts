import {BaseAC} from "./BaseAC";
import {instanceTool} from "yayaluoya-tool/dist/instanceTool";
import {URLT} from "yayaluoya-tool/dist/http/URLT";

@instanceTool()
export class ComAC extends BaseAC {
    static readonly instance: ComAC;

    /**
     * 获取文件路径
     * @param str
     * @returns
     */
    static getFileUrl(str: string) {
        let url = new URLT(URLT.join(import.meta.env.VITE_BASE_API, '/file'));
        url.addQuery({
            path: str,
        });
        return url.href;
    }

    /**
     * 打开一个项目路径
     * @param path
     * @param type
     */
    open_item_path(path: TArraify<string>, type?: ComN.openType) {
        return this.postData({
            url: '/open_item_path',
            data: {path, type},
        });
    }
}