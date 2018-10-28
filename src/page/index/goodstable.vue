<template>  
  <el-container >
      <el-row :gutter="20" class="myleft">
       
         <el-row :gutter="20">
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
            <el-input class="myleft"  v-if="search!='status'"  @keyup.enter.native="keyupSearch" suffix-icon="el-icon-search" v-model="searchContent" style="width:200px;" :placeholder="'code'==search?'请输入商品编码':'请输入商品名称'" auto-complete="off"></el-input>
               <el-select v-else class="myleft"  v-model="searchStatus"   placeholder="请选择" @change="searchGoods">
                         <el-option 
                                  v-for="item in statusData"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                          </el-option>
               </el-select > 
             <el-button type="primary"  @click="searchGoods" class="myleft" circle><i class="el-icon-search el-icon--left"></i>搜索</el-button>
             <el-button type="primary"  @click="resetSearch" class="myleft" circle><i class="el-icon-setting el-icon--left"></i>重置</el-button>
             <el-button type="primary"  @click ="delWaring" class="myleft" style="float:right;"  circle><i class="el-icon-delete el-icon--left"></i>删除商品</el-button> 
             <el-button type="primary" @click="handleEdit({id:'add'})" class="myleft" style="float:right;" circle><i class="el-icon-plus el-icon--left"></i>添加商品</el-button>
        </el-col>
         </el-row>
         <el-row :gutter="20">
           <el-col :span="4">
             <div class="demo-color-box bg-danger" @click="searchGoodsByStatus('6')" > 
                 爆款 : {{statusCount.dangerNum}}
             </div>
           </el-col>
           <el-col :span="4">
              <div class="demo-color-box bg-success"  @click="searchGoodsByStatus('5')"> 
                新品 : {{statusCount.successNum}}
             </div>
           </el-col>
           <el-col :span="4">
              <div class="demo-color-box bg-blue"  @click="searchGoodsByStatus('1')"> 
                正常 : {{statusCount.blueNum}}
             </div>
           </el-col> 
          <el-col :span="4">
             <div class="demo-color-box bg-warning" @click="searchGoodsByStatus('4')" > 
                 待编辑 : {{statusCount.warningNum}}
             </div>
           </el-col>
           <el-col :span="4">
              <div class="demo-color-box bg-info" @click="searchGoodsByStatus('3')" > 
                清货 : {{statusCount.blackNum}}
             </div>
           </el-col>
           <el-col :span="4">
              <div class="demo-color-box bg-black" @click="searchGoodsByStatus('2')" > 
                停产 : {{statusCount.infoNum}}
             </div>
           </el-col>
         </el-row>
      </el-row> 
   <el-table  height="800"
            class="mytalble"
            :data="tableData" 
            stripe 
            border
            :default-sort = "{prop: 'createtime2', order: 'descending'}"
            :row-class-name="tableRowClassName"
             @selection-change="handleSelectionChange"
            v-loading="loading1"
            element-loading-text="拼命加载中..."
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)" 
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
         <img  :src="baserUrl +'/img/query/imgId?id='+scope.row.idpic" alt="点击编辑" style="width: 40px;height: 40px;padding:2px;">
        </div>
      </template> 
      </el-table-column>
      <el-table-column
        prop="name"
        align="center"
        label="商品名称"
        sortable
        width="450">  
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
        width="200"
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
    <el-row :gutter="20" style="margin-bottom:10px;margin-top:10px;">   
     <el-col :span="12" :offset="8" >  
       <el-pagination 
      @current-change="handleCurrentChange"
      :current-page="pageNo" 
      :page-size="pageSize"
      layout="total,prev,pager, next"
      :total="total">
    </el-pagination></el-col > 
      </el-row> 

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
    this.getGoodsStatus();
  },
  data() {
    return {
      pageNo: 1,
      pageSize: 15,
      total: 0,
      search: "code",
      searchContent: "",
      searchStatus: "1",
      loading1: false,
      baserUrl: Config.target,
      uploadImgUrl: Config.target + "/img/upload",
      imageUrl: "",
      multipleSelection: [],
      multipleSelection2: [],
      options: [
        {
          value: "code",
          label: "商品编码"
        },
        {
          value: "name",
          label: "商品名称"
        },
        {
          value: "status",
          label: "商品状态"
        }
      ],
      statusCount: {
        blueNum: 0,
        dangerNum: 0,
        successNum: 0,
        warningNum: 0,
        infoNum: 0,
        blackNum: 0
      },
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
        },
        {
          value: "5",
          label: "新品"
        },
        {
          value: "6",
          label: "爆款"
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
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getGoodsList();
    },
    tableRowClassName(row, rowIndex) {
      if (rowIndex % 2 == 0) {
        return "warning-row";
      }
      return "";
    },
    keyupSearch() {
      if (this.searchContent != "") {
        //回车事件
        this.searchGoods();
      } else {
        this.$message.console.warn("请输入搜索内容");
      }
    },
    selectChange() {
      // if (this.searchContent.length > 0) {
      //   this.searchGoods();
      // }
      this.searchContent = "";
      if ("status" == this.search) {
        this.searchStatus = "1";
      }
      this.searchGoods();
    },
    handleEdit(data) {
      this.$router.push({ path: "/goodsedit", query: { goodsId: data.id } });
    },
    async searchGoods() {
      const that = this;
      let params = {
        pageNo: 1,
        pageSize: that.pageSize,
        ticket: that.$sto.get(that.$conf.constant.cookie).ticket
      };
      if ("status" == that.search) {
        params["type"] = that.search;
        params["status"] = parseInt(that.searchStatus);
      } else if (that.searchContent != "") {
        params["type"] = that.search;
        params["name"] = that.searchContent;
      } else {
        this.$message.console.warn("请输入搜索内容");
      }
      const res = await fetch("POST", "/goods/query/list", params);
      if (res.code == 0) {
        that.tableData = res.result.list;
        that.total = res.result.total;
      } else {
        that.$message.error("网络异常");
      }
    },searchGoodsByStatus(searchStatus){
      this.search = 'status';
      this.searchStatus =searchStatus;
      this.searchGoods();
    },
    resetSearch() {
      this.searchContent = "";
      this.searchStatus = "1";
      this.search = "code";
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
        case 5:
          return "新品";
          break;
        case 6:
          return "爆款";
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
      const params = {
        pageNo: that.pageNo,
        pageSize: that.pageSize
      };
      if (tag) {
        params["tagids"] = tag;
      }
      if ("status" == that.search) {
        params["type"] = that.search;
        params["status"] = parseInt(that.searchStatus);
      } else if (that.searchContent != "") {
        params["type"] = that.search;
        params["name"] = that.searchContent;
      }
      params["ticket"] = that.$sto.get(that.$conf.constant.cookie).ticket;
      that.loading1 = true;
      const res = await fetch("POST", "/goods/query/list", params);
      that.loading1 = false;
      if (res.code == 0) {
        that.tableData = res.result.list;
        that.total = res.result.total;
      } else {
        that.$message.error("网络异常");
      }
    },
    async getGoodsStatus() {
      const res = await fetch("GET", "/goods/query/status", {});
      if (res.code == 0) {
        const list = res.result;
        this.statusCount = {
          blueNum: 0,
          dangerNum: 0,
          successNum: 0,
          warningNum: 0,
          infoNum: 0,
          blackNum: 0
        };
        if (list != null) {
          for (var i = 0; i < list.length; i++) {
            const map = list[i];
            switch (map.status) {
              case 1:
                this.statusCount.blueNum = map.num;
                break;
              case 2:
                this.statusCount.infoNum = map.num;
                break;
              case 3:
                this.statusCount.blackNum = map.num;
                break;
              case 4:
                this.statusCount.warningNum = map.num;
                break;
              case 5:
                this.statusCount.successNum = map.num;
                break;
              case 6:
                this.statusCount.dangerNum = map.num;
                break;
            }
          }
        }
      } else {
        this.statusCount = {
          blueNum: 0,
          dangerNum: 0,
          successNum: 0,
          warningNum: 0,
          infoNum: 0,
          blackNum: 0
        };
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
          that.getGoodsStatus();
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
  .el-button--text {
    white-space: pre-wrap;
  }
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

div {
  display: block;
}
.bg-black {
  background-color: #303133;
}
.bg-blue {
  background-color: #409eff;
}
.bg-success {
  background-color: #67c23a;
}
.bg-warning {
  background-color: #e6a23c;
}
.bg-danger {
  background-color: #f56c6c;
}
.bg-info {
  background-color: #909399;
}
.demo-color-box {
  border-radius: 4px;
  padding: 10px;
  margin: 5px 0;
  height: 40px;
  box-sizing: border-box;
  color: #fff;
  font-size: 14px;
}
</style>
