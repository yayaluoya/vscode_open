import { AxiosResponse } from "axios";
import { ResData } from "yayaluoya-tool/dist/http/ResData";
import { BaseApiCon } from "yayaluoya-tool/dist/node/BaseApiCon";
/**
 * 基类api
 */
export class BaseAC extends BaseApiCon {
    protected resData_(data: any, con: boolean, res: AxiosResponse<any, any>): ResData<any> {
        return data;
    }
}