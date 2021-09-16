<template>
  <div>
    <h1>商品管理</h1>
    <el-row style="margin-bottom: 10px;">
      <el-col :span="24">
        <div style="display: flex;justify-content: center">
          <el-select size="small" style="width: 120px;margin-right: 20px;" value="name" placeholder="请选择">
            <el-option key="0" label="商品名称" value="name"></el-option>
          </el-select>
          <el-input size="small" v-model="searchValue" style="width: 220px;margin-right: 20px;"></el-input>
          <el-button size="small" type="primary" @click="getAllCourse">搜索</el-button>
        </div>
      </el-col>
      <el-col :span="24">
        <el-button type="primary" @click="dialogFormVisible = true">添加商品</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table
          :data="products"
          style="width: 100%"
          border>
          <el-table-column prop="id" fixed label="课程编号" width="80"></el-table-column>
          <el-table-column prop="name" fixed label="课程名称" width="150"></el-table-column>
          <el-table-column prop="courseImg" label="课程图片" width="100">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <el-image :src="scope.row.courseImg" style="width: 200px;height: 200px"
                          fit="contain"></el-image>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">查看封面</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="课程价格" width="100"></el-table-column>
          <el-table-column prop="courseType" label="付费类型" width="100" :formatter="payForm"></el-table-column>
          <el-table-column prop="level" label="课程等级" width="100"></el-table-column>
          <el-table-column prop="courseCategoryId" label="课程类别" :width="80"></el-table-column>
          <el-table-column prop="period" label="建议学习周期" width="120"></el-table-column>
          <el-table-column prop="status" label="课程状态" width="80" :formatter="statusForm"></el-table-column>

          <el-table-column prop="teacherId" label="课程讲师"></el-table-column>
          <el-table-column prop="lessons" label="课程总课时"></el-table-column>
          <el-table-column prop="pubLessons" label="已更新课时"></el-table-column>
          <el-table-column prop="students" label="学习人数 "></el-table-column>
          <el-table-column prop="pubDate" label="创建时间"></el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleDetailClick(scope.row)">编辑</el-button>
              <el-button @click="handleDelClick(scope.row.id)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!-- TODO 分页展示-->
    <el-row>
      <el-col :span="12" :offset="12">
        <el-pagination
          background
          :page-size="5"
          layout="prev, pager, next"
          @current-change="changePage"
          :total="total">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- 保存商品信息框 -->
    <el-row>
      <el-col :span="24">
        <el-dialog title="添加商品" @close="closeDialog" center width="30%" :visible.sync="dialogFormVisible">
          <el-form :model="product">
            <el-form-item label="课程名称" :label-width="formLabelWidth">
              <el-input size="small" v-model="product.name" style="width: 300px"></el-input>
            </el-form-item>
            <el-form-item label="课程封面图片" :label-width="formLabelWidth">
              <!--文件上传框-->
              <el-upload
                :action="uploadURL"
                :on-remove="handleRemove"
                :file-list="fileList"
                ref="upload"
                name="file"
                :on-success="handleSuccess"
                :data="{type:'img'}"
                :multiple="false"
                :limit="1"
                :auto-upload="false"
                list-type="picture" style="width: 300px">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">
                  上传到服务器
                </el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过4M!</div>
              </el-upload>
            </el-form-item>
            <el-form-item label="课程价格" :label-width="formLabelWidth">
              <el-input size="small" v-model="product.price" style="width: 300px"></el-input>
            </el-form-item>
            <!--TODO 付费类型展示处理-->
            <el-form-item label="付费类型" :label-width="formLabelWidth">
              <el-select size="small" v-model="product.courseType" style="width: 300px">
                <el-option label="收费" value="0"></el-option>
                <el-option label="免费" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="难度等级" :label-width="formLabelWidth">
              <el-select size="small" v-model="product.level" style="width: 300px">
                <el-option label="入门" value="1"></el-option>
                <el-option label="进阶" value="2"></el-option>
                <el-option label="高级" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="建议学习周期" :label-width="formLabelWidth">
              <el-input size="small" v-model="product.period" placeholder="建议学习天数"></el-input>
            </el-form-item>

            <el-form-item label="课程类别" :label-width="formLabelWidth">
              <el-cascader size="small" v-model="product.courseCategoryId" :options="categoriesList"
                           :props="{label:'name',value:'id',emitPath:false}" style="width: 300px"
                           clearable></el-cascader>
            </el-form-item>
            <el-form-item label="课程讲师" :label-width="formLabelWidth">
              <el-cascader size="small" v-model="product.teacherId" :options="categoriesList"
                           :props="{label:'name',value:'id',emitPath:false}" style="width: 300px"
                           clearable></el-cascader>
            </el-form-item>
            <el-form-item label="课程详情" :label-width="formLabelWidth">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入课程详情介绍"
                v-model="product.brief"
                style="width: 300px">
              </el-input>
            </el-form-item>

            <el-form-item label="总课时数量" :label-width="formLabelWidth">
              <el-input size="small" v-model="product.lessons"></el-input>
            </el-form-item>
            <el-form-item label="课时更新数量" :label-width="formLabelWidth">
              <el-input size="small" v-model="product.pubLessons"></el-input>
            </el-form-item>
            <el-form-item label="学习人数" :label-width="formLabelWidth">
              <el-input size="small" v-model="product.students" placeholder="学习人数"></el-input>
            </el-form-item>
            <el-form-item label="课程状态" :label-width="formLabelWidth">
              <el-select size="small" v-model="product.status" style="width: 300px">
                <el-option label="上架" value="1"></el-option>
                <el-option label="下架" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible=false">取 消</el-button>
            <el-button type="primary" @click="save">确 定</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-dialog title="添加商品" @close="closeDialog" center width="30%" :visible.sync="updateFormVisible">
          <el-form :model="product">
            <el-form-item label="课程名称" :label-width="formLabelWidth">
              <el-input size="small" v-model="product.name" style="width: 300px"></el-input>
            </el-form-item>
            <el-form-item label="课程封面图片" :label-width="formLabelWidth">
              <!--文件上传框-->
              <el-upload
                :action="uploadURL"
                :on-remove="handleRemove"
                :file-list="fileList"
                ref="upload"
                name="file"
                :on-success="handleSuccess"
                :data="{type:'img'}"
                :multiple="false"
                :limit="1"
                :auto-upload="false"
                list-type="picture" style="width: 300px">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">
                  上传到服务器
                </el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过4M!</div>
              </el-upload>
            </el-form-item>
            <el-form-item label="课程价格" :label-width="formLabelWidth">
              <el-input size="small" v-model="product.price" style="width: 300px"></el-input>
            </el-form-item>
            <!--TODO 付费类型展示处理-->
            <el-form-item label="付费类型" :label-width="formLabelWidth">
              <el-select size="small" v-model="product.courseType" style="width: 300px">
                <el-option label="收费" value="0"></el-option>
                <el-option label="免费" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="难度等级" :label-width="formLabelWidth">
              <el-select size="small" v-model="product.level" style="width: 300px">
                <el-option label="入门" value="1"></el-option>
                <el-option label="进阶" value="2"></el-option>
                <el-option label="高级" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="建议学习周期" :label-width="formLabelWidth">
              <el-input size="small" v-model="product.period" placeholder="建议学习天数"></el-input>
            </el-form-item>

            <el-form-item label="课程类别" :label-width="formLabelWidth">
              <el-cascader size="small" v-model="product.courseCategoryId" :options="categoriesList"
                           :props="{label:'name',value:'id',emitPath:false}" style="width: 300px"
                           clearable></el-cascader>
            </el-form-item>
            <el-form-item label="课程讲师" :label-width="formLabelWidth">
              <el-cascader size="small" v-model="product.teacherId" :options="categoriesList"
                           :props="{label:'name',value:'id',emitPath:false}" style="width: 300px"
                           clearable></el-cascader>
            </el-form-item>
            <el-form-item label="课程详情" :label-width="formLabelWidth">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入课程详情介绍"
                v-model="product.brief"
                style="width: 300px">
              </el-input>
            </el-form-item>

            <el-form-item label="总课时数量" :label-width="formLabelWidth">
              <el-input size="small" v-model="product.lessons"></el-input>
            </el-form-item>
            <el-form-item label="课时更新数量" :label-width="formLabelWidth">
              <el-input size="small" v-model="product.pubLessons"></el-input>
            </el-form-item>
            <el-form-item label="学习人数" :label-width="formLabelWidth">
              <el-input size="small" v-model="product.students" placeholder="学习人数"></el-input>
            </el-form-item>
            <el-form-item label="课程状态" :label-width="formLabelWidth">
              <el-select size="small" v-model="product.status"  style="width: 300px">
                <el-option label="上架" value="1"></el-option>
                <el-option label="下架" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="updateFormVisible=false,this.product={}">取 消</el-button>
            <el-button type="primary" @click="updateProDuct">确 定</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {del, products, saveProduct, updatePro} from "../api/product";
