import child_process from 'child_process';
import { statSync } from 'fs';
import { ArrayUtils } from 'yayaluoya-tool/dist/ArrayUtils';

/**
 * 打开项目
 * @param url
 * @param type 打开方式
 */
export function openItem(url: TArraify<string>, type: ComN.openType = 'vscode') {
    let urls = ArrayUtils.arraify(url);
    for (let o of urls) {
        if (
            statSync(o, {
                throwIfNoEntry: false,
            })
        ) {
            switch (type) {
                case 'webStorm':
                    child_process.exec(`webStorm ${o}`);
                    break;
                case 'vscode':
                default:
                    child_process.exec(`code ${o}`);
                    break;
            }
        }
    }
}
