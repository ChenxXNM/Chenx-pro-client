<template>
  <div>
    <el-row style="margin-bottom: 10px;">
      <!--触发添加的弹出框-->
      <el-button type="primary" @click="centerDialogVisible = true">添加类别</el-button>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-tree :props="defaultProps" node-key="id" :data="data">
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span>{{ node.label }}</span>
                        <span>
                          <el-button type="text" size="mini" @click="del(node.key)">删除</el-button>
                        </span>
                        <span>
                           <el-button type="text" size="mini" @click="handeleCateGory(node)">修改类别</el-button>
                        </span>
                    </span>
        </el-tree>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <!--添加类别框-->
        <el-dialog title="添加类别" :visible.sync="centerDialogVisible" width="30%" center>
          <div style="display: flex;justify-content: center;margin-bottom: 10px;">
            <span class="demonstration">类别名称</span>
            <el-input style="width: 300px;" v-model="category.name"></el-input>
          </div>
          <!--添加弹出框-->
          <span slot="footer" class="dialog-footer">
                        <el-button @click="clearDialog">取 消</el-button>
                        <el-button type="primary" @click="add">确 定</el-button>
                    </span>
        </el-dialog>
      </el-col>

      <el-col :span="24">
        <!--修改-->
        <el-dialog title="修改类别" :visible.sync="centerDialog" width="30%" center>
          <div style="display: flex;justify-content: center;margin-bottom: 10px;">
            <span class="demonstration">类别名称</span>
            <el-input style="width: 300px;" v-model="category.name"></el-input>
          </div>
          <!--添加弹出框-->
          <span slot="footer" class="dialog-footer">
                        <el-button @click="clearDialog">取 消</el-button>
                        <el-button type="primary" @click="update">确 定</el-button>
                    </span>
        </el-dialog>
      </el-col>


    </el-row>
  </div>
</template>

<script>
import {addCategory, categorys, deleteCategory, updateCategory} from "../api/category";


export default {
  name: "Category",
  data() {
    return {
      centerDialogVisible: false,
      centerDialog: false,
      defaultOptions: {label: 'name', value: 'id', checkStrictly: true, leaf: 'children', disable: 'status'},
      data: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      category: {},
    }
  }
  ,
  methods: {
    // 获取类别列表
    getCategory() {
      //  请求
      categorys().then(res => {
        this.data = res.data
      })
    },
    handeleCateGory(node){
      this.category.id=node.key;
      this.centerDialog=true;
    },
    // 保存类别
    add() {
      if (this.category.name) {
        addCategory(this.category).then(res => {
          // 清空文本框
          this.category.name = ""
          // 保存成功后关闭添加框
          this.centerDialogVisible = false
          // 获取插入成功的数据
          this.getCategory()
        }).catch(error => {
          console.log(error);
        })
      }
    },
    update(){
      updateCategory(this.category).then(res=>{
        this.category.name=""
        this.centerDialog=false
        this.getCategory()
      }).catch(error=>{
        console.log(error);
      })

    },
    del(id){
      deleteCategory(id).then(res=>{
        this.getCategory()
      }).catch(error=>{
        console.log(error);
      })
    },

    clearDialog() { //取消保存
      this.category = {};
      this.centerDialogVisible = false;
      this.centerDialog = false;
    },
  },
  created() {
    this.getCategory()
  }
}
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 18px;
  padding-right: 8px;
}

.demonstration {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 25px;
}

.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
