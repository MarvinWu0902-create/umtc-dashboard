<script setup>

</script>

<template>
   <p class="title">YIP 常用系統連結</p>
    <div class="container">
        <div class="wrap">
            <div class="item">
                <span class="item-name">
                    <p>YM Yield Dashboard</p>
                </span>
                <a href="http://10.22.66.28:8000/" target="_blank" >
                <img src="../assets/YM_Yield_dashboard.jpg" height="150px" width="300px">
                </a>
                <ul>
                    <li>AOI/OST/Bump/CC/FVI Yield查詢以及基本的GFA/照片</li>
                </ul>
            </div>

            <div class="item">
                <!-- 10.22.66.38/YM_AOI_Analyzer/ target="_blank"-->
                <span class="item-name"><p>數值分析系統</p></span>
<img src="../assets/YM_AOI_Analyzer.jpg" height="150px" width="300px">
                <ul>
                    <li>查詢AOI良率與GFA/照片(可匯出單批所有缺點照片)</li>
                    <li>本地資料夾路徑<strong>file://10.22.66.38/YM_AOI_Analyzer/</strong></li>
                </ul>
            </div>
            <div class="item">
                <span class="item-name">
                    <p>OST小綠人系統</p>
                </span>
                <img src="../assets/YM_OST_Analyzer.jpg" height="150px" width="300px">
                <ul>
                    <li>查詢電測良率/mapping/Hot zone</li>
                    <li>本地資料夾路徑<strong>file://10.22.66.38/YM_OST_Analyzer/</strong></li>
                </ul>
            </div>
        </div>






        <div class="wrap">
            <div class="item">
                <span class="item-name">
                    <p>JMP Script</p>
                </span>
                <a href="http://utcsyshp03/Carrier/YM/YIP/Forms/AllItems.aspx?id=%2FCarrier%2FYM%2FYIP%2F01%20JMP%20script" target="_blank">
                <img src="../assets/JMP_Script.jpg" height="150px" width="300px">
                </a>
                <ul>
                    <li>多批GFA彙整與缺點照片匯入</li>
                    <li>By站點各缺點Trend chart</li>
                </ul>
            </div>
            <div class="item">
                <span class="item-name">
                    <p>Defect PCS</p>
                </span>
                <a href="http://10.22.66.28:8000/" target="_blank" >
                <img src="../assets/Defect_PCS.jpg" height="150px" width="300px">
                </a>
                <ul>
                    <li>各Defect code trend chart trend shift alarm monitor</li>
                </ul>
            </div>
            <div class="item">
                <span class="item-name">
                    <p>Commonality</p>
                </span>
                <a href="http://10.22.66.28:8000/" target="_blank">
                <img src="../assets/Commonality.jpg" height="150px" width="300px">
                </a>
                <ul>
                    <li>做Commonality的資料抓取(包含SPC data/CPV/EIS生產記錄機台等)</li>
                </ul>
            </div>
        </div>

        <div class="wrap">
            <div class="item">
                <span class="item-name">
                    <p>EAMS</p>
                </span>
                <a href="http://10.22.60.25/" target="_blank">
                <img src="../assets/EAMS.jpg" height="150px" width="300px">
                </a>
                <ul>
                    <li>進板順序查詢</li>
                </ul>
            </div>
            <div class="item">

            </div>
            <div class="item">

            </div>
        </div>




    </div>
</template>

<style scoped>
.title{
    font-size: 36px;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 700;
    text-align: center;
}
.container {
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    font-family: Arial, Helvetica, sans-serif;
}

.wrap {
    width: 80%;
    display: flex;
    height: 400px;
    /* 調整wrap高度來讓height固定，不受子元素item影響 */
}

.item {
    width: 100%;
    margin: 10px 10px 10px 10px;
    border-radius: 10px;
    background-color: rgba(165, 227, 247, 0.5);
    transition: margin 0.5s;
}

.item:hover {
    margin: 3px 10px 10px 10px;
    border-radius: 10px;
    background-color:rgba(165, 227, 247,0.9);
    box-shadow: 2px 2px 5px 1px rgb(122, 122, 122);
    transition: margin 0.5s;
}

.item-name {
    font-size: larger;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 700;
    text-align: center;
}

.item>img {
    cursor: pointer;
    width: 100%;
    vertical-align: top;
    transition: 0.5s;
}

.item>img:hover {
    box-shadow: 5px 5px 5px 0px rgba(121, 121, 121, 0.5);
    transition: 0.5s;
}
</style>
