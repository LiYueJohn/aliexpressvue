<template>

  <el-container v-if="showUserManagement">
      <el-row :gutter="20" class="myleft">
        <el-col :span="24" > 
             <el-button type="primary" @click="showDailog('add')"   style="float:left;margin-left:20px;" circle><i class="el-icon-plus el-icon--left"></i>添加用户</el-button>
       </el-col>
      </el-row> 
  <el-table
    :data="tableData"
    border
    :default-sort = "{prop: 'addtime', order: 'descending'}"
    style="width: 100%;margin-top:20px;margin-left:20px;">
    <el-table-column
      label="姓名"
      width="180">
      <template scope="scope">
       <span style="margin-left: 10px">{{ scope.row.nickname }}</span>
      </template>
    </el-table-column>

    <el-table-column
      label="角色"
      width="180">
      <template scope="scope">
       <span style="margin-left: 10px">{{ scope.row.role==1?'主管':scope.row.role==2?'产品编辑':'产品开发' }}</span>
      </template>
    </el-table-column>

    <el-table-column
      label="添加日期"
      width="180">
      <template scope="scope"> 
        <span style="margin-left: 10px">{{ scope.row.addtime }}</span>
      </template>
    </el-table-column>

    <el-table-column label="操作">
      <template scope="scope">  
        <el-button
          size="small"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table> 
              <el-dialog
                :title="dialogTitle"
                :visible.sync="dialogFormVisible" 
                :modal-append-to-body="false"
                width="30%"
                center> 
                  <el-form :model="form"  ref="formUser">
                      <el-row :gutter="20">
                          <el-col :span="12" > 
                          <el-form-item label="用户名称" prop="nickname" :label-width="formLabelWidth">
                            <el-input v-model="form.nickname"  placeholder="请输入用户名称" auto-complete="off"></el-input>
                          </el-form-item> 
                          </el-col> 
                      </el-row>
                      <el-row :gutter="20">
                          <el-col :span="12" > 
                          <el-form-item label="用户帐号" prop="account" :label-width="formLabelWidth">
                            <el-input v-model="form.account"  placeholder="请输入用户帐号" auto-complete="off"></el-input>
                          </el-form-item> 
                          </el-col> 
                      </el-row>
                      <el-row :gutter="20"> 
                          <el-col :span="12" >
                          <el-form-item label="用户角色" prop="role" :label-width="formLabelWidth">
                               <el-select  v-model="form.role"   placeholder="请选择">
                                    <el-option 
                                  v-for="item in roledata"
                                  :key="item.id"
                                  :label="item.name"
                                  :value="item.id">
                                </el-option>
                                  </el-select >
                          </el-form-item> 
                          </el-col>
                      </el-row>
                       <el-row :gutter="20">
                          <el-col :span="12" > 
                          <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
                            <el-input v-model="form.password"  placeholder="请输入密码" auto-complete="off"></el-input>
                          </el-form-item> 
                          </el-col> 
                      </el-row>  
                  </el-form>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogFormVisible = false">取 消</el-button>
                  <el-button type="primary" @click="submitForm('formUser')">确 定</el-button>
                </span>
              </el-dialog> 

  </el-container >
</template>

<script>
import { Table, TableColumn, Icon, Popover, Tag, Button } from "element-ui";
import UserApi from "../../api/user";
export default {
  components: {
    ElTable: Table,
    ElTableColumn: TableColumn,
    ElIcon: Icon,
    ElPopover: Popover,
    ElTag: Tag,
    ElButton: Button
  },
  data() {
    return {
      formLabelWidth: "100px",
      dialogFormVisible: false,
      form: {
        nickname: "",
        password: "",
        role: "",
        account: ""
      },
      rulesUser: {
        nickname: [
          { required: true, message: "请输入用户名称", trigger: "blur" }
        ], 
        role: [
          { required: true, message: "请输选择用户角色", trigger: "change" }
        ],
        account: [
          { required: true, message: "请选择用户帐号", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      roledata: [
        { id: 1, name: "主管" },
        { id: 2, name: "产品编辑" },
        { id: 3, name: "产品开发" }
      ],
      tableData: [],
      showUserManagement:false
    };
  },
  mounted() {
    const that = this;
    that.showUserManagement = that.$sto.get(that.$conf.constant.cookie).userName=='lvxiao';
    that.getUserList();
  },
  methods: {
    submitForm(name) {
      const that = this; 
       this.editPicId = "";
      //   this.form = {
      //     nickname: "",
      //     password: "",
      //     role: "",
      //     account: ""
      //   };
      // if( that.form.role&&that.form.password&&that.form.account&&that.nickname){

      // }
       that.addUser(); 
      // that.$refs[name].validate(valid => {
      //   if (valid) { 
          
      //   }
      // });
    },
    showDailog(action) {
      if ("add" == action) {
        this.dialogTitle = "新增用户";
        this.form.id = "";
        this.form.name = "";
        this.imageUrl = "";
        this.editPicId = "";
        this.form = {
          nickname: "",
          password: "",
          role: "",
          account: ""
        };
      } else {
        this.dialogTitle = "编辑用户";
      }
      this.dialogFormVisible = true;
    },
    async getUserList() {
      const that = this;
      const params = {};
      const res = await UserApi.getUserList(params);
      if (res.code == 0) {
        that.tableData = res.result;
      } else {
        that.$message.error("网络异常");
      }
    },
    async addUser() {
      const that = this;
      const params = that.form;
      const res = await UserApi.addUser(params);
      if (res.code == 0) {
        if (res.result == "-1") {
          that.$message.error("用户已存在！");
        } else if (res.result) {
          that.$message.success("新增成功！");
          that.getUserList();
        } else {
          that.$message.error("操作失败");
        }
      } else {
        that.$message.error("网络异常");
      }
      this.dialogFormVisible = false;
    },
    async delUser(id) {
      const that = this;
      const params = { id: id };
      const res = await UserApi.delUser(params);
      if (res.code == 0) {
        if (res.result) {
          that.$message.success("删除成功");
          that.getUserList();
        } else {
          that.$message.error("删除失败");
        }
      } else {
        that.$message.error("网络异常");
      }
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delUser(row.id);
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped>
</style>
