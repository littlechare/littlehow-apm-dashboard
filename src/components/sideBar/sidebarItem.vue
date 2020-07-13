<template>
  <div v-if="item.children">
    <template v-if="item.children.length == 0">
      <el-menu-item :index="item.request">
        <i :class="item.iconCls"></i>
        <span>{{item.menuName}}</span>
      </el-menu-item>
    </template>

    <el-submenu v-else :index="item.menuId">
      <template slot="title">
        <i :class="item.iconCls"></i>
        <span>{{item.menuName}}</span>
      </template>

      <template v-for="child in item.children">
        <sidebar-item
          v-if="child.children&&child.menuLevel!=='1'&&child.children.length>0"
          :item="child"
          :key="child.menuId"/>
        <el-menu-item v-else :index="child.request" :key="child.menuId">
          <i :class="defaultMenuIndex === child.request? 'el-icon-open' : 'el-icon-turn-off'"></i>
          <span>{{child.menuName}}</span>
        </el-menu-item>
      </template>
    </el-submenu>
  </div>
</template>

<script>
export default {
  name: 'sidebarItem',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    // 路由meta字段中配置归属
    defaultMenuIndex () {
      return this.$route.meta.group ? this.$route.meta.group.path : ''
    }
  }
}
</script>
