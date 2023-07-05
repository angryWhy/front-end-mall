import { customRef } from "vue";

export function debounceRef (value ,delay=800){
    let timer = null;
    return customRef((track,trigger)=>{
        return{
            get(){
                track()
                return value;
            },
            set(newValue){
                clearTimeout(timer);
                timer = setTimeout(() => {
                    value = newValue;
                    trigger();
                }, delay);
            }
        }
    })
}

export function throttle (func ,delay=800){
    let pre = Date().now()
    return () => {
        let context = this;
        let args = arguments;
        let now = Date().now();
        if(now - pre > delay){
            func.apply(context,args);
            pre = now;
        }
    }
}