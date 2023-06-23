import request from '../request';
//springboot接口
export function menuList(){
    return request({
        url:"/product/pmscategory/list/tree"
    })
}
export function menuAdd(params){
    return request({
        url:"/product/pmscategory/save",
        data:params,
        method:"POST"
    })
}
export function menuDel(params){
    return request({
        url:"/product/pmscategory/delete",
        data:params,
        method:"POST"
    })
}
export function menuLoad(params){
    return request({
        url:`/product/pmscategory/info/${params}`
    })
}
export function menuUpdate(params){
    return request({
        url:`/product/pmscategory/update`,
        data:params,
        method:"POST"
    })
}