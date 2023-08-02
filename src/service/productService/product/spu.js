import request from '../request';
//springboot接口
export function spuList(params){
    return request({
        url:"product/pmsspuinfo/listByCondition",
        params
    })
}

