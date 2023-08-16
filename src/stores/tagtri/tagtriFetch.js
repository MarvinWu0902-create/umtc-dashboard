import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import { apiGetTagTri, apiPostTagTri } from '@/api/index.js'


export const UsetagtriStore = defineStore('tagtrifetch', () => {

    const paramsProcess = ref(null);
    const paramsPwd = ref(null);

    const vertifyStatus = ref(false);

    const inputValue = ref({
        pn: '',
        layer: '',
        tag: '',
        tri: ''
    });

    const tableData = ref([]);
    const tagtrifetchData = async () => {
        try {
            const res = await apiGetTagTri(paramsProcess.value, paramsPwd.value);
            paramsPwd.value = null;

            console.log('res.data', res.data);
            if (res.data === 'password error') {
                vertifyStatus.value = false//認證失敗
                alert('密碼錯誤!');
            } else {
                vertifyStatus.value = true;///認證通過
                tableData.value = res.data;
            }
        } catch (error) {
            console.log('tagtri fetch err', error);
        }
    };

    const tagtriPostData = async () => {
        const postData = {
            data: tableData.value,
            process: paramsProcess.value
        }
        try {
            const res = await apiPostTagTri(postData, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
            if (res.data === 'done') {
                alert('上傳完成!')
            }
        } catch (error) {
            console.log('上傳問題', error);
        }
    }
    return {
        tagtrifetchData, tagtriPostData, paramsProcess, paramsPwd, vertifyStatus, inputValue, tableData
    }
})