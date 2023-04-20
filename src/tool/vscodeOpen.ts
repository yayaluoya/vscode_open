import child_process from "child_process";
import { statSync } from "fs";
import { ArrayUtils } from "yayaluoya-tool/dist/ArrayUtils";
/**
 * 用vscode打开项目
 * @param url 
 */
export function vscodeOpen(url: TArraify<string>) {
    let urls = ArrayUtils.arraify(url);
    for (let o of urls) {
        statSync(o, {
            throwIfNoEntry: false,
        }) && child_process.exec(`code ${o}`);
    }
}