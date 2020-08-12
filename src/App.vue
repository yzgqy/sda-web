<template>
  <el-container>
    <el-header>
      <el-row :gutter="20">
        <el-col :span="3" :offset="1">
          <b>微服务拆分支持平台</b>
        </el-col>
        <el-col :span="4" :offset="6">
          <el-input v-model="input" placeholder="搜索项目" clearable size="mini"/>
        </el-col>
        <el-col :span="3":offset="7">
          <el-button type="primary" plain>退出</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside>
        <el-row>
          <el-col :span="24">
            <el-menu router :default-active="$route.path">
              <el-menu-item index="/apps">
                <div class = "a">
                <i class="el-icon-folder-opened"></i>
                <span slot="title" class="menu">全部项目</span>
                  </div>
              </el-menu-item>
              <el-menu-item index="/star-apps">
                <div class = "a">
                <i class="el-icon-star-off"></i>
                <span slot="title" class="menu">标星项目</span>
                </div>
              </el-menu-item>
              <el-menu-item index="/archive-apps">
                <div class = "a">
                <i class="el-icon-folder-checked"></i>
                <span slot="title" class="menu">归档项目</span>
                  </div>
              </el-menu-item>
              <el-menu-item index="/tasks">
                <div class = "a">
                <i class="el-icon-setting"></i>
                <span slot="title" class="menu">任务</span>
                </div>
              </el-menu-item>
              <el-menu-item index="/guide">
                <div class = "a">
                <i class="el-icon-document"></i>
                <span slot="title" class="menu">手册</span>
                </div>
              </el-menu-item>
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>
      <el-main>
        <div>
          <router-view/>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    data(){
      return {
        input: ''
      }
    }
  }
</script>

<style>

  .el-header {
    background-color: rgb(217, 236, 255);
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  .cardList li{
    width: 330px;
    height: 250px;
    list-style: none;
    float:left;
    font-size: 9px;
    margin: 10px;
    /*background:#67C23A*/
      /*D5E8D4*/
  }

  .el-aside {
    /*background-color: #D3DCE6;*/
    /*color: #333;*/
    text-align: center;
    line-height: 200px;
    font-size: 20px;
  }

  .menu{
    font-size: 16px;
    color:#000000;
  }
  .a{
    margin: 10px;
  }

</style>
