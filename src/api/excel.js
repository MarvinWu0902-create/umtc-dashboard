import axios from "axios";
const excelRequest=axios.create({
    baseURL:'http://10.22.94.222:3000/'
});

export const getexcelData=()=>excelRequest.get(`getExcelData`);
