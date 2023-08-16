import axios from "axios";
const tagtriRequest=axios.create({
    baseURL:'http://10.22.94.222/api/tagtri/'
});

export const gettagtriData=(process,pwd)=>tagtriRequest.get(`tagtri.php?process=${process}&pwd=${pwd}`);
export const posttagtriData=(data,headerobj)=>tagtriRequest.post(`upload.php`,data,headerobj);