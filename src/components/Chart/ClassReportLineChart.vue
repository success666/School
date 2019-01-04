<template>
  <div :id="chartId"></div>
</template>

<script>
  var echarts = require('echarts')

  export default {
    name: 'ClassReportLineChart',
    props: ['chartId'],
    data() {
      return {
      }
    },
    methods: {
      chartInit(params) {
        var intensityLine = this.$echarts.init(document.getElementById(params.id))
        intensityLine.setOption({
          title: {
            text: params.title,
            textStyle: {
              align: 'center'
            },
            left: '40%',
            top: '5%'
          },
          grid: {
            left: '16%',
            right: '16%',
            bottom: '20%',
            top: '20%',
            containLabel: true
          },
          backgroundColor: params.backgroundColor,
          color: ['orange'],
          legend: {
            data: [{
              name: params.avgName,
              icon: 'line'
            }],
            show: true,
            right: '16%',
            top: '14%'
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: params.xLine,
            name: params.xUnit,
            nameLocation: 'start'
          },
          yAxis: {
            type: 'value',
            name: params.yUnit,
            splitLine: {
              lineStyle:
                {
                  type: 'dashed'
                }
            }
          },
          series: [{
            data: params.data,
            name: params.avgName,
            type: 'line',
            markLine: {
              symbol: 'none',
              data: [{
                type: 'average',
                name: params.avgName
              }],
              itemStyle: {
                normal: {
                  lineStyle: {
                    type: 'solid',
                    color: 'orange'
                  },
                  label: {
                    show: true,
                    position: 'end'
                  }
                }
              }
            },
            areaStyle: {
              color: {
                colorStops: [{
                  offset: 0, color: '#CEE0FF' // 0% 处的颜色
                }, {
                  offset: 1, color: '#E9F1FF' // 100% 处的颜色
                }]
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
