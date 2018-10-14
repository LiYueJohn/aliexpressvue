<template>  
  <el-container  class="mycontainer">    
       <el-row :gutter="20" > 
        <el-col :span="24">  
            <el-button type="primary"  @click="showDailog('add')" circle><i class="el-icon-plus el-icon--left"></i></el-button>  
            <el-button type="primary"  @click="delWaring()" class="myleft" circle><i class="el-icon-delete el-icon--left"></i></el-button>
            <el-button type="primary"  @click="editDialog()" class="myleft" circle><i class="el-icon-edit el-icon--left"></i></el-button>
        </el-col>
      </el-row> 
      
        <el-table
            class="mytable"
            :data="tableData"  
            :default-sort = "{prop: 'name', order: 'descending'}"
            @selection-change="handleSelectionChange"
             highlight-current-row
             @current-change="handleCurrentChange"
            > 
              <el-table-column
              type="selection"
              width="30">
            </el-table-column>
            <el-table-column
            prop="name"
            label="商品分类"
            align="center"
            sortable
            > 
            </el-table-column>  
        </el-table> 
        
              <el-dialog
                :title="dialogTitle"
                :visible.sync="dialogFormVisible" 
                :modal-append-to-body="false"
                width="20%"
                center> 
                  <el-form :model="form" :rules="rulesTag" ref="formTag">
                      <el-form-item label="分类名称" prop="name" :label-width="formLabelWidth">
                        <el-input v-model="form.name" auto-complete="off"></el-input>
                      </el-form-item> 
                  </el-form>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogFormVisible = false">取 消</el-button>
                  <el-button type="primary" @click="submitForm('formTag')">确 定</el-button>
                </span>
              </el-dialog>   
  </el-container> 
</template> 
<script>
import bus from "../../assets/eventbus";
import TagApi from "../../api/tag";

import fetch from '../../api/fetch/index';
export default {
  name: "goodsclassification",
  data() {
    return {
      dialogTitle: "新增分类",
      currentRow: "",
      multipleSelection: [],
      multipleSelectionMap: {
        id: "",
        name: ""
      },
      dialogFormVisible: false,
      options: [
        {
          value: "code",
          label: "商品编码"
        },
        {
          value: "name",
          label: "商品名称"
        }
      ],
      form: {
        id: "",
        name: ""
      },
      formLabelWidth: "120px",
      rulesTag: {
        name: [{ required: true, message: "请输入分类名称", trigger: "blur" }]
      },
      tableData: []
    };
  },
  methods: {
    showDailog(action) {
      if ("add" == action) {
        this.dialogTitle = "新增分类";
      } else {
        this.dialogTitle = "编辑分类";
      }
      this.dialogFormVisible = true;
      if ("add" == action) {
        this.dialogTitle = "新增分类";
        this.form.id = "";
        this.form.name = "";
      } else {
        this.dialogTitle = "编辑分类";
        this.form.id = this.multipleSelectionMap.id;
        this.form.name = this.multipleSelectionMap.name; 
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = [];
      this.multipleSelectionMap = {
        id: "",
        name: ""
      };
      if (val.length == 1) {
        this.multipleSelectionMap = {
          id: val[0].id,
          name: val[0].name
        };
      }
      for (let i = 0; i < val.length; i++) {
        this.multipleSelection.push(val[i].id);
      }
    },
    handleCurrentChange(val) {
      this.currentRow = val.id;
      //通知父组件  已改变
      this.$emit("tagChange", this.currentRow);
    },
    submitForm(name) {
      const that = this;
      that.$refs[name].validate(valid => {
        if (valid){
          if('新增分类'==this.dialogTitle){ 
            that.addTag(); // 验证通过 
          }else{
            that.dialogFormVisible = false;
            that.editTag();
          }
        }
      });
    },
    editDialog() {
      if (this.multipleSelection.length == 0) {
        this.$message.info("请选择勾选欲修改的分类！");
        return;
      }
      if (this.multipleSelection.length > 1) {
        this.$message.warning("只能修改单个分类！");
        return;
      }
      this.showDailog("edit");
    },
    async delTag() {
      const that = this;
      const params = { id: that.multipleSelection.join(",") };
      const res = await fetch('POST', '/tag/del', params);
      if (res.code == 0) {
        if (res.result) {
          that.$message.success("删除成功");
          that.getTagList();
        } else {
          that.$message.error("删除失败");
        }
      } else {
        that.$message.error("网络异常");
      }
    },
    delWaring() {
      if (this.multipleSelection.length == 0) {
        this.$message.info("请勾选欲删除的分类！");
        return;
      }
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delTag();
        })
        .catch(() => {});
    },
    async addTag() { 
      const that = this;
      const params = { name: that.form.name };
      const res = await fetch('POST', '/tag/add', params);
      if (res.code == 0) {
        if (res.result) {
          that.$message.success("添加成功");
          that.getTagList();
        } else {
          that.$message.error("添加失败");
        }
      } else {
        that.$message.error("网络异常");
      }
    },
    async editTag() {
      //
      const that = this;
      const params = that.form;
      const res = await fetch('POST', '/tag/edit', params);
      if (res.code == 0) {
        if (res.result) {
          that.$message.success("编辑成功");
          that.getTagList();
        } else {
          that.$message.error("编辑失败");
        }
      } else {
        that.$message.error("网络异常");
      }
    },
    async getTagList() {
      //
      const that = this;
      const params = {};
      const res = await fetch('POST', '/tag/query/list', params);
      console.log(res);
      if (res.code == 0) {
        that.tableData = res.result;
        bus.$emit('tagsData',that.tableData);
      } else {
        that.$message.error("网络异常");
      }
    },
    handleSelect(item) {
      console.log(item);
    }
  },
  mounted() {
    this.getTagList();
  }
};
</script>

<style scoped>
.mycontainer {
  width: 100%;
  min-height: 600px;
}
.inline-input {
  width: 100%;
}
.my-margin-top {
  margin-top: 10px;
}
.myleft {
  margin-left: 10px;
}
.myright {
  float: right;
}
.mytable {
  margin-top: 10px;
  width: 100%;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 100%;
  min-height: 400px;
}
</style>
