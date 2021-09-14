<template>
    <div class="box">
        <el-row>
            <el-col :span="24">
                <el-card style="width: 600px;display: flex;text-align: center;">
                    <img src="../../../../../code/admin_client/src/assets/logo.png" class="logo" alt="">
                    <el-form label-width="100px" :model="user" :rules="rules" ref="userForm">
                        <el-form-item label="用户名" prop="username">
                            <el-input class="input" v-model="user.username"></el-input>
                        </el-form-item>

                        <el-form-item label="密码" prop="password">
                            <el-input class="input" v-model="user.password"></el-input>
                        </el-form-item>

                        <el-form-item label="验证码" prop="code">
                            <el-input class="input code" v-model="user.code"></el-input>
                            <img :src="url" class="imgcode" alt="" @click="get_captcha">
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" class="loginBtn" @click="login('userForm')">立即登录</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: "Login",
    methods: {
        // 发起登录请求
        login(formName) {
            this.$refs[formName].validate((valid) => {
                if (!valid) return false
                let item = localStorage.getItem("token");
                this.user.token = item
                // 表单规则验证通过后发送请求  进行登录
                this.$axios.post("http://localhost:8989/admin/login", this.user).then(res => {
                    console.log(res.data);
                    if (res.data.success) {
                        // 跳转到首页
                        this.$router.push("/")
                        localStorage.username = res.data.username
                    } else {
                        this.$message.error("您输入的信息有误，请重新输入")
                    }
                }).catch(error => {
                    this.$message.error("您输入的信息有误，请重新输入")
                    console.log(error);
                })
            })
        },
        // 获取验证码
        get_captcha() {
            this.$axios.get("http://localhost:8989/admin/captcha").then(res => {
                console.log(res.data.code);
                this.url = res.data.code
                // 将验证码的key保存到localStorage
                localStorage.token = res.data.token
            }).catch(error => {
                console.log(error);
            })
        },
    },
    created() {
        this.get_captcha()
    },
    data() {
        return {
            url: "", // 验证码的路径
            user: {
                username: "",
                password: "",
                code: "",
            },
            rules: {
                username: [
                    {required: true, message: "请输入用户名", trigger: 'blur'},
                ],
                password: [
                    {required: true, message: "请输入密码", trigger: 'blur'},
                ],
                code: [
                    {required: true, message: "请输入验证码", trigger: 'blur'},
                ]
            }
        }
    },
}
</script>

<style scoped>
.box {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 90vh;
}

.logo {
    height: 200px;
}

.input {
    width: 400px;
    display: flex;
    justify-content: left;
}

.code {
    width: 55%;
    float: left;
}

.imgcode {
    width: 40%;
    height: 40px;
    float: right;
}

.loginBtn {
    width: 100%;
}
</style>
