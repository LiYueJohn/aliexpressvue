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
             <el-button type="primary" @click="showDailog('add')" class="myleft" style="float:right;" circle><i class="el-icon-plus el-icon--left"></i>添加商品</el-button>
      
        </el-col>
      </el-row> 
   <el-table  height="700"
            class="mytalble"
            :data="tableData" 
            stripe
            :default-sort = "{prop: 'createtime2', order: 'descending'}"
             @selection-change="handleSelectionChange"
            >   
         <el-table-column
              type="selection"
              width="55">
            </el-table-column>
      <el-table-column
        prop="status"
        align="center"
        label="商品状态"
        sortable
        width="200"> 
       <template scope="scope"> 
            <span>{{getStatus(scope.row.status)}}</span>
      </template> 

      </el-table-column>

      <el-table-column
        prop="name"
        align="center"
        label="商品名称"
        sortable
        width="200"> 
       <template scope="scope"> 
        <el-button @click="handleEdit(scope.row)" type="text" size="small">{{scope.row.name}}</el-button>
      </template> 

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
        prop="idpic"
        label="商品图片"
        width="120"
        > 
       <template scope="scope">
         <div @click="handlePicturePreview(baserUrl +'/img/query/imgId?id='+scope.row.idpic)">
         <img  :src="baserUrl +'/img/query/imgId?id='+scope.row.idpic" alt="" style="width: 80px;height: 80px;padding:10px;">
        </div>
      </template> 
      </el-table-column>
      <el-table-column
            align="center"
        prop="cost"
        label="价格"
      width="120">
      </el-table-column> 

      <el-table-column
            align="center"
        prop="weight"
        label="重量"
      width="120">
      </el-table-column> 

      <el-table-column
            align="center"
        prop="createtime2"
        label="添加时间"
        sortable
      width="115"> 
      </el-table-column>  
      <el-table-column
            align="center"
        prop="remarks" 
        label="备注"
      >
      </el-table-column>    
    </el-table>  

          <el-dialog 
          :visible.sync="imgDialogVisible"  
          :modal-append-to-body="false"
          width="30%"
          center >
          <center>
          <img style="height:500px;width:500px;"  :src="dialogImageUrl" alt=""> 
          </center>
        </el-dialog>

              <el-dialog
                :title="dialogTitle"
                :visible.sync="dialogFormVisible" 
                :modal-append-to-body="false"
                width="10%"
                center> 
                  <el-form :model="form" :rules="rulesTag" ref="formGoods" style="height: 500px;overflow-y:scroll;padding-left:10px;padding-right:10px;">
                      <el-row :gutter="20">  
                          <el-col :span="12" > 
                                <el-col :span="24" > 
                                <el-form-item label="商品名称" prop="name" :label-width="formLabelWidth">
                                  <el-input v-model="form.name" auto-complete="off"></el-input>
                                </el-form-item> 
                                </el-col>
                                <el-col :span="24" > 
                                <el-form-item label="商品英文名称" prop="ename" :label-width="formLabelWidth">
                                  <el-input v-model="form.ename" auto-complete="off"></el-input>
                                </el-form-item> 
                                </el-col>  
                          </el-col>   

                          <el-col :span="12" > 
                          <el-form-item label="商品主图"   :label-width="formLabelWidth">  
                                  <el-upload
                                  class="avatar-uploader"
                                  :action="uploadImgUrl"
                                  :show-file-list="false"
                                  :on-success="handleAvatarSuccess"
                                  :before-upload="beforeAvatarUpload"> 
                                    <img  v-if="editPicId&&editPicId.length>0&&imageUrl.length<=0" :src="baserUrl +'/img/query/imgId?id='+editPicId" class="avatar"> 
                                    <img  v-else-if="imageUrl"  :src="imageUrl" class="avatar">   
                                    <i  v-else class="el-icon-plus avatar-uploader-icon"></i> 
                                </el-upload> 
                          </el-form-item> 
                          </el-col> 
                      
                      </el-row>
                       <el-row :gutter="20">
                          <el-col :span="12" > 
                          <el-form-item label="商品分类" prop="tagids" :label-width="formLabelWidth">
                               <el-select  v-model="form.tagids" multiple placeholder="请选择">
                                    <el-option 
                                  v-for="item in tagsData"
                                  :key="item.id"
                                  :label="item.name"
                                  :value="item.id">
                                </el-option>
                                  </el-select >
                          </el-form-item> 
                          </el-col>
                          <el-col :span="12" > 
                          <el-form-item label="成本价(CNY)" prop="cost" :label-width="formLabelWidth">
                            <el-input v-model="form.cost" auto-complete="off"></el-input>
                          </el-form-item> 
                          </el-col>
                      </el-row>
                       <el-row :gutter="20">
                          <el-col :span="12" > 
                          <el-form-item label="重量(KG)" prop="weight" :label-width="formLabelWidth">
                                <el-input v-model="form.weight" auto-complete="off"></el-input>
                          </el-form-item> 
                          </el-col>
                          <el-col :span="12" > 
                          <el-form-item label="商品状态" prop="status" :label-width="formLabelWidth">  
                            <el-select  v-model="form.status"   placeholder="请选择">
                                    <el-option 
                                  v-for="item in statusData"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                                  </el-select >
                          </el-form-item> 
                          </el-col>
                      </el-row>  
                       <el-row :gutter="20">
                          <el-col :span="20" >  
                          <el-form-item label="类型" prop="kind" :label-width="formLabelWidth">  
                            <el-radio-group v-model="form.kind" size="small">
                               <el-radio   label="普货"></el-radio>
                              <el-radio   label="含电"></el-radio>
                              <el-radio   label="液体"></el-radio>
                              <el-radio   label="粉末"></el-radio>
                              <el-radio  label="纯电"></el-radio>   
                            </el-radio-group> 
                          </el-form-item> 
                          </el-col>
                      </el-row> 
                       <el-row :gutter="20" >
                          <el-col :span="12" v-if="showSupplier" > 
                          <el-form-item label="供应商信息" prop="supplier" :label-width="formLabelWidth">
                               <el-input type="textarea" v-model="form.supplier" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
                          </el-form-item> 
                          </el-col> 
                          <el-col :span="12" > 
                          <el-form-item label="备注" prop="remarks" :label-width="formLabelWidth">
                               <el-input type="textarea" v-model="form.remarks" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
                          </el-form-item> 
                          </el-col> 
                      </el-row> 
                       <el-row :gutter="20" v-if="showDetailsOperate">
                          <el-col :span="24" > 
                          <el-form-item label="产品描述" prop="description" :label-width="formLabelWidth">
                               <el-input type="textarea" v-model="form.description" :autosize="{ minRows: 8, maxRows: 10}" ></el-input>
                          </el-form-item> 
                          </el-col> 
                      </el-row>  
                       <el-row :gutter="20">
                          <el-col :span="24" >    
                             <el-form-item label="商品图片" prop="idpic" :label-width="formLabelWidth">   <el-row>
                           <el-col :span="4" >  
                              <el-button type="primary" @click="download">下载图片</el-button>  
                          </el-col> 
                         </el-row>
                          <el-row style="margin-top:20px;"> 
                                <ImgUpload ref="ImgUpload"  :picids="form.idpics" >  
                                </ImgUpload>  
                         </el-row> 
                             </el-form-item> 
                          </el-col> 
                      </el-row>
                  </el-form>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogNotVisible">取 消</el-button>
                  <el-button type="primary" @click="submitForm('formGoods')">确 定</el-button>
                </span>
              </el-dialog>   

