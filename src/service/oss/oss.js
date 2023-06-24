import request from './request';
export function getPolicy(){
    return request({
        url:"/oss/policy",
    })
} 