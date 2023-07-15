function all(arr) {
    return new Promise((resolve,reject)=>{
        let count = 0;
        let resList = [];
        arr.forEach((service) => {
            Promise.resolve(service).then(res=>{
                resList.push(res);
                count++;
                if(count==arr.length){
                    resolve(resList);
                }
            },err=>{
                reject("err")
            })
        });
    })
}
const promise = all([1,2,3,4])
promise.then(res=>{
    console.log(res);
})