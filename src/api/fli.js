import axios from "axios";
const aoiRequest=axios.create({
    baseURL:'http://10.22.94.222/api/fli/'
});
////// 10.22.94.222

export const getfliData=(start,end)=>aoiRequest.get(`flidaily.php?st=${start}&et=${end}`);
export const postfliData=(data,headerobj)=>aoiRequest.post(`upload.php`,data,headerobj);