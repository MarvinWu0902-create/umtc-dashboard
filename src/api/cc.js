import axios from 'axios'
const ccRequest=axios.create({
    baseURL:'http://10.22.94.222/api/cc/'
});

export const getccData=(start,end)=>ccRequest.get(`daily/ccdaily.php?st=${start}&et=${end}`);
export const postccData=(data,headerobj)=>ccRequest.post('daily/upload.php',data,headerobj);

export const getccmappingData=(lot,defect)=>ccRequest.get(`daily/ccmapping.php?lot=${lot}&defect=${defect}`);

// weekly stack
export const getccstackData=(part)=>ccRequest.get(`stack/ccstack.php?part=${part}`);
export const getccstackPNData=()=>ccRequest.get(`stack/ccstackpn.php`);
export const getccstackyieldData=(part)=>ccRequest.get(`stack/ccstackyield.php?part=${part}`);
//