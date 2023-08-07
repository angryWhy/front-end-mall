import request from '../request';
export function wareList(params){
    return request({
        url:`/warea/wmswareinfo/list`,
        params
    })
}
export function wareAdd(params){
    return request({
        url:"/warea/wmswareinfo/save",
        data:params,
        method:"POST"
    })
}
export function wareDel(params){
    return request({
        url:"/warea/wmswareinfo/delete",
        data:params,
        method:"POST"
    })
}
export function wareLoad(id){
    return request({
        url:`/warea/wmswareinfo/info/${id}`,
        
    })
}
export function wareUpdate(params){
    return request({
        url:`/warea/wmswareinfo/update`,
        data:params,
        method:"POST"
    })
}