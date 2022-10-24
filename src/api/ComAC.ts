import { BaseAC } from "./BaseAC";
import { instanceTool } from "yayaluoya-tool/dist/instanceTool";
import { URLT } from "yayaluoya-tool/dist/http/URLT";

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
}