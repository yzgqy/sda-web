<template>
  <div>
    <el-button @click="addInfo">新增信息</el-button>
    <ul class="infoList">
      <li v-for="info in list">
        <el-card shadow="hover" class="infoCard">
          <div slot="header" class="clearfix">
            <el-row>
              <el-col :span="12"><span>信息描述：{{info.desc}}</span></el-col>
              <el-col :span="12"><span>创建时间：{{$moment(info.createdAt).format('YYYY-MM-DD HH:mm')}}</span></el-col>
            </el-row>
            <el-row>
              <el-col :span="22"><span>插件名称：{{info.functionName}}</span></el-col>
              <el-col :span="2"><i class="el-icon-delete"></i></el-col>
            </el-row>
          </div>
          <div>
            <el-row>
              <el-col :span="12">
                <div>
                  <p>参数：</p>
                  <div v-for="item in info.taskDataList">
                    <p v-if="item.input">
                      {{ item.name }}:&nbsp;&nbsp;&nbsp;{{decodeURIComponent(item.data)}}
                    </p>
                  </div>
                </div>
              </el-col>
              <el-col :span="12">
                <div>
                  <p>数据集：</p>
                  <div v-for="item in info.taskDataList">
                    <!--              <p v-if="!item.input">{{ item.dataType }}:{{item.data}}</p>-->
                    <p v-if="!item.input">{{ item.dataType }}</p>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </li>
    </ul>

    <el-dialog title="选择收集工具" :visible.sync="dialogFormVisible_select">
      <el-table :data="functionList" @row-click="openFun">
        <el-table-column property="name" label="算法名"></el-table-column>
        <el-table-column property="desc" label="描述"></el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog :title="func.name" :visible.sync="dialogFormVisible_param">
      <el-row>
        <el-col :span="4">描述：</el-col>
        <el-col :span="10">
          <el-input v-model="func.desc" size="mini"/>
        </el-col>
      </el-row>
      <div v-for="(item, index) in func.metaData.metaDataItemList">
        <div :key="index">

          <div v-if="item.dataType === 'FormData'">
            <el-row class="form">
              <el-col :span="4">
                <span>{{ item.name+'：' }}</span>
              </el-col>
              <el-col :span="10">
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
                <el-col :span="2">
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
                <el-table-column prop="desc" label="描述"></el-table-column>
                <el-table-column prop="status" label="状态" width="170"></el-table-column>
                <el-table-column prop="createdAt" label="创建时间" width="170">{{$moment(createdAt).format('YYYY-MM-DDHH:mm')}}
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

      <el-button @click="execute" type="primary">执行</el-button>


    </el-dialog>


  </div>
</template>

<script>
  export default {
    data() {
      var _this = this
      const appid = this.$route.params.appid
      this.$http.get("http://localhost:8019/api/task/infos?pageNum=1&pageSize=100&appId=" + appid).then(function (res) {
        _this.list = res.data.result;
        console.log(res.data.result[0].taskDataList)
      })
      return {
        fileList: [],
        activeName: 'info',
        list: [{
          taskDataList: [{
            input: false,
            name: '',
            data: ''
          }]
        }],
        path: '',

        dialogFormVisible_select: false,
        dialogFormVisible_param: false,

        functionList: [],
        func: {
          name: '',
          metaData: {
            metaDataItemList: []
          },
          desc: '',
          type: ''
        }
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

      execute() {
        var _this = this
        _this.dialogFormVisible_param = false

        const appid = _this.$route.params.appid
        const type="InfoCollection"
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
            if(mymetaDataItemList[index].type === "FILE"){
              inputDataDto.formDatas[mymetaDataItemList[index].name] = [_this.path]
            }
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

        // this.dialogFormVisible_param = false
        // var _this = this
        // const appid = this.$route.params.appid
        // this.$http.post("http://localhost:8019/api/task/do", {
        //   appId: appid,
        //   type: "InfoCollection",
        //   functionName: '',
        //   inputDataDto: {
        //     infoDatas: {},
        //     formDatas: {}
        //   }
        // }).then(function (res) {
        //   _this.list = res.data.result;
        //   console.log(res.data.result[0].taskDataList)
        // })

      },
      openFun(row) {
        this.dialogFormVisible_param = true
        this.dialogFormVisible_select = false
        this.func = row

        var _this = this
        const appid = _this.$route.params.appid

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
      addInfo() {
        var _this = this;
        _this.dialogFormVisible_select = true
        this.$http.get("http://localhost:8019/api/function/InfoCollection").then(function (res) {
          _this.functionList = res.data;
        })
      }
    }
  }
</script>

<style scoped>
  .infoList li {
    /*width: 400px;*/
    /*height: 400px;*/
    list-style: none;
    /*float: left;*/
    font-size: 9px;
    margin: 30px;
  }
  .infoCard{
    width: 90%
  }

</style>
