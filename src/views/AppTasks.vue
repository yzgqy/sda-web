<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="信息收集" name="info"></el-tab-pane>
      <el-tab-pane label="服务划分" name="partition"></el-tab-pane>
      <el-tab-pane label="对比分析" name="evaluation"></el-tab-pane>
      <el-tab-pane label="任务管理" name="task">
        <div>
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
              width="150">
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
              label="开始时间" width="170">{{$moment(startTime).format('YYYY-MM-DD HH:mm')}}
            </el-table-column>
            <el-table-column
              prop="endTime"
              label="结束时间" width="170">{{$moment(endTime).format('YYYY-MM-DD HH:mm')}}
            </el-table-column>
            <el-table-column
              prop="status"
              label="状态" width="120">
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-pagination :page-size="pageSize" :current-page="pageNum" @prev-click="preClick" @next-click="nextClick" @current-change="currentChange"
                   background
                   layout="prev, pager, next"
                   :total="total">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    data() {
      var _this = this
      const appid = this.$route.params.appid
      this.$http.get("http://localhost:8019/api/app/" + appid).then(function (res) {
        _this.appName = res.data.name
        _this.$http.get("http://localhost:8019/api/task?pageSize=12&pageNum=1&appName=" + _this.appName).then(function (res) {
          _this.tableData = res.data.result
          _this.total=res.data.total
          _this.pageSize=res.data.pageSize
          _this.pageNum=res.data.pageNum
        })
      })

      return {
        appName: '',
        activeName: 'task',
        tableData: [],
        total: '',
        pageSize: '',
        pageNum:''
      }
    },

    methods: {

      currentChange(pageNum){
        this.pageNum = pageNum
        var _this = this;
        this.$http.get("http://localhost:8019/api/task?pageSize=12&pageNum="+this.pageNum+"&appName=" + _this.appName).then(function (res) {
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
      }
    }
  }
</script>

<style scoped>

</style>
