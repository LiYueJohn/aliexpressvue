<style lang="less">
.console-sidebar {
  .el-submenu__title {
    font-size: 12px;
    height: 46px;
    line-height: 46px;
  }
  .el-submenu {
    background: #37424f;
    border-bottom: 1px solid #414d5c;
  }
  .el-submenu__icon-arrow {
    right: 40px;
    margin-top: -4px;
  }
  .el-icon-message {
    font-size: 12px;
  }
  .el-menu-item {
    font-size: 12px;
    height: 42px;
    line-height: 42px;
    &.is-active {
      border-right: none;
      color: #fff;
      background: #0099cc !important;
      &:hover {
        background: #0099cc !important;
      }
    }
  }
}
</style>
<style scoped lang="less">
.console-sidebar {
  position: fixed;
  top: 50px;
  bottom: 0px;
  background-color: #293038;
  z-index: 102;
  overflow-x: hidden;
  overflow-y: auto;
  height: auto;
  width: 180px;
  .sidebar-content {
    width: 200px;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    background: #293038;
    .sidebar-fold {
      height: 30px;
      width: 140px;
      background: #394555;
      color: #aeb9c2;
      text-align: left;
      padding: 0 20px;
      line-height: 30px !important;
      user-select: none;
      cursor: pointer;
      -webkit-user-select: none;
      -moz-user-select: none;
    }
  }
}
</style>
<template>
  <div class="console-sidebar">
    <el-menu :unique-opened='true' :router='true' theme="dark" :default-active="defaultActive" class="sidebar-content">
      <div class="sidebar-fold">用户角色：{{roleName}}</div>
      <el-menu-item index="/index"><i class="el-icon-message"></i>商品管理</el-menu-item>
        <el-menu-item index="/user" v-if="showUserManagement"><i class="el-icon-document"></i>用户管理</el-menu-item>
      <!-- <el-submenu index="base">
        <template slot="title">
          <i class="el-icon-message"></i>
          基础服务
        </template>
        <el-menu-item index="/thrmenu/article"><i class="el-icon-document"></i>三级菜单</el-menu-item>
      </el-submenu> -->
      <!-- <el-submenu index="user" v-if="roleName=='主管'">
        <template slot="title">
          <i class="el-icon-message"></i>
          用户中心
        </template>
        <el-menu-item index="/user"><i class="el-icon-document"></i>用户管理</el-menu-item>
      </el-submenu> -->
    </el-menu>
  </div>
</template>
<script>
import { Menu, Submenu, MenuItem, Icon } from "element-ui";
export default {
  components: {
    ElMenu: Menu,
    ElSubmenu: Submenu,
    ElMenuItem: MenuItem,
    Icon: Icon
  },
  computed: {
    defaultActive: function() {
      const that = this;
      let cookies = that.$sto.get(that.$conf.constant.cookie);
      const base64 = require("base-64");
      const utf8 = require("utf8");
      that.roleName = utf8.decode(base64.decode(cookies.ticket));
      that.showUserManagement = that.$sto.get(that.$conf.constant.cookie).userName=='lvxiao';
      return (
        (that.$route.meta && that.$route.meta.activePath) || this.$route.path
      );
    }
  },
  data() {
    return {
      roleName: "",
      showUserManagement:false
    };
  },
  methods: {
     
  }
};
</script>
 