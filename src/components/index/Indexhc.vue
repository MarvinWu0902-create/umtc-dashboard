<template>
  <div class="hcouter">
    <div ref="chartContainer" class="hc"></div>
  </div>
</template>

<script setup>
import Highcharts from "highcharts";
import { storeToRefs } from "pinia";
import pinia from "@/stores/index.js";

import { UseBtnStore } from "@/stores/Index/IndexBtn.js";
import { UseXYStore } from '@/stores/Index/XYAxisData.js'
import { UseHcStore } from '@/stores/Index/hcshare.js'


import { watchEffect, ref, watch, computed, onUnmounted } from "vue";

const usebtnstore = UseBtnStore(pinia);

const { filterData, partList, clickHandle } = storeToRefs(usebtnstore);///filterData變化驅動

const usehcstore = UseHcStore(pinia);
const { chartContainer } = storeToRefs(usehcstore);

const usexystoreout = UseXYStore(pinia);
const { mLeft, mRight, wLeft, wRight, dLeft, dRight } = storeToRefs(usexystoreout);


watchEffect(() => {
  console.log('filterData check', filterData.value.length);
  if (filterData.value && chartContainer.value && filterData.value.length > 0) {///filterData有資料就執行

    const usexystore = UseXYStore(pinia);

    const { xAxisData, seriesData, mLeft, mRight, wLeft, wRight, dLeft, dRight } = storeToRefs(usexystore);
    console.log('第一次的seriesData', seriesData.value);

    console.log('chartContainer.value', chartContainer.value);


    Highcharts.chart(chartContainer.value, {
      title: {
        text: 'YM OAY'
      },
      credits: {
        enabled: false
      },
      chart: {
        type: 'areaspline',
        zoomType: 'xy',
        resetZoomButton: {
          position: {
            x: 0,
            y: -40
          }
        }
      },
      legend: {
        symbolHeight: 12,
        symbolWidth: 12,
        symbolRadius: 0
      },
      xAxis: {
        categories: xAxisData.value
      },
      series: seriesData.value,
      yAxis: [{ // 第一条Y轴
        labels: {
          // format: '{value} lots',
          formatter: function () {
            if(this.chart.series[this.chart.series.length-1].userOptions.classify==='Process'){
              return (((this.value)).toFixed(1) / 1000) + 'k units'
            }else{
              return this.value + ' lots' 
            }
          },
          style: {
            color: Highcharts.getOptions().colors[1]
          }
        },
        title: {
          text: 'Total lots',
          style: {
            color: Highcharts.getOptions().colors[1]
          }
        }
      }, { // 第二条Y轴
        title: {
          text: 'OAY',
          style: {
            color: Highcharts.getOptions().colors[0]
          }
        },
        labels: {
          format: '{value}%',
          style: {
            color: Highcharts.getOptions().colors[0]
          }
        },
        opposite: true
      }],
      // series:[Array.from(seriesLine.value)]
      // series:[Array.from(seriesLine.value).map((item)=>({...item}))]
      // series:Array.from(seriesLine.value).map((item)=>JSON.parse(JSON.stringify(item))),
      tooltip: {
        formatter: function () {
          if (this.series.userOptions.type == 'spline') {
            return `料號:<b>${this.series.name}</b><br>時間:<b>${this.x}</b><br>OAY:<b>${this.y.toFixed(1)}%</b>`
          } else if (this.series.userOptions.name != 'OST' && this.series.userOptions.name != 'CC' && this.series.userOptions.name != 'VI' && this.series.userOptions.name != 'WPG' && this.series.userOptions.name != 'Bump' && this.series.userOptions.name != 'Inline') {
            return `料號:<b>${this.series.userOptions.name}</b><br>時間:<b>${this.x}</b><br>批數:<b>${this.y} lots</b>`;
          } else {
            return `站點:<b>${this.series.userOptions.name}</b><br>時間:<b>${this.x}</b><br>顆數:<b>${this.y} units</b>`;
          }
        }
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          pointWidth:25,
          // pointPadding:0.2,
          // groupPadding:0.1,
          dataLabels: {
            zIndex:3,
            enabled: true,
            style:{
              fontSize:'8px'
            },
            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
            formatter: function () {
              if (this.series.userOptions.name != 'OST' && this.series.userOptions.name != 'CC' && this.series.userOptions.name != 'VI' && this.series.userOptions.name != 'WPG' && this.series.userOptions.name != 'Bump' && this.series.userOptions.name != 'Inline') {
                // return this.y + ' lots';
                return this.y
              } else {
                return isNaN(this.y / this.total) ? '' : ((this.y / this.total) * 100).toFixed(1) + '%'
              }
            }
          }
        },
        // spline: {
        //   dataLabels: {
        //     enabled: true,
        //     ////
        //     color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
        //     formatter: function () {
        //       // if (this.series.userOptions.name != 'OST' && this.series.userOptions.name != 'CC' && this.series.userOptions.name != 'VI' && this.series.userOptions.name != 'WPG' && this.series.userOptions.name != 'Bump' && this.series.userOptions.name != 'Inline') {
        //       //   return this.y + ' lots';
        //       // } else {
        //       //   return isNaN(this.y / this.total) ? '' : ((this.y / this.total) * 100).toFixed(1) + '%'
        //       // }
        //       return this.y.toFixed(1)+'%'
        //     }
        //   },
        //   enableMouseTracking: true////開啟tooltips
        // }
      }
    });
  }///if
});

onUnmounted(() => {
  clickHandle.value = 'isCount';
  mLeft.value = 6;
  mRight.value = 0;
  wLeft.value = 6;
  wRight.value = 0;
  dLeft.value = 6;
  dRight.value = 0;
});




</script>

<style scoped>

.hcouter{
  width: 100%;
  display: flex;
  justify-content: center;
}
.hc {
  width: 80%;

}

</style>
