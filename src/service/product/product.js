import request from '../request';
//springboot接口
export function menuService(){
    return request({
        url:"/product/pmscategory/list/tree"
    })
}