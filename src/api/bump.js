import axios from 'axios'
const bumpRequest=axios.create({
    baseURL:'http://10.22.94.222/api/bump/'
});

export const getbumpData=(start,end)=>bumpRequest.get(`daily/bumpdaily.php?st=${start}&et=${end}`);
export const postbumpData=(data,headerobj)=>bumpRequest.post('daily/upload.php',data,headerobj);

export const getbumpmappingData=(lot,defect)=>bumpRequest.get(`daily/bumpmapping.php?lot=${lot}&defect=${defect}`);

export const getbumptrendData=(defect,pn)=>bumpRequest.get(`daily/bumptrend.php?defect=${defect}&pn=${pn}`);

// weekly stack
export const getbumpstackData=(part)=>bumpRequest.get(`stack/bumpstack.php?part=${part}`);
export const getbumpstackPNData=()=>bumpRequest.get(`stack/bumpstackpn.php`);
export const getbumpstackyieldData=(part)=>bumpRequest.get(`stack/bumpstackyield.php?part=${part}`);
// 