<template>
  <div :id="chartId"></div>
</template>

<script>
    export default {
      name: 'ClassReportPieChart',
      props: ['chartId'],
      data() {
        return {
        }
      },
      methods: {
        chartInit(params) {
          var pieChart = this.$echarts.init(document.getElementById(params.id))
          pieChart.setOption({
            backgroundColor: params.backgroundColor,
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            title: {
              text: '上课人数',
              left: 'center',
              top: '42%',
              padding: [24, 0],
              textStyle: {
                color: '#000',
                fontSize: 15,
                align: 'center',
                fontWeight: 'normal'
              },
              subtext: params.courseNo,
              subtextStyle: {
                color: '#000',
                fontSize: 30,
                align: 'center',
                fontWeight: 'normal'
              }
            },
            series: [{
              name: '心率',
              type: 'pie',
              hoverAnimation: false,
              legendHoverLink: false,
              radius: ['25%', '45%'],
              color: params.insideColor,
              label: {
                normal: {
                  position: 'inner'
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              tooltip: {
                show: false
              },

              data: params.labelData
            }, {
              name: '心率',
              type: 'pie',
              radius: ['35%', '50%'],
              color: params.outsideColor,
              labelLine: {
                normal: {
                  show: true,
                  length: 40,
                  length2: 140,
                  lineStyle: {
                    width: 2
                  }
                }
              },
              label: {
                normal: {
                  formatter: '{b|{b}} {d|{d}%}\n{hr|}\n{c|{c}人}',
                  padding: [0, -140],
                  lineHeight: 16,
                  borderRadius: 1,
                  rich: {
                    b: {
                      fontSize: 12,
                      align: 'left',
                      verticalAlign: 'middle'
                    },
                    hr: {
                      width: '100%',
                      borderWidth: 1,
                      height: 1
                    },
                    d: {
                      fontSize: 14,
                      align: 'left',
                      verticalAlign: 'middle'
                    },
                    c: {
                      fontSize: 15,
                      color: '#000',
                      align: 'center',
                      verticalAlign: 'middle'
                    }
                  }
                }
              },
              data: params.data
            }
            ]
          })
        }
      }
    }
</script>

<style scoped>

</style>
