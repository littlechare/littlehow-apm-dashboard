import { mapMutations, mapState } from 'vuex'

export const removeTabMixin = {
  data () {
    return {}
  },
  computed: {
    ...mapState(['keepAlives', 'editableTabs'])
  },
  methods: {
    ...mapMutations(['REMOVE_KEEP_ALIVES', 'DE_CURRENT_EDITABLETABS']),
    removeCurrentTab () {
      let aliveIndex = this.keepAlives.findIndex(
        item => this.$route.name === item
      )
      this.REMOVE_KEEP_ALIVES(aliveIndex)
      let editableIndex = this.editableTabs.findIndex(
        item => this.$route.path === item.id
      )
      this.DE_CURRENT_EDITABLETABS(editableIndex)
    }
  }
}

export default {
  // 全局
  data () {
    return {}
  },
  methods: {
    $getDictionaryByField (field) {
      const dictionary = JSON.parse(localStorage.getItem('dictionary'))
      let arr = []
      for (let i = 0; i < dictionary.length; i++) {
        if (dictionary[i].field === field) {
          arr = dictionary[i].children
          break
        }
      }
      return arr
    },
    $formatDate (date, rule = 'YYYY-MM-DD HH:mm:ss') {
      if (!date) return ''
      return window.moment(new Date(date)).format(rule)
    },
    $formatJson (json) {
      if (!json) {
        return json
      }
      json = json.trim()
      try {
        if (json.startsWith('{') && json.endsWith('}')) {
          return '<pre style="line-height: 18px; color: black;">' + JSON.stringify(JSON.parse(json), null, 2) + '</pre>'
        }
      } catch (e) {
        console.log(e)
      }
      return json
    },
    $codeText (code, target) {
      let text = code
      target.forEach(v => {
        if (
          (typeof code === 'string' && code === v.code) ||
          (typeof code === 'number' && code === Number(v.code)) ||
          (typeof code === 'boolean' && code === Boolean(v.code))
        ) {
          text = v.codeDesc
        }
      })
      return text
    },
    $languageText (code, target) {
      let text = code
      target.forEach(v => {
        if (code === v.code) {
          text = v.codeDesc
        }
      })

      return text
    },
    $goBack () {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
    },
    $emptyObjValue (obj) {
      for (let key in obj) {
        if (obj.hasOwnProperty(key) && obj[key]) obj[key] = ''
      }
    },
    // 保留
    $toFixed (num = 0, dp = 2) {
      if (isNaN(num)) {
        return '0'
      }
      let numArr = num.toString().split('.')
      numArr[1] !== undefined &&
        numArr[1].length > dp &&
        (numArr[1] = numArr[1].substring(0, dp))
      return numArr.join('.')
    },
    $getObjectURL (file) {
      let url = ''
      if (window.createObjectURL !== undefined) {
        url = window.createObjectURL(file)
      } else if (window.URL !== undefined) {
        url = window.URL.createObjectURL(file)
      } else if (window.webkitURL !== undefined) {
        url = window.webkitURL.createObjectURL(file)
      }
      return url
    }
  }
}
