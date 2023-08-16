import axios  from "axios";

const viRequest=axios.create({
    baseURL:'http://10.22.94.222/api/vi/'
});
//10.22.94.222
export const getviData=(start,end)=>viRequest.get(`daily/vidaily.php?st=${start}&et=${end}`);
export const getviNcn=(lot)=>viRequest.get(`daily/ncn.php?lot=${lot}`);
export const postviData=(data,headerobj)=>viRequest.post('daily/upload.php',data,headerobj);

export const getvitrendData=(pn,process,defect)=>viRequest.get(`daily/vitrend.php?tpartno=${pn}&tprocess=${process}&tdefect=${defect}`);
export const getvidefectData=(process,pn,defect)=>viRequest.get(`daily/vitop3.php?tpartno=${pn}&tprocess=${process}&tdefect=${defect}`);


export const postviactionData=(data,headerobj)=>viRequest.post('daily/viactionpost.php',data,headerobj);
export const updateviactionData=(data,headerobj)=>viRequest.post('daily/viactionupdate.php',data,headerobj);
export const getviactionData=(process)=>viRequest.get(`daily/viactionget.php?process=${process}`);


export const getvitrendpageData=(pn,defect,process,st,et)=>viRequest.get(`trend/vitrend.php?pn=${pn}&defect=${defect}&process=${process}&st=${st}&et=${et}`);