<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="信息收集" name="info"></el-tab-pane>
      <el-tab-pane label="服务划分" name="partition"></el-tab-pane>
      <el-tab-pane label="对比分析" name="evaluation">
        <div>
          对比分析
<!--          <div ref="linemain"/>-->
          <div id="evaluation" style="width: 900px;height:600px;"/>
        </div>
      </el-tab-pane>
      <el-tab-pane label="任务管理" name="task"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    data() {
      var _this = this
      const appid = this.$route.params.appid
      this.$http.get("http://localhost:8019/api/partition?pageSize=10&page=1&appId=" + appid).then(function (res) {
        _this.datas = res.data.result;
        _this.drawLineChart()
      })

      return {
        datas: [],
        activeName: 'evaluation',
        myChart: {},
      }
    },

    methods: {
      handleClick(tab, event) {
        const appid = this.$route.params.appid
        if (tab.name == 'info') {
          this.goToLink(`/apps/${appid}/info/list`)
        } else if (tab.name == 'partition') {
          this.goToLink(`/apps/${appid}/partition/list`)
        } else if (tab.name == 'evaluation') {
          this.goToLink(`/apps/${appid}/evaluation`)
        } else {
          this.goToLink(`/apps/${appid}/tasks`)
        }
      },
      goToLink(url) {
        this.$router.push(url).catch(err => {
          err
        })
      },

      drawLineChart() {
        // 基于准备好的dom，初始化echarts实例
        // let myChart = this.$echarts.init(this.$refs.linemain)
        let myChart = this.$echarts.init(document.getElementById("evaluation"));

        this.myChart = myChart
        this.myChart.hideLoading();

        const option = {
          legend: {
            data: ['IRN', 'CHM', 'CHD', 'IFN', 'OPN']
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            },
            formatter: (params) => {
              let html = '<div>' + params[0].data.id + '</div>';
              const date = new Date(params[0].data.createdAt);
              html += '<div>' + date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' '
                + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '</div>';
              html += '<div>' + params[0].data.desc + '</div>';
              html += '<br/>';
              params.map((data) => {
                html += '<div>';
                html += '<div style="float:left;width:14px;height:14px;border-radius:7px;background-color:' + data.color + '"></div>';
                html += '<span style="margin-left:4px;">' + data.seriesName + ':' + data.value[1] + '</span>';
                html += '</div>';
              });
              return html;
            },
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          // xAxis: {
          //   type: 'value',
          //   min: 0,
          //   max: Math.max(3, this.datas.length - 1),
          //   splitLine: {
          //     show: false
          //   },
          // },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.getXData(this.datas)
          },
          yAxis: [
            {
              name: '',
              type: 'value',
              splitLine: {
                show: false
              },
              axisLine: {
                lineStyle: {
                  color: '#c04027'
                }
              },
            },
            {
              name: '',
              type: 'value',
              splitLine: {
                show: false
              },
              axisLine: {
                lineStyle: {
                  color: '#2664c0'
                }
              },
            },
          ],
          series: [
            {
              yAxisIndex: 0,
              name: 'IRN',
              data: this.formatData(this.datas, 'IRN'),
              type: 'line',
            },
            {
              yAxisIndex: 0,
              name: 'CHM',
              data: this.formatData(this.datas, 'CHM'),
              type: 'line'
            },
            // {
            //   yAxisIndex: 0,
            //   name: 'Instability',
            //   data: formatData(this.datas, 'Instability'),
            //   type: 'line'
            // },
            {
              yAxisIndex: 0,
              name: 'CHD',
              data: this.formatData(this.datas, 'CHD'),
              type: 'line'
            },
            {
              yAxisIndex: 0,
              name: 'IFN',
              data: this.formatData(this.datas, 'IFN'),
              type: 'line'
            },
            {
              yAxisIndex: 1,
              name: 'OPN',
              data: this.formatData(this.datas, 'OPN'),
              type: 'line'
            },
          ]
        };

        console.log(option.series)
        this.myChart.setOption(option)

        // this.myChart.on('click', (params) => {
        //
        // });
      },

      formatData(partitoins, indicatorName) {
        const datas = [];
        let index = 0;
        partitoins.map((p) => {
          let indicator = null;
          const e = p.lastEvaluation;
          if (e == null)
            return;

          for (let i in e.indicators) {
            if (e.indicators[i].name === indicatorName) {
              indicator = e.indicators[i];
              break;
            }
          }
          if (indicator == null) {
            return;
          }
          const data = {
            partition: p,
            name: p.id,
            id: p.id,
            createdAt: p.createdAt,
            desc: p.desc,
            value: [index++, indicator.value],
          };
          datas.push(data);
        });
        return datas;
      },
      getXData(partitoins) {
        const datas = [];
        let index = 0;
        partitoins.map((p) => {
          if(p.name === null){
            datas.push(p.id);
          }else {
            datas.push(p.name);
          }

        });
        return datas;

      }
    }
  }
</script>

<style scoped>

</style>
