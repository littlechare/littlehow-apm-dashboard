<template>
  <div class="filterTable">
    <section class="table">
      <el-table :data="tableData"
                :stripe="hasStripe"
                :border="hasBorder"
                :size="size"
                :empty-text="emptyText"
                :show-header="showHeader"
                :header-cell-style="headerCellStyle"
                :highlight-current-row="highlightCurrentRow"
                :row-key="rowKey"
                :row-class-name="tableRowClassName">
        <el-table-column type="expand" label="#" v-if="isExpand">
          <template slot-scope="props">
            <el-form label-position="left">
              <template v-for="(field, index) in expandFields">
                <el-form-item
                  style="padding: 15px"
                  :key="`el-form-item-${index}`"
                  :label="field.label"
                  :label-width="field.labelWidth + 'px'"
                  v-if="props.row[field.prop]">
                  <div v-if="field.isImage">
                    <el-image
                      :style="`width: ${field.imgWidth}; height: ${field.imgHeight}`"
                      v-for="item in props.row[field.prop]"
                      :key="item"
                      :src="item"
                      :preview-src-list="field.isLargeImage ? [item] : []">
                      <div slot="error" class="image-slot; display:inline">
                        <i class="el-icon-picture-outline"></i>
                      </div>
                    </el-image>
                  </div>
                  <div v-html="props.row[field.prop]" v-else></div>
                </el-form-item>
                <el-divider v-if="expandFields[index+1] && props.row[expandFields[index+1].prop]"></el-divider>
              </template>
            </el-form>
          </template>
        </el-table-column>
        <template v-for="(field, index) in tableFields">
          <template v-if="field.type!=='index'">
            <el-table-column :key="`el-table-column-${index}`"
                             :column-key="`table-column-${index}`"
                             :align="field.align"
                             :label="field.label"
                             :fixed="field.fixed"
                             :type="field.type"
                             :sortable="field.hasSort"
                             :formatter="field.formatter"
                             :prop="field.prop"
                             show-overflow-tooltip
                             :width="field.width"
                             :min-width="field.minWidth">
              <template slot="header" v-if="field.isShowIcon">
                <span>{{field.label}}</span>
                <el-tooltip placement="top">
                  <div slot="content" v-html="field.tip"></div>
                  <i :class="field.icon"></i>
                </el-tooltip>
              </template>
              <template slot-scope="scope">
                <!-- 链接列 -->
                <template v-if="field.isLink">
                  <span v-if="!scope.row[field.prop]">--</span>
                  <router-link
                    v-else
                    :to="{ name: scope.row[field.pathName], params: {
                      [field.param1]: scope.row[field.param1],
                      [field.param2]: scope.row[field.param2]
                     }}">
                    <span v-if="!scope.row[field.prop]">--</span>
                    <span v-else v-html="scope.row[field.prop]"></span>
                  </router-link>
                </template>
                <!-- 放大图列 -->
                <template v-else-if="field.isImage" slot-scope="scope">
                  <el-image
                    :style="`width: ${field.imgWidth}; height: ${field.imgHeight}`"
                    v-for="item in scope.row[field.prop]"
                    :key="item"
                    :src="item"
                    :preview-src-list="field.isLargeImage ? [item] : []">
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline"></i>
                    </div>
                  </el-image>
                  <span v-if="!scope.row[field.prop]">--</span>
                </template>
                <!-- 进度条 -->
                <template v-else-if="field.isProgress" slot-scope="scope">
                  <el-progress :percentage="scope.row[field.prop]"></el-progress>
                </template>
                <!-- 没链接 -->
                <template v-else>
                  <span v-if="scope.row[field.prop] !== 0 && !scope.row[field.prop]" :style="{color: field.textColor || ''}">--</span>
                  <span v-else v-html="scope.row[field.prop]" :style="{color: field.textColor || ''}"></span>
                </template>
              </template>
            </el-table-column>
          </template>
          <template v-if="field.type==='index'">
            <el-table-column :key="`el-table-column-${index}`"
                             :column-key="`table-column-${index}`"
                             :align="field.align"
                             :label="field.label"
                             :type="field.type"
                             :width="field.width">
            </el-table-column>
          </template>
        </template>
        <slot></slot>
      </el-table>
    </section>
    <section class="footer_pagination footer" v-if="isShowPagination && total > 0">
      <el-pagination
        background
        @size-change="handleChange"
        @current-change="handleChange"
        :layout="layout"
        :current-page.sync="pagination.pageIndex"
        :hide-on-single-page="false"
        :page-size.sync="pagination.pageSize"
        :page-sizes.sync="pagination.pageSizes"
        :total="total">
      </el-pagination>
    </section>
  </div>
</template>

<script>
export default {
  name: 'FilterTable',
  props: {
    loaded: { type: Boolean, default: true },
    total: { type: Number, default: 0 },
    tableData: { type: Array, required: true },
    fields: { type: Array, required: true },
    hasStripe: { type: Boolean, default: false },
    hasBorder: { type: Boolean, default: false },
    size: { type: String },
    showHeader: { type: Boolean, default: true },
    highlightCurrentRow: { type: Boolean, default: false },
    rowKey: [Function, String],
    layout: { type: String, default: 'total, sizes, prev, pager, next, jumper' },
    isShowPagination: { type: Boolean, default: true },
    headerCellStyle: { type: Object, default: function () { return {} } },
    isExpand: { type: Boolean, default: false },
    tableId: { type: String, default: '' }
  },
  computed: {
    emptyText () {
      if (this.loaded && !this.isFaild) {
        return '暂无数据'
      } else if (!this.loaded && !this.isFaild) {
        return '正在加载...'
      } else if (this.isFaild) {
        return '加载失败...'
      } else {
        return '暂无数据'
      }
    },
    expandFields () {
      return this.fields.filter(item => item.type === 'expand')
    },
    tableFields () {
      return this.fields.filter(item => item.type !== 'expand')
    }
  },
  data () {
    return {
      isFaild: false,
      pagination: {
        pageIndex: 1,
        pageSizes: this.$store.state.pagination.pageSizes,
        pageSize: this.$store.state.pagination.pageSize
      }
    }
  },
  methods: {
    handleChange () {
      this.$emit('changePagination', this.pagination, this.tableId)
    },
    tableRowClassName ({ row }) {
      if (row.exceptionStr) {
        return 'warning-row'
      }
      return ''
    }
  },
  created () {
    this.handleChange()
  },
  mounted () {
    let self = this
    setTimeout(() => {
      if (!self.loaded) {
        self.isFaild = true
      }
    }, 8000)
  }
}
</script>

<style lang="scss">
  .el-table .warning-row {
    color: indianred;
    font-weight: bold;
    background-color: lightyellow;
  }
</style>

<style scoped lang="scss">
  .footer_pagination {}

</style>
