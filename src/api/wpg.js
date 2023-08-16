import axios  from "axios";

const wpgRequest=axios.create({
    baseURL:'http://10.22.94.222/api/wpg/'
});

export const getwpgData=(start,end)=>wpgRequest.get(`daily/wpgdaily.php?st=${start}&et=${end}`);
export const postwpgData=(data,headerobj)=>wpgRequest.post('daily/upload.php',data,headerobj);