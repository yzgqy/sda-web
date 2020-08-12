<template>
  <div name="show">

    <el-row>
      <el-col :span="24"><div><el-button @click="dialogFormVisible = true">新增项目</el-button></div></el-col>
    </el-row>

    <ul class="cardList">
      <li v-for="(app,index) in list">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <el-row>
              <el-col :span="20"><h2>{{app.name}}</h2></el-col>
              <el-col :span="2"><i class="el-icon-delete" @click="delApp(app.id)"></i></el-col>
              <el-col :span="2"><i class="el-icon-edit" @click="editBtn(index)"></i></el-col>
            </el-row>
          </div>
          <div>
            <p>{{app.desc}}</p>
            <p>创建时间：{{$moment(app.createdAt).format('YYYY-MM-DD HH:mm')}}</p>
            <i v-if="app.isStarred === 0" class="el-icon-star-off"></i>
            <i v-if="app.isStarred === 1" class="el-icon-star-on"></i>
            <el-button style="float: right; padding: 3px 0" type="text" @click="goToLink(app.id)">查看详情</el-button>
          </div>
        </el-card>
      </li>
    </ul>



    <el-dialog title="新增项目" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="项目名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="项目描述" :label-width="formLabelWidth">
          <el-input v-model="form.desc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button @click="addApp">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑项目" :visible.sync="dialogFormVisible_update">
      <el-form >
        <el-form-item label="项目名称" :label-width="formLabelWidth">
          <el-input v-model="nameEdit" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="项目描述" :label-width="formLabelWidth">
          <el-input v-model="descEdit" autocomplete="off" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button @click="editApp">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    data() {
      var _this = this;
      this.$http.get("http://localhost:8019/api/app?pageSize=100&pageNum=1").then(function (res) {
        _this.list = res.data.result;
      })
      return {
        list: [],
        dialogFormVisible: false,
        dialogFormVisible_update: false,
        form: {
          name: '',
          desc: ''
        },
        formLabelWidth: '100px',
        idEdit: '',
        nameEdit:'',
        descEdit:''
      }
    },
    methods: {
      editBtn(index) {
        this.dialogFormVisible_update = true
        const idEdit = this.list[index].id
        const nameEdit =this.list[index].name
        const descEdit =this.list[index].desc
        this.idEdit = idEdit
        this.nameEdit = nameEdit
        this.descEdit = descEdit
      },

      editApp() {
        this.$http.put("http://localhost:8019/api/app",{
          id: this.idEdit,
          name: this.nameEdit,
          desc: this.descEdit
        }).then(function (res) {
          console.log(res)
        })
        this.dialogFormVisible_update = false
      },
      delApp(appid) {
        var _this = this;
        this.$confirm('是否删除该项目？', '删除项目', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          // type: 'warning'
        }).then(() => {
          this.$http.delete("http://localhost:8019/api/app/" + appid).then(function (res) {
            console.log(res)
          })
          this.$message({
            type: 'success',
            message: '删除成功!'
          });

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });


      },
      cancel: function () {
        this.dialogFormVisible = false
        this.dialogFormVisible_update = false
        this.form.name = ''
        this.form.desc = ''
      },
      addApp: function () {
        var _this = this;
        _this.dialogFormVisible = false
        this.$http.post("http://localhost:8019/api/app", {
          name: _this.form.name,
          desc: _this.form.desc,
        }).then(function (res) {
          console.log(res)

        })

        _this.form.name = ''
        _this.form.desc = ''
      },
      goToLink(appid) {
        this.$router.push(`/apps/${appid}/info/list`).catch(err => {
          err
        })
      },

    }
  }
</script>

<style scoped>
  .appList li {
    width: 300px;
    height: 250px;
    list-style: none;
    float: left;
    font-size: 9px;
    margin: 30px;
  }
</style>
