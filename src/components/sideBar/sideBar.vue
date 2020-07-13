<template>
  <el-menu
    class="el-menu-vertical"
    background-color="#304156"
    text-color="#BFCBD9"
    @select="menuSelect"
    :default-active="defaultMenuIndex"
    unique-opened
    active-text-color="#1890ff">
    <sidebar-item
      v-for="menu in menuList"
      :key="menu.menuId"
      :item="menu"/>
  </el-menu>
</template>
<script>
import sidebarItem from './sidebarItem'
export default {
  name: 'sidebar',
  components: { sidebarItem },
  computed: {
    // 路由meta字段中配置归属
    defaultMenuIndex () {
      return this.$route.meta.group ? this.$route.meta.group.path : ''
    }
  },
  props: {
    menuList: {
      type: Array,
      required: true
    }
  },
  methods: {
    menuSelect (index) {
      this.$emit('menuSelect', index)
    }
  }
}
</script>

<style>
  .el-aside{
    height: 100%;
  }
</style>
