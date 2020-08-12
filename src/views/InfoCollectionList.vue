<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="信息收集" name="info">
        <router-view/>
      </el-tab-pane>
      <el-tab-pane label="服务划分" name="partition"></el-tab-pane>
      <el-tab-pane label="对比分析" name="evaluation"></el-tab-pane>
      <el-tab-pane label="任务管理" name="task"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        activeName: 'info',
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
      }
    }
  }
</script>


<style scoped>

</style>
