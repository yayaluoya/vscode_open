import { ElMessage } from 'element-plus';
import { ResData } from 'yayaluoya-tool/src/http/ResData';

/**
 * 消息提示工具
 */
export class Mes {
    /**
     * 成功提示
     * @param _str
     */
    static success(_str: string) {
        ElMessage.success(_str);
    }
    /**
     * 警告提示
     * @param _str
     */
    static warning(_str: string) {
        ElMessage.warning(_str);
    }
    /**
     * info提示
     * @param _str
     */
    static info(_str: string) {
        ElMessage.info(_str);
    }
    /**
     * 异常提示
     * @param _str
     */
    static error(_str: string) {
        ElMessage.error(_str);
    }

    /**
     * 处理http的错误请求提示
     * @param param0
     */
    static handleHttpCatch({ msg }: ResData) {
        Mes.error(msg);
    }
}
