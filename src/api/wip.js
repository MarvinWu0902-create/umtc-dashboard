import axios  from "axios";

const wipRequest=axios.create({
    baseURL:'http://10.22.94.222/api/wip/'
});
export const getwipYield=(pn,lot,proccode,proccode8,status,start,end,radio)=>wipRequest.get(`wipyield.php?pn=${pn}&lot=${lot}&proccode=${proccode}&proccode8=${proccode8}&status=${status}&st=${start}&et=${end}&radio=${radio}`);