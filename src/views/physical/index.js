
export function getLevelName(level) {
  var levelInt = parseInt(level)
  var levelName = ''
  switch (levelInt) {
    case 1:
      levelName = '优秀'
      break
    case 2:
      levelName = '良好'
      break
    case 3:
      levelName = '及格'
      break
    case 4:
      levelName = '不及格'
      break
    case 5:
      levelName = '正常'
      break
    case 6:
      levelName = '异常'
      break
    case 7:
      levelName = '低体重'
      break
    case 8:
      levelName = '超重'
      break
    case 9:
      levelName = '肥胖'
      break
    case 10:
      levelName = '视力正常'
      break
    case 11:
      levelName = '轻度近视'
      break
    case 12:
      levelName = '中度近视'
      break
    case 13:
      levelName = '重度近视'
      break
    case 14:
      levelName = '阴性'
      break
    case 15:
      levelName = '阳性'
      break
    case 16:
      levelName = '强阳性'
      break
    default:
      break
  }
  return levelName
}
