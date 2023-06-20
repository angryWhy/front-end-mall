import request from '../request';
//springboot接口
export function menuList(){
    return request({
        url:"/product/pmscategory/list/tree"
    })
}
export function menuAdd(params){
    return request({
        url:"/product/pmscategory/list/tree",
        data:{
            ...params   
        },
        method:"POST"
    })
}
export function menuDel(params){
    return request({
        url:"/product/pmscategory/list/tree",
        data:{
            ...params   
        },
        method:"POST"
    })
}