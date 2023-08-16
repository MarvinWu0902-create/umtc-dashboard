import { ref, computed, watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import pinia from '../../../stores/index.js';
import { apiGetVITrendData, apiPostVIActionData, apiGetVIActionData, apiPostupdateActionData } from '../../../api/index.js';
import Highcharts from 'highcharts';

import { UseTableStore } from './viTableSet.js';
const usetablestore = UseTableStore(pinia);
const { partRecord } = storeToRefs(usetablestore);

export const UseTrendStore = defineStore('videfecttrend', () => {
    const partnumber = ref('');
    const process = ref('');
    const defect = ref('');
    const defecttrendData = ref([]);

    const selectStatus = ref(false);

    ////要去插入的位置跟有無插入狀態
    const insertStatus = ref(false);
    // const insertLoc=ref(0);
    const now = new Date();
    const yesterdata = new Date(now);
    yesterdata.setDate(now.getDate() - 30);////-1

    // now.setHours(0, 0, 0, 0);
    // yesterdata.setHours(0, 0, 0, 0);
    yesterdata.setDate(1);
    yesterdata.setHours(0, 0, 0, 1);

    const nowTimestamp = now.getTime();
    const yesterdataTimestamp = yesterdata.getTime();

    const timeRange = ref(yesterdataTimestamp);

    const actionValue = ref('');

    const colorValue = ref('rgba(255, 255, 255, 1)');

    const insertLoc = ref(0);

    const plotAry = ref([]);


    const saveData = ref([]);
    // const savaTime=ref([]);
    // const savaLot=ref([]);

    ///Form
    const acitonOption = ref([]);
    const actionmodelValue = ref([]);

    const templotAry = ref([]);

    const itemSelect = ref('');

    // const labelX = ref(0);
    // const labelY = ref(-10);
    ////


    ////for action post&get data
    const actionGet = ref([]);
    ///


    watch(partRecord, (newval, oldval) => {////料號更動時，trnedchart不見
        selectStatus.value = false;
    });

    const gettrendData = async () => {

        try {
            const action = await apiGetVIActionData(process.value);
            actionGet.value = action.data;
            console.log('action res', action.data);
            acitonOption.value = action.data.map((item) => ({ label: item.text, value: item.text }));
            actionmodelValue.value = action.data.map((item) => item.text);

            const res = await apiGetVITrendData(partnumber.value, process.value, defect.value);
            defecttrendData.value = res.data;
            console.log('trend res', res.data);
        } catch (error) {
            console.log('vi defect trend fail', error);
        };

    };

    const postactionData = async (data) => {
        try {
            const res = await apiPostVIActionData(data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
            console.log('post action finish', res.data);
        } catch (error) {
            console.log('post action error', error)
        }
    };

    const postupdateactionData = async (data) => {
        try {

            const test = await apiPostupdateActionData(data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

            // const action = await apiGetVIActionData(process.value);
            // console.log('step');
            // actionGet.value = action.data;

            console.log('actionGet.value', actionGet.value);
            console.log('process.value', process.value);
        } catch (error) {
            console.log('update action error', error);
        }
    }





    const seriesAry = computed(() => {////要處理action get 的資料

        if (!insertStatus.value) {///insertStatus.value false->沒點選新增的情況，也就是一開始的狀態

            plotAry.value = [];
            ////^先清
            const container = [];
            const machineAry = [...new Set(defecttrendData.value.map((item) => item.machine))];

            defect.value.split(',').forEach((def) => {

                const eachdefectAry = defecttrendData.value
                    .sort((a, b) => Date.parse(a.Processtime) - Date.parse(b.Processtime))
                    .filter((item) => item.Defect === def);

                machineAry.forEach((mac, idx) => {

                    const passObj = {};
                    passObj.type = 'line';
                    passObj.lineColor = Highcharts.getOptions().colors[idx];
                    passObj.name = mac;
                    passObj.defect = def;
                    passObj.marker = {};
                    passObj.marker.enabled = true;
                    passObj.marker.lineWidth = 2;
                    passObj.marker.lineColor = Highcharts.getOptions().colors[idx];
                    passObj.marker.fillColor = 'white';
                    passObj.marker.symbol = 'circle';

                    // const eachmacAry = eachdefectAry
                    //     .map((item) => item.machine === mac ? Number(item.Rate) : null);

                    const eachmacAry = eachdefectAry
                        .map((item) => item.machine === mac ? Number(item.Rate) : null);

                    ///先用Action get 來找出insertLoc->依對策數來調整數據
                    console.log('ActionGet', actionGet.value);
                    if (actionGet.value.length > 0) {///抓DB該站點有Action

                        actionGet.value.forEach((obj, idx) => {

                            if (idx === 0) {///加上第一個action

                                const temLoc = eachdefectAry.findIndex((item) => Date.parse(new Date(item.Processtime)) >= Number(obj.time));


                                passObj.data = eachmacAry;
                                passObj.data.splice(temLoc, 0, null);

                                passObj.time = eachdefectAry
                                    .map((item) => item.Processtime);
                                passObj.time.splice(temLoc, 0, ' ');

                                passObj.lotnumber = eachdefectAry
                                    .map((item) => item.LotNum);
                                passObj.lotnumber.splice(temLoc, 0, ' ');

                                container.push(passObj);

                                const plotpushAry = {
                                    color: actionGet.value[idx].color,
                                    from: temLoc,
                                    to: temLoc,
                                    zIndex: 2,
                                    label: {
                                        y: -10, x: 0, text: actionGet.value[idx].text, style: { fontSize: '12px', fontWeight: 'bold', color: actionGet.value[idx].color }
                                    },
                                    time: Number(obj.time)
                                };

                                if (!plotAry.value.find((obj) => obj.label.text === plotpushAry.label.text)) {///裏頭沒有
                                    plotAry.value.push(plotpushAry);
                                    // templotAry.value.push(plotpushAry);
                                }

                            } else {///多個action則到這，(使用Container的資料去累積)
                                ////[{data:[...],time:[...],lotnumber:[...]}]

                                const temLoc = container[container.length - 1].time.findIndex((timestr) => Date.parse(new Date(timestr)) >= Number(obj.time));

                                container[container.length - 1].data.splice(temLoc, 0, null);
                                container[container.length - 1].time.splice(temLoc, 0, ' ');
                                container[container.length - 1].lotnumber.splice(temLoc, 0, ' ');

                                const plotpushAry = {
                                    color: actionGet.value[idx].color,
                                    from: temLoc,
                                    to: temLoc,
                                    zIndex: 2,
                                    label: {
                                        y: -10, x: 0, text: actionGet.value[idx].text, style: { fontSize: '12px', fontWeight: 'bold', color: actionGet.value[idx].color }
                                    },
                                    time: Number(obj.time)
                                };

                                if (!plotAry.value.find((obj) => obj.label.text === plotpushAry.label.text)) {///裏頭沒有
                                    plotAry.value.push(plotpushAry);
                                    // templotAry.value.push(plotpushAry);
                                }
                            }
                        })
                    } else {///沒有Action的地方

                        ////
                        plotAry.value = [];
                        ///
                        passObj.data = eachmacAry
                            .slice(0, eachmacAry.length + 1);
                        passObj.time = eachdefectAry
                            .map((item) => item.Processtime)
                            .slice(0, eachmacAry.length + 1);
                        passObj.lotnumber = eachdefectAry
                            .map((item) => item.LotNum)
                            .slice(0, eachmacAry.length + 1);
                        console.log('non_insert');
                        console.log('plotAry.valuenon', plotAry.value);

                        container.push(passObj);
                    }
                });
            })

            saveData.value = container;///暫存


            console.log('container', container)
            return container

        } else {

            const container = [];

            insertLoc.value = saveData.value[0].time
                .map((item) => Date.parse(new Date(item)))
                .findIndex((timestamp) => timestamp >= timeRange.value);

            saveData.value.forEach((item, idx) => {

                const passObj = {};
                passObj.type = 'line';
                passObj.lineColor = Highcharts.getOptions().colors[idx + 1 > saveData.value.length / 2 ? saveData.value.length - idx - 2 : idx];
                passObj.name = item.name;
                passObj.defect = item.defect;
                passObj.marker = {};
                passObj.marker.enabled = true;
                passObj.marker.lineWidth = 2;
                passObj.marker.lineColor = Highcharts.getOptions().colors[idx + 1 > saveData.value.length / 2 ? saveData.value.length - idx - 2 : idx];
                passObj.marker.fillColor = 'white';
                passObj.marker.symbol = 'circle';

                passObj.data = item.data;
                passObj.data.splice(insertLoc.value, 0, null);

                passObj.time = item.time;
                passObj.time.splice(insertLoc.value, 0, ' ');

                passObj.lotnumber = item.lotnumber;
                passObj.lotnumber.splice(insertLoc.value, 0, ' ');

                container.push(passObj)
            }
            )

            return container
        }


    });
    return {
        gettrendData, postactionData, postupdateactionData, partnumber, process, defect, selectStatus, defecttrendData, seriesAry, timeRange, actionValue, colorValue, insertLoc, insertStatus, plotAry, acitonOption, actionmodelValue, templotAry, itemSelect, actionGet
    }
})