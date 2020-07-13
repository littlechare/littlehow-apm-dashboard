<template>
  <el-container>
    <el-header>
      <p class="logo">微服务监控系统</p>
      <div class="menu-tabs">
        <el-tabs
          @contextmenu.native.prevent="contextmenu"
          @tab-click="tabClickHandle"
          @tab-remove="removeTab"
          tab-position="top"
          type="card"
          v-model="currentTab"
          v-rightMenu="menudata"
        >
          <el-tab-pane
            :closable="item.id !== '/homePage'"
            :key="item.id"
            :label="item.title || '首页'"
            :name="item.id"
            v-for="(item) in editableTabs"
          ></el-tab-pane>
        </el-tabs>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <sidebar :menuList="menuList" @menuSelect="menuSelect"/>
      </el-aside>
      <el-main id="container">
        <transition mode="out-in" name="fade-transform">
          <keep-alive :include="keepAlives">
            <router-view />
          </keep-alive>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import sidebar from '@/components/sideBar/sideBar'
import { mapMutations, mapState, mapActions } from 'vuex'
import menuList from '@/assets/menuList'

export default {
  name: 'index',
  data () {
    return {
      tabData: [],
      menuList: [],
      tabIndex: 1,
      userName: sessionStorage.userName || '',
      menudata: {
        boxStyle: `width:100px;
                          background:#fff;
                          border:1px solid #ebebeb;
                          border-radius: 5px;
                          box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);`,
        optionStyle: `color:#606266;line-height:30px;font-size:14px;`,
        menus: [
          {
            content: '关闭其它页',
            callback: 'closeOther'
          },
          {
            content: '关闭当前页',
            callback: 'closeCurrent'
          },
          {
            content: '关闭右侧页',
            callback: 'closeRight'
          },
          {
            content: '关闭左侧页',
            callback: 'closeLeft'
          },
          {
            content: '关闭所有页',
            callback: 'closeAll'
          }
        ]
      }
    }
  },
  components: { sidebar },
  computed: {
    currentTab: {
      get: function () {
        return this.$store.state.currentTab
      },
      set: function () {} // 不能删除
    },
    defaultMenuIndex () {
      return this.$route.meta.group ? this.$route.meta.group.path : ''
    },
    ...mapState(['keepAlives', 'editableTabs'])
  },
  mounted () {
    this.menuList = menuList;
    // let res = [];
    // localStorage.setItem('dictionary', JSON.stringify(this.group(res)))

    // this.FETCH_COUNTRY_LIST()
  },
  methods: {
    ...mapMutations([
      'ADD_KEEP_ALIVES',
      'REMOVE_KEEP_ALIVES',
      'CLEAR_EDITABLETABS',
      'UPDATE_EDITABLETABS',
      'DE_RIGHT_EDITABLETABS',
      'DE_LEFT_EDITABLETABS',
      'CLEAR_KEEP_ALIVES'
    ]),
    ...mapActions([]),
    menuSelect (index) {
      this.addTab(index)
    },
    to (path, name) {
      if (path) return { path }
      else return { name }
    }
    // 导航数据分组
    group (arr) {
      let map = {}
      let dest = []
      for (let i = 0; i < arr.length; i++) {
        let item = arr[i]
        if (!map[item.field]) {
          dest.push({
            fieldName: item.fieldName,
            field: item.field,
            children: [item]
          })
          map[item.field] = item
        } else {
          for (let j = 0; j < dest.length; j++) {
            let dj = dest[j]
            if (dj.field === item.field) {
              dj.children.push(item)
              break
            }
          }
        }
      }
      return dest
    },
    tabClickHandle (tab) {
      this.addTab(tab.paneName)
    },
    removeKeepAlives (editableTabs) {
      let editkeepAlives = editableTabs.map(edit => edit.keepAlive)
      editkeepAlives.forEach(name => {
        let index = this.keepAlives.findIndex(
          item => name === item && name !== 'homePage'
        )
        this.REMOVE_KEEP_ALIVES(index)
      })
    },
    addTab (path, jumpType = null) {
      this.$router.push({ path })
    },
    removeTab (tabId) {
      let tabs = this.editableTabs
      let activeName = this.currentTab
      if (activeName === tabId) {
        tabs.forEach((tab, index) => {
          if (tab.id === tabId) {
            let nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.id
            }
          }
        })
      }
      this.$router.push({ path: activeName })
      this.UPDATE_EDITABLETABS(tabs.filter(tab => tab.id !== tabId))
      let removeCurrent = tabs.filter(tab => tab.id === tabId)
      this.removeKeepAlives(removeCurrent)
    },
    closeOther () {
      let others = this.editableTabs.filter(
        item => item.id !== this.currentTab && item.id !== '/homePage'
      )
      this.removeKeepAlives(others)
      let tabs = this.editableTabs.filter(
        item => item.id === this.currentTab || item.id === '/homePage'
      )
      this.UPDATE_EDITABLETABS(tabs)
    },
    closeCurrent () {
      if (this.currentTab === '/homePage') return
      this.removeTab(this.currentTab)
    },
    closeRight () {
      let index = this.editableTabs.findIndex(
        item => this.currentTab === item.id
      )
      let [...copyEditableTabs] = [...this.editableTabs]
      let rights = copyEditableTabs.splice(index + 1)

      this.DE_RIGHT_EDITABLETABS(index)
      this.removeKeepAlives(rights)
    },
    closeLeft () {
      let index = this.editableTabs.findIndex(
        item => this.currentTab === item.id
      )
      let homePage = this.editableTabs[0]
      let [...copyEditableTabs] = [...this.editableTabs]
      copyEditableTabs.splice(index + 1)
      let lefts = copyEditableTabs

      this.DE_LEFT_EDITABLETABS({ index, homePage })
      this.removeKeepAlives(lefts)
    },
    closeAll () {
      this.CLEAR_EDITABLETABS()
      this.CLEAR_KEEP_ALIVES()
      this.$router.replace({ path: '/homePage' })
    },
    contextmenu (event) {
      let path = event.target.id.split('tab-')[1]
      this.$router.push({ path })
    }
  }
}
</script>
<style lang="scss">
  .el-dropdown {
    width: 110px;
    flex: none;
    text-align: center;
  }
  .el-menu-vertical:not(.el-menu--collapse) {
    height: 100%;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: rgb(84, 92, 100);
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .menu-tabs {
    align-self: flex-end;
    flex: none;
    width: 100%;
    background-color: #fff;
    .el-tabs {
      z-index: 2000 !important;
    }
    .el-tabs__header.is-top {
      margin-bottom: 0px;
    }
    .el-tabs__item {
      -o-user-select: none;
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
      -khtml-user-select: none;
      user-select: none;
    }
  }
  .right-menu_item:hover {
    background-color: #ecf5ff !important;
    color: #66b1ff !important;
  }
  .el-submenu__title .iconfont {
    vertical-align: middle;
    margin-right: 8px;
    margin-left: 5px;
    width: 28px;
    text-align: center;
  }
</style>
<style lang="scss" scoped>
  header {
    width: 100%;
    height: 44px;
    background-color: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px;
    box-sizing: border-box;
  }
  .el-container {
    height: 100%;
  }
  .el-main {
    overflow-x: hidden;
  }
  .logo {
    width: 200px;
    text-align: center;
    flex: none;
    font-size: 20px;
    color: rgb(84, 92, 100);
  }
  .iconfont {
    margin-right: 8px;
  }
</style>
