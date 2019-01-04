<template>
  <div class="chart" :id="chartId" style="height: 350px;width: 100%;"></div>
</template>

<script>
  var echarts = require('echarts')

  export default {
    name: 'JumpRopeLineChart',
    props: ['chartId'],
    data() {
      return {
      }
    },
    methods: {
      chartInit(id, xData, yData) {
        var maxY = Math.max.apply(Math, yData)
        var maxYData = maxY * 2
        var xXChart = echarts.init(document.getElementById(id))
        xXChart.setOption({
          title: {
            show: true,
            text: '每15秒中断次数对比图',
            top: 'bottom',
            left: 'center',
            textStyle: {
              fontWeight: '350'
            }
          },
          color: ['orange'],
          xAxis: {
            type: 'category',
            nameTextStyle: {
              fontSize: 16
            },
            boundaryGap: false,
            nameGap: 20,
            data: xData,
            name: '时间\n(min)',
            nameLocation: 'start'
          },
          yAxis: {
            max: maxYData,
            type: 'value',
            name: '中断次数',
            nameTextStyle: {
              fontSize: 16
            },
            splitLine: {
              lineStyle:
                {
                  type: 'dashed'
                }
            }
          },
          series: [{
            data: yData,
            name: 'series',
            type: 'line',
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#CEE0FF'
                }, {
                  offset: 1,
                  color: '#E9F1FF'
                }])
              }
            },
            lineStyle: {
              normal: {
                color: '#0061FF'
              }
            },
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  textStyle: {
                    color: '#000'
                  }
                }
              }
            }
          }]
        })
      }
    }
  }
</script>

<style scoped>

</style>



