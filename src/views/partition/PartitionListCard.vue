<template>
  <div>
    <el-button @click="addPartion">新增划分</el-button>
    <ul class="cardList">
      <li v-for="(partiton,index) in list">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <el-row>
              <el-col :span="20"><span>名称：{{partiton.name}}</span></el-col>
              <el-col :span="2"><i class="el-icon-edit"></i></el-col>
              <el-col :span="2"><i class="el-icon-delete"></i></el-col>
            </el-row>

          </div>
          <div>
            <p>描述：{{partiton.desc}}</p>
            <p>状态：{{partiton.status}}</p>
            <p>创建时间：{{$moment(partiton.createdAt).format('YYYY-MM-DD HH:mm')}}</p>
            <p>更新时间：{{$moment(partiton.updatedAt).format('YYYY-MM-DD HH:mm')}}</p>
            <el-button type="text" class="button" @click="getDetail(partiton.id)">查看详情</el-button>
          </div>
        </el-card>
      </li>
    </ul>

    <el-dialog title="选择划分算法" :visible.sync="dialogFormVisible_select">
      <el-table :data="functionList" @row-click="openFun" border>
        <el-table-column property="name" label="插件名"></el-table-column>
        <el-table-column property="desc" label="描述"></el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog class="funcDialog" :title="func.name" :visible.sync="dialogFormVisible_param" width="80%">
      <div v-for="(item, index) in func.metaData.metaDataItemList">
        <div :key="index">

          <div v-if="item.dataType === 'FormData'">
            <el-row class="form">
              <el-col :span="3" style="text-align: left">
                <span>{{ item.name+'：' }}</span>
              </el-col>
              <el-col :span="6">
                <el-input v-if="item.type==='STRING'" v-model="item.value" size="mini"/>
                <el-upload v-if="item.type ==='FILE'" class="upload-demo" action="http://localhost:8019/api/upload"
                           :limit="1" :file-list="fileList" :on-success="uploadSuccess">
                  <el-button type="primary" size="mini">上传<i class="el-icon-upload el-icon--right"/></el-button>
                </el-upload>
              </el-col>
            </el-row>
          </div>

          <div v-if="item.dataType === 'InfoData'">
            <div v-if="item.type === 'SYS_NODE'">
              <el-row class="form">
                <el-col :span="3">
                  <h3>{{ item.name}}：</h3>
                </el-col>
                <el-col :span="4">
                  <h3>{{nodeCount}}</h3>
                </el-col>
              </el-row>
            </div>
            <div v-else>
              <el-row class="form">
                <el-col :span="24">
                  <h3>{{ item.name}}</h3>
                </el-col>
              </el-row>
              <!--              <el-divider></el-divider>-->
              <el-table v-bind:data="getDataByType(item.type)" height="140" border style="width: 100%" >
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="desc" label="描述" width="200"></el-table-column>
                <el-table-column prop="status" label="状态" width="160"></el-table-column>
                <el-table-column prop="createdAt" label="创建时间" width="160">{{$moment(createdAt).format('YYYY-MM-DD HH:mm')}}
                </el-table-column>
                <el-table-column label="操作" width="80">
                  <template slot-scope="scope">
<!--                    <el-button @click="delComponent(scope.row)" type="text" size="small">删除</el-button>-->
<!--                    <el-button @click="editComponent(scope.row)" type="text" size="small">编辑</el-button>-->
                    <el-button type="text" size="mini" @click="selectInfo(item.type,scope.row)">选择</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>

        </div>
      </div>

      <el-button type="primary" @click="execute" style="display:block;margin:0 auto">执行</el-button>


    </el-dialog>

  </div>
</template>

