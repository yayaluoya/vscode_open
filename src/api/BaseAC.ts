import { AxiosResponse, AxiosRequestConfig } from "axios";
import { ResData } from "yayaluoya-tool/dist/http/ResData";
import { BaseApiCon } from "yayaluoya-tool/dist/node/BaseApiCon";
/**
 * 基类api
 */
export class BaseAC extends BaseApiCon {
    /** 可配置选项 */
    get op() {
        return {
            baseURL: import.meta.env.VITE_BASE_API,
            timeout: 1000 * 60 * 5,
        };
    }

    /** 获取数据中的数据 */
    requestDataData<D>(op: AxiosRequestConfig) {
        return this.requestData<D>(op).then(({ data }) => data);
    }


    /**
     * get请求获取数据
     * @param _op 请求配置 
     * @param data 
     * @param headers 
     * @returns 
     */
    getData<D>(_op: AxiosRequestConfig) {
        return this.requestDataData<D>({
            ..._op,
            method: 'get',
        });
    }
    /**
     * post请求获取数据
     * @param _op 请求配置 
     * @param data 
     * @param headers 
     * @returns 
     */
    postData<D>(_op: AxiosRequestConfig) {
        return this.requestDataData<D>({
            ..._op,
            method: 'post',
        });
    }
    /**
     * put请求获取数据
     * @param _op 请求配置 
     * @param data 
     * @param headers 
     * @returns 
     */
    putData<D>(_op: AxiosRequestConfig) {
        return this.requestDataData<D>({
            ..._op,
            method: 'put',
        });
    }
    /**
     * delete请求获取数据
     * @param _op 请求配置 
     * @param data 
     * @param headers 
     * @returns 
     */
    deleteData<D>(_op: AxiosRequestConfig) {
        return this.requestDataData<D>({
            ..._op,
            method: 'delete',
        });
    }

    protected resData_(data: any, con: boolean, res: AxiosResponse<any, any>): ResData<any> {
        return data;
    }
}