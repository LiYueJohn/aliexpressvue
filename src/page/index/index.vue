<style lang="less">
.quick-container {
  .quick-card {
    .el-card__header {
      padding: 0 20px;
      height: 48px;
      line-height: 48px;
    }
    .el-step__description {
      margin-top: 15px;
      p {
        line-height: 1.5;
      }
    }
  }
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>

<style lang="less" scoped>
.quick-container {
  .quick-card {
    margin: 0px 20px 20px 20px;
    .github-star {
      float: right;
      color: #108ee9;
      cursor: pointer;
      margin-top: 10px;
    }
    .card-text {
      font-size: 13px;
      color: #999;
      line-height: 1.5;
    }
    .card-btn {
      margin-top: 15px;
    }
    .myselect{
        margin-left: 15px;
    }
  }
}
</style>
<template>
  <div class="quick-container">
    <el-card class="quick-card"> 
      <el-row :gutter="20">
        <el-col :span="4"><Goodsclassification @tagChange="tagChange" ></Goodsclassification></el-col>
        <el-col :span="20"> <goodstable ref="goodstable"></goodstable></el-col>
      </el-row> 
    </el-card> 
  </div>
</template>

<script>
import { Card, Steps, Step, Button } from "element-ui";

import goodstable  from "./goodstable"; 

import Goodsclassification  from "./goodsClassification"; 
export default {
  components: {
    ElCard: Card,
    ElSteps: Steps,
    ElStep: Step,
    ElButton: Button,goodstable,Goodsclassification
  },
  data() {
 
    return { 
      active: 1, 
    };
  },
  methods: {
      tagChange(id){ 
        this.$refs.goodstable.getGoodsList(id+"");
      }
  }
};
</script>
