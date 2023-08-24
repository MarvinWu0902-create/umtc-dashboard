import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { apiGetaoiDefectData, apiGetaoiDefectTriData, apiGetaoifuckingData } from '@/api/index.js'

export const UsedefectFetch = defineStore('useaoidailydefectfetch', () => {
    const activeDefect = ref('BU S1+S2');
    const activeProcess = ref('LTHSEP1/LTHADF1');
    let today = new Date();
    today.setHours(8, 0, 0, 0);
    let todaytimeStamp = today.getTime();
    let yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    yesterday.setHours(8, 0, 0, 0);
    let yestimeStamp = yesterday.getTime();

    const time_params = ref({
        st: yestimeStamp,
        et: todaytimeStamp
    });
    const pageStatus = ref('normal');

    const defectList = ref(
        [
            { Defect: 'BU S1+S2', Process: 'LTHSEP1/LTHADF1' },
            { Defect: 'BU S3+S5+S6', Process: 'LTHSEP1/LTHADF1' },
            { Defect: 'BU O1+O4', Process: 'LTHADF1/LTHDFV1' },
            { Defect: 'BU O2+O6', Process: 'PTHSAC1/AOIVRS1' },
            { Defect: 'BU O51/O52', Process: 'SAPECU1/PTHCUM1/SAPPEC1' },/////PTHCUM1/SAPPEC1
            { Defect: 'BU A3+A4+A7', Process: 'PTHCUM1/PTHFCU1/ABFMEC1' },
            { Defect: 'Core S4', Process: 'LTHDES1' },
            { Defect: 'BU O7', Process: 'SAPECU1' },
            { Defect: 'BU A5+A6', Process: 'LDLCOL1/LTHSEP1' }
        ]
    );

    const primevalData = ref([]);
    const triggerData = ref([]);
    const matchData = ref([]);

    const selectOptions = ref([]);
    const selectOptions2 = ref([]);
    const selectOptions3 = ref([]);
    // const saveData = ref([]);

    const defectFetchData = async () => {
        try {
            console.log(time_params.value.st, time_params.value.et, null, pageStatus.value);
            const res = await apiGetaoiDefectData(time_params.value.st, time_params.value.et, null, pageStatus.value);
            const tri = await apiGetaoiDefectTriData();
            // 
            // timefilterData.value = res.data;
            // // 
            primevalData.value = res.data;



            triggerData.value = tri.data;
            console.log('res data', res.data);
            console.log('tri data', tri.data);
        } catch (error) {
            console.log('defect fetch error', error);
        }
    };

    const defectFetchMacData = async (st, et, process) => {
        try {
            const res = await apiGetaoiDefectData(st, et, process);

            console.log('res mac', res);

            // timefilterData.value = res.data;
            ////丟進時間區間data
            primevalData.value = res.data;
            ////watch 
        } catch (error) {
            console.log('defect fetch mac error', error);
        }
    }

    // const checkstatusAry = computed(() => {

    //     return timefilterData.value
    //         .filter((item) => selectOptions.value
    //             .includes(item.PartNo)
    //         );
    // });
    // watch(checkstatusAry, (newval, oldval) => {
    //     console.log('checkstatusAry',newval, oldval);
    //     primevalData.value = newval;
    // });



    const checkbarAry = computed(() => {
        return primevalData.value
            .map((item) => ({ pn: item.PartNo, device: item.ProdClass }))
            .filter((obj, index, self) => index === self.findIndex((s) => s.pn === obj.pn))
    });///用一開始抓出或是篩選時間抓出的資料料號建成checkbar
    ////['3273012','3273020',...]

    const checkbar2Ary = computed(() => {
        return [...new Set(primevalData.value.map((item) => item.ProdClass))]
    });
    const checkbar3Ary = computed(() => {
        return [...new Set(primevalData.value.map((item) => item.LotType.split('_')[0]))]
    })


    watch(checkbarAry, (newval, oldval) => {
        selectOptions.value = newval
            .sort((a, b) => Number(a.pn) - Number(b.pn))
            .map((item) => ({ pn: item.pn, device: item.device, status: true }));
    });

    watch(checkbar2Ary, (newval, oldval) => {
        selectOptions2.value = newval
            .map((item) => ({ device: item, status: true }));
    });

    watch(checkbar3Ary, (newval, oldval) => {
        selectOptions3.value = newval
            .map((item) => ({ type: item, status: true }));
    });



    const defectfuckingData = async (lot) => {
        try {
            const fff = await apiGetaoifuckingData(lot);
            matchData.value = fff.data;
        } catch (error) {
            console.log('defect fetch fucking error', error);
        }
    };

    const filterData = computed(() => {///分出BU CORE  //點缺點和有新抓的資料觸發
        if (activeDefect.value.split(' ')[0] === 'BU') {
            return primevalData.value
                .filter((item) => (item.LayerName === '-Outer' ||
                    (Number(item.LayerName.split('L')[2]) - Number(item.LayerName.split('L')[1]) + 1) / 2 > 1
                ) && selectOptions.value.filter((item) => item.status === true).map((item) => item.pn).includes(item.PartNo)
                    && selectOptions3.value.filter((item) => item.status === true).map((item) => item.type).includes(item.LotType.split('_')[0])
                )
        } else {
            return primevalData.value
                .filter((item) => ((Number(item.LayerName.split('L')[2]) - Number(item.LayerName.split('L')[1]) + 1) / 2 === 1)
                    && selectOptions.value.filter((item) => item.status === true).map((item) => item.pn).includes(item.PartNo)
                    && selectOptions3.value.filter((item) => item.status === true).map((item) => item.type).includes(item.LotType.split('_')[0])
                );
        }
    });







    return {
        defectFetchData,
        defectfuckingData,
        defectFetchMacData,
        primevalData,
        filterData,
        activeDefect,
        activeProcess,
        defectList,
        triggerData,
        matchData,
        time_params,
        selectOptions,
        selectOptions2,
        selectOptions3,
        checkbarAry,
        checkbar2Ary,
        checkbar3Ary,

        pageStatus
    }
})