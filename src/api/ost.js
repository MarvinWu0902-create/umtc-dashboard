import axios from 'axios'
const ostRequest=axios.create({
    baseURL:'http://10.22.94.222/api/ost/'
});

export const getostData=(start,end)=>ostRequest.get(`daily/ostdaily.php?st=${start}&et=${end}`);
export const postostData=(data,headerobj)=>ostRequest.post(`daily/upload.php`,data,headerobj);

export const getostmappingData=(lot,defect)=>ostRequest.get(`daily/ostmapping.php?lot=${lot}&defect=${defect}`);

// weekly mapping
export const getoststackData=(process,part)=>ostRequest.get(`stack/oststack.php?process=${process}&part=${part}`);
export const getoststackPNData=(process)=>ostRequest.get(`stack/oststackpn.php?process=${process}`);
export const getoststackyieldData=(process,part)=>ostRequest.get(`stack/oststackyield.php?process=${process}&part=${part}`);
//