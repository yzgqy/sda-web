<template>
    <div>
      <router-view/>
    </div>
</template>

<script>
    export default {
      data() {
        var _this = this
        const appid = this.$route.params.appid
        this.$http.get("http://localhost:8019/api/app/"+appid).then(function (res) {
          _this.app.name = res.data.name;
          _this.app.desc = res.data.desc;
          _this.app.createdAt = res.data.createdAt;
          _this.app.updatedAt = res.data.updatedAt;
        })
        return{
          app: {
            id: '1',
            name: '1号项目',
            desc: '1号项目描述',
            createdAt: 1559463097000,
            updatedAt: 1559463097000
          }
        }
      },
      methods: {

      }
    }
</script>

<style scoped>

</style>