<script>
  export default {
    data() {
      var _this = this
      const appid = this.$route.params.appid
      this.$http.get("http://localhost:8019/api/partition?pageSize=10&page=1&appId=" + appid).then(function (res) {
        _this.list = res.data.result;
      })
      return {
        activeName: 'partition',
        list: [],
        dialogFormVisible_select: false,
        dialogFormVisible_param: false,
        form: {
          name: '',
          desc: ''
        },
        functionList: [],
        func: {
          name: '',
          metaData: {
            metaDataItemList: [
              {
                dataType: '',
                name: '',
                required: false,
                desc: '',
                type: '',
                list: [],
                value: ''
              }
            ]
          },
          desc: '',
          type: ''
        },
        infoDatas: [],
        oneInfo: [],
        nodeCount: '',
        path: '',

        excuteForm: {
          appId: '',
          type: '',
          functionName: '',
          inputDataDto: {
            infoDatas: {},
            formDatas: {}
          }
        },

        inputDataTmp: [],
      }
    },


    methods: {
      selectInfo(funcType,row) {
          // const key = 'xianyu'
          // const demo = {
          //   [`${key}`] : 'value'
          // }
          // console.log(demo)
          // console.log(demo.xianyu)
          // console.log(demo[key])
          var flag = false
          for (var index in this.inputDataTmp) {
            if (this.inputDataTmp[index].type === funcType) {
              flag = true
              var isHas = false
              for(var i in this.inputDataTmp[index].data){
                if(this.inputDataTmp[index].data[i].id === row.id){
                  isHas = true
                }
              }
              if(!isHas) {
                this.inputDataTmp[index].data.push(row)
              }
            }
          }
          if (!flag) {
            const item = {
              type: funcType,
              data: [row]
            }
            this.inputDataTmp.push(item)
          }
          // console.log(this.inputDataTmp)
      },
      uploadSuccess(res, file, fileList) {
        this.path = res.path
      },

      getDataByType(type) {
        for (var index in this.infoDatas) {
          if (this.infoDatas[index].type === type)
            return this.infoDatas[index].list
        }

      },
      getDetail(partitionId) {
        const appid = this.$route.params.appid
        this.goToLink(`/apps/${appid}/partition/detail/${partitionId}`)
      },
      execute() {
        var _this = this
        _this.dialogFormVisible_param = false

        const appid = _this.$route.params.appid
        const type="Partition"
        const functionName=_this.func.name
        var inputDataDto = {
          infoDatas: {},
          formDatas: {}
        }

        const mymetaDataItemList = _this.func.metaData.metaDataItemList
        console.log(_this.func.metaData.metaDataItemList)
        for (var index in mymetaDataItemList) {
          console.log(index)
          if(mymetaDataItemList[index].dataType === "FormData"){
            const key = mymetaDataItemList[index].name
            const value = mymetaDataItemList[index].value
            inputDataDto.formDatas[key] = [value]
          }
          if(mymetaDataItemList[index].type === "SYS_NODE"){
            inputDataDto.infoDatas[mymetaDataItemList[index].name] = [{
              id: appid,
              name: mymetaDataItemList[index].name
            }]
          }
        }

        for(var i in _this.inputDataTmp){
          inputDataDto.infoDatas[_this.inputDataTmp[i].type] = _this.inputDataTmp[i].data
        }

        console.log(appid)
        console.log(type)
        console.log(functionName)
        console.log(inputDataDto)
        _this.$http.post("http://localhost:8019/api/task/do", {
          appId: appid,
          type: type,
          functionName: functionName,
          inputDataDto: inputDataDto
        }).then(function (res) {
          _this.list = res.data.result;
          console.log(res.data.result[0].taskDataList)
        })
      },
      openFun(row) {
        var _this = this
        const appid = _this.$route.params.appid
        _this.dialogFormVisible_param = true
        _this.dialogFormVisible_select = false
        _this.func = row

        const dataList = row.metaData.metaDataItemList
        const info = {}
        for (var index in dataList) {
          if (dataList[index].dataType === "InfoData") {
            if (dataList[index].type === 'SYS_NODE') {
              _this.$http.get("http://localhost:8019/api/info/node?appId=" + appid + "&name=SYS_NODE").then(function (res) {
                _this.nodeCount = res.data.nodeCount
                // console.log(_this.func.metaData.metaDataItemList[index].nodeCount)
              })
            } else {
              const type = dataList[index].type
              console.log("http://localhost:8019/api/info?appId=" + appid + "&name=" + type)
              _this.$http.get("http://localhost:8019/api/info?appId=" + appid + "&name=" + type).then(function (res) {
                _this.infoDatas.push({
                  type: type,
                  list: res.data
                })
              })
            }
          }

        }
      },
      addPartion() {
        var _this = this;
        _this.dialogFormVisible_select = true
        this.$http.get("http://localhost:8019/api/function/Partition").then(function (res) {
          _this.functionList = res.data;
        })
      },
      goToLink(url) {
        this.$router.push(url).catch(err => {
          err
        })
      }
    }
  }
</script>

<style scoped>
.funcDialog{
  width: 90%
}
</style>
