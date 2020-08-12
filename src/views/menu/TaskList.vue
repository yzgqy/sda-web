<template>
  <div>
    <el-card class="box-card">
      <el-row gutter="20">
        <el-col :span="6">
          <p><b>项目名称:</b></p>
        </el-col>
        <el-col :span="6">
          <p><b>类型:</b></p>
        </el-col>
      </el-row>
      <el-row gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入项目名称" v-model="input" clearable size="small"></el-input>
        </el-col>
        <el-col :span="6">
          <el-select v-model="value" placeholder="请选择项目类型" size="small">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button @click="queryTask" size="small" type="primary" >查询</el-button>
        </el-col>
      </el-row>

    </el-card>
    <div class="div-placeholder">

    </div>
    <el-card class="box-card">
      <div id ="building-top">
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="编号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="appName"
          label="应用名称"
          width="150" >
        </el-table-column>
        <el-table-column
          prop="type"
          label="任务类型" width="150">
        </el-table-column>
        <el-table-column
          prop="functionName"
          label="插件名称">
        </el-table-column>
        <el-table-column
          prop="startTime"
          label="开始时间" width="170">
          {{$moment(startTime).format('YYYY-MM-DD HH:mm')}}
        </el-table-column>
        <el-table-column
          prop="endTime"
          label="结束时间" width="170">
          {{$moment(endTime).format('YYYY-MM-DD HH:mm')}}
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态" width="120">
        </el-table-column>
      </el-table>
      </div>
      <el-pagination :page-size="pageSize" :current-page="pageNum" @prev-click="preClick" @next-click="nextClick" @current-change="currentChange"
        background
        layout="prev, pager, next"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "TaskList",
    data() {
      var _this = this;
      this.$http.get("http://localhost:8019/api/task?pageSize=10&pageNum=1").then(function (res) {
        _this.tableData = res.data.result;
        _this.total=res.data.total
        _this.pageSize=res.data.pageSize
        _this.pageNum=res.data.pageNum
      })
      return {
        tableData: [],
        input: '',
        value: '',
        options: [{
          value: 'InfoCollection',
          label: '信息收集'
        }, {
          value: 'Partition',
          label: '划分'
        }, {
          value: 'Evaluation',
          label: '评估'
        }],
        value: '',
        total: '',
        pageSize: '',
        pageNum:''
      }
    },
    methods: {
      currentChange(pageNum){
        this.pageNum = pageNum
        var _this = this;
        this.$http.get("http://localhost:8019/api/task?pageSize=10&pageNum="+this.pageNum).then(function (res) {
          _this.tableData = res.data.result;
          _this.total=res.data.total
          _this.pageSize=res.data.pageSize
          _this.pageNum=res.data.pageNum
        })
      },
      preClick(){
        var _this = this;
        if(this.pageNum===1){}
        else {
          this.pageNum = this.pageNum-1
        }
      },
      nextClick(){
        var _this = this;
        if(this.pageNum*this.pageSize < this.total){
          this.pageNum = this.pageNum+1
        }
      },
      queryTask() {
        var _this = this;
        const appName = this.input
        const type = this.value
        this.$http.get("http://localhost:8019/api/task?appName=" + appName + "&type=" + type + "&pageSize=10&pageNum=1").then(function (res) {
          _this.tableData = res.data.result;
        })

      }
    }
  }
</script>

<style scoped>
  .div-placeholder {
    margin: 10px;
  }

  #building-top .el-table thead {
    color: #000000;
    font-weight: 500;
  }

  #building-top .el-table{
    color: #000000;
  }
</style>
