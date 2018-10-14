<template>  
  <el-container >
      <el-row :gutter="20" class="myleft">
        <el-col :span="24" > 
            <span>搜索条件</span>  
            <el-select class="myleft" v-model="search" @change="selectChange" placeholder="请选择">
            <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
          </el-select > 
            <el-input class="myleft" v-model="searchContent" style="width:200px;" :placeholder="'code'==search?'请输入商品编码':'请输入商品名称'" auto-complete="off"></el-input>
             <el-button type="primary"  @click="searchGoods" class="myleft" circle><i class="el-icon-search el-icon--left"></i>搜索</el-button>
             <el-button type="primary"  @click="resetSearch" class="myleft" circle><i class="el-icon-setting el-icon--left"></i>重置</el-button>
             <el-button type="primary"  @click ="delWaring" class="myleft" style="float:right;"  circle><i class="el-icon-delete el-icon--left"></i>删除商品</el-button> 
             <el-button type="primary" @click="handleEdit({id:'add'})" class="myleft" style="float:right;" circle><i class="el-icon-plus el-icon--left"></i>添加商品</el-button>
        </el-col>
      </el-row> 
   <el-table  height="800"
            class="mytalble"
            :data="tableData" 
            stripe 
            border
            :default-sort = "{prop: 'createtime2', order: 'descending'}"
            :row-class-name="tableRowClassName"
             @selection-change="handleSelectionChange"
            >   
         <el-table-column
              type="selection"
              width="55">
            </el-table-column>

      <el-table-column
        align="center"
        prop="idpic"
        label="商品图片"
        width="120"
        > 
       <template scope="scope">
         <div @click="handleEdit(scope.row)">
         <img  :src="baserUrl +'/img/query/imgId?id='+scope.row.idpic" alt="" style="width: 80px;height: 80px;padding:10px;">
        </div>
      </template> 
      </el-table-column>
      <el-table-column
        prop="name"
        align="center"
        label="商品名称"
        sortable
        width="200">  
      </el-table-column>
      <el-table-column
            align="center"
        prop="id"
        label="商品编码"
      width="120">
      </el-table-column> 
      <el-table-column
            align="center"
        prop="tagids"
        label="商品分类"
      width="120"> 
       <template scope="scope">
        <span>{{getTagName(scope.row.tagids)}}</span>
      </template> 
      </el-table-column> 
      <el-table-column
            align="center"
        prop="cost"
        label="价格(RMB)"
      width="120">
      </el-table-column> 

      <el-table-column
            align="center"
        prop="weight"
        label="重量（KG）"
      width="120">
      </el-table-column> 
      <el-table-column
            align="center"
        prop="shop" 
        label="在售店铺"
      >
      </el-table-column>  
      <el-table-column
            align="center"
        prop="remarks" 
        label="备注"
      >
      </el-table-column>  
      <el-table-column
        prop="status"
        align="center"
        label="商品状态"
        sortable
        width="150"> 
       <template scope="scope"> 
            <span>{{getStatus(scope.row.status)}}</span>
      </template>  
      </el-table-column> 

      <el-table-column
            align="center"
        prop="createtime2"
        label="添加时间"
        sortable
      width="115"> 
      </el-table-column>   
    </el-table>  
 

</el-container>


