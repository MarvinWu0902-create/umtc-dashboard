import {getOAYData,postOAYData} from './oay.js'

import {getmgData} from './mongo.js';
import {getexcelData} from './excel.js';
export const getapimgData=getmgData;
export const getapiexcelData=getexcelData;


import {
    getaoiData,
    getaoitrendData,
    postaoiData,
    getaoifocusData,
    getaoifocusPNData,
    postaoifocusPNData,
    //daily defect
    getdailydefectData,
    getdefecttriData,
    getfuckingData,

    //weekly mapping
    getaoistackData,
    getaoistackPNData,
    getaoistackyieldData
} from './aoi.js'


import {
    getfliData,
    postfliData
} from './fli.js'

import {
    getostData,
    postostData,
    getostmappingData,
    // weekly mapping
    getoststackData,
    getoststackPNData,
    getoststackyieldData
} from './ost.js'

import {
    getbumpData,
    postbumpData,
    getbumpmappingData,
    getbumptrendData,
    //weekly mapping
    getbumpstackData,
    getbumpstackPNData,
    getbumpstackyieldData
} from './bump.js'

import {
    getccData,
    postccData,
    getccmappingData,
    //weekly stack
    getccstackData,
    getccstackPNData,
    getccstackyieldData
}from './cc.js'

import {
    getviData,
    getviNcn,
    postviData,
    getvitrendData,
    getvidefectData,

    postviactionData,
    getviactionData,
    updateviactionData,

    getvitrendpageData////trend page
}from './vi.js'

import {
    getwpgData,
    postwpgData
}from './wpg.js'

import {
    getwipYield
}from './wip.js'

import {
    gettagtriData,
    posttagtriData
}from './tagtri.js'

export const apiGetOAYData=getOAYData;
export const apiPostOAYData=postOAYData;

export const apiGetaoiData=getaoiData;
export const apiGetaoitrendData=getaoitrendData;
export const apiPostaoiData=postaoiData;

export const apiGetaoifocusPNData=getaoifocusPNData;
export const apiPostaoifocusPNData=postaoifocusPNData;

export const apiGetaoiFocusData=getaoifocusData;

// fli daily
export const apiGetfliData=getfliData;
export const apiPostfliData=postfliData;
// 

//aoi daily defect
export const apiGetaoiDefectData=getdailydefectData;
export const apiGetaoiDefectTriData=getdefecttriData;
export const apiGetaoifuckingData=getfuckingData;
//





//aoi weekly stack
export const apiGetaoistackData=getaoistackData;
export const apiGetaoistackPNData=getaoistackPNData;
export const apiGetaoistackYieldData=getaoistackyieldData;
// 

export const apiGetOSTData=getostData;
export const apiPostOSTData=postostData;
export const apiGetOSTmappingData=getostmappingData;

//ost weekly stack
export const apiGetoststackData=getoststackData;
export const apiGetoststackPNData=getoststackPNData;
export const apiGetoststackYieldData=getoststackyieldData;
//

export const apiGetBumpData=getbumpData;
export const apiPostBumpData=postbumpData;
export const apiGetBumpmappingData=getbumpmappingData;
export const apiGetBumpTrendData=getbumptrendData;

//bump weekly stack
export const apiGetbumpstackData=getbumpstackData;
export const apiGetbumpstackPNData=getbumpstackPNData;
export const apiGetbumpstackYieldData=getbumpstackyieldData;
//


export const apiGetCCData=getccData;
export const apiPostCCData=postccData;
export const apiGetCCmappingData=getccmappingData;

//cc weekly stack
export const apiGetccstackData=getccstackData;
export const apiGetccstackPNData=getccstackPNData;
export const apiGetccstackYieldData=getccstackyieldData;
//






export const apiGetVIData=getviData;
export const apiPostVIData=postviData;
export const apiGetNCN=getviNcn;


// VI Action
export const apiPostVIActionData=postviactionData;
export const apiGetVIActionData=getviactionData;
export const apiPostupdateActionData=updateviactionData;
//

// VI Trend Page
export const apiGetVITrendPage=getvitrendpageData;
// 



export const apiGetVITrendData=getvitrendData;
export const apiGetVIDefectData=getvidefectData;

export const apiGetWPGData=getwpgData;
export const apiPostWPGData=postwpgData;

export const apiGetWIPYield=getwipYield;

export const apiGetTagTri=gettagtriData;
export const apiPostTagTri=posttagtriData;
