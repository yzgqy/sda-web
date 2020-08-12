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
          <el-col :span="12">
            <div id="coupling" class="barGraph" style="width: 400px;height:300px;"/>
          </el-col>
          <el-col :span="12">
            <div id="coherence" class="barGraph" style="width: 400px;height:300px;"/>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div id="couplingCV" class="barGraph" style="width: 400px;height:300px;"/>
          </el-col>
          <el-col :span="12">
            <div id="coherenceCV" class="barGraph" style="width: 400px;height:300px;"/>
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
        _this.drawCouplingChart()
        _this.drawCoherenceChart()
        _this.drawCouplingCVChart()
        _this.drawCoherenceCVChart()
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

      drawCouplingChart() {
        let myChart = this.$echarts.init(document.getElementById("coupling"));

        // this.myChart = myChart
        // this.myChart.hideLoading();

        let xAxisDta = []
        let seriesDta = []
        this.choosenPartition.forEach(function (e) {
          if (e.lastEvaluation != null) {
            xAxisDta.push(e.name)
            console.log(e)
            const indicators = e.lastEvaluation.indicators
            indicators.forEach(function (indicator) {
              if (indicator.name === "coupling") {
                seriesDta.push(indicator.value)
              }
            })

          }
        })

        const option = {
          title: {
            text: 'Coupling',
            subtext: '服务外部依赖占比',
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
      drawCoherenceChart() {
        let myChart = this.$echarts.init(document.getElementById("coherence"));

        // this.myChart = myChart
        // this.myChart.hideLoading();

        let xAxisDta = []
        let seriesDta = []
        this.choosenPartition.forEach(function (e) {
          if (e.lastEvaluation != null) {
            xAxisDta.push(e.name)
            console.log(e)
            const indicators = e.lastEvaluation.indicators
            indicators.forEach(function (indicator) {
              if (indicator.name === "coherence") {
                seriesDta.push(indicator.value)
              }
            })

          }
        })

        const option = {
          title: {
            text: 'Coherence',
            subtext: '服务内部依赖占比',
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
      drawCouplingCVChart() {
        let myChart = this.$echarts.init(document.getElementById("couplingCV"));

        // this.myChart = myChart
        // this.myChart.hideLoading();

        let xAxisDta = []
        let seriesDta = []
        this.choosenPartition.forEach(function (e) {
          if (e.lastEvaluation != null) {
            xAxisDta.push(e.name)
            console.log(e)
            const indicators = e.lastEvaluation.indicators
            indicators.forEach(function (indicator) {
              if (indicator.name === "couplingCV") {
                seriesDta.push(indicator.value)
              }
            })

          }
        })

        const option = {
          title: {
            text: 'CouplingCV',
            subtext: '耦合变异值',
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
      drawCoherenceCVChart() {
        let myChart = this.$echarts.init(document.getElementById("coherenceCV"));

        // this.myChart = myChart
        // this.myChart.hideLoading();

        let xAxisDta = []
        let seriesDta = []
        this.choosenPartition.forEach(function (e) {
          if (e.lastEvaluation != null) {
            xAxisDta.push(e.name)
            console.log(e)
            const indicators = e.lastEvaluation.indicators
            indicators.forEach(function (indicator) {
              if (indicator.name === "coherenceCV") {
                seriesDta.push(indicator.value)
              }
            })

          }
        })

        const option = {
          title: {
            text: 'CoherenceCV',
            subtext: '内聚变异值',
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
