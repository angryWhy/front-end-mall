import request from '../request';
//springboot接口
export function skuList(params){
    return request({
        url:"product/pmsskuinfo/listByCondition",
        params
    })
}

