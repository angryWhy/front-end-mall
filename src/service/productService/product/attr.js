import request from '../request';
//springboot接口
export function attrList(params,id){
    return request({
        url:`product/pmsattrgroup/list/${id}`,
        params
    })
}
export function attrRelationList(id){
    return request({
        url:`product/pmsattrgroup/${id}/attr/relation`
    })
}
export function attrList2(id){
    return request({
        url:`product/pmsattrgroup/list/${id}`
    })
}
export function attrAdd(params){
    return request({
        url:"/product/pmsattrgroup/save",
        data:params,
        method:"POST"
    })
}
export function attrdDel(params){
    return request({
        url:"/product/pmsbrand/delete",
        data:params,
        method:"POST"
    })
}
export function attrRelationDelete(params){
    return request({
        url:`product/pmsattr/relation/delete`,
        data:params,
        method:"POST"
    })
}
export function attrLoad(params){
    return request({
        url:`/product/pmsattrgroup/info/${params}`,
        
    })
}
export function attrUpdate(params){
    return request({
        url:`/product/pmsattrgroup/update`,
        data:params,
        method:"POST"
    })
}