</template> 
<script>
import bus from "../../assets/eventbus";
import { formatDate } from "../../assets/date";
// import GoodsApi from "../../api/goods";
import ImgApi from "../../api/img";
import Config from "../../config/index";
import fetch from "../../api/fetch/index";
import ImgUpload from "../../components/imgUpload.vue";
export default {
  name: "goodstable",
  components: {
    ImgUpload
  },
  created() {
    this.getGoodsList();
  },
  data() {
    return {
      search: "code",
      searchContent: "",
      showDetailsOperate: false,
      showSupplier: false,
      goodsDetailsData: null,
      imgDialogVisible: false,
      dialogImageUrl: "",
      baserUrl: Config.target,
      uploadImgUrl: Config.target + "/img/upload",
      imageUrl: "",
      // dialogVisible: false,
      dialogTitle: "新增商品",
      dialogFormVisible: false,
      multipleSelection: [],
      multipleSelection2: [],
      form: {
        id: "",
        name: "",
        ename: "",
        tagids: "",
        cost: "",
        weight: "",
        kind: "普货",
        supplier: "",
        remarks: "",
        description: "",
        idpics: "",
        idpic: "",
        status: "1"
      },
      editPicId: "",
      formLabelWidth: "100px",
      rulesTag: {
        name: [{ required: true, message: "请输入商品名称", trigger: "blur" }]
      },
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
      statusData: [
        {
          value: "1",
          label: "正常"
        },
        {
          value: "2",
          label: "停产"
        },
        {
          value: "3",
          label: "清货"
        },
        {
          value: "4",
          label: "待编辑"
        }
      ],
      tagsData: [],
      tableData: []
    };
  },
  mounted() {
    const that = this;
    bus.$on("tagsData", function(data) {
      that.tagsData = [];
      for (let i = 0; i < data.length; i++) {
        that.$set(that.tagsData, i, data[i]);
      }
    });
    let ticket = that.$sto.get(that.$conf.constant.cookie).ticket;
    const base64 = require("base-64");
    const utf8 = require("utf8");
    that.showDetailsOperate =
      utf8.decode(base64.decode(ticket)) != "产品开发" ? true : false;
    that.showSupplier =
      utf8.decode(base64.decode(ticket)) != "产品编辑" ? true : false;
  },
  methods: {
     tableRowClassName( row, rowIndex ) { 
        if (rowIndex % 2 == 0) {
          return 'warning-row';
        }  
        return '';
      } ,
    selectChange() {
      if (this.searchContent.length > 0) {
        this.searchGoods();
      }
    },handleEdit(data){ 
      this.$router.push({ path: "/goodsedit",query:{goodsId:data.id} });
    },
    async searchGoods() {
      const that = this;
      let params = {
        type: that.search,
        name: that.searchContent,
        ticket: that.$sto.get(that.$conf.constant.cookie).ticket
      };
      const res = await fetch("POST", "/goods/query/list", params);
      if (res.code == 0) {
        that.tableData = res.result;
      } else {
        that.$message.error("网络异常");
      }
    },
    resetSearch() {
      this.searchContent = "";
      this.getGoodsList();
    },
    getTagName(tagids) {
      let tagName = "";
      let tagidsArr = tagids.split(",");
      if (0 >= tagidsArr.length) {
        return tagName;
      }
      for (let i = 0; i < this.tagsData.length; i++) {
        let tag = this.tagsData[i];
        for (let k = 0; k < tagidsArr.length; k++) {
          if (tag.id == tagidsArr[k]) {
            tagName += "," + tag.name;
          }
        }
      }
      tagName = tagName.substring(1, tagName.length);
      return tagName;
    },
    getStatus(status) {
      switch (status) {
        case 1:
          return "正常";
          break;
        case 2:
          return "停产";
          break;
        case 3:
          return "清货";
          break;
        case 4:
          return "待编辑";
          break;
        default:
          break;
      }
    },
    handlePicturePreview(url) {
      this.dialogImageUrl = url;
      this.imgDialogVisible = true;
    }, 
    handleSelectionChange(val) {
      this.multipleSelection = [];
      this.multipleSelection2 = [];
      for (let i = 0; i < val.length; i++) {
        this.multipleSelection.push(val[i].id);
        this.multipleSelection2.push(val[i].idpics);
      }
    }, 
    async getImg(id) {
      const that = this;
      const params = { id: id };
      const res = await fetch("POST", "/img/query/imgId", params);
      if (res.code == 0) {
        let img64 = res.result.img;
        return "data:image/png;base64," + img64;
      } else {
        that.$message.error("网络异常");
      }
      return "";
    },
    async getGoodsList(tag) {
      const that = this;
      const params = {};
      if (tag) {
        params["tagids"] = tag;
      }
      params["ticket"] = that.$sto.get(that.$conf.constant.cookie).ticket;
      const res = await fetch("POST", "/goods/query/list", params);
      if (res.code == 0) {
        that.tableData = res.result;
      } else {
        that.$message.error("网络异常");
      }
    }, 
    delWaring() {
      if (this.multipleSelection.length == 0) {
        this.$message.info("请勾选欲删除的商品！");
        return;
      }
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delGoods();
        })
        .catch(() => {});
    },
    async delGoods() {
      const that = this;
      const params = {
        goodsIds: that.multipleSelection.join(","),
        picIds: that.multipleSelection2.join(",")
      };
      const res = await fetch("POST", "/goods/del", params);
      if (res.code == 0) {
        if (res.result) {
          that.$message.success("删除成功");
          that.getGoodsList();
        } else {
          that.$message.error("删除失败");
        }
      } else {
        that.$message.error("网络异常");
      }
    } 
  }
};
</script>
<style    lang="less">  
 .el-table .warning-row {
    background: #deedf8;
  }

  .el-table .success-row {
    background: #3f16d3;
  }
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.mytalble {
  margin-top: 10px; 
.el-button--text{ white-space: pre-wrap;}
}
.myleft {
  margin-left: 10px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
