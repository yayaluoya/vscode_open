import { AxiosResponse, AxiosRequestConfig } from 'axios';
import { ResData } from 'yayaluoya-tool/dist/http/ResData';
import { BaseApiCon } from 'yayaluoya-tool/dist/node/BaseApiCon';
import { HttpStatus } from 'yayaluoya-tool/src/http/HttpStatus';
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
     * @returns
     */
    deleteData<D>(_op: AxiosRequestConfig) {
        return this.requestDataData<D>({
            ..._op,
            method: 'delete',
        });
    }

    protected resData_(data: ResData, con: boolean, res: AxiosResponse<any, any>): ResData<any> {
        if (data.status != HttpStatus.OK) {
            throw data;
        }
        return data;
    }
}
