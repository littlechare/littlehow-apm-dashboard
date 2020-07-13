<template>
<!-- 统一的列表筛选处理 -->
  <el-form ref="filterForm"
           :model="formInline"
           :inline="isInline"
           :label-position="labelPosition"
           :hide-required-asterisk="hideRequiredAsterisk"
           :status-icon="hasStatusIcon"
           :validate-on-rule-change="false"
           :disabled="isDisabled">
    <el-form-item v-for="(field, key, index) in fields"
                  :prop="key"
                  :label="field.label"
                  :key="`filter-form-item-${index}`">
      <component :is="field.tag | tagFilter"
                 v-model="formInline[key]"
                 :rules="field.rules"
                 :prefix-icon="field.prefix"
                 :suffix-icon="field.suffix"
                 :type="field.type"
                 :maxlength="field.maxlength"
                 :max="field.max"
                 :min="field.min"
                 :minlength="field.minlength"
                 :show-word-limit="field.hasWordLimit"
                 :clearable="field.hasClearable"
                 :show-password="field.hasPassword"
                 :disabled="field.disabled"
                 :readonly="field.readonly"
                 :size="field.size"
                 :step="field.step"
                 :loading="field.loading"
                 :placeholder="field.placeholder">
        <template slot="append" v-if="field.append">{{field.append}}</template>
        <template slot="prefix" v-if="field.prefix">{{field.prefix}}</template>
        <template slot="prepend" v-if="field.prepend">{{field.prepend}}</template>
        <template slot="suffix" v-if="field.suffix">{{field.suffix}}</template>
        <template v-if="field.children">
          <component :is="option.tag | tagFilter"
                     v-for="(option, idx) in field.children"
                     :key="`filter-form-item-${index}-${idx}`"
                     :label="option.label"
                     :disabled="option.disabled"
                     :value="option.value">{{option.label}}
          </component>
        </template>
      </component>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click.prevent="handleSubmitForm">提交</el-button>
      <el-button @click.prevent="handleResetForm" v-if="hasReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'FilterForm',
  props: {
    labelWidth: { type: Number },
    hasReset: { type: Boolean, default: false },
    isInline: { type: Boolean, default: false },
    labelPosition: { type: String, default: 'right' },
    hideRequiredAsterisk: { type: Boolean, default: true },
    hasStatusIcon: { type: Boolean, default: false },
    isDisabled: { type: Boolean, default: false },
    fields: { type: Object, required: true }
  },
  data () {
    return {
      formInline: {}
    }
  },
  filters: {
    tagFilter (tag) {
      return `el-${tag}`
    }

  },
  methods: {
    handleSubmitForm () {
      this.$refs.filterForm.validate(valid => valid && this.$emit('onSubmit', this.$data.formInline))
    },
    handleResetForm () {
      this.$refs.filterForm.resetFields(this.$refs.filterForm.clearValidate())
    }
  },
  beforeDestroy () {
    this.handleResetForm()
  }
}
</script>

<style scoped>

</style>
