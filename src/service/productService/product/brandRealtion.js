import request from '../request';
//springboot接口
export function relationList(params){
    return request({
        url:"/product/pmscategorybrandrelation/catelog/list",
        params
    })
}
export function relationSave(params){
    return request({
        url:"/product/pmscategorybrandrelation/save",
        data:params,
        method:"POST"
    })
}
export function brandDel(params){
    return request({
        url:"/product/pmsbrand/delete",
        data:params,
        method:"POST"
    })
}
export function brandLoad(params){
    return request({
        url:`/product/pmsbrand/info/${params}`
    })
}
export function brandUpdate(params){
    return request({
        url:`/product/pmsbrand/update`,
        data:params,
        method:"POST"
    })
}
