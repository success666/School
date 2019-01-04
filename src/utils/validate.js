/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

export const PASSWORD = /^(?!^\d+$)(?!^[a-zA-Z]+$)(?!^[~!@#$%^&*()]+$)[A-Za-z0-9~!@#$%^&*()]{6,16}$/;
export const PASSWORD_TIP = '字母、数字、特殊字符任意两种或以上组合, 6-16位';
export const MOBILE = /^([1][3-9])+\d{9}$|^([9][28])+\d{9}$/

// 验证是否整数
export function isInteger(rule, value, callback) {
  if (value !== '') {
    const re = /^[+]{0,1}(\d+)$/
    const rsCheck = re.test(value)
    if (!rsCheck) {
      callback(new Error('请输入正确的配置数量！'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

// 验证是否整数
export function isIntegerEquipment(rule, value, callback) {
  if (value !== '') {
    const re = /^[+]{0,1}(\d+)$/
    const rsCheck = re.test(value)
    if (!rsCheck) {
      callback(new Error('请输入正确的配置数量！'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}
