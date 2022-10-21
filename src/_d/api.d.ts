import { type IItemD as IItemD_ } from "../../.node/src/localData/ItemDP";
import { type IConfig as IConfig_ } from "../../.node/src/config/IConfig";

/**
 * api相关的命名空间
 */
declare namespace NApi {
    /**
     * 配置
     */
    export interface IConfig extends IConfig_ { }
    /**
     * 项目数据配置
     */
    export interface IItemD extends IItemD_ { }
}