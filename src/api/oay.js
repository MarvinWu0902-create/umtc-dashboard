import axios from "axios";
const oayRequest=axios.create({
    baseURL:'http://10.22.94.222/api/oay/'
})

// oayRequest.interceptors.request.use(
//     function(config){console.log('1',config);return config;},function(error){console.log('2',error)}
// );///發送請求攔截器 
// oayRequest.interceptors.response.use(
//     response=>{console.log('3',response);return Promise.resolve(response);}///也可 return response (await 會自動轉成promise物件)
//     ,error=>{console.log('4',error)}
// );///接收回應攔截器 
export const getOAYData=(data)=>oayRequest.get(`index.php?device=${data}`);
export const postOAYData=(data,headerobj)=>oayRequest.post(`upload.php`,data,headerobj);