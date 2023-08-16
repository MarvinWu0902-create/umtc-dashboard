import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import Highcharts from 'highcharts';
import { apiGetVITrendPage, apiGetVIActionData } from '../../../api/index.js';


export const UseviStore = defineStore('vitrendpagefetch', () => {

    const trendData = ref([]);
    const actionData = ref([]);
    const insertStatus = ref(false);
    const params = ref({
        pn: '',
        defect: '',
        process: '',
        st: '',
        et: '',
    });

    const categoriesAry = ref([]);
    const plotAry = ref([]);
    const tableData = ref([]);

    const machineName = ref([]);

    const container = computed(() => {

        const machineAry = trendData.value.map((item) => item[params.value.process]);

        const sortData = trendData.value.sort((a, b) => Date.parse(a[`${params.value.process}Time`]) - Date.parse(b[`${params.value.process}Time`]));
        categoriesAry.value = sortData.map((item) => item[`${params.value.process}Time`]);


        const container = [];

        console.log('action Data', actionData.value);
        if (actionData.value !== []) {
            let times = 0;
            let lastLoc = 0;
            let actionName = '';
            actionData.value.sort((a, b) => Number(a) - Number(b))
                .forEach((item, idx) => {

                    let insertLoc = sortData
                        .map((item) => Date.parse(item[`${params.value.process}Time`]))
                        .findIndex(((timestamp) => timestamp >= Number(item.time)));
                    ////時間區間之前 insertLoc->0 所以要跳過forEach 時間區間之後 insertLoc->-1 所以要讓他在最後
                    console.log('insertLoc', insertLoc);

                    if (insertLoc === 0) {
                        return;
                    } else if (insertLoc===-1) {
                        insertLoc = sortData.length;
                    };

                    let toChartEnd = sortData.length - insertLoc;
                    console.log('sortData.length', sortData.length);
                    console.log('toChartEnd', toChartEnd);
                    if (times === 0) {

                        item.loc = insertLoc;

                        categoriesAry.value.splice(insertLoc, 0, ' ');

                        plotAry.value.push({
                            time:Number(item.time),
                            color: item.color,
                            from: insertLoc,
                            to: insertLoc,
                            zIndex: 2,
                            label: { y: 0, x: -10, text: item.text, style: { fontSize: '10px', fontWeight: 'bold', color: item.color } }
                        });

                        /////
                        tableData.value.push({
                            label: 'POR',
                            data: sortData.slice(0, insertLoc)
                        });
                        lastLoc = insertLoc;
                        actionName = item.text;
                    } else {
                        item.loc = insertLoc + times;

                        categoriesAry.value.splice(insertLoc + times, 0, ' ');

                        plotAry.value.push({
                            time:Number(item.time),
                            color: item.color,
                            from: insertLoc + times,
                            to: insertLoc + times,
                            zIndex: 2,
                            label: { y: 0, x: -10, text: item.text, style: { fontSize: '10px', fontWeight: 'bold', color: item.color } }
                        });


                        if (idx === actionData.value.length - 1) {///最後一個
                            console.log(3);
                            tableData.value.push({
                                label: actionName,
                                data: sortData.slice(lastLoc, insertLoc)
                            });

                            tableData.value.push({
                                label: item.text,
                                data: sortData.slice(insertLoc)
                            });


                        } else {///第二個~
                            console.log(2);
                            tableData.value.push({
                                label: actionName,
                                data: sortData.slice(lastLoc, insertLoc)
                            });

                            actionName = item.text;

                        }
                    }
                    times += 1;///處理資料間隔
                });
        }

        console.log('tableData.value', tableData.value);

        machineName.value = [...new Set(machineAry)];
        machineName.value.forEach((mac, idx) => {///機台別



            let containerData = sortData.map((item) => item[params.value.process] === mac ? Number(item.Rate) : null);
            let containerLot = sortData.map((item) => item[params.value.process] === mac ? item.LotNum : ' ');
            let containerTime = sortData.map((item) => item[params.value.process] === mac ? item[`${params.value.process}Time`] : ' ');

            if (actionData.value !== []) {
                actionData.value.forEach((item) => {

                    if (!item.loc)  return;

                    containerData.splice(item.loc, 0, null);
                    containerLot.splice(item.loc, 0, ' ');
                    containerTime.splice(item.loc, 0, ' ');
                });
            }
            container.push({
                type: 'line',
                data: containerData,
                name: mac,
                defect: params.value.defect,
                marker: {
                    enabled: true,
                    lineWidth: true,
                    lineColor: Highcharts.getOptions().colors[idx],
                    fillColor: 'white',
                    symbol: 'circle'
                },
                lot: containerLot,
                time: containerTime

            })
        });

        return container
    })





    const getData = async () => {
        try {
            const res = await apiGetVITrendPage(params.value.pn, params.value.defect, params.value.process, params.value.st, params.value.et);
            console.log('res data', res.data);
            trendData.value = res.data;

            insertStatus.value = true;
        } catch (error) {
            console.log('vi trend page fetch error', error);
        }

    }

    const getAction = async () => {
        try {
            const res = await apiGetVIActionData(params.value.process);
            console.log('action data', res.data);
            actionData.value = res.data;
        } catch (error) {
            console.log('action data fetch error', error);
        }
    }


    return {
        getData, getAction, params, trendData, actionData, insertStatus, categoriesAry, plotAry, container, tableData, machineName
    }


})