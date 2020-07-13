export const Regex = {
  PHONE: /^\d+$/,
  EMAIL: /^[\S]+@[\w|\d]+\.[\w|\d]+$/,
  ACCOUNT: /(^\d{5,20}$)|(^[\S]+@[\w|\d]+\.[\w|\d]+$)/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/,
  CODE: /^\d{6}$/,
  ID_CARD: /^[\uFF08-\uFF09()A-Za-z0-9]{1,18}$/,
  IS_DECIMAL: /^\d+\.\d+$/,
  NUM_POSITUVE: /^([1-9]\d*.?|0.)\d*$/,
  // eslint-disable-next-line no-useless-escape
  NICkNAME: /^[\d\w\u4e00-\u9fa5,\.;\:"'?!\-]{2,11}$/,
  // eslint-disable-next-line no-useless-escape
  REMARK: /^.{1,30}$/,
  NUM_SIX_POINT: /^([1-9][0-9]*(\.[0-9]{1,6})?|0\.(?!0+$)[0-9]{1,6})$/,
  NUM_FOUR_POINT: /^([1-9][0-9]*(\.[0-9]{1,4})?|0\.(?!0+$)[0-9]{1,4})$/,
  NUM_TWO_POINT: /^([1-9][0-9]*(\.[0-9]{1,2})?|0\.(?!0+$)[0-9]{1,2})$/,
  NUM_ONE_POINT: /^([1-9][0-9]*(\.[0-9])?|0\.(?!0+$)[0-9])$/,
  POSITIVE_INTEGER: /^[1-9][0-9]*$/,
  NUM: /^[0-9]*$/,
  NAME: /^.{1,10}$/,
}
