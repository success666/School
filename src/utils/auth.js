import Cookies from 'js-cookie'
import parseBase from '@/utils/parseBase'

const TokenKey = 'Admin-Token'

export function getToken() {
  return window.localStorage.getItem('access_token')
}

export function removeToken() {
  localStorage.clear()
  sessionStorage.clear()
  return Cookies.remove(TokenKey)
}

export function setToken(data) {
  window.localStorage.setItem('access_token', data.token)
  window.localStorage.setItem('ydl_user', JSON.stringify(data))
  window.localStorage.setItem('menuData', JSON.stringify(data.menus))
}

export function isHavePermissions(funName) {
  let power = window.localStorage.getItem('access_token')
  power = parseBase.decode(power)
  if (power.indexOf(funName) >= 0) {
    return true
  } else {
    return false
  }
}
