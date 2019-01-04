<template>
  <div class="chart" :id="chartId" style="height: 350px;width: 100%;"></div>
</template>

<script>
  var echarts = require('echarts')

  export default {
    name: 'JumpRopeChart',
    props: ['chartId'],
    data() {
      return {
      }
    },
    methods: {
      chartInit(id, xData, yData) {
        var xXChart = echarts.init(document.getElementById(id))
        xXChart.setOption({
          title: {
            show: true,
            text: '每15秒跳绳次数对比图',
            top: 'bottom',
            left: 'center',
            textStyle: {
              fontWeight: '350'
            }
          },
          color: ['#639BFE'],
          xAxis: [
            {
              name: '时间\n(min)',
              nameTextStyle: {
                fontSize: 16
              },
              nameLocation: 'start',
              nameGap: 20,
              type: 'category',
              data: xData
            }
          ],
          yAxis: [
            {
              name: '跳绳次数',
              type: 'value',
              nameTextStyle: {
                fontSize: 16
              },
              splitLine: {
                lineStyle:
                  {
                    type: 'dashed'
                  }
              }
            }
          ],
          series: [
            {
              type: 'bar',
              barWidth: 40,
              data: yData,
              label: {
                show: true,
                position: 'top',
                color: '#454545',
                fontSize: 18
              }
            }
          ]
        })
      }
    }
  }
</script>

<style scoped>

</style>
