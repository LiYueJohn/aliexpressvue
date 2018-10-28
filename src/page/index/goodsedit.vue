<template    > 
    <el-row :gutter="20" 
     v-loading="loading2"
    :element-loading-text="loadingText"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
          >  
  <el-container>
    <el-button @click="goback" type="primary" size="small"  style="margin-left:40px;" >
         返回
          </el-button>
          <span style="margin-left:40px;" v-if="this.$route.query.goodsId!='add'">编辑商品----商品编码：&nbsp;&nbsp;&nbsp;{{this.$route.query.goodsId}}</span>
          <span style="margin-left:40px;background:" v-else>新增商品</span>
          <!-- <el-tabs v-model="activeName2" @tab-click="handleClick"> -->
            <!-- <el-tab-pane   :label="商品编辑&nbsp;&nbsp;&nbsp;{{this.$route.query.userId}}" name="first-ta">  -->
               <el-form :model="form" :rules="rulesTag" ref="formGoods" 
               style="height: 800px;padding:10px 20px 20px 10px"
                >
                      <el-row :gutter="20">  
                          <el-col :span="12" > 
                                <el-col :span="24" > 
                                <el-form-item label="商品名称" prop="name" :label-width="formLabelWidth">
                                  <el-input :disabled="seller" v-model="form.name" auto-complete="off"></el-input>
                                </el-form-item> 
                                </el-col>
                                <el-col :span="24" > 
                                <el-form-item label="商品英文名称" prop="ename" :label-width="formLabelWidth">
                                  <el-input :disabled="seller" v-model="form.ename" auto-complete="off"></el-input>
                                </el-form-item> 
                                </el-col>  
                          </el-col>   
                          <el-col :span="12" > 
                          <el-form-item label="商品主图"   :label-width="formLabelWidth">  
                                  <el-upload :disabled="seller"
                                  class="avatar-uploader"
                                  :action="uploadMainImgUrl"
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
                          <el-form-item label="重量(KG)" prop="weight" :label-width="formLabelWidth">
                                <el-input :disabled="seller" v-model="form.weight" auto-complete="off"></el-input>
                          </el-form-item> 
                          </el-col>
                          <el-col :span="12" > 
                          <el-form-item label="成本价(CNY)" prop="cost" :label-width="formLabelWidth">
                            <el-input :disabled="seller" v-model="form.cost" auto-complete="off"></el-input>
                          </el-form-item> 
                          </el-col>
                      </el-row>
                       <el-row :gutter="20">
                          <el-col :span="12" > 
                          <el-form-item label="报关中文" prop="declarezh" :label-width="formLabelWidth">
                                <el-input :disabled="seller" v-model="form.declarezh" auto-complete="off"></el-input>
                          </el-form-item> 
                          </el-col>
                          <el-col :span="12" > 
                          <el-form-item label="报关英文" prop="declareen" :label-width="formLabelWidth">
                            <el-input :disabled="seller" v-model="form.declareen" auto-complete="off"></el-input>
                          </el-form-item> 
                          </el-col>
                      </el-row>
                       <el-row :gutter="20">
                          <el-col :span="12" > 
                          <el-form-item label="商品分类" prop="tagids" :label-width="formLabelWidth">
                               <el-select :disabled="seller" v-model="form.tagids" multiple placeholder="请选择">
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
                          <el-form-item label="商品状态" prop="status" :label-width="formLabelWidth">  
                            <el-select :disabled="seller" v-model="form.status"   placeholder="请选择">
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
                            <el-radio-group  :disabled="seller" v-model="form.kind" size="small">
                               <el-radio   label="普货"></el-radio>
                              <el-radio   label="含电"></el-radio>
                              <el-radio   label="液体"></el-radio>
                              <el-radio   label="刀具"></el-radio>
                              <el-radio  label="磁性"></el-radio>   
                            </el-radio-group> 
                          </el-form-item> 
                          </el-col>
                      </el-row> 
                      <el-row :gutter="20">
                        <el-col :span="24" >
                            <el-form-item label="多商品操作"   :label-width="formLabelWidth"> 
                               <el-button type="primary" @click="addSonProduct">新增子商品</el-button>
                           </el-form-item> 
                         <el-form-item
                            v-for="(val, index) in multiproduct"
                            :label="'子商品' + (index+1)"
                            :key="'s'+index"
                            :label-width="formLabelWidth"
                          >
                          <el-form >
                             <el-row :gutter="20">
                              <el-col :span="7" >
                                <el-form-item label="名称" label-width="40px"  >  
                                  <el-input v-model="val.name" placeholder="名称"></el-input>
                                </el-form-item>  
                              </el-col>  
                              <el-col :span="7" > 
                                <el-form-item label="价格"  label-width="40px"  >  
                                  <el-input v-model="val.price"  placeholder="价格（CNY）" ></el-input>
                                </el-form-item> 
                              </el-col>
                              <el-col :span="7" > 
                                <el-form-item label="重量"  label-width="40px"  >  
                                  <el-input v-model="val.weight"  placeholder="重量（KG）" ></el-input>
                                </el-form-item> 
                              </el-col> 
                                <el-col :span="2" > 
                                <el-form-item   >  
                                    <el-button type="primary" @click.prevent="removeSonProduct(val)">删除</el-button> 
                                </el-form-item> 
                              </el-col>
                              </el-row>
                          </el-form>
                            
                           
                          </el-form-item>
                        </el-col>
                      </el-row>
                       <el-row :gutter="20" >
                          <el-col :span="12" v-if="showSupplier" > 
                          <el-form-item label="在售店铺" prop="shop" :label-width="formLabelWidth">
                               <el-input :disabled="seller" type="textarea" v-model="form.shop" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
                          </el-form-item> 
                          </el-col> 
                          <el-col :span="12" > 
                          <el-form-item label="备注" prop="remarks" :label-width="formLabelWidth">
                               <el-input :disabled="seller" type="textarea" v-model="form.remarks" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
                          </el-form-item> 
                          </el-col> 
                      </el-row> 
                       <el-row :gutter="20" >
                          <el-col :span="12" v-if="showSupplier" > 
                          <el-form-item label="供应商信息" prop="supplier" :label-width="formLabelWidth">
                               <el-input :disabled="seller" type="textarea" v-model="form.supplier" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
                          </el-form-item> 
                          </el-col>
                          <el-col :span= "12" >  
                          </el-col> 
                      </el-row> 
                       <el-row :gutter="20" v-if="showDetailsOperate">
                          <el-col :span="24" > 
                          <el-form-item label="产品描述" prop="description" :label-width="formLabelWidth">
                               <el-input :disabled="seller" type="textarea" v-model="form.description" :autosize="{ minRows: 8, maxRows: 10}" ></el-input>
                          </el-form-item> 
                          </el-col> 
                      </el-row>  
                       <el-row :gutter="20" v-if="showDetailsOperate">
                          <el-col :span="24" >    
                             <el-form-item label="商品图片" prop="idpic" :label-width="formLabelWidth">   <el-row>
                           <el-col :span="4" >  
                              <el-button type="primary" @click="download">下载图片</el-button>  
                          </el-col> 
                         </el-row>
                          <el-row style="margin-top:20px;"> 
                                <ImgUpload :disabled="seller" ref="ImgUpload"  :picids="form.idpics" >  
                                </ImgUpload>  
                         </el-row> 
                             </el-form-item> 
                          </el-col> 
                      </el-row>
                      <el-row :gutter="20" style="margin-bottom:40px">   
                        <el-col :span="12" :offset="12" >  
                          <el-button @click="goback">返 回</el-button>
                          <el-button :disabled="seller" type="primary" @click="submitForm('formGoods')">提 交</el-button>
                        </el-col > 
                      </el-row>
                  </el-form>
            <!-- </el-tab-pane> -->
            <!-- <el-tab-pane   label="商品详情" name="second-ta"></el-tab-pane> -->
          <!-- </el-tabs>   --> 
  </el-container >
   </el-row>