</el-container>


</template> 
<script>
import bus from "../../assets/eventbus";
import { formatDate } from "../../assets/date";
import GoodsApi from "../../api/goods";
import ImgApi from "../../api/img";
import Config from "../../config/index";
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
      editPicId:"",
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
      statusData:[ 
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
    selectChange() {
      if (this.searchContent.length > 0) {
        this.searchGoods();
      }
    },
    async searchGoods() {
      const that = this;
      let params = {
        type: that.search,
        name: that.searchContent,
        ticket: that.$sto.get(that.$conf.constant.cookie).ticket
      };
      const res = await GoodsApi.getGoodsList(params);
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
    getStatus(status){
     switch (status) {
       case 1:
         return "正常"
         break;
       case 2:
         return "停产"
         break;
       case 3:
         return "清货"
         break;
       case 4:
         return "待编辑"
         break; 
       default:
         break;
     }
    },
    handlePicturePreview(url) {
      this.dialogImageUrl = url;
      this.imgDialogVisible = true;
    },
    showDailog(action) {
      if ("add" == action) {
        this.dialogTitle = "新增商品";
        this.form.id = "";
        this.form.name = "";
        this.imageUrl = "";
        this.editPicId = ""; 
        this.form = {
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
          status: '1'//默认正常
        };
      } else {
        this.dialogTitle = "编辑商品";
      }
      this.dialogFormVisible = true;
      this.$refs.ImgUpload.setImgList(this.form.idpics);
    },
    handleSelectionChange(val) {
      this.multipleSelection = [];
      this.multipleSelection2 = [];
      for (let i = 0; i < val.length; i++) {
        this.multipleSelection.push(val[i].id);
        this.multipleSelection2.push(val[i].idpics);
      }
    },
    handleClick(row) {
      console.log(row);
    },
    handleAvatarSuccess(res, file) {
      if (res.code == 0 && res.result.length > 0) {
        this.form.idpic = res.result;
        this.imageUrl = window.URL.createObjectURL(file.raw);
      } else {
        this.$message.error("上传图片失败，请重新上传!");
      }
    },
    beforeAvatarUpload(file) {
      let type = file.type;
      const isJPG = type.indexOf("image") >= 0 ? true : false;
      // const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("只能是上传图片文件!");
      }
      // if (!isLt2M) {
      //   this.$message.error('图片大小不能超过 2MB!');
      // }
      return isJPG;
    },
    submitForm(name) {
      const that = this;
      let imgList = that.$refs.ImgUpload.getImgList();
      that.$refs.ImgUpload.resetImgList();
      let formData = new FormData();
      let oldPicids = [];
      for (let i = 0; i < imgList.length; i++) {
        if (imgList[i].file.name != "") {
          formData.append("files", imgList[i].file);
        } else {
          oldPicids.push(imgList[i].file.picid);
        }
      }
      // console.log(formData);
      let url = Config.target + "/img/batch/upload";
      that.$refs[name].validate(valid => {
        if (valid) {
          // that.addGoods();
          that.myAxios(url, formData, oldPicids);
        }
      });
    },
    myAxios(url, formData, oldPicids) {
      this.$axios({
        method: "post",
        url: url,
        data: formData,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "multipart/form-data"
        }
      }).then(
        res => {
          let resData = res.data;
          if (resData.result != "false") {
            oldPicids.push(resData.result);
          }
          this.form.idpics = oldPicids.join(",");
          this.addGoods();
        },
        err => {
          this.$message.error("网络异常！");
        }
      );
    },
    async getImg(id) {
      const that = this;
      const params = { id: id };
      const res = await ImgApi.getImgById(params);
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
      const res = await GoodsApi.getGoodsList(params);
      if (res.code == 0) {
        that.tableData = res.result;
      } else {
        that.$message.error("网络异常");
      }
    },
    async addGoods() {
      const that = this;
      const params = that.form;
      params["ticket"] = that.$sto.get(that.$conf.constant.cookie).ticket;
      let tagidsArr = params.tagids;
      params.tagids = tagidsArr.join(",");
      const res = await GoodsApi.addGoods(params);
      if (res.code == 0) {
        if (res.result) {
          that.$message.success("操作成功");
          that.getGoodsList();
        } else {
          that.$message.error("操作失败");
        }
      } else {
        that.$message.error("网络异常");
      }
      this.dialogNotVisible();
    },
    dialogNotVisible() {
      this.$refs.ImgUpload.resetImgList();
      this.dialogFormVisible = false;
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
      const res = await GoodsApi.delGoods(params);
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
    },
    handleEdit(data) {
      let tagsData = data.tagids.split(",");
      for (let i = 0; i < tagsData.length; i++) {
        tagsData[i] = parseInt(tagsData[i]);
      }
      this.form = {
        id: data.id,
        name: data.name,
        ename: data.ename,
        tagids: tagsData,
        cost: data.cost,
        weight: data.weight,
        kind: data.kind,
        supplier: data.supplier,
        description: data.description,
        remarks: data.remarks,
        idpics: data.idpics,
        idpic: data.idpic,
        status: data.status+""
      };
      this.editPicId = data.idpic; 
      this.imageUrl ="";
      this.showDailog("edit");
    },
    async download() {
      let data = [];
      if (this.form.idpics.length > 0) {
        data.push(this.form.idpics);
      } else {
        that.$message.info("无图片可下载！");
        return;
      }
      this.downloadImg(data.join(","));
    }, // 下载文件
    downloadImg(data) {
      let url = this.baserUrl + "/img/download/imgIds?ids=" + data;
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      // link.setAttribute("download", "excel.zip");
      document.body.appendChild(link);
      link.click();
    }
  }
};
</script>
<style  >
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
