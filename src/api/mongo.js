import axios from "axios";
const mongodbRequest=axios.create({
    baseURL:'http://localhost:3000/'
});
export const getmgData=()=>mongodbRequest.get(`TEST`);