</template>

<script>
import fetch from "../../api/fetch/index";
import Config from "../../config/index";
import ImgUpload from "../../components/imgUpload.vue";
export default {
  naem: "goodsedit",
  components: {
    ImgUpload
  },
  mounted() {
    // console.log(this.$route.query.goodsId);
    const that = this;
    let ticket = that.$sto.get(that.$conf.constant.cookie).ticket;
    const base64 = require("base-64");
    const utf8 = require("utf8");
    const rolename = utf8.decode(base64.decode(ticket));
    if (rolename == "仓库管理员") {
      rolename = "产品开发";
    } else if (rolename == "销售员") {
      rolename = "产品编辑";
      that.seller = true;
    }
    that.showDetailsOperate = rolename != "产品开发" ? true : false;
    that.showSupplier = rolename != "产品编辑" ? true : false;
    if (utf8.decode(base64.decode(ticket)) == "仓库管理员") {
      that.showSupplier = false;
    }
    that.getTagList();
    if (this.$route.query.goodsId != "add") {
      that.getGoods(this.$route.query.goodsId);
    }
  },
  data() {
    return {
      seller: false,
      loading2: false,
      loadingText: "",
      baserUrl: Config.target,
      uploadImgUrl: Config.target + "/img/upload",
      uploadMainImgUrl: Config.target + "/img/upload/main",
      imageUrl: "",
      showDetailsOperate: false,
      showSupplier: false,
      formLabelWidth: "100px",
      multiproduct:[],
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
        shop: "",
        declareen: "",
        declarezh: "",
        idpics: "",
        idpic: "", 
        multiproduct: [],
        status: "1"
      },
      editPicId: "",
      rulesTag: {
        name: [{ required: true, message: "请输入商品名称", trigger: "blur" }]
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
      tagsData: []
    };
  },
  methods: {
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
    goback() {
      this.$router.push({ path: "/index" });
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
    async getGoods(goodsId) {
      this.loadingText = "拼命加载中...";
      this.loading2 = true;
      const that = this;
      const params = { id: parseInt(goodsId) };
      const res = await fetch("POST", "/goods/query/id", params);
      this.loading2 = false;
      if (res.code == 0) {
        that.imageUrl = "";
        that.form = res.result;
        that.multiproduct = JSON.parse(that.form.multiproduct);
        that.editPicId = res.result.idpic;
        that.form.status = res.result.status + "";
        let tagsData = res.result.tagids.split(",");

        for (let i = 0; i < tagsData.length; i++) {
          tagsData[i] = parseInt(tagsData[i]);
        }
        this.form.tagids = tagsData;

        this.$refs.ImgUpload.setImgList(this.form.idpics);
      } else {
        that.$message.error("网络异常");
      }
    },
    async getTagList() {
      const that = this;
      const params = {};
      const res = await fetch("POST", "/tag/query/list", params);
      if (res.code == 0) {
        const tableData = res.result;
        that.tagsData = [];
        for (let i = 0; i < tableData.length; i++) {
          that.$set(that.tagsData, i, tableData[i]);
        }
      } else {
        that.$message.error("网络异常");
      }
    },
    // handleClick: function(tab, event) {
    //   console.log(event.target.getAttribute("name")); //获取到当前元素的id
    // },
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
      let url = Config.target + "/img/batch/upload";
      that.$refs[name].validate(valid => {
        if (valid) {
          // that.addGoods();
          that.myAxios(url, formData, oldPicids);
        }
      });
    },
    myAxios(url, formData, oldPicids) {
      this.loadingText = "拼命上传中...";
      this.loading2 = true;
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
          this.form.multiproduct = JSON.stringify(this.multiproduct);
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
      const res = await fetch("POST", "/img/query/imgId", params);
      if (res.code == 0) {
        let img64 = res.result.img;
        return "data:image/png;base64," + img64;
      } else {
        that.$message.error("网络异常");
      }
      return "";
    },
    async addGoods() {
      const that = this;
      const params = that.form;
      params["ticket"] = that.$sto.get(that.$conf.constant.cookie).ticket;
      let tagidsArr = params.tagids;
      params.tagids = tagidsArr.join(",");
      const res = await fetch("POST", "/goods/add", params);
      this.loading2 = false;
      if (res.code == 0) {
        if (res.result) {
          that.$message.success("操作成功");
          that.goback();
        } else {
          that.$message.error("操作失败");
        }
      } else {
        that.$message.error("网络异常");
      }
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
    },  removeSonProduct(item) {
        var index = this.multiproduct.indexOf(item)
        if (index !== -1) {
          this.multiproduct.splice(index, 1)
        }
      }, addSonProduct() {
        this.multiproduct.push({
          name:"",price:"",weight:""
        });
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
