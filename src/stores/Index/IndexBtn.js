import { defineStore,storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { UseIndexFetch } from "./IndexFetch.js";

import pinia from "../index.js";

const usefetstore = UseIndexFetch(pinia);
const {IndexfetchData}=usefetstore
const { filterData, productData, partList, Indexdata, Index_params } = storeToRefs(usefetstore);//Fet傳入///從IndexFetch.js 傳進 filterData, productData, partList, Indexdata, Index_params

export const UseBtnStore = defineStore('useindexbtn', () => {
    ///try
    // const partBtn=ref([]);

    ///
    const clickHandle=ref('isCount');
    const activeBtn = (PN) => partList.value.includes(PN);
    const btnClick = (PN) => {
        if (partList.value.includes(PN)) {///重複點擊
            ///partlist有PN
            ///如果PN是'All'，partList要是空的且filterData也要是空的
            ///反之，partList則排除PN以及'All'且filterData排除掉PN
            if(PN==='All'){///
                partList.value=[];
                filterData.value=[];
            }else{///重複點擊任一料號
                partList.value = partList.value.filter((eachpart) => eachpart !== PN&&eachpart !== 'All');
            //     filterData.value = filterData.value.filter((item) =>
            //     item.partnum !== PN
            //     ///以重複點擊前的filterData.value去排除掉重複點擊的料號資料
            // );
            }
            filterData.value = filterData.value.filter((item) =>
                partList.value.includes(item.partnum)
                ///以重複點擊前的filterData.value去排除掉重複點擊的料號資料
            );
            // partList.value = partList.value.filter((eachpart) => eachpart !== PN);
            // filterData.value = filterData.value.filter((item) =>
            //     item.partnum !== PN
            // );///ex.filterData有兩個料號，點擊其中一個剩一個
            
        } else {
            ///partlist沒有PN
            ///如果PN是'All',則將partList填滿(?)且filterData不用篩選(?)
            ///反之則將PN新增到partList中且利用partList去Indexdata篩選

            if(PN==='All'){
                partList.value=partBtn.value;///填滿(?)
            }else{
                partList.value.push(PN);
            }



            // partList.value.push(PN);#
            filterData.value = Indexdata.value.filter((item) =>
                partList.value.includes(item.partnum)
            );///ex.由Indexdata去篩選符合partList
        }

        if(partList.value.length>1){
            clickHandle.value='isCount';
        };
    };
    const filterClick = () => {///篩選Product
        // filterData.value = Indexdata.value.filter((item) =>
        //     item.ProdClass === Index_params.value.product///Select v-model綁定
        // );
        IndexfetchData();
        
        filterData.value = Index_params.value.product !== '' 
            ? Indexdata.value.filter((item) =>item.ProdClass === Index_params.value.product) 
            : Indexdata.value
        productData.value = filterData.value;///丟給productData，因為filterData.value會因為btnClick變動

        ///
        // partBtn.value=[...new Set(productData.value.map((item) => item.partnum)),'All'];
        // ///

        partList.value = [...[
            ...new Set(productData.value.map((item) => item.partnum)),
        ]]///點擊後更新partList，用productData(點擊後完整partnum的filterData)確保partList是完整

    };
    // const partBtn = computed(() => [
    //     ...new Set(productData.value.map((item) => item.partnum)),'All']);//filterClick點擊後更新productData生成partBtn

    const partBtn = computed(() => productData.value.length === 0
        ? [...new Set(productData.value.map((item) => item.partnum))]
        : [...new Set(productData.value.map((item) => item.partnum)), 'All']);///不是最佳解，待處理!

    return {
        filterData, partBtn, partList,clickHandle, filterClick, activeBtn, btnClick
    }
}
);
