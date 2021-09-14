<template>
    <div>
        <el-container class="box">
            <el-aside width="220px" style="background-color: rgb(175,200,227)">
                <el-menu :default-openeds="['1']">
                    <el-submenu index="1">
                        <template slot="title"><i class="el-icon-message"></i>系统菜单</template>
                        <el-menu-item index="1-0">
                            <router-link to="/home">主页</router-link>
                        </el-menu-item>
                        <el-menu-item index="1-1">
                            <router-link to="/category">类别管理</router-link>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>

            <el-container>
                <el-header style="text-align: right; font-size: 14px">
                    <span>{{ username }}</span>
                    <el-dropdown>
                        <i class="el-icon-setting" style="margin-right: 15px"></i>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-if="username!=='游客'"><a href="javascript:" @click="signOut">退出系统</a>
                            </el-dropdown-item>
                            <el-dropdown-item v-if="username==='游客'"><a href="#/login">点我登录</a></el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-header>
                <el-main>
                    <!-- 中心内容 -->
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
export default {
    name: "index",
    data() {
        return {
            username: "游客",
        }
    },
    methods: {
        // 获取用户的登录信息
        getUserStatus() {
            let username = localStorage.getItem("username");
            console.log(username+"===============")
            // 向后端发送请求 验证用户的登录状态是否存在
            // 携带token username 验证该username是否在redis中
          this.$axios({
            url:"http://localhost:8989/admin/selLogin",
            method:"get",
            params:{
              token:localStorage.getItem("token")
            }
          }).then(res=>{
            if (username) {
              this.username = username
            } else {
              // 如果没登录  直接跳转到登录页
              this.$router.push("/login")
            }
          })
        },
      signOut(){
          this.$axios({
            url:"http://localhost:8989/admin/delete",
            method:"delete",
            params:{
              token:localStorage.getItem("token")
            }
          }).then(res=>{
            //console.log(localStorage.getItem("token"));
            localStorage.clear();
            this.$router.push("/login")
          }).catch(error=>{
            console.log(error);
          })
      }
    },
    created() {
        this.getUserStatus()
    }
}
</script>

<style scoped>
.el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
}

.el-aside {
    color: #333;
}

.box {
    display: flex;
    height: 100vh;
}
</style>
