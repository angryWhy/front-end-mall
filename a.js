

const obj = {
    "2023":1,
    "2024":2
}
const data = Object.entries(obj);
console.log(data);
const map = new Map(Object.entries(obj));
for( const [key,value] of map){
    console.log(key,value);
}
map.forEach((key,value)=>{
    console.log(key,value);
})