import {categorys} from "../api/category";

export default {
  name: "Product",
  data() {
    return {
      uploadURL: "http://localhost:8989/admin/upload",    // 文件上传所对应的后端的方法路径
      dialogFormVisible: false,
      updateFormVisible:false,
      formLabelWidth: '120px',
      products: [],//商品数据
      product: {level: '1', courseType: "1"}, // 商品对象
      level: {status: "1"},
      searchValue: "",
      fileList: [],
      categoriesList: [],//类别列表
      total: 0,
      page: 1,
      rows: 5
    }
  },
  methods: {
    // 保存课程
    save() {
      saveProduct(this.product).then(res => {
        this.getAllCourse()
        this.closeDialog(); // 关闭数据框
      })
    },
    closeDialog() {//关闭对话框
      this.dialogFormVisible = false;
      this.product = {status: '1'};
      this.fileList = [];
    },
    // 获取课程列表的方法
    getAllCourse() {
      let params={page:this.page,searchValue:this.searchValue,}
      products(params).then(res => {
        console.log(res.data.total);
        console.log(res.data.products);
        this.products = res.data.products;
        this.total=res.data.total;
      })
    },
    // 获取类别列表
    get_catetory() {
      categorys().then(res => {
        this.categoriesList = res.data
      })
    },
    changePage(page){
      this.page=page;
      this.getAllCourse()
    },
    handleRemove() {
    },
    payForm(row){
      if(row.courseType==0){
        return "免费"
      }else{
        return "付费"
      }
    },
    statusForm(row){
      if (row.status==0){
        return "上架"
      }else if (row.status==1){
        return "下架"
      }else{
        return "售罄"
      }
    },
    // 文件上传成功时触发
    handleSuccess(response, file, fileList) {
      // 将图片全路径地址保存到对象中
      this.product.courseImg = response
    },
    // 修改商品  展示修改框
    handleDetailClick(course) {
      this.product=course;
      this.updateFormVisible=true;
    },
    //修改
    updateProDuct(){
      updatePro(this.product).then(res=>{
        this.product={}
        this.updateFormVisible=false
        this.getAllCourse()
      }).catch(error=>{
        console.log(error);
      })
    },
    // 点击文件将上传到服务器
    submitUpload() {
      // 发起上传文件的请求  会携带该el-upload中的文件向uploadURL的路径中发起上传文件的请求
      this.$refs.upload.submit();
    },
    // 删除商品
    handleDelClick(id) {
      del(id).then(res=>{
          this.getAllCourse();
      }).catch(error=>{
        console.log(error);
      })
    },
  },
  created() {
    this.get_catetory();
    this.getAllCourse();
  }
}
</script>

<style scoped>
.el-table__row .warning-row {
  background-color: #5FB878;
}

.el-table__row .success-row {
  background-color: #b31d28;
}

.el-row {
  margin: 10px 0px;
}

.el-input {
  width: 300px;
}

.el-upload {
  width: 300px;
}
</style>
