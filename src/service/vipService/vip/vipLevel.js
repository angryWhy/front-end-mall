import request from '../request';
//springboot接口
export function vipLevelList(params){
    return request({
        url:`member/umsmemberlevel/list`,
        params
    })
}
export function vipLevelAdd(params){
    return request({
        url:"member/umsmemberlevel/save",
        data:params,
        method:"POST"
    })
}
export function vipLevelDel(params){
    return request({
        url:"member/umsmemberlevel/delete",
        data:params,
        method:"POST"
    })
}

export function vipLevelLoad(params){
    return request({
        url:`member/umsmemberlevel/info/${params}`,
        
    })
}
export function vipLevelUpdate(params){
    return request({
        url:`member/umsmemberlevel/update`,
        data:params,
        method:"POST"
    })
}