/**
 * 公共命名空间
 */
namespace ComN {
    // 打卡方式
    type openType = 'vscode' | 'webStorm';

    /**
     * 项目配置
     */
    interface IConfig {
        /** 端口 */
        port: number;
        /** 是否打开浏览器 */
        openBrowser: boolean;
        /** 黑夜模块 */
        dark: boolean;
    }

    /**
     * 项目数据
     */
    interface IItemD {
        /** 唯一的id */
        id?: string,
        /** 一个简称，可以重复 */
        key: string;
        /** 图标，本地文件路径 */
        icon: string;
        /** 标题 */
        title: string;
        /** 项目路径列表 */
        paths: string[];
        /** 打开次数 */
        openNumber: number;
        /** 打卡方式 */
        openType?: openType;
    }
}