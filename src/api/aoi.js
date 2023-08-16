import axios from "axios";
const aoiRequest=axios.create({
    baseURL:'http://10.22.94.222/api/aoi/'
});
// 10.22.94.222
export const getaoiData=(start,end)=>aoiRequest.get(`aoidaily.php?st=${start}&et=${end}`);
export const getaoitrendData=(defect,pn,layer)=>aoiRequest.get(`trendchart.php?defect=${defect}&pn=${pn}&layer=${layer}`);
export const getaoifocusData=(start,end)=>aoiRequest.get(`aoifocus.php?st=${start}&et=${end}`);

export const getaoifocusPNData=()=>aoiRequest.get(`aoifocusform.php`);
export const postaoifocusPNData=(data,headerobj)=>aoiRequest.post('aoifocuscheck.php',data,headerobj);

export const postaoiData=(data,headerobj)=>aoiRequest.post(`upload.php`,data,headerobj);

// dailydefect
export const getdailydefectData=(start,end,process,status)=>aoiRequest.get(`dailydefect/dailydefect.php?st=${start}&et=${end}&process=${process}&status=${status}`);
export const getdefecttriData=()=>aoiRequest.get(`dailydefect/defecttri.php`);
export const getfuckingData=(lot)=>aoiRequest.get(`dailydefect/defectmatch.php?lot=${lot}`);
//

//weekly stack
export const getaoistackData=(process,part)=>aoiRequest.get(`stack/aoistack.php?process=${process}&part=${part}`);
export const getaoistackPNData=(process)=>aoiRequest.get(`stack/aoistackpn.php?process=${process}`);
export const getaoistackyieldData=(process,part)=>aoiRequest.get(`stack/aoistackyield.php?process=${process}&part=${part}`);
// 