<template>
  <div>
    <el-row>
      <el-col :span="24">
        <div class="heng">
        <el-card class="box-card">
          <el-row>
            <el-col :span="5">
              <div>
                <p><b>名称：</b>{{partitionInfo.name}}</p>
                <p><b>应用名：</b>{{partitionInfo.appName}}</p>
                <p><b>描述：</b>{{partitionInfo.desc}}</p>
                <p><b>状态：</b>{{partitionInfo.status}}</p>
                <p><b>创建时间：</b>{{$moment(partitionInfo.createdAt).format('YYYY-MM-DD HH:mm')}}</p>
                <p><b>更新时间：</b>{{$moment(partitionInfo.updatedAt).format('YYYY-MM-DD HH:mm')}}</p>
                <el-tooltip placement="bottom">
                  <div slot="content">多行信息<br/>第二行信息</div>
                  <p><b>执行插件：</b>{{partitionInfo.taskEntity.functionName}}</p>
                </el-tooltip>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <p><b>输入参数：</b></p>
                <div>
                  <div v-for="param in partitionInfo.params" class="text item">
                    <div v-if="param.type === 'FormData' & param.name != 'Centrepoints'">
                      <p><b>{{param.name}}：</b>{{param.data}}</p>
                    </div>

                  </div>
                  <div>
                    <p><b>Centrepoints：</b>ACCOUNT;ORDERS;PRODUCT</p>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="9">
              <div>
                <p><b>数据集：</b></p>
                <div>
                  <div v-for="param in partitionInfo.params" class="text item">

                    <div v-if="param.type === 'InfoData'  & param.name!='SYS_RELATION_PAIR_TABLE_SCHEMA_FOREIGN_KEY' ">
                      <p>{{param.name}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="2":offset="2">
              <el-button type="primary" plain>方案评估</el-button>
            </el-col>
          </el-row>
        </el-card>
        </div>
      </el-col>
    </el-row>

    <div class="mainshow">
      <el-row>
        <el-col :span="8">
          <div
            ref="main"
            style="width: 500px;height:500px;"
          />
        </el-col>
        <el-col :span="16">
          <div v-if="flag==='none'">暂无信息</div>
          <div v-if="flag==='node'">
            <el-row>
              <el-col :span="18">
                <span v-text="partitionName"> 分区名称：{{partitionName}} </span>
              </el-col>
            </el-row>

            <el-row gutter="20">
              <el-col :span="9">
                <el-input placeholder="请输入内容" v-model="targetPartitionInput" size="small">
                  <template slot="prepend">目标分区：</template>
                </el-input>
              </el-col>
              <el-col :span="9">
                <el-input placeholder="请输入内容" v-model="descInput" size="small" clearable>
                  <template slot="prepend">描述：</template>
                </el-input>
              </el-col>
              <el-col :span="6">
                <el-button size="mini" type="primary" plain @click="move">移动到目标分区</el-button>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <div>
                  <el-table :data="partitionNodes" style="width: 100%" ref="multipleTable" tooltip-effect="dark"
                            @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="name" label="名称"></el-table-column>
                    <el-table-column prop="clazz" label="类型" width="180"></el-table-column>
                    <el-table-column prop="attrs" label="属性" width="140"></el-table-column>
                  </el-table>
                </div>
              </el-col>
            </el-row>

          </div>
          <div v-if="flag==='edge'">
            边信息
            <el-table :data="partitionEdges" style="width: 100%">
              <el-table-column prop="source" label="调用者"></el-table-column>
              <el-table-column prop="target" label="被调用者"></el-table-column>
              <el-table-column prop="type" label="类型"></el-table-column>
              <el-table-column prop="value" label="调用次数" width="80"></el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
  export default {
    data() {
      var _this = this
      this.partitionId = this.$route.params.partitionId
      this.$http.get("http://localhost:8019/api/partition/" + this.partitionId).then(function (res) {
        _this.partitionInfo.id = res.data.id;
        _this.partitionInfo.appId = res.data.appId;
        _this.partitionInfo.desc = res.data.desc;
        _this.partitionInfo.status = res.data.status;
        _this.partitionInfo.createdAt = res.data.createdAt;
        _this.partitionInfo.updatedAt = res.data.updatedAt;
        _this.partitionInfo.name = res.data.name;
        _this.partitionInfo.appName = res.data.appName;
        _this.partitionInfo.taskEntity.functionName = res.data.taskEntity.functionName;
        _this.partitionInfo.params = res.data.taskEntity.taskDataList;
      })
      this.$http.get("http://localhost:8019/api/partition-detail/" + this.partitionId).then(function (res) {
        _this.graphInfo.type = res.data.data.type
        _this.graphInfo.nodes = res.data.data.nodes
        _this.graphInfo.links = res.data.data.links

        //确定最大最小node大小
        res.data.data.nodes.forEach(element => {
          if (element.size > _this.sizeMax) {
            _this.sizeMax = element.size;
          }
          if (element.size < _this.sizeMin) {
            _this.sizeMin = element.size;
          }
        });

        //设置nodes
        var nodes = []
        for (var idx in _this.graphInfo.nodes) {
          nodes[idx] = _this.transformNode(_this.graphInfo.nodes[idx], _this.sizeMin, _this.sizeMax, _this.sizeRangeMin, _this.sizeRangeMax)
        }
        _this.nodes = nodes
        //设置edges
        var edges = []
        for (var idx in _this.graphInfo.links) {
          edges[idx] = _this.transformEdge(_this.graphInfo.links[idx])
        }
        _this.edges = edges

        _this.drawChart()

      })
      this.$http.get("http://localhost:8019/api/evaluation/last?partitionId=" + this.partitionId).then(function (res) {
        _this.indicators = res.data.indicators;

        let seriesData = []
        let locArr = []
        let notArr = []
        let ceArr = []
        let caArr = []
        let imArr = []
        let rcArr = []
        let partition = []
        _this.indicators.forEach(function (e) {
          let item = {
            partition: e.partitionNodeId,
            value: e.value
          }
          partition = _this.setValue(partition, e.partitionNodeId)
          if (e.name === "LOC") {
            locArr.push(item)
          } else if (e.name === "NOT") {
            notArr.push(item)
          } else if (e.name === "Ce") {
            ceArr.push(item)
          } else if (e.name === "Ca") {
            caArr.push(item)
          } else if (e.name === "I") {
            imArr.push(item)
          } else if (e.name === "RC") {
            rcArr.push(item)
          } else if (e.name === "LOC_Cv") {
            _this.LOC_Cv = e.value
          } else if (e.name === "NOT_Cv") {
            _this.NOT_Cv = e.value
          } else if (e.name === "I_Cv") {
            _this.Im_Cv = e.value
          } else if (e.name === "RC_Cv") {
            _this.RC_Cv = e.value
          } else if (e.name === "I_Avg") {
            _this.Is_Avg = e.value
          } else if (e.name === "RC_Avg") {
            _this.RC_Avg = e.value
          } else if (e.name === "IRN") {
            _this.IRN = e.value
          }
        })

        partition.forEach(function (e) {
          let loc = _this.getValue(locArr, e)
          let not = _this.getValue(notArr, e)
          let ce = _this.getValue(ceArr, e)
          let ca = _this.getValue(caArr, e)
          let im = _this.getValue(imArr, e)
          let rc = _this.getValue(rcArr, e)
          seriesData.push({
            name: e,
            value: loc,
            datas: [loc,not,ce,ca,im,rc],
            loc: loc,
            not: not,
            ce: ce,
            ca: ca,
            im: im,
            rc: rc
          })
        })


        _this.pieDataLoc.seriesData = seriesData
        console.log(_this.pieDataLoc.seriesData)
        _this.getPie()
      })


      return {
        pieDataLoc: {},
        pieDataLot: {},
        partitionId: '',
        indicators: [],
        partitionInfo: {
          id: '',
          appId: '',
          desc: '',
          status: '',
          createdAt: '',
          updatedAt: '',
          name: '',
          appName: '',
          taskEntity: {
            functionName: '',
            params: []
          }

        },
        graphInfo: {
          type: '',
          nodes: [],
          links: []
        },

        nodes: [],
        edges: [],
        sizeMax: 0,
        sizeMin: 9999,
        sizeRangeMin: 5,
        sizeRangeMax: 30,
        selectedNode: [],


        myChart: {},
        defaultColor: '#5370c7',
        selectedColor: '#c71919',

        flag: 'none',

        partitionName: '',
        partitionEdges: [],
        partitionNodes: [],

        descInput: '',
        targetPartitionInput: '',

        multipleSelection: [],

        selectedNodeIndex: 0,
      }
    },
    methods: {
      transformEdge(edge) {
        return {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          data: edge,
          value: edge.count,
          symbolSize: [2, 0],
          label: {
            show: true,
          },
        }
      },

      transformNode(node, sizeMin, sizeMax, sizeRangeMin, sizeRangeMax) {
        let color = this.defaultColor;
        if (this.selectedNode != null && this.selectedNode.id == node.id) {
          color = selectedColor;
        }

        return {
          id: node.id,
          name: node.name,
          desc: node.desc,
          data: node,
          symbolSize: this.calculateNodeSize(node.size, sizeMin, sizeMax, sizeRangeMin, sizeRangeMax),
          x: null,
          y: null,
          itemStyle: {
            normal: {
              color: color
            }
          }
        }
      },

      calculateNodeSize(size, sizeMin, sizeMax, sizeRangeMin, sizeRangeMax) {
        return (sizeRangeMax * (size - sizeMin) + sizeRangeMin * (sizeMax - size)) / (sizeMax - sizeMin);
      },

      drawChart() {
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(this.$refs.main)

        this.myChart = myChart
        this.myChart.hideLoading();

        //默认选中结点为0号
        this.nodes[this.selectedNodeIndex].itemStyle = {normal: {color: this.selectedColor}}
        //默认左侧为node列表
        this.flag = "node"
        this.getPartitionNodes(this.nodes[this.selectedNodeIndex].id)

        // 指定图表的配置项和数据
        const option = {
          animation: false,
          series: [{
            type: 'graph',
            layout: 'force',
            label: {
              normal: {
                formatter: '{b}',
              },
            },
            roam: true,
            data: this.nodes,
            focusNodeAdjacency: true,
            categories: [],
            force: {
              // initLayout: 'circular'
              // repulsion: 20,
              // edgeLength: [10, 100],
              repulsion: 200,
              gravity: 0.2,
              // layoutAnimation: false,
            },
            lineStyle: {
              normal: {
                curveness: 0.1,
              },
            },
            edgeSymbol: ['circle', 'arrow'],
            edgeLabel: {
              formatter: '{c}',
            },
            edges: this.edges,
          }],
        };
        // 使用刚指定的配置项和数据显示图表。
        this.myChart.setOption(option)

        this.myChart.on('click', (params) => {
          if (params.seriesType === 'graph') {
            this.selectedNode = null;
            if (params.dataType === 'edge') {
              // 点击到了 graph 的 edge（边）上。
              console.log("edge")
              console.log(params.data)
              this.flag = "edge"
              this.getPartitionEdges(params.data.id)
            } else {
              // 点击到了 graph 的 node（节点）上。
              console.log("node")
              console.log(params.data)
              this.selectedNode = params.data.data;
              this.flag = "node"
              this.getPartitionNodes(params.data.id)
              this.partitionName = params.data.name

              //之前选中结点改为defaultColor
              this.nodes[this.selectedNodeIndex].itemStyle = {normal: {color: this.defaultColor}}
              for (var idx in this.nodes) {
                if (this.nodes[idx].id === params.data.id) {
                  this.selectedNodeIndex = idx
                }
              }
              //选中结点改为selectedColor
              this.nodes[this.selectedNodeIndex].itemStyle = {normal: {color: this.selectedColor}}
              this.refreshData()
            }
          }
        });
      },

      getPartitionEdges(edgeId) {
        var _this = this
        this.$http.get("http://localhost:8019/api/partition-detail-edge/" + edgeId + "?pageSize=100&page=1" + this.partitionId).then(function (res) {
          const edgeInfo = res.data.result
          var partitionEdges = []
          for (var idx in edgeInfo) {
            partitionEdges[idx] = {
              source: edgeInfo[idx].pair.sourceNodeObj.name,
              target: edgeInfo[idx].pair.targetNodeObj.name,
              type: edgeInfo[idx].pair.infoName,
              value: edgeInfo[idx].pair.value,
            }
          }
          _this.partitionEdges = partitionEdges
        })

      },

      getPartitionNodes(nodeId) {
        var _this = this
        this.$http.get("http://localhost:8019/api/partition-detail-node/" + nodeId + "?pageSize=100&page=1" + this.partitionId).then(function (res) {
          const nodeInfo = res.data.result
          var partitionNodes = []
          for (var idx in nodeInfo) {
            partitionNodes[idx] = {
              id: nodeInfo[idx].id,
              name: nodeInfo[idx].name,
              clazz: nodeInfo[idx].clazz,
              attrs: nodeInfo[idx].attrs,
            }
          }
          _this.partitionNodes = partitionNodes
        })
      },

      refreshData() {
        this.myChart.setOption({
          series: [{
            data: this.nodes,
            edges: this.edges,
          }]
        });
      },

      handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log(val)
      },

      move() {
        const _this = this
        _this.$confirm('是否移动结点到新的分区？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          var nodeIds = []
          for (var idx in _this.multipleSelection) {
            nodeIds[idx] = _this.multipleSelection[idx].id
          }
          _this.$http.post("http://localhost:8019/api/partition-results/moveNode/" + _this.$route.params.partitionId + "?oldPartitionResultName=" + _this.partitionName + "&targetPartitionResultName=" + _this.targetPartitionInput, nodeIds)
            .then(function (res) {
              if (res.data.status === 200) {
                _this.$message({
                  type: 'success',
                  message: '移动成功!'
                });
              } else {
                _this.$message({
                  type: 'error',
                  message: '移动失败!'
                });
              }
            })

        }).catch(() => {
          _this.$message({
            type: 'info',
            message: '已取消移动'
          });
        });

      },
      getValue(arr, partition) {
        let value
        let list = Array.from(arr);
        list.forEach(function (e) {
          if (e.partition === partition) {
            value = e.value
          }
        })
        return value
      },

      setValue(arr, value) {
        let flag = 0

        let list = Array.from(arr);
        list.forEach(function (e) {
          if (e === value)
            flag = 1
        })
        if (flag == 0)
          list.push(value)
        return list
      },

      getPie() {
        // 基于准备好的dom，初始化echarts实例
        let myChartPie = this.$echarts.init(document.getElementById('myChart1'));

        const option = {
          title: {
            text: "微服务指标",
            subtext: '根据服务大小划分',
            left: 'center'
          },
            tooltip: {
              trigger: 'item',
              formatter: function (a) {
                return ('name:' + a['name']
                  + '</br>LoC:' + a['value']
                  + '<br>NOT:' + a['data'].datas[1]
                  + '<br>Ce:' + a['data'].datas[2]
                  + '<br>Ca:' + a['data'].datas[3]
                  + '<br>I:' + a['data'].datas[4]
                  + '<br>RC:' + a['data'].datas[5]);
              }
            },
          series: [
            {
              name: '服务',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: this.pieDataLoc.seriesData,
            }
          ]
        };
        myChartPie.setOption(option);
      },
    }
  }
</script>

<style scoped>
  .paramList li {
    list-style: none;
  }

  .piechart {
    width: 250px;
    height: 250px;
  }

  p {
    font-size: 12px;
    font-family: "Helvetica Neue";
  }

  .heng{
    font-size: 20px;
  }
  .box-card {
    margin: 10px;
    /*padding: 5px;*/
  }

  .mainshow {
    /*margin: 20px;*/
    /*padding: 5px;*/
  }
</style>
