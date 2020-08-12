<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="信息收集" name="info"></el-tab-pane>
      <el-tab-pane label="服务划分" name="partition"></el-tab-pane>
      <el-tab-pane label="对比分析" name="evaluation">

        <el-row>
          <el-col :span="24">
            <div>
              <el-tag
                :key="tag"
                v-for="tag in dynamicTags"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)">
                {{tag}}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加方案</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <div id="loc_cv" class="barGraph" style="width: 300px;height:250px;"/>
          </el-col>
          <el-col :span="6">
            <div id="not_cv" class="barGraph" style="width: 300px;height:250px;"/>
          </el-col>
          <el-col :span="6">
            <div id="im_cv" class="barGraph" style="width: 300px;height:250px;"/>
          </el-col>
          <el-col :span="6">
            <div id="rc_cv" class="barGraph" style="width: 300px;height:250px;"/>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <div id="is_avg" class="barGraph" style="width: 300px;height:250px;"/>
          </el-col>
          <el-col :span="6">
            <div id="rc_avg" class="barGraph" style="width: 300px;height:250px;"/>
          </el-col>
          <el-col :span="6">
            <div id="irn" class="barGraph" style="width: 300px;height:250px;"/>
          </el-col>
        </el-row>

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
        _this.datas = res.data.result;//所有的划分
        let dynamicTags = []
        let count = 7
        let choosenPartition = []//选择的划分
        _this.datas.forEach(function (e) {
          if (count > 0) {
            dynamicTags.push(e.name)
            choosenPartition.push(e)
          }
          count--
        })
        _this.choosenPartition = choosenPartition
        _this.dynamicTags = dynamicTags
        _this.drawlocCvChart()
        _this.drawnotCvChart()
        _this.drawimCvChart()
        _this.drawRcCvChart()
        _this.drawIsAvgChart()
        _this.drawRcAvgChart()
        _this.drawIRNChart()
      })

      return {
        choosenPartition: [],
        datas: [],
        activeName: 'evaluation',
        myChart: {},

        dynamicTags: ['标签一', '标签二', '标签三'],
        inputVisible: false,
        inputValue: ''
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

      drawlocCvChart() {
        let myChart = this.$echarts.init(document.getElementById("loc_cv"));
        let xAxisDta = []
        let seriesDta = []
        this.choosenPartition.forEach(function (e) {
          if (e.lastEvaluation != null) {
            xAxisDta.push(e.name)
            console.log(e)
            const indicators = e.lastEvaluation.indicators
            indicators.forEach(function (indicator) {
              if (indicator.name === "LOC_Cv") {
                seriesDta.push(indicator.value)
              }
            })

          }
        })

        const option = {
          title: {
            text: 'LOC_Cv',
            subtext: '代码行数变化系数',
          },
          xAxis: {
            type: 'category',
            data: xAxisDta
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: seriesDta,
            type: 'bar',
            barWidth: '20%',
          }]
        };

        myChart.setOption(option)

      },

      drawnotCvChart() {
        let myChart = this.$echarts.init(document.getElementById("not_cv"));
        let xAxisDta = []
        let seriesDta = []
        this.choosenPartition.forEach(function (e) {
          if (e.lastEvaluation != null) {
            xAxisDta.push(e.name)
            console.log(e)
            const indicators = e.lastEvaluation.indicators
            indicators.forEach(function (indicator) {
              if (indicator.name === "NOT_Cv") {
                seriesDta.push(indicator.value)
              }
            })

          }
        })

        const option = {
          title: {
            text: 'NOT_Cv',
            subtext: '表数变化系数',
          },
          xAxis: {
            type: 'category',
            data: xAxisDta
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: seriesDta,
            type: 'bar',
            barWidth: '20%',
          }]
        };

        myChart.setOption(option)
      },
      drawimCvChart() {
        let myChart = this.$echarts.init(document.getElementById("im_cv"));
        let xAxisDta = []
        let seriesDta = []
        this.choosenPartition.forEach(function (e) {
          if (e.lastEvaluation != null) {
            xAxisDta.push(e.name)
            console.log(e)
            const indicators = e.lastEvaluation.indicators
            indicators.forEach(function (indicator) {
              if (indicator.name === "I_Cv") {
                seriesDta.push(indicator.value)
              }
            })

          }
        })

        const option = {
          title: {
            text: 'I_Cv',
            subtext: '稳定性变化系数',
          },
          xAxis: {
            type: 'category',
            data: xAxisDta
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: seriesDta,
            type: 'bar',
            barWidth: '20%',
          }]
        };

        myChart.setOption(option)
      },
      drawRcCvChart() {
        let myChart = this.$echarts.init(document.getElementById("rc_cv"));
        let xAxisDta = []
        let seriesDta = []
        this.choosenPartition.forEach(function (e) {
          if (e.lastEvaluation != null) {
            xAxisDta.push(e.name)
            console.log(e)
            const indicators = e.lastEvaluation.indicators
            indicators.forEach(function (indicator) {
              if (indicator.name === "RC_Cv") {
                seriesDta.push(indicator.value)
              }
            })

          }
        })

        const option = {
          title: {
            text: 'RC_Cv',
            subtext: '内聚变化系数',
          },
          xAxis: {
            type: 'category',
            data: xAxisDta
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: seriesDta,
            type: 'bar',
            barWidth: '20%',
          }]
        };

        myChart.setOption(option)
      },
      drawIsAvgChart() {
        let myChart = this.$echarts.init(document.getElementById("is_avg"));
        let xAxisDta = []
        let seriesDta = []
        this.choosenPartition.forEach(function (e) {
          if (e.lastEvaluation != null) {
            xAxisDta.push(e.name)
            console.log(e)
            const indicators = e.lastEvaluation.indicators
            indicators.forEach(function (indicator) {
              if (indicator.name === "I_Avg") {
                seriesDta.push(indicator.value)
              }
            })

          }
        })

        const option = {
          title: {
            text: 'I_Avg',
            subtext: '稳定性平均数',
          },
          xAxis: {
            type: 'category',
            data: xAxisDta
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: seriesDta,
            type: 'bar',
            barWidth: '20%',
          }]
        };

        myChart.setOption(option)
      },
      drawRcAvgChart() {
        let myChart = this.$echarts.init(document.getElementById("rc_avg"));
        let xAxisDta = []
        let seriesDta = []
        this.choosenPartition.forEach(function (e) {
          if (e.lastEvaluation != null) {
            xAxisDta.push(e.name)
            console.log(e)
            const indicators = e.lastEvaluation.indicators
            indicators.forEach(function (indicator) {
              if (indicator.name === "RC_Avg") {
                seriesDta.push(indicator.value)
              }
            })

          }
        })

        const option = {
          title: {
            text: 'RC_Avg',
            subtext: '内聚平均数',
          },
          xAxis: {
            type: 'category',
            data: xAxisDta
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: seriesDta,
            type: 'bar',
            barWidth: '20%',
          }]
        };

        myChart.setOption(option)
      },
      drawIRNChart() {
        let myChart = this.$echarts.init(document.getElementById("irn"));
        let xAxisDta = []
        let seriesDta = []
        this.choosenPartition.forEach(function (e) {
          if (e.lastEvaluation != null) {
            xAxisDta.push(e.name)
            console.log(e)
            const indicators = e.lastEvaluation.indicators
            indicators.forEach(function (indicator) {
              if (indicator.name === "IRN") {
                seriesDta.push(indicator.value)
              }
            })

          }
        })

        const option = {
          title: {
            text: 'IRN',
            subtext: '耦合通信总频率',
          },
          xAxis: {
            type: 'category',
            data: xAxisDta
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: seriesDta,
            type: 'bar',
            barWidth: '20%',
          }]
        };

        myChart.setOption(option)
      },

      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.dynamicTags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      }

    }
  }
</script>


<style scoped>
  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

  .barGraph {
    margin: 10px;
    padding: 30px;
  }
</style>
