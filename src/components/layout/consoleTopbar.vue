<style scoped lang="less">
.console-topbar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 101;
  clear: both;
  height: 50px;
  font-size: 12px;
  width: 100%;
  .el-col {
    background: #09c;
    height: 50px;
    color: #fff;
    font-size: 14px;
    line-height: 50px;
    .topbar-home {
      position: relative;
      display: block;
      width: 50px;
      background: #0087b4;
      font-size: 28px;
      color: #fff;
      text-align: center;
      height: 50px;
      line-height: 50px;
      overflow: hidden;
      float: left;
      &:before {
        content: "";
        position: absolute;
        width: 28px;
        height: 28px;
        left: 11px;
        top: 11px;
        display: inline-block;
        background: url(../../images/logo.png) no-repeat center center;
        background-size: cover;
      }
    }
    .topbar-home-link {
      display: inline-block;
      height: 50px;
      box-sizing: border-box;
      padding: 0 20px;
      color: #fff;
      font-size: 14px;
      line-height: 50px;
      border-right: 1px solid #008fbf;
    }
    .topbar-info {
      float: right;
      width: 150px;
      line-height: 50px;
      padding: 0 10px;
      height: 50px;
      display: block;
      z-index: 2;
      background: #09c;
      color: #fff;
      font-size: 14px;
      border-left: 1px solid #008fbf;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      .user-name {
        display: block;
        width: 100%;
        color: #fff;
        font-size: 14px;
      }
      .el-dropdown-menu {
        padding: 0 !important;
        .el-dropdown-menu__item {
          padding: 0 10px;
          height: 30px;
          line-height: 30px;
        }
      }
    }
  }
}
</style>
<template>
  <el-row class="console-topbar" type="flex">
    <el-col :xs="12" :sm="12" :md="12" :lg="12">
      <a class="topbar-home" target="_blank" href="javascript:void(0);"></a>
      <a href="javascript:void(0);" target="_self" class="topbar-home-link">
        <span>ERP系统</span>
      </a> 
    </el-col>
    <el-col :xs="12" :sm="12" :md="12" :lg="12">
      <el-dropdown trigger="click" class="topbar-info" @command="handleCommand">
        <a href="javascript:void(0)" class="user-name">
          {{roleName}}--{{userName}}<i class="el-icon-caret-bottom el-icon--right"></i>
        </a>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="goodsmangement">商品管理</el-dropdown-item> 
          <el-dropdown-item v-if="showUserManagement" command="user">用户管理</el-dropdown-item>
          <el-dropdown-item command="signOut">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</template>
<script>
import {
  Row,
  Col,
  Dropdown,
  Icon,
  DropdownMenu,
  DropdownItem
} from "element-ui";
export default {
  components: {
    ElRow: Row,
    ElCol: Col,
    ElDropdown: Dropdown,
    ElDropdownMenu: DropdownMenu,
    ElDropdownItem: DropdownItem,
    Icon: Icon
  },
  mounted() {
    const that = this;
    let cookies = that.$sto.get(that.$conf.constant.cookie);
    that.userName =  cookies.userName;
      const base64 = require("base-64");
      const utf8 = require("utf8");
      that.roleName = utf8.decode(base64.decode(cookies.ticket));
      that.showUserManagement = that.$sto.get(that.$conf.constant.cookie).userName=='lvxiao'; 
  },
  data() {
    return {
      userName: "",
      roleName: "",
      showUserManagement:false
    };
  },
  methods: {
    handleCommand(command) {
      // 点击菜单项触发的事件回调
      const that = this;
      if (command == "signOut") {
        // 退出登录
        let $sto = that.$sto;
        let $conf = that.$conf;
        let cookies = $sto.get($conf.constant.cookie);
        if (cookies && cookies.token) {
           cookies.token="";cookies.ticket="";cookies.userName="";
        }
        $sto.set($conf.constant.cookie, cookies);
        that.$router.push({ path: $conf.route.login });
      }else if(command == 'goodsmangement'){
        that.$router.push({path: '/index'});
      }else if(command == 'user'){
        that.$router.push({path: '/user'});
      }
    }
  }
};
</script>
