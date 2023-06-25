import axios from 'axios';
import request from './request';
export function getPolicy(){
    return request({
        url:"/oss/policy",
    })
}
export function getUpload(params){
    axios({
        method: "POST",
        ...params,
        
    })
}