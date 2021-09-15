<template>
  <div>
    <h1>用户管理</h1>
    <el-row>
      <el-col>
        <div style="display: flex;justify-content: center">
          <el-select size="small" style="width: 120px;margin-right: 20px;" value="username" placeholder="请选择">
            <el-option key="0" label="用户名" value="username"></el-option>
          </el-select>
          <el-input size="small" v-model="username" style="width: 220px;margin-right: 20px;"></el-input>
          <el-button size="small" type="primary" v-model="username" @click="get_user_list">搜索</el-button>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table
          :data="usersList"
          border
          style="width: 100%">
          <el-table-column prop="id" label="用户id" align="center" width="80"></el-table-column>
          <el-table-column prop="name" label="用户名" align="center" width="100"></el-table-column>
          <el-table-column prop="status" label="状态" width="100"
                           :formatter="versionFormatter"></el-table-column>
          <el-table-column prop="phone" label="手机号"></el-table-column>
          <el-table-column prop="bir" label="生日"></el-table-column>
          <el-table-column prop="image" width="100" align="center" label="头像">
            <template slot-scope="scope">
              <el-image :src="scope.row.image" style="width: 80px; height: 80px" fit="contain"></el-image>
            </template>
          </el-table-column>
          <el-table-column prop="password" label="密码"></el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="deleteUser(scope.row)">删除</el-button>
              <el-button type="text" size="small" @click="handleUpdate(scope.row.id)">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页-->
        <el-row>
          <el-col :span="12" :offset="12">
            <el-pagination
              background
              :page-size="3"
              layout="prev, pager, next"
              @current-change="changePage"
              :total="total">
            </el-pagination>
          </el-col>
        </el-row>
      </el-col>
    </el-row>


    <!-- 修改用户信息-->
    <el-row>
      <el-col :span="24">
        <el-dialog title="修改用户信息" center width="30%" :visible.sync="userDialogFormVisible">
          <el-form :model="user">
            <el-form-item label="状态" :label-width="formLabelWidth">
              <el-select size="small" v-model="status" style="width: 300px">
                <el-option label="正常" value="1"></el-option>
                <el-option label="冻结" value="0"></el-option>
                <el-option label="未激活" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="userDialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="updateUser">确 定</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {deleteUser, selLike, updateUser, userList} from "../api/user";

export default {
  name: "User",
  data() {
    return {
      formLabelWidth: '120px',
      userDialogFormVisible: false,
      usersList: [],
      user: {},
      status: "", // 用户的状态
      username: "",
      total: 0,   // 用户总数量
      page: 1,    // 页码
      rows: 3,
    }
  },
  methods: {
    // 更新用户触发
    handleUpdate(id){
      this.user.id=id
      this.userDialogFormVisible = true
    },
    deleteUser(row){
      deleteUser(row.id).then(res=>{
        this.get_user_list()
      })
    },
    // 发起更新用户的请求
    updateUser(row){
      // 发起请求
      this.user.status=this.status
      updateUser(this.user).then(res=>{
        this.userDialogFormVisible=false;
        this.status="";
        this.get_user_list()
        this.user={}
      }).catch(error=>{
        console.log(error);
      })
      // this.status  修改后的用户的值
    },
    // 页码改变时触发
    changePage(page) {
      this.page = page;
      // 当页码改变时 再次重新获取该页码对应的用户列表
      this.get_user_list()
    },
    // 格式化用户状态显示
    versionFormatter(row, column, cellValue, index) {
      if (row.status === 1) {
        return "正常"
      }
      if (row.status === 2) {
        return "未激活"
      }
      if (row.status === 0) {
        return "冻结"
      }
    },

    get_user_list() {
      console.log(this.user.username+"123");
      // 获取用户时需要向后端传递页码
      let params = {page: this.page,name:this.username}

      userList(params).then(res => {
        this.total = res.data.total
        this.usersList = res.data.users
        console.log(this.usersList)
      }).catch(error => {
        console.log(error);
      })
    }
  },
  created() {
    this.get_user_list()
  }
}
</script>

<style scoped>
.el-row {
  margin-bottom: 10px;
}
</style>
